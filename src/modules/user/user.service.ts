import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { SignUpRequestDto } from './dtos/requests/sign-up-request.dto';
import { Argon2Service } from '../../helper/argon2/argon2.service';
import { UserUpdateRequestDto } from './dtos/requests/user-update-request.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private readonly argon2Serivce: Argon2Service,
  ) {}

  async findByEmailOrThrow(
    email: string,
    withRTK: boolean = false,
  ): Promise<User> {
    let user: User | null;
    if (withRTK)
      user = await this.userRepository.findOne({
        where: { email: email },
        relations: ['refreshToken'],
      });
    else
      user = await this.userRepository.findOneBy({
        email: email,
      });
    if (!user) return Promise.reject();
    return user;
  }

  async signUp(request: SignUpRequestDto): Promise<User> {
    request.password = await this.argon2Serivce.hashPassword(request.password);
    const user = this.userRepository.create({
      ...request,
      nickname: request.nickname ?? request.name,
    });

    if (!request.isGuest) user.role = UserRole.USER;

    await this.userRepository.save(user);
    return user;
  }

  async update(request: UserUpdateRequestDto, user: User): Promise<User> {
    if (request.password !== undefined) {
      if (request.password !== request.passwordConfirm) {
        throw new BadRequestException('error.user.password.unconfirm');
      }
      request.password = await this.argon2Serivce.hashPassword(
        request.password,
      );
    }

    try {
      Object.assign(user, request);

      return this.userRepository.save(user);
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('error.user.conflict.nickname');
      }
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async incrementTokenVersion(user: User): Promise<void> {
    await this.userRepository.increment({ id: user.id }, 'tokenVersion', 1);
  }
}

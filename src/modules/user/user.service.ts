import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { SignUpRequestDto } from './dtos/requests/sign-up-request.dto';
import { Argon2Service } from '../../helper/argon2/argon2.service';

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
    if (!user) return Promise.reject('User not found');
    return user;
  }

  async signUp(signUpRequestDto: SignUpRequestDto): Promise<User> {
    signUpRequestDto.password = await this.argon2Serivce.hashPassword(
      signUpRequestDto.password,
    );
    const user = this.userRepository.create({
      ...signUpRequestDto,
    });

    if (!signUpRequestDto.isGuest) user.role = UserRole.USER;

    await this.userRepository.save(user);
    return user;
  }

  async incrementTokenVersion(user: User) {
    await this.userRepository.increment({ id: user.id }, 'tokenVersion', 1);
  }
}

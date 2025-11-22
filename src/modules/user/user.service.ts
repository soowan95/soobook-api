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
import { UserSettingService } from '../userSetting/user-setting.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private readonly userSettingService: UserSettingService,
    private readonly argon2Service: Argon2Service,
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

  async signUp(
    request: SignUpRequestDto,
    userId: number | undefined = undefined,
  ): Promise<User> {
    if (request.email) await this.validateEmail(request.email);
    if (request.nickname) await this.validateNickname(request.nickname);
    request.password = await this.argon2Service.hashPassword(request.password);
    let guest: User;
    let user: User = this.userRepository.create({
      ...request,
      nickname: request.nickname ?? request.name,
    });

    if (!request.isGuest) user.role = UserRole.USER;
    else user.setting = await this.userSettingService.create(user.id);
    if (userId) {
      guest = await this.userRepository.findOneByOrFail({
        id: userId,
      });
      user = this.userRepository.merge(guest, user);
    }

    await this.userRepository.save(user);
    return user;
  }

  async update(request: UserUpdateRequestDto, user: User): Promise<User> {
    if (request.nickname) await this.validateNickname(request.nickname);
    if (request.password !== undefined) {
      if (request.password !== request.passwordConfirm) {
        throw new BadRequestException('error.user.password.unconfirm');
      }
      request.password = await this.argon2Service.hashPassword(
        request.password,
      );
    }

    user = this.userRepository.merge(user, request);

    return this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async incrementTokenVersion(user: User): Promise<void> {
    await this.userRepository.increment({ id: user.id }, 'tokenVersion', 1);
  }

  private async validateEmail(email: string): Promise<void> {
    const userCnt: number = await this.userRepository.countBy({
      email: email,
    });
    if (userCnt > 0) throw new ConflictException('warning.user.conflict.email');
  }

  private async validateNickname(nickname: string): Promise<void> {
    const userCnt: number = await this.userRepository.countBy({
      nickname: nickname,
    });
    if (userCnt > 0)
      throw new ConflictException('warning.user.conflict.nickname');
  }
}

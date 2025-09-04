import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpRequestDto } from './dtos/requests/sign-up-request.dto';
import {Argon2Service} from "../helper/argon2/argon2.service";

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private readonly argon2Serivce: Argon2Service,
  ) {}

  async findByEmailOrThrow(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      email: email,
    });
    if (!user) return Promise.reject('User not found');
    return user;
  }

  async signUp(signUpRequestDto: SignUpRequestDto): Promise<User> {
    signUpRequestDto.password = await this.argon2Serivce.hashPassword(signUpRequestDto.password);
    const user = this.userRepository.create({
      ...signUpRequestDto,
    });

    await this.userRepository.save(user);
    return user;
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const user = await this.userRepository.findOneBy({
      id: id,
    });

    if (!user) return;

    user.refreshToken = await this.argon2Serivce.hashPassword(refreshToken);
    await this.userRepository.save(user);
  }
}

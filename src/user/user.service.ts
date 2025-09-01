import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpRequestDto } from './dtos/requests/sign-up.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async signUp(signUpRequestDto: SignUpRequestDto): Promise<User> {
    const user = this.userRepository.create({
      ...signUpRequestDto,
    });

    await this.userRepository.save(user);
    return user;
  }
}

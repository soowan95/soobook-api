import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserSetting } from './user-setting.entity';
import { UserSettingUpdateRequestDto } from './dtos/requests/user-setting-update-request.dto';

@Injectable()
export class UserSettingService {
  constructor(
    @Inject('USER_SETTING_REPOSITORY')
    private readonly userSettingRepository: Repository<UserSetting>,
  ) {}

  async create(userId: number): Promise<UserSetting> {
    return await this.userSettingRepository.save({
      user: { id: userId },
    });
  }

  async show(userId: number): Promise<UserSetting> {
    return await this.userSettingRepository
      .findOneOrFail({
        where: { user: { id: userId } },
      })
      .catch((): Promise<UserSetting> => {
        return this.create(userId);
      });
  }

  async update(
    userId: number,
    request: UserSettingUpdateRequestDto,
  ): Promise<UserSetting> {
    let userSetting: UserSetting = await this.show(userId);
    userSetting = this.userSettingRepository.merge(userSetting, request);
    return await this.userSettingRepository.save(userSetting);
  }
}

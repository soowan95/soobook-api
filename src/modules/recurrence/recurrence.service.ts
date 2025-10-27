import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Recurrence } from './recurrence.entity';
import { RecurrenceCreateRequestDto } from './dtos/requests/recurrence-create-request.dto';
import { User } from '../user/user.entity';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account.entity';

@Injectable()
export class RecurrenceService {
  constructor(
    @Inject('RECURRENCE_REPOSITORY')
    private recurrenceRepository: Repository<Recurrence>,
    private readonly accountService: AccountService,
  ) {}

  async create(
    request: RecurrenceCreateRequestDto,
    user: User,
  ): Promise<Recurrence> {
    const account: Account = await this.accountService.findByIdOrThrow(
      request.accountId,
    );

    return await this.recurrenceRepository.save({
      ...request,
      user: user,
      account: account,
    });
  }
}

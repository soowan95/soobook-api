import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { AccountCreateRequestDto } from './dtos/requests/account-create-request.dto';
import { User } from '../user/user.entity';

@Injectable()
export class AccountService {
  constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private accountRepository: Repository<Account>,
  ) {}

  async findByIdOrThrow(id: number): Promise<Account> {
    const account: Account | null = await this.accountRepository.findOneBy({
      id: id,
    });
    if (!account) throw new NotFoundException('error.account.notFound');
    return account;
  }

  async create(request: AccountCreateRequestDto, user: User): Promise<Account> {
    let linkedAccount: Account | null = null;
    if (request.linkedAccountId) {
      linkedAccount = await this.accountRepository.findOneBy({
        id: request.linkedAccountId,
      });
      if (!linkedAccount) throw new NotFoundException('error.account.notFound');
    }

    const account: Account = this.accountRepository.create({
      ...request,
      currentBalance: request.initialBalance,
      user: user,
      linkedAccount: linkedAccount ?? undefined,
    });

    await this.accountRepository.save(account);
    return account;
  }
}

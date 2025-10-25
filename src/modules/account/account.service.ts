import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { AccountCreateRequestDto } from './dtos/requests/account-create-request.dto';
import { User } from '../user/user.entity';
import { AccountUpdateRequestDto } from './dtos/requests/account-update-request.dto';
import Decimal from 'decimal.js';

@Injectable()
export class AccountService {
  constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private accountRepository: Repository<Account>,
  ) {}

  async findAllByUserId(userId: number): Promise<Account[]> {
    return await this.accountRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['linkedAccount'],
    });
  }

  async findAllByKeyword(keyword: string, userId: number): Promise<Account[]> {
    const likeKeyword = `%${keyword}%`;

    return this.accountRepository
      .createQueryBuilder('account')
      .leftJoin('account.user', 'user')
      .leftJoinAndSelect('account.linkedAccount', 'linkedAccount')
      .where('user.id = :userId', { userId })
      .andWhere(
        'account.name LIKE :likeKeyword OR account.institutionName LIKE :likeKeyword OR account.description LIKE :likeKeyword',
        { likeKeyword },
      )
      .getMany();
  }

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

  async update(request: AccountUpdateRequestDto): Promise<Account> {
    let account: Account | null = await this.accountRepository.findOneBy({
      id: request.id,
    });

    if (!account) throw new NotFoundException('error.account.notFound');

    if (request.initialBalance) {
      const difference: Decimal = new Decimal(request.initialBalance).minus(
        new Decimal(account.initialBalance),
      );

      request.currentBalance = new Decimal(account.currentBalance)
        .plus(difference)
        .toString();
    }

    account = this.accountRepository.merge(account, request);
    await this.accountRepository.save(account);
    return account;
  }
}

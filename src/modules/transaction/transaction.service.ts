import { Inject, Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import { TransactionCreateRequestDto } from './dtos/requests/transaction-create-request.dto';
import { User } from '../user/user.entity';
import { AccountService } from '../account/account.service';
import { AccountUpdateRequestDto } from '../account/dtos/requests/account-update-request.dto';
import Decimal from 'decimal.js';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private transactionRepository: Repository<Transaction>,
    private readonly accountService: AccountService,
  ) {}

  async showDaily(userId: number): Promise<Transaction[]> {
    const today = new Date();
    return await this.transactionRepository.find({
      where: {
        user: { id: userId },
        createdAt: Between(startOfDay(today), endOfDay(today)),
      },
      relations: ['account'],
    });
  }

  async showMonthly(userId: number): Promise<Transaction[]> {
    const today = new Date();
    return await this.transactionRepository.find({
      where: {
        user: { id: userId },
        createdAt: Between(startOfMonth(today), endOfMonth(today)),
      },
      relations: ['account'],
    });
  }

  async create(request: TransactionCreateRequestDto, user: User) {
    let account = await this.accountService.findByIdOrThrow(request.accountId);

    let accountUpdateRequestDto: AccountUpdateRequestDto =
      new AccountUpdateRequestDto();

    switch (request.type) {
      case 'income':
        accountUpdateRequestDto.currentBalance = new Decimal(account.currentBalance)
          .plus(request.amount)
          .toString();
        break;
      case 'expense':
        accountUpdateRequestDto.currentBalance = new Decimal(account.currentBalance)
          .minus(request.amount)
          .toString();
    }

    account = await this.accountService.update(accountUpdateRequestDto);

    const transaction = this.transactionRepository.create({
      ...request,
      user: user,
      account: account,
    });

    await this.transactionRepository.save(transaction);
    return transaction;
  }
}

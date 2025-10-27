import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import { TransactionCreateRequestDto } from './dtos/requests/transaction-create-request.dto';
import { User } from '../user/user.entity';
import { AccountService } from '../account/account.service';
import { AccountUpdateRequestDto } from '../account/dtos/requests/account-update-request.dto';
import Decimal from 'decimal.js';
import { Account } from '../account/account.entity';
import { TransactionType } from './transaction-type.enum';

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
    await this.mandatoryTransfer(request);
    let account: Account = await this.accountService.findByIdOrThrow(
      request.accountId,
    );
    let toAccount: Account | null = null;

    let accountUpdateRequestDto: AccountUpdateRequestDto =
      new AccountUpdateRequestDto();
    let toAccountUpdateRequestDto: AccountUpdateRequestDto =
      new AccountUpdateRequestDto();

    switch (request.type) {
      case 'income':
        accountUpdateRequestDto.currentBalance = new Decimal(
          account.currentBalance,
        ).plus(request.amount);
        break;
      case 'expense':
        await this.checkBalance(
          new Decimal(account.currentBalance),
          request.amount,
        );
        accountUpdateRequestDto.currentBalance = new Decimal(
          account.currentBalance,
        ).minus(request.amount);
        break;
      case 'transfer':
        toAccount = await this.accountService.findByIdOrThrow(
          request.toAccountId!,
        );
        await this.checkBalance(
          new Decimal(account.currentBalance),
          request.amount,
        );
        accountUpdateRequestDto.id = account.id;
        accountUpdateRequestDto.currentBalance = new Decimal(
          account.currentBalance,
        ).minus(request.amount);
        toAccountUpdateRequestDto.id = toAccount.id;
        toAccountUpdateRequestDto.currentBalance = new Decimal(
          toAccount.currentBalance,
        ).plus(request.amount);
        request.location = `${account.name} -> ${toAccount.name}`;
        break;
    }

    account = await this.accountService.update(accountUpdateRequestDto);

    if (request.type == TransactionType.TRANSFER) {
      toAccount = await this.accountService.update(toAccountUpdateRequestDto);
    }

    let transaction: Transaction = this.transactionRepository.create({
      ...request,
      user: user,
      account: account,
      toAccount: toAccount ?? undefined,
    });

    transaction = await this.transactionRepository.save(transaction);
    return transaction;
  }

  private async mandatoryTransfer(
    request: TransactionCreateRequestDto,
  ): Promise<void> {
    if (request.type == TransactionType.TRANSFER) {
      if (!request.toAccountId) {
        throw new BadRequestException('error.transaction.mandatory.transfer');
      } else if (request.accountId == request.toAccountId) {
        throw new BadRequestException('error.transaction.same.account');
      }
    }
  }

  private async checkBalance(currentBalance: Decimal, amount: Decimal) {
    if (currentBalance.minus(amount).lt(0)) {
      throw new BadRequestException('error.transaction.insufficient.balance');
    }
  }
}

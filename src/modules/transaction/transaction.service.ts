import { Inject, Injectable } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { Transaction } from './transaction.entity';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import { TransactionCreateRequestDto } from './dtos/requests/transaction-create-request.dto';
import { User } from '../user/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private transactionRepository: Repository<Transaction>,
  ) {}

  async showDaily(user: User): Promise<Transaction[]> {
    const today = new Date();
    return await this.transactionRepository.findBy({
      user: user,
      createdAt: Between(startOfDay(today), endOfDay(today)),
    });
  }

  async showMonthly(user: User): Promise<Transaction[]> {
    const today = new Date();
    return await this.transactionRepository.findBy({
      user: user,
      createdAt: Between(startOfMonth(today), endOfMonth(today)),
    });
  }

  async create(
    transactionCreateRequestDto: TransactionCreateRequestDto,
    user: User,
  ) {
    const transaction = this.transactionRepository.create({
      ...transactionCreateRequestDto,
      user: user,
    });

    await this.transactionRepository.save(transaction);
    return transaction;
  }
}

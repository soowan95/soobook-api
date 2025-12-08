import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Balance } from './balance.entity';
import { Account } from '../account/account.entity';
import { Currency } from '../currency/currency.entity';
import Decimal from 'decimal.js';

@Injectable()
export class BalanceService {
  constructor(
    @Inject('BALANCE_REPOSITORY')
    private balanceRepository: Repository<Balance>,
  ) {}

  async findAllByAccount(
    account: Account,
    relations: string[] = [],
  ): Promise<Balance[]> {
    return await this.balanceRepository.find({
      where: {
        account: account,
      },
      relations: relations,
    });
  }

  async findByAccountAndCurrency(
    account: Account,
    currency: Currency,
    relations: string[] = [],
  ): Promise<Balance> {
    let balance: Balance | null = await this.balanceRepository.findOne({
      where: {
        account: account,
        currency: currency,
      },
      relations: relations,
    });

    if (!balance) {
      balance = this.balanceRepository.create({
        account: account,
        currency: currency,
        amount: new Decimal(0),
      });

      balance = await this.balanceRepository.save(balance);
    }

    return balance;
  }

  async save(
    account: Account,
    currency: Currency,
    amount: Decimal,
  ): Promise<void> {
    await this.balanceRepository.save({
      account: account,
      currency: currency,
      amount: amount,
    });
  }
}

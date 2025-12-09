import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Balance } from './balance.entity';
import { Account } from '../account/account.entity';
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

  async findByAccountIdAndUnit(
    accountId: number,
    unit: string,
    relations: string[] = [],
  ): Promise<Balance> {
    let balance: Balance | null = await this.balanceRepository.findOne({
      where: {
        accountId: accountId,
        unit: unit,
      },
      relations: relations,
    });

    if (!balance) {
      balance = this.balanceRepository.create({
        accountId: accountId,
        unit: unit,
        amount: new Decimal(0),
      });

      balance = await this.balanceRepository.save(balance);
    }

    return balance;
  }

  async save(balance: Balance): Promise<void> {
    await this.balanceRepository.save(balance);
  }
}

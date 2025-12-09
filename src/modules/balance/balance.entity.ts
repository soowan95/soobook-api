import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  VersionColumn,
} from 'typeorm';
import { Currency } from '../currency/currency.entity';
import Decimal from 'decimal.js';
import { Account } from '../account/account.entity';

@Entity()
export class Balance {
  @PrimaryColumn({ name: 'account_id' })
  accountId: number;

  @PrimaryColumn()
  unit: string;

  @ManyToOne(() => Account, (account) => account.balances, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => Currency, (currency) => currency.balances, {
    nullable: false,
  })
  @JoinColumn({ name: 'unit' })
  currency: Currency;

  @Column('decimal', { default: 0 })
  amount: Decimal;

  @VersionColumn()
  version: number;
}

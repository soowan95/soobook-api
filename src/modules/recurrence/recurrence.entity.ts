import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Soobook } from '../../common/interfaces/soobook.entity';
import { User } from '../user/user.entity';
import { Account } from '../account/account.entity';
import Decimal from 'decimal.js';
import { TransactionType } from '../transaction/transaction-type.enum';
import { Transaction } from '../transaction/transaction.entity';
import { Category } from '../category/category.entity';

export enum RecurrencePeriodType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

@Entity()
export class Recurrence extends Soobook {
  @ManyToOne(() => User, (user) => user.recurrences, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Account, (account) => account.recurrences, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => Account, (account) => account.transferRecurrences)
  @JoinColumn({ name: 'to_account_id' })
  toAccount: Account | null;

  @ManyToOne(() => Category, (category) => category.recurrences, {
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => Transaction, (transaction) => transaction.recurrence)
  transactions: Transaction[];

  @Column({ length: 30, nullable: true })
  description: string;

  @Column()
  location: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: Decimal;

  @Column('enum', { enum: TransactionType })
  type: TransactionType;

  @Column('enum', { enum: RecurrencePeriodType, name: 'period_type' })
  periodType: RecurrencePeriodType;

  @Column({ name: 'execute_day', nullable: true, unsigned: true })
  executeDay: number;

  @Column('timestamp', { name: 'end_date', nullable: true })
  endDate: Date;
}

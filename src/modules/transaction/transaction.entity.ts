import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import Decimal from 'decimal.js';
import { Account } from '../account/account.entity';
import { Soobook } from '../../common/interfaces/soobook.entity';
import { Category } from '../category/category.entity';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

@Entity()
export class Transaction extends Soobook {
  @ManyToOne(() => User, (user) => user.transactions, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Account, (account) => account.transactions, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => Category, (category) => category.transactions)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToOne(() => Account, (account) => account.transfer)
  @JoinColumn({ name: 'to_account_id' })
  toAccount: Account;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: Decimal;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ length: 30, nullable: true })
  description: string;

  @Column({ nullable: true })
  memo: string;

  @Column()
  location: string;
}

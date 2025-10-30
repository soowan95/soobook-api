import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import Decimal from 'decimal.js';
import { Account } from '../account/account.entity';
import { Soobook } from '../../common/interfaces/soobook.entity';
import { Category } from '../category/category.entity';
import { TransactionType } from './transaction-type.enum';
import { Recurrence } from '../recurrence/recurrence.entity';

@Entity()
export class Transaction extends Soobook {
  @ManyToOne(() => User, (user) => user.transactions, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Account, (account) => account.transactions, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => Category, (category) => category.transactions, {
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Recurrence, (recurrence) => recurrence.transactions)
  @JoinColumn({ name: 'recurrence_id' })
  recurrence: Recurrence;

  @ManyToOne(() => Account, (account) => account.transferTransactions)
  @JoinColumn({ name: 'to_account_id' })
  toAccount: Account;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: Decimal;

  @Column('enum', {
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

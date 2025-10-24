import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
} from 'typeorm';
import { User } from '../user/user.entity';
import Decimal from 'decimal.js';
import { requestContext } from '../../common/middlewares/request-context';
import { Account } from '../account/account.entity';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'updated_ip', nullable: true })
  updatedIp: string;

  @BeforeUpdate()
  setUpdatedIp() {
    const store = requestContext.getStore();
    if (store?.ip) {
      this.updatedIp = store.ip;
    }
  }
}

import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import Decimal from 'decimal.js';
import { requestContext } from '../../common/middlewares/request-context';

export enum AccountType {
  CASH = 'cash',
  SAVINGS_ACCOUNT = 'savingAccount',
  DEBIT_CARD = 'debitCard',
  CREDIT_CARD = 'creditCard',
  FUNDS = 'funds',
  INSURANCE = 'insurance',
}

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.accounts, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 30 })
  name: string;

  @Column({ name: 'institution_name', nullable: true })
  institutionName: string;

  @Column()
  number: string;

  @Column({
    type: 'enum',
    enum: AccountType,
  })
  type: AccountType;

  @Column({ name: 'payment_date', nullable: true })
  paymentDate: Date;

  @Column('decimal', { nullable: true, precision: 15, scale: 2  })
  limitAmount: Decimal;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ length: 30, nullable: true })
  description: string;

  @Column('decimal', { name: 'initial_balance', default: 0, precision: 15, scale: 2 })
  initialBalance: Decimal;

  @Column('decimal', { name: 'current_balance', precision: 15, scale: 2 })
  currentBalance: Decimal;

  @OneToOne(() => Account, (account) => account.linkedCard)
  @JoinColumn({ name: 'linked_account_id' })
  linkedAccount: Account;

  @OneToOne(() => Account, (account) => account.linkedAccount)
  linkedCard: Account;

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

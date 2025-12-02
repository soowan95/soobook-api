import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import Decimal from 'decimal.js';
import { Transaction } from '../transaction/transaction.entity';

@Entity()
export class Currency {
  @PrimaryColumn()
  unit: string;

  @Column('decimal', { precision: 15, scale: 2 })
  ttb: Decimal;

  @Column('decimal', { precision: 15, scale: 2 })
  tts: Decimal;

  @Column('decimal', { name: 'kftc_deal_bas_r', precision: 15, scale: 2 })
  kftcDealBasR: Decimal;

  @Column()
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.currency)
  transactions: Transaction[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

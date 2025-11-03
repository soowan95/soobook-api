import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Soobook } from '../../common/interfaces/soobook.entity';
import { Transaction } from '../transaction/transaction.entity';
import { Recurrence } from '../recurrence/recurrence.entity';

@Entity()
export class Category extends Soobook {
  @Column({ length: 30, unique: true })
  name: string;

  @OneToMany(() => Category, (category) => category.parent, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  children: Category[];

  @ManyToOne(() => Category, (category) => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];

  @OneToMany(() => Recurrence, (recurrence) => recurrence.category)
  recurrences: Recurrence[];
}

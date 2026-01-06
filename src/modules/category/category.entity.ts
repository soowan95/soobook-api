import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import { Soobook } from '../../common/interfaces/soobook.entity';
import { Transaction } from '../transaction/transaction.entity';
import { Recurrence } from '../recurrence/recurrence.entity';

@Entity()
@Tree('materialized-path')
export class Category extends Soobook {
  @Column({ length: 30, unique: true })
  name: string;

  // @OneToMany(() => Category, (category) => category.parent, {
  //   cascade: ['remove'],
  //   onDelete: 'CASCADE',
  // })
  @TreeChildren()
  children: Category[];

  // @ManyToOne(() => Category, (category) => category.children)
  @TreeParent()
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];

  @OneToMany(() => Recurrence, (recurrence) => recurrence.category)
  recurrences: Recurrence[];
}

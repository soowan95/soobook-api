import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Soobook } from '../../common/interfaces/soobook.entity';

@Entity()
export class Category extends Soobook {
  @Column({ length: 30 })
  name: string;

  @OneToMany(() => Category, (category) => category.parent, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  children: Category[];

  @ManyToOne(() => Category, (category) => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Category;
}
import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { requestContext } from '../middlewares/request-context';

export abstract class Soobook {
  @PrimaryGeneratedColumn()
  id: number;

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

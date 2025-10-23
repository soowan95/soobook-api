import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { requestContext } from '../../common/middlewares/request-context';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column('timestamp', { name: 'expires_at' })
  expiresAt: Date;

  @OneToOne(() => User, (user) => user.refreshToken, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'user_id'})
  user: User;

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

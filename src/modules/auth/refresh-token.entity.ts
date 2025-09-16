import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column('timestamp', { name: 'expires_at' })
  expiresAt: Date;

  @OneToOne(() => User, (user) => user.refreshToken)
  @JoinColumn({name: 'user_id'})
  user: User;
}

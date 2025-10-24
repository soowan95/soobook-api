import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Soobook } from '../../common/interfaces/soobook.entity';

@Entity()
export class RefreshToken extends Soobook {
  @Column()
  token: string;

  @Column('timestamp', { name: 'expires_at' })
  expiresAt: Date;

  @OneToOne(() => User, (user) => user.refreshToken, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

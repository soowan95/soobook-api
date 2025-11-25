import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Soobook } from '../../common/interfaces/soobook.entity';
import { User } from '../user/user.entity';

export enum UserSettingDefaultView {
  MAIN = 'main',
  DAILY_TRANSACTION = 'dailyTransaction',
  MONTHLY_TRANSACTION = 'monthlyTransaction',
  STATISTICS = 'statistics',
}

export enum UserSettingTabBarMode {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

@Entity()
export class UserSetting extends Soobook {
  @OneToOne(() => User, (user) => user.setting, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'is_show_main_income', default: true })
  isShowMainIncome: boolean;

  @Column({ name: 'is_show_main_expense', default: true })
  isShowMainExpense: boolean;

  @Column({ name: 'is_show_main_balance', default: true })
  isShowMainBalance: boolean;

  @Column({ name: 'is_show_main_latest_transaction', default: true })
  isShowMainLatestTransaction: boolean;

  @Column('enum', {
    name: 'default_view',
    enum: UserSettingDefaultView,
    default: UserSettingDefaultView.MAIN,
  })
  defaultView: UserSettingDefaultView;

  @Column('enum', {
    name: 'tab_bar_mode',
    enum: UserSettingTabBarMode,
    default: UserSettingTabBarMode.HORIZONTAL,
  })
  tabBarMode: UserSettingTabBarMode;
}

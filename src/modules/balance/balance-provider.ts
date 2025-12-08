import { DataSource } from 'typeorm';
import { Balance } from './balance.entity';

export const balanceProviders = [
  {
    provide: 'BALANCE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Balance),
    inject: ['DATA_SOURCE'],
  },
];

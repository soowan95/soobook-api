import { DataSource } from 'typeorm';
import { Account } from './account.entity';

export const accountProvider = [
  {
    provide: 'ACCOUNT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Account),
    inject: ['DATA_SOURCE'],
  },
];

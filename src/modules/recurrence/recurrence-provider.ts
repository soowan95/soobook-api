import { DataSource } from 'typeorm';
import { Recurrence } from './recurrence.entity';

export const recurrenceProvider = [
  {
    provide: 'RECURRENCE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Recurrence),
    inject: ['DATA_SOURCE'],
  },
];

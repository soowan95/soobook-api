import { DataSource } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

export const refreshTokenProvider = [
  {
    provide: 'REFRESH_TOKEN_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RefreshToken),
    inject: ['DATA_SOURCE'],
  },
];

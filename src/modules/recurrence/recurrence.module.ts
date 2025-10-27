import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { recurrenceProvider } from './recurrence-provider';

@Module({
  imports: [DatabaseModule],
  providers: [...recurrenceProvider],
})
export class RecurrenceModule {}

import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Recurrence } from './recurrence.entity';

@Injectable()
export class RecurrenceService {
  constructor(
    @Inject('RECURRENCE_REPOSITORY')
    private recurrenceRepository: Repository<Recurrence>,
  ) {}

  async create(): Promise<void> {
    console.log('create recurrence');
  }
}

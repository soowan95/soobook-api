import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Recurrence } from './recurrence.entity';
import { RecurrenceCreateRequestDto } from './dtos/requests/recurrence-create-request.dto';
import { User } from '../user/user.entity';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account.entity';
import { RecurrenceUpdateRequestDto } from './dtos/requests/recurrence-update-request.dto';
import { RecurrenceTerminateRequestDto } from './dtos/requests/recurrence-terminate-request.dto';
import { startOfDay } from 'date-fns';
import { TransactionUpdateRequestDto } from '../transaction/dtos/requests/transaction-update-request.dto';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class RecurrenceService {
  constructor(
    @Inject('RECURRENCE_REPOSITORY')
    private recurrenceRepository: Repository<Recurrence>,
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
  ) {}

  async create(
    request: RecurrenceCreateRequestDto,
    user: User,
  ): Promise<Recurrence> {
    const account: Account = await this.accountService.findByIdOrThrow(
      request.accountId,
    );

    return await this.recurrenceRepository.save({
      ...request,
      user: user,
      account: account,
    });
  }

  async findAllByUserId(userId: number): Promise<Recurrence[]> {
    return await this.recurrenceRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['account'],
    });
  }

  async findByIdOrThrow(id: number): Promise<Recurrence> {
    const recurrence: Recurrence | null =
      await this.recurrenceRepository.findOneBy({
        id: id,
      });
    if (!recurrence) throw new NotFoundException('error.recurrence.notFound');
    return recurrence;
  }

  async update(
    request: RecurrenceUpdateRequestDto,
    isCascade: boolean | undefined = undefined,
  ): Promise<Recurrence> {
    let recurrence: Recurrence = await this.findByIdOrThrow(request.id);
    await this.checkTransactions(request, recurrence);
    let account: Account | null = null;
    if (request.accountId) {
      account = await this.accountService.findByIdOrThrow(request.accountId);
    }

    if (request.amount) {
      switch (isCascade) {
        case undefined:
          if (recurrence.transactions?.length > 0) {
            throw new ConflictException('warning.recurrence.transactions');
          }
          break;
        case true:
          let transactionUpdateRequest: TransactionUpdateRequestDto =
            new TransactionUpdateRequestDto();
          transactionUpdateRequest.amount = request.amount;
          await this.transactionService.update(
            transactionUpdateRequest,
            recurrence.user.id,
          );
          break;
        case false:
          break;
      }
    }

    recurrence = this.recurrenceRepository.merge(recurrence, {
      ...request,
      account: account ?? undefined,
    });

    return await this.recurrenceRepository.save(recurrence);
  }

  async terminate(request: RecurrenceTerminateRequestDto): Promise<Recurrence> {
    const recurrence: Recurrence = await this.findByIdOrThrow(request.id);

    recurrence.endDate = startOfDay(new Date());

    return await this.recurrenceRepository.save(recurrence);
  }

  private async checkTransactions(
    request: RecurrenceUpdateRequestDto,
    recurrence: Recurrence,
  ): Promise<void> {
    if (request.type) {
      if (recurrence.transactions?.length > 0) {
        throw new ConflictException('error.recurrence.transactions');
      }
    }
  }
}

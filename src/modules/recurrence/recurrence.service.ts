import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Recurrence, RecurrencePeriodType } from './recurrence.entity';
import { RecurrenceCreateRequestDto } from './dtos/requests/recurrence-create-request.dto';
import { User } from '../user/user.entity';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account.entity';
import { RecurrenceUpdateRequestDto } from './dtos/requests/recurrence-update-request.dto';
import { RecurrenceTerminateRequestDto } from './dtos/requests/recurrence-terminate-request.dto';
import { getDate, getDay, startOfDay } from 'date-fns';
import { TransactionUpdateRequestDto } from '../transaction/dtos/requests/transaction-update-request.dto';
import { TransactionService } from '../transaction/transaction.service';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category.entity';
import { CurrencyService } from '../currency/currency.service';
import { Currency } from '../currency/currency.entity';

@Injectable()
export class RecurrenceService {
  constructor(
    @Inject('RECURRENCE_REPOSITORY')
    private recurrenceRepository: Repository<Recurrence>,
    private readonly accountService: AccountService,
    private readonly categoryService: CategoryService,
    private readonly currencyService: CurrencyService,
    private readonly transactionService: TransactionService,
  ) {}

  async create(
    request: RecurrenceCreateRequestDto,
    user: User,
  ): Promise<Recurrence> {
    const account: Account = await this.accountService.findByIdOrThrow(
      request.accountId,
    );
    let toAccount: Account | null = null;
    if (request.toAccountId) {
      toAccount = await this.accountService.findByIdOrThrow(
        request.toAccountId,
      );
    }
    const category: Category = await this.categoryService.findByIdOrThrow(
      request.categoryId,
    );
    const currency: Currency = await this.currencyService.findByUnit(
      request.unit,
    );

    return await this.recurrenceRepository.save({
      ...request,
      user: user,
      account: account,
      toAccount: toAccount,
      category: category,
      currency: currency,
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

  async getDailyTarget(
    after: number = 0,
    relations: string[] = [],
  ): Promise<Recurrence[]> {
    const targetDate: Date = new Date();
    targetDate.setDate(targetDate.getDate() + after);
    return this.recurrenceRepository.find({
      where: {
        periodType: RecurrencePeriodType.DAILY,
        endDate: MoreThanOrEqual(startOfDay(targetDate)),
      },
      relations: relations,
    });
  }

  async getWeeklyTarget(
    after: number = 0,
    relations: string[] = [],
  ): Promise<Recurrence[]> {
    const targetDate: Date = new Date();
    targetDate.setDate(targetDate.getDate() + after);
    return this.recurrenceRepository.find({
      where: {
        periodType: RecurrencePeriodType.WEEKLY,
        executeDay: getDay(targetDate),
        endDate: MoreThanOrEqual(startOfDay(targetDate)),
      },
      relations: relations,
    });
  }

  async getMonthlyTarget(
    after: number = 0,
    relations: string[] = [],
  ): Promise<Recurrence[]> {
    const targetDate: Date = new Date();
    targetDate.setDate(targetDate.getDate() + after);
    return this.recurrenceRepository.find({
      where: {
        periodType: RecurrencePeriodType.MONTHLY,
        executeDay: getDate(targetDate),
        endDate: MoreThanOrEqual(startOfDay(targetDate)),
      },
      relations: relations,
    });
  }

  async update(
    request: RecurrenceUpdateRequestDto,
    isCascade: boolean | undefined = undefined,
  ): Promise<Recurrence> {
    let recurrence: Recurrence = await this.findByIdOrThrow(request.id);
    await this.checkTransactions(request, recurrence);
    let account: Account | null = null;
    let toAccount: Account | null = null;
    let category: Category | null = null;
    let currency: Currency | null = null;
    if (request.accountId) {
      account = await this.accountService.findByIdOrThrow(request.accountId);
    }
    if (request.toAccountId) {
      toAccount = await this.accountService.findByIdOrThrow(
        request.toAccountId,
      );
    }
    if (request.categoryId) {
      category = await this.categoryService.findByIdOrThrow(request.categoryId);
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

    if (request.unit) {
      currency = await this.currencyService.findByUnit(request.unit);
    }

    recurrence = this.recurrenceRepository.merge(recurrence, {
      ...request,
      account: account ?? undefined,
      toAccount: toAccount,
      category: category ?? undefined,
      currency: currency ?? recurrence.currency,
    });

    if (!request.toAccountId && recurrence.toAccount) {
      recurrence.toAccount = null;
    }

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

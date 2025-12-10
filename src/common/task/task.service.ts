import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TransactionService } from '../../modules/transaction/transaction.service';
import { RecurrenceService } from '../../modules/recurrence/recurrence.service';
import { Recurrence } from '../../modules/recurrence/recurrence.entity';
import { TransactionCreateRequestDto } from '../../modules/transaction/dtos/requests/transaction-create-request.dto';
import { TransactionType } from '../../modules/transaction/transaction-type.enum';
import { OptimisticLockVersionMismatchError } from 'typeorm';
import { CurrencyService } from '../../modules/currency/currency.service';
import { Balance } from '../../modules/balance/balance.entity';
import { BalanceService } from '../../modules/balance/balance.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly recurrenceService: RecurrenceService,
    private readonly currencyService: CurrencyService,
    private readonly balanceService: BalanceService,
  ) {}

  private readonly logger = new Logger(TaskService.name);

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async createDailyTransaction(): Promise<void> {
    this.logger.log('📲 Daily transaction creation started');

    const dailyTargets: Recurrence[] =
      await this.recurrenceService.getDailyTarget(0, [
        'account',
        'toAccount',
        'category',
        'user',
      ]);
    const weeklyTargets: Recurrence[] =
      await this.recurrenceService.getWeeklyTarget(0, [
        'account',
        'toAccount',
        'category',
        'user',
      ]);
    const monthlyTargets: Recurrence[] =
      await this.recurrenceService.getMonthlyTarget(0, [
        'account',
        'toAccount',
        'category',
        'user',
      ]);
    const allTargets: Recurrence[] = [
      ...dailyTargets,
      ...weeklyTargets,
      ...monthlyTargets,
    ];

    const totalCnt: number = allTargets.length;
    let successCnt: number = 0;
    let failCnt: number = 0;

    for (const recurrence of allTargets) {
      const { id, createdAt, updatedAt, updatedIp, ...rest } = recurrence;
      let transactionCreateRequest: TransactionCreateRequestDto = Object.assign(
        new TransactionCreateRequestDto(),
        {
          ...rest,
          categoryId: rest.category.id,
          accountId: rest.account.id,
          toAccountId: rest.toAccount?.id,
        },
      );
      await this.transactionService
        .create(transactionCreateRequest, recurrence.user, recurrence)
        .then(() => {
          successCnt++;
        })
        .catch((error) => {
          this.logger.error(`⚠️ Error transaction creation: ${error}`);
          failCnt++;
          if (error instanceof OptimisticLockVersionMismatchError) {
            // TODO: Send notification
            this.logger.log('> Concurrent transaction');
          } else {
            // TODO: Send notification
            this.logger.log('> Unknown error');
          }
        });
    }

    this.logger.log(
      `🎯 Total: ${totalCnt}\n✅ Success: ${successCnt}\n⛔️ Fail: ${failCnt}`,
    );
    this.logger.log('🏁 Daily transaction creation end');
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async noticeInsufficientBalance(): Promise<void> {
    this.logger.log('📲 Send notification started');

    const dailyTargets: Recurrence[] =
      await this.recurrenceService.getDailyTarget(1, ['account', 'currency']);
    const weeklyTargets: Recurrence[] =
      await this.recurrenceService.getWeeklyTarget(3, ['account', 'currency']);
    const monthlyTargets: Recurrence[] =
      await this.recurrenceService.getMonthlyTarget(3, ['account', 'currency']);
    const allTargets: Recurrence[] = [
      ...dailyTargets,
      ...weeklyTargets,
      ...monthlyTargets,
    ];

    const totalCnt: number = allTargets.length;
    let successCnt: number = 0;
    let failCnt: number = 0;

    for (const recurrence of allTargets) {
      const balance: Balance =
        await this.balanceService.findByAccountIdAndUnit(
          recurrence.account.id,
          recurrence.currency.unit,
        );
      if (
        (recurrence.type == TransactionType.EXPENSE ||
          recurrence.type == TransactionType.TRANSFER) &&
        balance.amount < recurrence.amount
      ) {
        // TODO: Send notification
        this.logger.log('> Insufficient balance');
      }
    }

    this.logger.log(
      `🎯 Total: ${totalCnt}\n✅ Success: ${successCnt}\n⛔️ Fail: ${failCnt}`,
    );
    this.logger.log('🏁 Send notification end');
  }

  @Cron('0 30 11 * * *')
  async fetchCurrency(): Promise<void> {
    await new Promise((r) => setTimeout(r, 3000));
    this.logger.log('📝 Fetching currency start');
    await this.currencyService.fetch();
    this.logger.log('🏁 Fetching currency end');
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TransactionService } from '../../modules/transaction/transaction.service';
import { RecurrenceService } from '../../modules/recurrence/recurrence.service';
import { Recurrence } from '../../modules/recurrence/recurrence.entity';
import { TransactionCreateRequestDto } from '../../modules/transaction/dtos/requests/transaction-create-request.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly recurrenceService: RecurrenceService,
  ) {}

  private readonly logger = new Logger(TaskService.name);

  // @Cron(CronExpression.EVERY_DAY_AT_4AM)
  @Cron('5 3 * * *')
  async createDailyTransaction() {
    this.logger.log('📲 Daily transaction creation started');

    let targetRecurrences: Recurrence[] =
      await this.recurrenceService.getDailyTarget();
    targetRecurrences.push(...(await this.recurrenceService.getWeeklyTarget()));
    targetRecurrences.push(
      ...(await this.recurrenceService.getMonthlyTarget()),
    );

    const totalCnt: number = targetRecurrences.length;
    let successCnt: number = 0;
    let failCnt: number = 0;

    for (const recurrence of targetRecurrences) {
      let transactionCreateRequest: TransactionCreateRequestDto = Object.assign(
        new TransactionCreateRequestDto(),
        {
          ...recurrence,
          categoryId: recurrence.category.id,
          accountId: recurrence.account.id,
          toAccount: recurrence.toAccount?.id,
        },
      );
      await this.transactionService
        .create(transactionCreateRequest, recurrence.user)
        .then(() => {
          successCnt++;
        })
        .catch(() => {
          failCnt++;
        });
    }

    this.logger.log(
      `🎯 Total: ${totalCnt}\n✅ Success: ${successCnt}\n⛔️ Fail: ${failCnt}`,
    );
    this.logger.log('🏁 Daily transaction creation ended');
  }
}

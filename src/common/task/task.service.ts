import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
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
        });
    }

    this.logger.log(
      `🎯 Total: ${totalCnt}\n✅ Success: ${successCnt}\n⛔️ Fail: ${failCnt}`,
    );
    this.logger.log('🏁 Daily transaction creation ended');
  }
}

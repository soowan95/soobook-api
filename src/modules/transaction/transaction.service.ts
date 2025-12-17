import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Between,
  OptimisticLockVersionMismatchError,
  Repository,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import {
  endOfDay,
  endOfMonth,
  parse,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { TransactionCreateRequestDto } from './dtos/requests/transaction-create-request.dto';
import { User } from '../user/user.entity';
import { AccountService } from '../account/account.service';
import Decimal from 'decimal.js';
import { Account } from '../account/account.entity';
import { TransactionType } from './transaction-type.enum';
import { CategoryService } from '../category/category.service';
import { TransactionUpdateRequestDto } from './dtos/requests/transaction-update-request.dto';
import { Category } from '../category/category.entity';
import { Recurrence } from '../recurrence/recurrence.entity';
import { Recursion } from '../../common/decorators/recursion.decorator';
import { TransactionMonthlyBriefResponseDto } from './dtos/responses/transaction-monthly-brief-response.dto';
import { Currency } from '../currency/currency.entity';
import { CurrencyService } from '../currency/currency.service';
import { Balance } from '../balance/balance.entity';
import { BalanceService } from '../balance/balance.service';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private transactionRepository: Repository<Transaction>,
    private readonly accountService: AccountService,
    private readonly balanceService: BalanceService,
    private readonly categoryService: CategoryService,
    private readonly currencyService: CurrencyService,
  ) {}

  async showDaily(
    userId: number,
    commitAt: string | undefined,
    accountId: number | undefined,
  ): Promise<Transaction[]> {
    const today: Date = commitAt
      ? parse(commitAt, 'yyyyMMdd', new Date())
      : new Date();
    const where: any = {
      user: { id: userId },
      commitAt: Between(startOfDay(today), endOfDay(today)),
    };
    if (accountId) {
      where['account'] = { id: accountId };
    }
    return await this.transactionRepository.find({
      where: where,
      relations: ['account', 'toAccount', 'category', 'recurrence', 'currency'],
    });
  }

  async showMonthly(
    userId: number,
    commitAt: string | undefined,
    accountId: number | undefined,
  ): Promise<Transaction[]> {
    const today: Date = commitAt
      ? parse(commitAt, 'yyyyMMdd', new Date())
      : new Date();
    const where: any = {
      user: { id: userId },
      commitAt: Between(startOfMonth(today), endOfMonth(today)),
    };
    if (accountId) {
      where['account'] = { id: accountId };
    }
    return await this.transactionRepository.find({
      where: where,
      relations: ['account', 'toAccount', 'category', 'recurrence', 'currency'],
    });
  }

  async showMonthlyBrief(
    userId: number,
    accountId: number | undefined,
  ): Promise<TransactionMonthlyBriefResponseDto> {
    const where: any = {
      user: { id: userId },
      commitAt: Between(startOfMonth(new Date()), endOfMonth(new Date())),
    };
    if (accountId) {
      where['account'] = { id: accountId };
    }

    let transactions: Transaction[] = await this.transactionRepository.find({
      where: where,
      relations: ['currency'],
    });

    return new TransactionMonthlyBriefResponseDto(
      await this.sumAmountByType(transactions, TransactionType.INCOME),
      await this.sumAmountByType(transactions, TransactionType.EXPENSE),
    );
  }

  async showLatest(
    userId: number,
    accountId: number | undefined,
    type: string,
  ): Promise<Transaction | null> {
    const where: any = {
      user: { id: userId },
      type: type,
    };
    if (accountId) {
      where['account'] = { id: accountId };
    }

    return await this.transactionRepository.findOne({
      where: where,
      relations: ['account', 'toAccount', 'category', 'recurrence', 'currency'],
      order: {
        commitAt: 'DESC',
      },
    });
  }

  async create(
    request: TransactionCreateRequestDto,
    user: User,
    recurrence: Recurrence | undefined = undefined,
  ): Promise<Transaction> {
    const category: Category = await this.categoryService.findByIdOrThrow(
      request.categoryId,
    );
    const currency: Currency = await this.currencyService.findByUnit(
      request.unit ?? 'KRW',
    );
    const account: Account | undefined =
      await this.accountService.findByIdOrThrow(request.accountId);
    const toAccount: Account | undefined =
      await this.accountService.findByIdOrThrow(request.toAccountId);

    try {
      await this.commit(
        request.type,
        request.accountId,
        request.toAccountId,
        request.amount,
        currency.unit,
      );
    } catch (error) {
      if (error instanceof OptimisticLockVersionMismatchError)
        throw new ConflictException('error.account.concurrent.transaction');
      else throw error;
    }

    if (request.type == TransactionType.TRANSFER)
      request.location = `${account!.name} -> ${toAccount!.name}`;

    let transaction: Transaction = this.transactionRepository.create({
      ...request,
      user: user,
      category: category,
      account: account!,
      toAccount: toAccount,
      recurrence: recurrence,
      currency: currency,
    });

    transaction = await this.transactionRepository.save(transaction);
    return transaction;
  }

  async update(
    request: TransactionUpdateRequestDto,
    userId: number,
  ): Promise<Transaction> {
    await this.mandatoryUpdate(request);

    let transaction: Transaction = await this.findByIdOrThrow(request.id);
    if (transaction.user.id !== userId) {
      throw new ForbiddenException('warning.transaction.forbidden');
    }
    let category: Category | null = null;
    let currency: Currency = transaction.currency;
    let account: Account | undefined = undefined;
    let toAccount: Account | undefined = undefined;

    if (request.categoryId)
      category = await this.categoryService.findByIdOrThrow(request.categoryId);
    if (request.unit)
      currency = await this.currencyService.findByUnit(request.unit);

    try {
      if (
        request.amount ||
        request.accountId ||
        request.toAccountId ||
        request.type
      ) {
        await this.commit(
          transaction.type,
          transaction.account.id,
          transaction.toAccount?.id,
          transaction.amount,
          transaction.currency.unit,
          true,
        );
        await this.commit(
          request.type ?? transaction.type,
          request.accountId ?? transaction.account.id,
          request.toAccountId,
          request.amount ? request.amount : transaction.amount,
          currency.unit,
        );
        account = await this.accountService.findByIdOrThrow(request.accountId);
        toAccount = await this.accountService.findByIdOrThrow(
          request.toAccountId,
        );
      }
    } catch (error) {
      if (error instanceof OptimisticLockVersionMismatchError)
        throw new ConflictException('error.account.concurrent.transaction');
      else throw error;
    }

    if (request.type == TransactionType.TRANSFER)
      request.location = `${account!.name} -> ${toAccount!.name}`;

    transaction = this.transactionRepository.merge(transaction, {
      ...request,
      account: account,
      toAccount: toAccount,
      category: category ?? undefined,
      currency: currency,
    });

    if (!toAccount) {
      transaction.toAccount = null;
    }

    return await this.transactionRepository.save(transaction);
  }

  async delete(id: number): Promise<void> {
    const transaction: Transaction = await this.findByIdOrThrow(id);
    await this.commit(
      transaction.type,
      transaction.account.id,
      transaction.toAccount?.id,
      transaction.amount,
      transaction.currency.unit,
      true,
    )
      .then(() => {
        this.transactionRepository.delete({ id: id });
      })
      .catch((error) => {
        if (error instanceof OptimisticLockVersionMismatchError)
          throw new ConflictException('error.account.concurrent.transaction');
        else throw error;
      });
  }

  @Recursion(3, OptimisticLockVersionMismatchError)
  private async commit(
    type: TransactionType,
    accountId: number,
    toAccountId: number | undefined,
    amount: Decimal,
    unit: string,
    rollback: boolean = false,
  ): Promise<void> {
    await this.mandatoryTransfer(type, accountId, toAccountId);
    let accountBalance: Balance =
      await this.balanceService.findByAccountIdAndUnit(accountId, unit);
    let toAccountBalance: Balance | null = null;

    switch (type) {
      case 'income':
        if (rollback)
          await this.checkBalance(new Decimal(accountBalance.amount), amount);
        accountBalance.amount = rollback
          ? new Decimal(accountBalance.amount).minus(amount)
          : new Decimal(accountBalance.amount).plus(amount);
        break;
      case 'expense':
        if (!rollback)
          await this.checkBalance(new Decimal(accountBalance.amount), amount);
        accountBalance.amount = rollback
          ? new Decimal(accountBalance.amount).plus(amount)
          : new Decimal(accountBalance.amount).minus(amount);
        break;
      case 'transfer':
        toAccountBalance = await this.balanceService.findByAccountIdAndUnit(
          toAccountId!,
          unit,
        );
        rollback
          ? await this.checkBalance(
              new Decimal(toAccountBalance.amount),
              amount,
            )
          : await this.checkBalance(new Decimal(accountBalance.amount), amount);
        accountBalance.amount = rollback
          ? new Decimal(accountBalance.amount).plus(amount)
          : new Decimal(accountBalance.amount).minus(amount);
        toAccountBalance.amount = rollback
          ? new Decimal(toAccountBalance.amount).minus(amount)
          : new Decimal(toAccountBalance.amount).plus(amount);
        break;
    }

    await this.balanceService.save(accountBalance);

    if (type == TransactionType.TRANSFER) {
      await this.balanceService.save(toAccountBalance!);
    }
  }

  private async findByIdOrThrow(id: number): Promise<Transaction> {
    const transaction: Transaction | null =
      await this.transactionRepository.findOne({
        where: {
          id: id,
        },
        relations: ['account', 'toAccount', 'category', 'user', 'currency'],
      });
    if (!transaction) throw new NotFoundException('error.transaction.notFound');
    return transaction;
  }

  private async mandatoryTransfer(
    type: TransactionType,
    accountId: number,
    toAccountId: number | undefined,
  ): Promise<void> {
    if (type == TransactionType.TRANSFER) {
      if (!toAccountId) {
        throw new BadRequestException('error.transaction.mandatory.transfer');
      } else if (accountId == toAccountId) {
        throw new BadRequestException('error.transaction.same.account');
      }
    }
  }

  private async mandatoryUpdate(
    request: TransactionUpdateRequestDto,
  ): Promise<void> {
    if (request.type == TransactionType.TRANSFER && !request.toAccountId) {
      throw new BadRequestException(
        'error.transaction.mandatory.toAccount.notFound',
      );
    }
  }

  private async checkBalance(currentBalance: Decimal, amount: Decimal) {
    if (currentBalance.minus(amount).lt(0)) {
      throw new BadRequestException('error.transaction.insufficient.balance');
    }
  }

  private async sumAmountByType(
    transactions: Transaction[],
    type: TransactionType,
  ): Promise<Decimal> {
    return transactions
      .filter((t) => t.type == type)
      .reduce(
        (sum: Decimal, t) =>
          sum.plus(new Decimal(t.amount).mul(t.currency.kftcDealBasR)),
        new Decimal(0),
      );
  }
}

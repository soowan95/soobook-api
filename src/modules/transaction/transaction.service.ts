import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import { TransactionCreateRequestDto } from './dtos/requests/transaction-create-request.dto';
import { User } from '../user/user.entity';
import { AccountService } from '../account/account.service';
import { AccountUpdateRequestDto } from '../account/dtos/requests/account-update-request.dto';
import Decimal from 'decimal.js';
import { Account } from '../account/account.entity';
import { TransactionType } from './transaction-type.enum';
import { CategoryService } from '../category/category.service';
import { TransactionUpdateRequestDto } from './dtos/requests/transaction-update-request.dto';
import { Category } from '../category/category.entity';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private transactionRepository: Repository<Transaction>,
    private readonly accountService: AccountService,
    private readonly categoryService: CategoryService,
  ) {}

  async showDaily(userId: number): Promise<Transaction[]> {
    const today = new Date();
    return await this.transactionRepository.find({
      where: {
        user: { id: userId },
        createdAt: Between(startOfDay(today), endOfDay(today)),
      },
      relations: ['account', 'toAccount', 'category', 'recurrence'],
    });
  }

  async showMonthly(userId: number): Promise<Transaction[]> {
    const today = new Date();
    return await this.transactionRepository.find({
      where: {
        user: { id: userId },
        createdAt: Between(startOfMonth(today), endOfMonth(today)),
      },
      relations: ['account', 'toAccount', 'category', 'recurrence'],
    });
  }

  async create(
    request: TransactionCreateRequestDto,
    user: User,
  ): Promise<Transaction> {
    const category: Category = await this.categoryService.findByIdOrThrow(
      request.categoryId,
    );

    const updatedAccounts: { account: Account; toAccount: Account | null } =
      await this.updateAccounts(
        request.type,
        request.accountId,
        request.toAccountId,
        request.amount,
      );

    if (request.type == TransactionType.TRANSFER)
      request.location = `${updatedAccounts.account.name} -> ${updatedAccounts.toAccount!.name}`;

    let transaction: Transaction = this.transactionRepository.create({
      ...request,
      user: user,
      category: category,
      account: updatedAccounts.account,
      toAccount: updatedAccounts.toAccount ?? undefined,
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

    if (request.categoryId)
      category = await this.categoryService.findByIdOrThrow(request.categoryId);

    await this.updateAccounts(
      transaction.type,
      transaction.account.id,
      transaction.toAccount?.id,
      transaction.amount,
      true,
    );
    const updatedAccounts: { account: Account; toAccount: Account | null } =
      await this.updateAccounts(
        request.type,
        request.accountId ?? transaction.account.id,
        request.toAccountId,
        request.amount,
      );

    if (request.type == TransactionType.TRANSFER)
      request.location = `${updatedAccounts.account.name} -> ${updatedAccounts.toAccount!.name}`;

    transaction = this.transactionRepository.merge(transaction, {
      ...request,
      account: updatedAccounts.account,
      toAccount: updatedAccounts.toAccount,
      category: category ?? undefined,
    });
    return await this.transactionRepository.save(transaction);
  }

  private async updateAccounts(
    type: TransactionType,
    accountId: number,
    toAccountId: number | undefined,
    amount: Decimal,
    isReset: boolean = false,
  ): Promise<{ account: Account; toAccount: Account | null }> {
    await this.mandatoryTransfer(type, accountId, toAccountId);
    let account: Account = await this.accountService.findByIdOrThrow(accountId);
    let toAccount: Account | null = null;

    let accountUpdateRequestDto: AccountUpdateRequestDto =
      new AccountUpdateRequestDto();
    accountUpdateRequestDto.id = accountId;
    let toAccountUpdateRequestDto: AccountUpdateRequestDto =
      new AccountUpdateRequestDto();

    switch (type) {
      case 'income':
        if (isReset)
          await this.checkBalance(new Decimal(account.currentBalance), amount);
        accountUpdateRequestDto.currentBalance = isReset
          ? new Decimal(account.currentBalance).minus(amount)
          : new Decimal(account.currentBalance).plus(amount);
        break;
      case 'expense':
        if (!isReset)
          await this.checkBalance(new Decimal(account.currentBalance), amount);
        accountUpdateRequestDto.currentBalance = isReset
          ? new Decimal(account.currentBalance).plus(amount)
          : new Decimal(account.currentBalance).minus(amount);
        break;
      case 'transfer':
        toAccount = await this.accountService.findByIdOrThrow(toAccountId!);
        isReset
          ? await this.checkBalance(
              new Decimal(toAccount.currentBalance),
              amount,
            )
          : await this.checkBalance(
              new Decimal(account.currentBalance),
              amount,
            );
        accountUpdateRequestDto.currentBalance = isReset
          ? new Decimal(account.currentBalance).plus(amount)
          : new Decimal(account.currentBalance).minus(amount);
        toAccountUpdateRequestDto.id = toAccountId!;
        toAccountUpdateRequestDto.currentBalance = isReset
          ? new Decimal(toAccount.currentBalance).minus(amount)
          : new Decimal(toAccount.currentBalance).plus(amount);
        break;
    }

    account = await this.accountService.update(accountUpdateRequestDto);

    if (type == TransactionType.TRANSFER) {
      toAccount = await this.accountService.update(toAccountUpdateRequestDto);
    }

    return { account, toAccount };
  }

  private async findByIdOrThrow(id: number): Promise<Transaction> {
    const transaction: Transaction | null =
      await this.transactionRepository.findOne({
        where: {
          id: id,
        },
        relations: ['account', 'toAccount', 'user'],
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
}

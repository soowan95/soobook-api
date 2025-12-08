import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { AccountCreateRequestDto } from './dtos/requests/account-create-request.dto';
import { User } from '../user/user.entity';
import { AccountUpdateRequestDto } from './dtos/requests/account-update-request.dto';
import Decimal from 'decimal.js';
import { AccountTotalCurrentBalanceResponse } from './dtos/responses/account-total-current-balance-response.dto';
import { CurrencyService } from '../currency/currency.service';
import { BalanceService } from '../balance/balance.service';
import { Balance } from '../balance/balance.entity';

@Injectable()
export class AccountService {
  constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private accountRepository: Repository<Account>,
    private readonly balanceService: BalanceService,
    private readonly currencyService: CurrencyService,
  ) {}

  async findAllByUserId(userId: number): Promise<Account[]> {
    return await this.accountRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['linkedAccount'],
    });
  }

  async findAllByKeyword(keyword: string, userId: number): Promise<Account[]> {
    const likeKeyword = `%${keyword}%`;

    return this.accountRepository
      .createQueryBuilder('account')
      .leftJoin('account.user', 'user')
      .leftJoinAndSelect('account.linkedAccount', 'linkedAccount')
      .where('user.id = :userId', { userId })
      .andWhere(
        'account.name LIKE :likeKeyword OR account.institutionName LIKE :likeKeyword OR account.description LIKE :likeKeyword',
        { likeKeyword },
      )
      .getMany();
  }

  async findByIdOrThrow(id: number): Promise<Account> {
    const account: Account | null = await this.accountRepository.findOneBy({
      id: id,
    });
    if (!account) throw new NotFoundException('error.account.notFound');
    return account;
  }

  async create(request: AccountCreateRequestDto, user: User): Promise<Account> {
    let linkedAccount: Account | null = null;
    if (request.linkedAccountId) {
      linkedAccount = await this.accountRepository.findOneBy({
        id: request.linkedAccountId,
      });
      if (!linkedAccount) throw new NotFoundException('error.account.notFound');
    }

    let account: Account = this.accountRepository.create({
      ...request,
      user: user,
      linkedAccount: linkedAccount ?? undefined,
    });

    account = await this.accountRepository.save(account);

    const currency = await this.currencyService.findByUnit(request.unit);

    await this.balanceService.save(
      account,
      currency,
      new Decimal(request.initialBalance),
    );

    return account;
  }

  async getTotalCurrentBalance(
    userId: number,
  ): Promise<AccountTotalCurrentBalanceResponse> {
    let totalBalance: Decimal = new Decimal(0);
    let accounts: Account[] = await this.accountRepository.find({
      where: {
        user: { id: userId },
      },
    });

    for (const account of accounts) {
      const balanceList: Balance[] = await this.balanceService.findAllByAccount(
        account,
        ['currency'],
      );
      totalBalance.plus(
        balanceList.reduce(
          (sum: Decimal, a) =>
            sum.plus(
              new Decimal(a.amount).mul(new Decimal(a.currency.kftcDealBasR)),
            ),
          new Decimal(0),
        ),
      );
    }

    return new AccountTotalCurrentBalanceResponse(totalBalance);
  }

  async update(request: AccountUpdateRequestDto): Promise<Account> {
    let account: Account | null = await this.accountRepository
      .findOneByOrFail({
        id: request.id,
      })
      .catch(() => {
        throw new NotFoundException('error.account.notFound');
      });

    let currency = await this.currencyService.findByUnit(request.unit);
    let balance = await this.balanceService.findByAccountAndCurrency(
      account,
      currency,
    );

    if (request.initialBalance) {
      const difference: Decimal = new Decimal(request.initialBalance).minus(
        new Decimal(balance.amount),
      );

      const newBalance = new Decimal(balance.amount).plus(difference);

      if (newBalance.lt(0)) {
        throw new BadRequestException('error.transaction.insufficient.balance');
      } else {
        await this.balanceService.save(account, currency, newBalance);
      }
    }

    account = this.accountRepository.merge(account, request);
    return await this.accountRepository.save(account);
  }

  async delete(id: number): Promise<void> {
    const account: Account | null = await this.accountRepository.findOne({
      where: {
        id: id,
      },
      relations: ['linkedCards'],
    });

    if (!account) throw new NotFoundException('error.account.notFound');

    if (account.linkedCards.length > 0) {
      const linkedCardIds: number[] = account.linkedCards.map(
        (card) => card.id,
      );
      throw new ConflictException({
        message: 'warning.account.linkedCards',
        data: linkedCardIds,
      });
    }

    await this.accountRepository.delete(id);
  }
}

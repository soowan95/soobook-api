import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Currency } from './currency.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CurrencyApiResponse } from './dtos/responses/currency-api-response.dto';
import * as dotenv from 'dotenv';
import Decimal from 'decimal.js';

dotenv.config({ path: `.env.${process.env.NODE_ENV || `dev`}` });

@Injectable()
export class CurrencyService {
  constructor(
    @Inject('CURRENCY_REPOSITORY')
    private currencyRepository: Repository<Currency>,
    private readonly httpService: HttpService,
  ) {}

  async fetch(): Promise<Currency[]> {
    const response = await firstValueFrom(
      this.httpService.get<CurrencyApiResponse[]>(
        `https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${process.env.KOREA_EXIM_AUTH_KEY}&data=AP01`,
      ),
    );

    for (const fetchedCurrency of response.data) {
      let div: number = 1;
      const numRegex = /\((.*?)\)/;
      const unitRegex = /^([A-Z]+)\(/;
      const numMatch = fetchedCurrency.cur_unit.match(numRegex);
      const unitMatch = fetchedCurrency.cur_unit.match(unitRegex);

      if (numMatch && unitMatch) {
        div = Number(numMatch[1]);
        fetchedCurrency.cur_unit = unitMatch[1];
      }
      let currency: Currency | null = await this.currencyRepository.findOneBy({
        unit: fetchedCurrency.cur_unit,
      });

      if (!currency) {
        currency = this.currencyRepository.create();
      }

      const ttbValue = fetchedCurrency.ttb.replaceAll(',', '');
      const ttsValue = fetchedCurrency.tts.replaceAll(',', '');
      const kftcDealBasRValue = fetchedCurrency.kftc_deal_bas_r.replaceAll(
        ',',
        '',
      );

      currency.unit = fetchedCurrency.cur_unit;
      currency.ttb = new Decimal(ttbValue).div(div);
      currency.tts = new Decimal(ttsValue).div(div);
      currency.kftcDealBasR = new Decimal(kftcDealBasRValue).div(div);
      currency.name = fetchedCurrency.cur_nm;
      await this.currencyRepository.save(currency);
    }

    return this.findAll();
  }

  async findAll(): Promise<Currency[]> {
    return await this.currencyRepository.find();
  }

  async findByUnit(unit: string): Promise<Currency> {
    return await this.currencyRepository
      .findOneOrFail({ where: { unit } })
      .catch(() => {
        throw new NotFoundException('error.currency.notFound');
      });
  }
}

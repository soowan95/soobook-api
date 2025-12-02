import { Exclude } from 'class-transformer';

export class CurrencyBaseResponseDto {
  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

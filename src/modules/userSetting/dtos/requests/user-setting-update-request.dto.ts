import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { UserSettingDefaultView } from '../../user-setting.entity';

export class UserSettingUpdateRequestDto {
  @ApiProperty({
    description: '메인 뷰 수입 보기',
    example: true,
  })
  @IsBoolean()
  isShowMainIncome: boolean;

  @ApiProperty({
    description: '메인 뷰 지출 보기',
    example: true,
  })
  @IsBoolean()
  isShowMainExpense: boolean;

  @ApiProperty({
    description: '메인 뷰 총액 보기',
    example: true,
  })
  @IsBoolean()
  isShowMainBalance: boolean;

  @ApiProperty({
    description: '메인 뷰 최근 거래내역 보기',
    example: true,
  })
  @IsBoolean()
  isShowMainLatestTransaction: boolean;

  @ApiProperty({
    description: '앱 시작 시 뷰',
    example: 'main',
  })
  @IsString()
  defaultView: UserSettingDefaultView;
}

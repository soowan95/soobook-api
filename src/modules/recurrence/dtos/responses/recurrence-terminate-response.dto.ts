import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class RecurrenceTerminateResponseDto {
  @ApiProperty({
    description: '변경된 종료일',
  })
  @Expose()
  @Transform(({ obj }) => obj.endDate, { toClassOnly: true })
  endDate: Date;
}

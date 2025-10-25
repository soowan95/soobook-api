import { applyDecorators } from '@nestjs/common';
import { IsNumber, IsOptional } from 'class-validator';

export function IsOptionalNumber() {
  return applyDecorators(IsOptional(), IsNumber());
}

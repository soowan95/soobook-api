import { applyDecorators } from '@nestjs/common';
import { IsDate, IsOptional } from 'class-validator';

export function IsOptionalDate() {
  return applyDecorators(IsOptional(), IsDate());
}
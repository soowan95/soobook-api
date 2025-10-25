import { applyDecorators } from '@nestjs/common';
import { IsBoolean, IsOptional } from 'class-validator';

export function IsOptionalBoolean() {
  return applyDecorators(IsOptional(), IsBoolean());
}

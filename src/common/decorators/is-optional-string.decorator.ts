import { applyDecorators } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';

export function IsOptionalString() {
  return applyDecorators(IsOptional(), IsString());
}

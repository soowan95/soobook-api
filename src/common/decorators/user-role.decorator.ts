import { UserRole } from '../../modules/user/user.entity';
import { SetMetadata } from '@nestjs/common';

export const Role = (...roles: UserRole[]) => SetMetadata('roles', roles);

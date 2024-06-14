import { Reflector } from '@nestjs/core';
import { EnumRoles } from 'src/types/roles.enums';

export const Roles = Reflector.createDecorator<EnumRoles[]>();

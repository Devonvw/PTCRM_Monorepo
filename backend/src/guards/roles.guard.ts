import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {Observable} from 'rxjs';
import {Roles} from '../decorators/roles.decorator';
import { EnumRoles } from 'src/types/roles.enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.role);
  }
}

function matchRoles(roles: string[], userRole: EnumRoles): boolean {
  return roles.some(role => userRole === role);
}
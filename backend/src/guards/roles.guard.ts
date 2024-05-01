import { Reflector } from '@nestjs/core';
import {Observable} from 'rxjs';
import {Roles} from '../decorators/roles.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { EnumRoles } from 'src/enums/roles.enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log("RolesGuard")
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log("uers:" ,user);
    return matchRoles(roles, user.role);
  }
}

function matchRoles(roles: string[], userRole: EnumRoles): boolean {
  console.log("required roles:",roles);
  console.log("user role:",userRole);
  return roles.some(role => userRole.toString() == role);
}
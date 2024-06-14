import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EnumRoles } from 'src/types/roles.enums';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    //. If the route is public, then everyone can access it
    if (isPublic) {
      return true;
    }
    //. Get the roles from the decorator
    const roles = this.reflector.get(Roles, context.getHandler());

    //. Get the request object
    const request = context.switchToHttp().getRequest();

    //. If there are no roles, then the route is accessible to everyone that is authenticated
    if (!roles) {
      return request.isAuthenticated();
    }
    const user = request.user;

    //. Check if user has the required role
    if (matchRoles(roles, user.role)) {
      return request.isAuthenticated();
    }

    //. If the user does not have the required role, then the user is not authorized
    return false;
  }
}

function matchRoles(roles: string[], userRole: EnumRoles): boolean {
  return roles.some((role) => userRole === role);
}

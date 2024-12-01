import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { User } from '../../auth/entities/user.entity'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from the route metadata
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles) {
      return true; // No roles required for this route
    }

    // Get the user from the request
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    // Check if the user has one of the required roles
    return requiredRoles.some((role) => user.role === role);
  }
}

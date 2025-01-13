import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export enum UserRole {
  Customer = 'Customer',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
  DeliveryMan = 'DeliveryMan',
  CustomerService = 'CustomerService',
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // No roles specified, allow access
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      return false; // No user or role information, deny access
    }

    return this.matchRoles(requiredRoles, user.role);
  }

  private matchRoles(allowedRoles: UserRole[], userRole: UserRole): boolean {
    if (userRole === UserRole.SuperAdmin) {
      return true; // SuperAdmin has access to everything
    }

    return allowedRoles.includes(userRole);
  }
}

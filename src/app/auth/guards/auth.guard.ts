import { computed, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces/auth-status.interface';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService)
  const router = inject(Router)
  const userStatus = computed(() => authService.userStatus())
  if(userStatus() ===  AuthStatus.authenticated) {
    return true
  }
  if(userStatus() ===  AuthStatus.checking) {
    return false
  }

  return false;
};

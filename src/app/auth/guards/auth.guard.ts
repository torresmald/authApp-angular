import { computed, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  console.log(route, state);
  
  const authService = inject(AuthService)
  const router = inject(Router)
  const userStatus = computed(() => authService.userStatus())
  console.log(userStatus());
  if(userStatus() !== 'authenticated') {
    router.navigate(['login'])
    return false
  }
  return true;
};

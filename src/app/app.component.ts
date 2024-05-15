import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces/auth-status.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  private  authService = inject(AuthService)
  private  router = inject(Router)

  public finishedAuthCheck = computed<boolean>(() => {
    if (this.authService.userStatus() == AuthStatus.checking){
      return false
    }
    return true
  })


  public authStatusChangeEffect = effect(() => {
    console.log(this.authService.userStatus());
    

    this.authService.userStatus() === AuthStatus.checking ? null : null
    this.authService.userStatus() === AuthStatus.authenticated ? this.router.navigate(['dashboard']) : null
    this.authService.userStatus() === AuthStatus.notAutenticated ? this.router.navigate(['login']) : null
  })
}

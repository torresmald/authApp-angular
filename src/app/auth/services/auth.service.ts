import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/user-interface';
import { AuthStatus } from '../interfaces/auth-status.interface';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response.interface';
import { CheckTokenResponse } from '../interfaces/check-token.response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  private http = inject(HttpClient);
  private _currentUser = signal<User | null>(null);
  private _userStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser());
  public userStatus = computed(() => this._userStatus());

  constructor() {
    this.checkAuthStatus().subscribe()
  }

  public login(email: string, password: String): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = {
      email,
      password,
    };

    return this.http.post<LoginResponse>(url, body).pipe(
      tap(({ user, token }) => {
        this.setAuthenticated(user, token);
      }),
      map(() => true),
      catchError((error) => throwError(() => error.error.message))
    );
  }

  public checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');
    if (!token)  {
      this.logout()  
      return of(false)
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map(({ user, token }) => {
        this.setAuthenticated(user, token);
        return true;
      }),
      catchError((error) => {
        this._userStatus.set(AuthStatus.notAutenticated);
        return of(false);
      })
    );
  }

  public setAuthenticated(user: User, token: string) {
    this._currentUser.set(user);
    this._userStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
  }

  public logout(){
    this._currentUser.set(null);
    this._userStatus.set(AuthStatus.notAutenticated);
    localStorage.removeItem('token');

  }
}

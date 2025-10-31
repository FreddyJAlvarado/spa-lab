import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private demo = { user: 'admin', pass: '1234' };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  login(usuario: string, password: string) {
    if (usuario === this.demo.user && password === this.demo.pass) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('auth', 'true');
        localStorage.setItem('user', usuario);
      }
      return of({ success: true }).pipe(delay(700));
    } else {
      return throwError(() => new Error('Usuario o contraseña incorrectos'));
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth');
      localStorage.removeItem('user');
    }
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('auth') === 'true';
    }
    return false;
  }

  getUser(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('user');
    }
    return null;
  }
}

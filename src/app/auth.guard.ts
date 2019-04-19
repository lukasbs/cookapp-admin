import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AppService} from './app.service';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private appService: AppService) {}

  canActivate() {
    this.appService.message = {text: '', type: ''};
    this.appService.messageChanged.next(this.appService.message);
    let tokenValid = false;
    const token = localStorage.getItem('token');

    if (token !== null) {
      // For better security, makeisValid endpoint in backend to check user token
      try {
        const tokenDecoded = jwt_decode(token);
        if (this.appService.userData.name !== null && this.appService.userData.password !== null &&
          this.appService.userData.name !== '' && this.appService.userData.password !== '') {
          tokenValid = true;
        } else {
          tokenValid = false;
        }
      } catch (Error) {
        tokenValid = false;
      }
    }

    if (token !== null && token !== '' && tokenValid) {
      return true;
    } else {
      this.router.navigate(['/login-page']);
      this.appService.message = {text: 'Proszę się zalogować aby uzyskać dostęp do tego zasobu!', type: 'ERROR'};
      this.appService.messageChanged.next(this.appService.message);
      return false;
    }
  }
}

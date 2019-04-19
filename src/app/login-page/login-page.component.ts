import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../app.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  @ViewChild('loginInput') loginInputRef: ElementRef;
  @ViewChild('passwordInput') passwordInputRef: ElementRef;
  @ViewChild('message') messageRef: ElementRef;

  private messageSubscription: Subscription;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.messageSubscription = this.appService.messageChanged
      .subscribe(
        () => {
          if (this.appService.message.type === 'ERROR') {
            this.appService.addErrorMessage(this.messageRef.nativeElement, this.appService.message.text);
          } else if (this.appService.message.type === 'SUCCESS') {
            this.appService.addSuccessMessage(this.messageRef.nativeElement, this.appService.message.text);
          }
        }
      );
    this.appService.messageChanged.next(this.appService.message);
  }

  doLogin() {
    const login = this.loginInputRef.nativeElement.value;
    const pass = this.passwordInputRef.nativeElement.value;

    if (login !== null && login !== '' && pass !== null && pass !== '') {
      this.appService.doLogin(login, pass);
    } else {
      this.appService.addErrorMessage(this.messageRef.nativeElement, 'Proszę podać login i hasło!');
    }
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }
}

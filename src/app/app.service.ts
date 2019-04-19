import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

@Injectable()
export class AppService {
  public message: {text: string, type: string};
  public messageChanged = new Subject<{text: string, type: string}>();
  public userData;

  constructor(private http: HttpClient, private router: Router) {
    this.message = {text: '', type: ''};
  }

  doLogin(login, pass) {
    this.http.post('http://localhost:8080/api/user/admin/auth/login', {
      name: login,
      password: pass
    }, {observe: 'response'}).subscribe(
      data => {
        this.userData = data.body;
        localStorage.setItem('token', this.userData.token);
        this.router.navigate(['/user-list']);
        this.message = {text: 'Udane Logowanie!', type: 'SUCCESS'};
        this.messageChanged.next(this.message);
      },
      err => {
        if (err.status === 403) {
          this.message = {text: 'Niepoprawne dane logowania, spróbuj ponownie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Problemy podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  addErrorMessage(element, message) {
    this.clearClass(element);
    element.classList.add('alert-danger');
    element.innerHTML = message;
  }

  addSuccessMessage(element, message) {
    this.clearClass(element);
    element.classList.add('alert-success');
    element.innerHTML = message;
  }

  clearClass(element) {
    if (element.classList.contains('alert-success')) {
      element.classList.remove('alert-success');
    } else if (element.classList.contains('alert-danger')) {
      element.classList.remove('alert-danger');
    }
  }
}

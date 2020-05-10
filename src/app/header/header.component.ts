import {Component, ContentChild, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef} from '@angular/core';
import {AppService} from '../app.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('backStatus') backRef: ElementRef;
  @ViewChild('clientStatus') clientRef: ElementRef;

  intervalId = setInterval( () => {
      this.checkBackEnd();
      this.checkClient();
    }, 5000);

  constructor(private appService: AppService, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.checkBackEnd();
    this.checkClient();
  }

  resetRecipePage() {
    this.appService.currentRecipesPage = 0;
    this.appService.currentRecipesPageChanged.next(this.appService.currentRecipesPage);
  }

  resetUserPage() {
    this.appService.currentUsersPage = 0;
    this.appService.currentUsersPageChanged.next(this.appService.currentUsersPage);
  }

  checkBackEnd() {
    this.http.get('http://localhost:8080/api/user/admin/all', {
      observe: 'response',
      withCredentials: true
    }).subscribe(
      data => {
        this.backRef.nativeElement.children[1].style.color = '#7bed9f';
      }, err => {
        this.backRef.nativeElement.children[1].style.color = '#ff6b81';
      }
    );
  }

  logoutHandler() {
    this.http.post('http://localhost:8080/api/user/auth/logout', { }, {
      observe: 'response',
      withCredentials: true
    }).subscribe();

    this.router.navigate(['/login-page']);
  }

  checkClient() {
    this.http.post('http://localhost:8080/api/user/auth/check', {}, {
      observe: 'response',
      withCredentials: true
    }).subscribe(
      data => {
        this.clientRef.nativeElement.children[1].style.color = '#7bed9f';
      },
      err => {
        this.clientRef.nativeElement.children[1].style.color = '#ff6b81';      }
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}

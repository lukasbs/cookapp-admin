import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../app.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  @ViewChild('message') messageRef: ElementRef;
  public currentPageUsers = null;

  userListChanged: Subscription;
  currentUsersPageChanged: Subscription;
  messageChanged: Subscription;

  constructor(private appService: AppService, private router: Router) { }

  ngOnInit() {
    this.userListChanged = this.appService.userListChanged.subscribe(
      (userList) => {
        userList.sort((a, b) => a.name.localeCompare(b.name));
        this.appService.userListChunked = this.appService.cutIntoChunks(userList);

        if (this.appService.currentUsersPage > this.appService.userListChunked.length - 1) {
          this.appService.currentUsersPage = this.appService.userListChunked.length - 1;
        } else if (this.appService.currentRecipesPage < 0) {
          this.appService.currentUsersPage = 0;
        }

        this.appService.currentUsersPageChanged.next(this.appService.currentUsersPage);
      }
    );

    this.currentUsersPageChanged = this.appService.currentUsersPageChanged.subscribe(
      (page) => {
        this.currentPageUsers = this.appService.userListChunked[page];
      }
    );

    this.messageChanged = this.appService.messageChanged.subscribe(
      (message) => {
        if (message.type === 'ERROR') {
          this.appService.addErrorMessage(this.messageRef.nativeElement, message.text);
        }
      }
    );

    this.appService.getAllUsers();

  }

  nextPage() {
    this.appService.clearClass(this.messageRef.nativeElement);
    this.appService.currentUsersPage++;
    this.appService.currentUsersPageChanged.next(this.appService.currentUsersPage);
  }

  previousPage() {
    this.appService.clearClass(this.messageRef.nativeElement);
    this.appService.currentUsersPage--;
    this.appService.currentUsersPageChanged.next(this.appService.currentUsersPage);
  }

  addHandler() {
    this.router.navigate(['/user-edit'], { queryParams: { edit: 'false' } });
  }

  editHandler(i: number) {
    this.appService.currentlyEditedUser = this.currentPageUsers[i];
    this.appService.currentlyEditedUserChanged.next(this.appService.currentlyEditedUser);
    this.router.navigate(['/user-edit'], { queryParams: { edit: 'true' } });
  }

  deleteHandler(i: number) {
    this.appService.clearClass(this.messageRef.nativeElement);
    this.appService.deleteUser(this.appService.userListChunked[this.appService.currentUsersPage][i].name);
  }

  searchHandler(form: NgForm) {
    this.appService.clearClass(this.messageRef.nativeElement);
    if (form.value.searchUser !== null && form.value.searchUser !== '') {
      this.appService.currentUsersPage = 0;
      this.appService.currentUsersPageChanged.next(this.appService.currentUsersPage);
      this.appService.getUserByName(form.value.searchUser);
    } else {
      this.appService.currentUsersPage = 0;
      this.appService.currentUsersPageChanged.next(this.appService.currentUsersPage);
      this.appService.getAllUsers();
    }
  }

  ngOnDestroy() {
    this.userListChanged.unsubscribe();
    this.currentUsersPageChanged.unsubscribe();
    this.messageChanged.unsubscribe();
  }

}

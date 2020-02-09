import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {AppService} from '../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {UserModel} from '../model/UserModel';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {
  @ViewChild('message') messageRef: ElementRef;

  routerSub: Subscription;
  messageChanged: Subscription;

  public user: UserModel;
  public editMode;

  constructor(private appService: AppService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.routerSub = this.route.queryParams.subscribe(
      params => {
        if (params.edit === 'true') {
          this.editMode = true;
          this.user = this.appService.currentlyEditedUser;
        } else {
          this.editMode = false;
          this.user = {name: '', password: '', role: 'USER'}; // picklist for role
        }
      }
    );

    this.messageChanged = this.appService.messageChanged.subscribe(
      (message) => {
        if (message.type === 'ERROR') {
          this.appService.addErrorMessage(this.messageRef.nativeElement, message.text);
        }
      }
    );
  }

  validateForm(form: NgForm) {
    return !(form.value.userName === null || form.value.userName === '' ||
      form.value.userPassword === null || form.value.userPassword === '' ||
      form.value.userRole === null || form.value.userRole === '');
  }

  editHandler(form: NgForm) {
    if (this.validateForm(form)) {
      this.appService.updateUser(this.user.name, form.value.userName, form.value.userPassword, form.value.userRole);
    } else {
      this.appService.addErrorMessage(this.messageRef.nativeElement, 'Proszę wypełnić wszystkie pola!');
    }
  }

  saveHandler(form: NgForm) {
    if (this.validateForm(form)) {
      this.appService.addUser(form.value.userName, form.value.userPassword, form.value.userRole);
    } else {
      this.appService.addErrorMessage(this.messageRef.nativeElement, 'Proszę wypełnić wszystkie pola!');
    }
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
    this.messageChanged.unsubscribe();
  }

}

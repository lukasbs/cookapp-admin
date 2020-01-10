import { Component, OnInit } from '@angular/core';
import {AppService} from '../app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private appService: AppService) { }

  ngOnInit() {
  }

  resetRecipePage() {
    this.appService.currentRecipesPage = 0;
    this.appService.currentRecipesPageChanged.next(this.appService.currentRecipesPage);
  }

  resetUserPage() {
    this.appService.currentUsersPage = 0;
    this.appService.currentUsersPageChanged.next(this.appService.currentUsersPage);
  }

}

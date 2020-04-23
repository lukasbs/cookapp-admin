/* tslint:disable:max-line-length */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ParsePageComponent } from './parse-page/parse-page.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserListComponent } from './user-list/user-list.component';
import {AppService} from './app.service';
import {AuthGuard} from './auth.guard';
import {HttpClientModule} from '@angular/common/http';
import { RecipeViewComponent } from './recipe-view/recipe-view.component';
import {FormsModule} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';

import {library} from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUsers, faList, faLayerGroup, faLightbulb, faSignOutAlt, faUserEdit, faUserPlus, faUserTimes, faSearch, faChevronLeft, faChevronRight, faChevronDown, faTimes, faEdit, faPlus, faBan, faCheck, faBars} from '@fortawesome/free-solid-svg-icons';
import { faListAlt, faNewspaper} from '@fortawesome/free-regular-svg-icons';

library.add(faUsers, faListAlt, faNewspaper, faLayerGroup, faLightbulb, faSignOutAlt, faUserEdit, faUserPlus, faUserTimes, faSearch, faChevronLeft, faChevronRight, faChevronDown, faTimes, faList, faEdit, faPlus, faBan, faCheck, faBars);
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginPageComponent,
    ParsePageComponent,
    RecipeEditComponent,
    RecipeListComponent,
    UserEditComponent,
    UserListComponent,
    RecipeViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    NgbModule
  ],
  providers: [
    AppService,
    AuthGuard,
    CookieService,
    NgbActiveModal
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

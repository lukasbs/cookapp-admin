import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserListComponent} from './user-list/user-list.component';
import {AuthGuard} from './auth.guard';
import {UserEditComponent} from './user-edit/user-edit.component';
import {RecipeListComponent} from './recipe-list/recipe-list.component';
import {RecipeEditComponent} from './recipe-edit/recipe-edit.component';
import {ParsePageComponent} from './parse-page/parse-page.component';
import {LoginPageComponent} from './login-page/login-page.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/login-page', pathMatch: 'full'},
  { path: 'user-list', component: UserListComponent, canActivate: [AuthGuard]},
  { path: 'user-edit', component: UserEditComponent, canActivate: [AuthGuard]},
  { path: 'recipe-list', component: RecipeListComponent, canActivate: [AuthGuard]},
  { path: 'recipe-edit', component: RecipeEditComponent, canActivate: [AuthGuard]},
  { path: 'parse-page', component: ParsePageComponent, canActivate: [AuthGuard]},
  { path: 'login-page', component: LoginPageComponent },
  { path: '**', redirectTo: 'user-list', canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}

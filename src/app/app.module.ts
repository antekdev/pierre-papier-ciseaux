import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { MenuComponent } from './menu/menu.component';
import { NoParenthesisPipe } from './menu/noparenthesis.pipe';
import { P404Component } from './p404/p404.component';

////////////////////////////////////////////////////////////// Social Login

import {
  SocialLoginModule,
  AuthServiceConfig,
  FacebookLoginProvider,
  VkontakteLoginProvider,
  GoogleLoginProvider
} from "angular-6-social-login-v2";
import { getAuthServiceConfigs } from "./socialloginConfig";

///////////////////////////////////////////////////////////// Routing

import { CommonGuard } from './common.guard';
const appRoutes: Routes = [
  { path: '', component: SigninComponent },
  { path: 'menu', component: MenuComponent, canActivate: [CommonGuard] },
  {
    path: "menu/play",
    component: PlayComponent,
    canActivate: [CommonGuard]
  },
  {
    path: "menu/settings",
    component: SettingsComponent,
    canActivate: [CommonGuard]
  },
  { path: '**', component: P404Component },
];

///////////////////////////////////////////////////////////// Database

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { environment } from '../environments/environment';
import { PlayComponent } from './menu/play/play.component';
import { SettingsComponent } from './menu/settings/settings.component';

/////////////////////////////////////////////////////////////

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    MenuComponent,
    NoParenthesisPipe,
    P404Component,
    PlayComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    SocialLoginModule,
    RouterModule.forRoot(
      appRoutes
    ),
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    SigninComponent,
    AngularFireDatabase,
    CommonGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

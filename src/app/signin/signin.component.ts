import {Component, OnInit} from '@angular/core';
import {
  AuthService,
  FacebookLoginProvider,
  VkontakteLoginProvider,
  GoogleLoginProvider,
  SocialUser
} from 'angular-6-social-login-v2';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Router} from '@angular/router';
import {DataService} from '../data.service';
import * as firebase from 'firebase';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';

export class User {
  constructor(public name: string,
              public loginTime: string,
              public selected: boolean,
              public isBlocked: boolean,
              public id: string) {}

}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})


export class SigninComponent implements OnInit {

  currentName: string;
  user: SocialUser;
  users: AngularFireList<User>;
  showLogOut: boolean = false;


  constructor(private socialAuthService: AuthService,
              private router: Router,
              private data: DataService,
              db: AngularFireDatabase) {
    // @ts-ignore - unable to build otherwise
    this.users = db.list<User>('/users');
    this.checkLogOut();
  }

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
    });
    this.data.currentMessage.subscribe(message => this.currentName = message);
  }

  static getCurrentTime() {
    let currentdate = new Date();
    return currentdate.getDate() + '/'
      + (currentdate.getMonth() + 1) + '/'
      + currentdate.getFullYear() + ' @ '
      + currentdate.getHours() + ':'
      + currentdate.getMinutes() + ':'
      + currentdate.getSeconds();
  }

  setNameIndicator(name) {
    let currentName = this.data.changeMessage(name);
  }

  addUser() {
    let newUser = new User(this.user.name, SigninComponent.getCurrentTime(), false, false, this.user.id.toString());
    firebase.database().ref(`users`).once("value", snapshot => {
      if (snapshot.val()) {
        let entries = Object.entries(snapshot.val());
        for (let row of entries) {
          // @ts-ignore
          if (row[1].id == this.user.id.toString()) {
            // @ts-ignore
            firebase.database().ref(`users/` + row[0]).update({ loginTime: SigninComponent.getCurrentTime() });
            return;
          }
        }
        this.users.push(newUser);
      }
      else {
        firebase.database().ref(`/users`).push(newUser);
      }
    });
    return newUser;
  }

  setSessionParameters(user: User) {
    localStorage.setItem('name', user.name);
    localStorage.setItem('id', user.id.toString());
    localStorage.setItem('loggedIn', 'true');
  }

  socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == 'vkontakte') {
      socialPlatformProvider = VkontakteLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        this.setNameIndicator(userData.name);
        let currentUser = this.addUser();
        this.setSessionParameters(currentUser);
        this.data.isWhitelisted(localStorage.getItem('id'));
        setTimeout(() => { this.router.navigate(['/menu/play']); }, 300);
      }
    )
  }

  logOut() {
    localStorage.clear();
    this.data.changeMessage('Welcome!');
    this.checkLogOut();
  }

  checkLogOut(){
    console.log(this.showLogOut, 'before', localStorage.getItem('name'));
    this.showLogOut = localStorage.getItem('name') != null;
    console.log(this.showLogOut, 'after');
  }

}

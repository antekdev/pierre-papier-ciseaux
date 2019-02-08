import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {DataService} from '../data.service';
import { User } from '../signin/signin.component';
import {AuthService, SocialUser} from 'angular-6-social-login-v2';
import {Router} from '@angular/router';
import 'rxjs/add/observable/of';
import {RpsService} from './rps.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {

  currentName: string;
  users: AngularFireList<User>;
  userData: SocialUser;
  private allSelected: boolean = false;
  private selectedUsers: Array<Object> = [];


  constructor(db: AngularFireDatabase,
              private socialAuthService: AuthService,
              private router: Router,
              private data: DataService,
              private rps: RpsService) {
    // @ts-ignore - unable to build otherwise
    this.users = db.list<User>('users').valueChanges();
  }

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.userData = user;
    });
    this.data.currentMessage.subscribe(message => this.currentName = message);
  }

  selectAll() {
    this.allSelected = !this.allSelected;
    document.getElementsByName('solebox').forEach(a => {
      // @ts-ignore
      if (a.checked != this.allSelected) a.click();
    });
  }

  selectUser(user, index) {
    let toStatus;
    user.selected ? toStatus = false : toStatus = true;
    // @ts-ignore
    document.getElementsByName('solebox')[index].checked = toStatus;
    user.selected = toStatus;
    if (toStatus) this.selectedUsers.push(user);
    else {
      let index = this.selectedUsers.indexOf(user);
      if (index > -1) {
        this.selectedUsers.splice(index, 1);
      }
    }
    return user;
    }

  navigate(value: string) {
    this.router.navigate(['menu/' + value]);
  }

  logOut() {
    localStorage.clear();
    this.data.changeMessage('Welcome!');
    this.router.navigate(['']);
  }

}

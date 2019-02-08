import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private messageSource = new BehaviorSubject<string>(localStorage.getItem('name') || 'Welcome!');
  currentMessage = this.messageSource.asObservable();
  attemptBlocked: boolean = false;
  isListed: boolean = false;

  isBlocked(user: object) {
    // @ts-ignore
    this.attemptBlocked = user.isBlocked;
  }

  isWhitelisted(uid: string) {
    firebase.database().ref(`users`).once("value")
      .then(snapshot => {
        if (snapshot.val()) {
          let entries = Object.entries(snapshot.val());
          for (let e of entries) {
            // @ts-ignore
            if (e[1].id == uid) {
              // @ts-ignore
              this.isListed = true;
              this.isBlocked(e[1]);
            }
          }
        }
      })
  }

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }



}

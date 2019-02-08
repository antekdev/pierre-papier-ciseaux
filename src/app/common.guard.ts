import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import {Router} from '@angular/router';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CommonGuard implements CanActivate {

  constructor (private data: DataService,
               private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // @ts-ignore
    if ((Observable.of(localStorage.getItem('loggedIn')).value === 'true') && (!this.data.attemptBlocked)) return true;
    else {
      this.router.navigate(['/forbidden']);
      return false;
    }
  }
}

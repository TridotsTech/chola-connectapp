import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DbService } from '../services/db.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public auth : AuthService,public router : Router,public db:DbService){

  }

  async canActivate() {
    const isLoggedIn = await this.auth.IsLoggedIn();
    if(isLoggedIn){
    // if(this.auth.IsLoggedIn()){
      return true;
    }

    this.router.navigate(['register'])
    // this.router.navigateByUrl('/login')
    // this.router.navigateByUrl('/signup?page_route=business-register')
    return false;
  }
  // canActivate() {
  //   if(this.auth.IsLoggedIn()){
  //     return true;
  //   }
  //   this.router.navigate(['register'])
  //   return false;
  // }

}

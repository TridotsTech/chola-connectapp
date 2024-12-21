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

  canActivate() {
    if(this.auth.IsLoggedIn()){

      // console.log(this.auth.Ispage())
      // checkTabItems()
      // console.log('login')
      // console.log(currentUrl);
      // this.db.side_tab_dashboard.map(res=>{
      // console.log(res.route);
      //   if(currentUrl.includes(res.route))
      //   {
      //     break;
      //   }
      //   else{
      //     this.router.navigate(['dashboard'])
      //     return false
      //   }
      // })

      return true;
    }
    this.router.navigate(['register'])
    return false;
  }

}

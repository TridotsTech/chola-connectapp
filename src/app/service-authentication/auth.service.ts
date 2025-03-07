import { Injectable } from '@angular/core';
import { Router} from '@angular/router';

import { DbService } from '../services/db.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public router : Router,public db:DbService) { }

  IsLoggedIn(){
    return !!localStorage.getItem('api_key')
  }
  
}

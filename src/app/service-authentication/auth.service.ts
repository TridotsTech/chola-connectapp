import { Injectable } from '@angular/core';
import { Router} from '@angular/router';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

import { DbService } from '../services/db.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public router : Router,public db:DbService) { }

  async IsLoggedIn(){
    try {
      const result = await SecureStoragePlugin.get({ key: 'api_key' });
      return !!result.value; // If we retrieve a value from SecureStorage, the user is logged in
    } catch (error) {
      console.error('Error checking secure storage:', error);
      return false; // Return false if there was an error checking SecureStorage
    }
    // return !!localStorage.getItem('cap_sec_api_key')
  }
  // IsLoggedIn(){
  //   return !!localStorage.getItem('api_key')
  // }
  
}

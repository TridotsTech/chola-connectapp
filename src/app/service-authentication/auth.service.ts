import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { DbService } from '../services/db.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    public router: Router,
    public db: DbService
  ) { }

  async IsLoggedIn(): Promise<boolean> {
    try {
      const result = await SecureStoragePlugin.get({ key: 'api_key' });
      return !!result.value;
    } catch (error) {
      console.error('Error checking secure storage:', error);
      return false;
    }
  }
}

import { Injectable } from '@angular/core';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DbService } from './db.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {
  private updatePopupState = new BehaviorSubject<{
    show: boolean;
    newVersion: string;
    currentVersion: string;
    force: boolean;
    storeUrl: string;
  }>({
    show: false,
    newVersion: '',
    currentVersion: '',
    force: false,
    storeUrl: ''
  });

  updatePopupState$ = this.updatePopupState.asObservable();

  constructor(
    private appVersion: AppVersion,
    private platform: Platform,
    private alertCtrl: AlertController,
    private db: DbService
  ) {}

  async checkForUpdate() {
    if (this.platform.is('android')) {
      await this.checkAndroidUpdate();
    } else if (this.platform.is('ios')) {
      await this.checkIOSUpdate();
    }
  }

  private async checkAndroidUpdate() {
    try {
      const currentVersion = await this.appVersion.getVersionNumber();
      this.db.get_app_version().subscribe(async (res) => {
        if (res && res.version) {
          const force = res.force || false;
          if (currentVersion !== res.version && res.show_popup) {
            this.showUpdatePopup(res.version, currentVersion, force, 'android');
          }
        }
      });
    } catch (error) {
      console.error('Error checking Android update:', error);
    }
  }

  private async checkIOSUpdate() {
    try {
      const currentVersion = await this.appVersion.getVersionNumber();
      this.db.get_ios_app_version().subscribe(async (res) => {
        if (res && res.version) {
          const force = res.force || false;
          if (currentVersion !== res.version && res.show_popup) {
            this.showUpdatePopup(res.version, currentVersion, force, 'ios');
          }
        }
      });
    } catch (error) {
      console.error('Error checking iOS update:', error);
    }
  }

  private showUpdatePopup(newVersion: string, currentVersion: string, force: boolean, platform: 'android' | 'ios') {
    const storeUrl = platform === 'android' 
      ? 'https://play.google.com/store/apps/details?id=com.cholahr.android'
      : 'https://apps.apple.com/us/app/chola-hr/id6742024031';

    this.updatePopupState.next({
      show: true,
      newVersion,
      currentVersion,
      force,
      storeUrl
    });
  }

  onUpdate(storeUrl: string, force: boolean) {
    window.open(storeUrl, '_system');
    if (force) {
      App.exitApp();
    }
    this.hideUpdatePopup();
  }

  onLater(force: boolean) {
    if (force) {
      App.exitApp();
    }
    this.hideUpdatePopup();
  }

  private hideUpdatePopup() {
    this.updatePopupState.next({
      show: false,
      newVersion: '',
      currentVersion: '',
      force: false,
      storeUrl: ''
    });
  }
} 
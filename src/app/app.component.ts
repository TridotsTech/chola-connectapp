import { Component, HostListener, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DbService } from './services/db.service';
import { NavigationEnd, Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { App } from '@capacitor/app';
import { AndroidBiometryStrength, BiometricAuth } from '@aparajita/capacitor-biometric-auth';
import { Network } from '@capacitor/network';
import { SSLCertificateChecker } from 'capacitor-ssl-pinning';
import { Device } from '@capacitor/device';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { SplashScreen } from '@capacitor/splash-screen';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  alert_animatings: any = [];
  alert_animate = false;
  sub1: any
  sub2;
  wasOffline = false;
  constructor(private navCtrl: NavController, public db: DbService, private alertCtrl: AlertController, private platform: Platform, private appVersion: AppVersion, public storage: Storage, private router: Router, public location: Location) { 
    this.checkNetworkOnStart();
    this.listenNetworkChanges();
  }

  async checkNetworkOnStart() {
    const status = await Network.getStatus();
    this.handleNetworkChange(status.connected);
  }

  // Listen for real-time network changes
  listenNetworkChanges() {
    Network.addListener('networkStatusChange', (status) => {
      this.handleNetworkChange(status.connected);
    });
  }

  // Handle network changes (Prevents multiple calls)
  handleNetworkChange(isConnected: boolean) {
    if (!isConnected && !this.wasOffline) {
      this.wasOffline = true;
      this.networkExitApp();
    } else if (isConnected && this.wasOffline) {
      this.wasOffline = false;
      // this.db.alertDesign('Back to Online','Okay');
    }
  }

  async networkExitApp() {
    const alert = await this.alertCtrl.create({
      header: "You are offline!",
      cssClass: 'my-custom-alert-class-network',
      message: 'Please connect to the internet and retry',
      backdropDismiss: false,
      buttons: [{
        text: 'Ok',
        handler: () => {
          App.exitApp();
        }
      }]
    });
    await alert.present();
  }


  ngOnInit() {

    setTimeout(() => {
      // this.db.ismobile ? this.router.navigateByUrl('/tabs/dashboard') : this.router.navigateByUrl('/dashboard')
    }, 3500)
    this.createStorage()

    this.db.ismobile = this.db.checkmobile();
    Promise.all([
      SecureStoragePlugin.get({ key: 'api_key' }),
      SecureStoragePlugin.get({ key: 'api_secret' })
    ])
      .then(results => {
        this.db.api_key = results[0].value;
        this.db.api_secret = results[1].value;
        this.db.get_customer_values();
      })
      .catch(error => {
        console.error('Error retrieving data securely:', error);
      });

    // this.db.get_dashboard();
    if (this.platform.is('android')) {
      // this.checkDeviceStatus();
      // this.enableFingerprint();
      // this.db.enable_location();
      // this.get_app_version();
    }



    this.platform.ready().then(res => {
      if ((this.db.ismobile || res == 'ios' || res == 'ipad' || res == 'iphone' || res == 'mobile' || res == 'tablet') && res != 'dom') {
        StatusBar.setBackgroundColor({color:'#005BC3'});
      }
      this.db.get_onesignal().subscribe(res => {
        if (res && res.is_key) {
          this.platform.is('android') && res.is_key ? this.db.OneSignalInit(res.key) : '';
        }
      })
    })

    this.platform.ready().then(() => {
      // Hide the splash screen after 3 seconds
      setTimeout(() => {
        SplashScreen.hide(); // Hide the splash screen
      }, 3500); // 3000 ms = 3 seconds
    });

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {

      if (this.db.path == '/' || this.db.path == '/tabs/dashboard') {
        this.log_out_app();
      } else if (this.db.path?.split('/')[1] == 'tabs' && this.db.path?.split('/')[1] == 'list') {
        // this.location.back();
        this.navCtrl.back();
      } else if (this.db.path?.split('/')[1] == 'list') {
        this.router.navigateByUrl('/tabs/dashboard')
      } else {
        this.navCtrl.back();
      }

    });

    this.db.domainurl = localStorage['site_name'] ? localStorage['site_name'] : null;

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.db.path = event.url;
        //  this.db.get_permission_details();
      }
    });

    this.sub1 = this.db.alert_animate.subscribe((res: any) => {
      // if (this.db.go1_business_role && this.router.url.includes('hd-ticket')) {
      //   // this.db.alert_animates = true;
      //   this.alert_animatings.push(res);
      //   setTimeout(() => { this.alert_animatings.shift(); }, this.db.ismobile ? 2500 : 2500);
      // }
    })

    this.sub1 = this.db.success_animate.subscribe((res: any) => {
      // this.db.alert_animates = true;
      this.alert_animatings.push(res);
      setTimeout(() => { this.alert_animatings.shift(); }, 2500);
    });

    this.sub2 = this.db.error_animate.subscribe((res: any) => {
      // this.db.alert_animates = true;
      this.alert_animatings.push(res);
      setTimeout(() => { this.alert_animatings.shift(); }, 2500);
    });

    this.platform.ready().then(() => {
      this.lockOrientation();
      // this.configureSSLPinning();
    });

  }

  async createStorage() {
    await this.storage.create();
  }


  async configureSSLPinning() {
    try {
      const isCertValid = await SSLCertificateChecker.checkCertificate({ url: this.db.baseUrl,fingerprint: '2D:ED:DF:36:AC:5F:4F:E7:E0:CF:61:72:9D:C1:BE:A6:CA:BD:FF:81:57:65:87:3A:51:A5:FF:58:39:3A:17:6D',});
      if (isCertValid) {
        console.log('SSL Pinning successful.');
      } else {
        console.error('SSL Pinning failed: Certificate mismatch');
      }
    } catch (error) {
      console.error('Error configuring SSL Pinning:', error);
    }
  }

  async checkDeviceStatus() {
    try {
      // Get device information using the Device API
      const info = await Device.getInfo();
      console.log('Device Info:', info);
      // Use the info to perform root/jailbreak detection logic
      if (this.isDeviceJailbroken(info)) {
        console.log('Your device appears to be jailbroken or rooted.')
      } else {
        console.log('Device is secure');
      }
    } catch (error) {
      console.error('Error getting device info:', error);
    }
  }

  isDeviceJailbroken(info:any) {
    // Basic checks for jailbroken devices
    if (info.platform === 'ios') {
      // Example checks for iOS jailbreak (modify as needed)
      const jailbreakIndicators = ['/Applications/Cydia.app', '/usr/sbin/sshd', '/bin/bash'];
      for (const path of jailbreakIndicators) {
        if (this.checkFileExists(path)) {
          return true;
        }
      }
    }

    if (info.platform === 'android') {
      // Example checks for Android root (modify as needed)
      const rootIndicators = ['/system/app/Superuser.apk', '/system/xbin/su'];
      for (const path of rootIndicators) {
        if (this.checkFileExists(path)) {
          return true;
        }
      }
    }

    return false;
  }

  // Function to check if a file exists (simplified for example)
  checkFileExists(path: string): boolean {
    // This function would need native code to check for actual files on the device.
    // For this example, we'll assume it's not present, but you'd implement this in native code for a real use case.
    return false;
  }

  async lockOrientation() {
    try {
      await ScreenOrientation.lock({ orientation: 'portrait' });
    } catch (error) {
      console.error('Error locking orientation:', error);
    }
  }


  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  private func() {
    this.db.ismobile = this.db.checkmobile();
  }

  async enableFingerprint() {

    BiometricAuth.authenticate({
      reason: 'Please authenticate to continue',  // Message shown to the user during authentication
      iosFallbackTitle: 'Use Passcode',           // iOS fallback message if biometric fails
      cancelTitle: 'Cancel',
      allowDeviceCredential: true,
      androidTitle: 'Biometric login',
      androidSubtitle: 'Log in using biometric authentication',
      androidConfirmationRequired: false,
      androidBiometryStrength: AndroidBiometryStrength.weak,
    })
      .then((result:any) => {
        if (result.success) {
          console.log('Authentication successful');
          // Perform actions after successful authentication
        } else {
          console.error('Authentication failed');
        }
      })
      .catch(error => {
        console.error('Authentication error:', error);
        // Handle cases where biometric authentication is not available or fails
      }); 
  }

  get_app_version() {
    this.db.get_app_version().subscribe(res => {
      if (res && res.version) {
        this.appVersion.getVersionNumber().then(value => {
          let new_version = value
          let force = res && res.force ? res.force : false
          new_version != res.version && res.show_popup ? this.update_notify(res.version, new_version, force) : null
        })

      }
    })
  }

  async update_notify(version, new_version, force) {
    const alert = await this.alertCtrl.create({
      header: 'Update Available',
      message: 'A new version(' + version + ') of this app is available for download. Must update it from PlayStore !',
      subHeader: 'current version : ' + new_version,
      buttons: [
        {
          text: 'cancel',
          handler: () => {
            force ? App.exitApp() : null
          }
        },
        {
          text: 'Update',
          handler: () => {
            window.open("https://play.google.com/store/apps/details?id=com.cholahr.android", '_system');
            App.exitApp()
          }
        }
      ]
    })

    await alert.present();
  }

  async log_out_app() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-alert-class',
      header: "Exit Alert",
      message: 'Are you sure you want to exit?',
      buttons: [{
        text: 'No',
        handler: () => {
          this.alertCtrl.dismiss();
        }
      },
      {
        text: 'Yes',
        handler: () => {
          App.exitApp();
        }
      }]
    });
    await alert.present();
  }

}

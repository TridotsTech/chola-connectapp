import { Component, HostListener, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DbService } from './services/db.service';
import { NavigationEnd, Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  alert_animatings: any = [];
  alert_animate = false;
  sub1: any
  sub2
  constructor(private navCtrl: NavController, public db: DbService, private alertCtrl: AlertController, private platform: Platform, private appVersion: AppVersion, public storage: Storage, private router: Router, public location: Location) { }


  ngOnInit() {

    setTimeout(() => {
      // this.db.ismobile ? this.router.navigateByUrl('/tabs/dashboard') : this.router.navigateByUrl('/dashboard')
    }, 3500)
    this.createStorage()

    this.db.ismobile = this.db.checkmobile();
    this.db.get_customer_values();

    // this.db.get_dashboard();
    if (this.platform.is('android')) {
      // this.db.enable_location();
      // this.get_app_version();
    }

    this.platform.ready().then(res => {
      if ((this.db.ismobile || res == 'ios' || res == 'ipad' || res == 'iphone' || res == 'mobile' || res == 'tablet') && res != 'dom') {
        StatusBar.setBackgroundColor({color:'#003F88'});
      }
      this.db.get_onesignal().subscribe(res => {
        if (res && res.is_key) {
          this.platform.is('android') && res.is_key ? this.db.OneSignalInit(res.key) : '';
        }
      })
    })

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

  }

  async createStorage() {
    await this.storage.create();
  }


  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  private func() {
    this.db.ismobile = this.db.checkmobile();
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

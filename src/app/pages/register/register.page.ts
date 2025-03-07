import {
  Component,
  HostListener,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { DbService } from 'src/app/services/db.service';

import {
  IonContent,
  ModalController,
  Platform,
} from '@ionic/angular';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
  
export class RegisterPage implements OnInit {
  background_image='/assets/imgs/login-bg.jpg'
  primary_source:any;
  
  @ViewChild(IonContent) content:any = IonContent;
  constructor(public db:DbService,private ngzone:NgZone,private router:Router,private platform:Platform,public modalCtrl:ModalController) {
   
  }

  ngOnInit() {
    this.db.side_menu_show = false
    this.db.cust_name && this.db.cust_email ? this.router.navigateByUrl('/') : this.router.navigateByUrl('/register');
    this.db.ismobile = this.db.checkmobile();
    this.primary_source =  localStorage['primary_source'] ? localStorage['primary_source'] : '';
  }

  @HostListener('window:resize', ['$event'])
  private func(){
     this.db.checkmobile();
  }
  ionViewWillLeave(){

  }
  scrollToTop() {
    this.content.scrollToTop(400);
  }

  img_style(data:any, type:any):any {
    if (type == 'color') {
      return { 'background': data };
    }else if (type == 'img') {
      return { 'background': 'url(' + this.db.product_img(data) + ') no-repeat'};
    }
  }

  async googleLogin() {

}

  redirectLoggedUserToProfilePage(res:any) {
    // As we are calling the Angular router navigation inside a subscribe method, the navigation will be triggered outside Angular zone.
    // That's why we need to wrap the router navigation call inside an ngZone wrapper
    this.ngzone.run(() => {
      // this.router.navigate(['profile']);

    });
  }

  goto_link(){
   this.router.navigateByUrl('/'); 
  }

  store_google_info(res:any){
    var social_data={
      email :res.user.providerData[0].email,
      user_name :res.user.providerData[0].displayName,
      provider :res.user.providerData[0].providerId,
      uid :res.user.providerData[0].uid
    }
 
  }

  // signup(){
  //   this.router.navigateByUrl('/web-page?page_route=supplier-registration')
  // }


}


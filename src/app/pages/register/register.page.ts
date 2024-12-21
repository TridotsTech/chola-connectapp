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
// import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';

// import * as firebase from 'firebase';
// import {AuthStateChange,FirebaseAuthentication} from '@capacitor-firebase-authentication';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
  
export class RegisterPage implements OnInit {
  // @Input() type;

  // ismobile;
  background_image='/assets/imgs/login-bg.jpg'
  primary_source:any;
  // private readonly authStateSubj = new Subject<AuthStateChange>();
  
  @ViewChild(IonContent) content:any = IonContent;
  constructor(public db:DbService,private ngzone:NgZone,private router:Router,private platform:Platform,public modalCtrl:ModalController) {
    
    // FirebaseAuthentication.removeAllListeners().then(() => {
    //   FirebaseAuthentication.addListener('authStateChange', (change) => {
    //     this.ngzone.run(() => {
    //       // console.log(change);
    //       this.authStateSubj.next(change);
    //     });
    //   });
    // });
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
    // this.db.verificationId = ''
  }
  scrollToTop() {
    this.content.scrollToTop(400);
  }

  // @HostListener('ionScroll', ['$event']) onScroll(event){
  //   if(event.detail.scrollTop > 0){
  //     this.scroll_top = true;
  //   }
  //   else{
  //     this.scroll_top = false;
  //   }
  // }


  img_style(data:any, type:any):any {
    if (type == 'color') {
      return { 'background': data };
    }else if (type == 'img') {
      return { 'background': 'url(' + this.db.product_img(data) + ') no-repeat'};
    }
  }

  async googleLogin() {
//     this.platform.ready().then(res =>{
//       if((this.db.ismobile || res == 'ios' || res == 'ipad' || res == 'iphone' || res == 'mobile' || res == 'tablet') && res != 'dom'){
//         this.googlePlus.login({  'webClientId': '696998011258-sj59ajsvh7jpu3osshdl7itfr5siloq2.apps.googleusercontent.com' }).then((success) => {
//         // this.googlePlus.login({  'webClientId': '79763288314-dno4do0fpubkvqinch26f61b782g4nt3.apps.googleusercontent.com' }).then((success) => {
//           // console.log(success);
//           let credential = firebase.auth.GoogleAuthProvider.credential(success['idToken'], null);
//           firebase.auth().signInWithCredential(credential).then((data) => {
//             // console.log(data);
//           }).catch((err) => this.db.alert(err));
//         }, err =>  this.db.alert(err));
//       } else {
//         // firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(gpRes => {
//         //   console.log(gpRes)
//         //   this.checks = gpRes.additionalUserInfo.profile;
//         // }).catch(err => this.db.alert(err));
//         this.db.signInWithGoogle().then((res: any) => {
//           if(res.additionalUserInfo) {
//              this.store_google_info(res);
//             // this.db.setProviderAdditionalInfo(result.additionalUserInfo.profile);
//           }
//           this.redirectLoggedUserToProfilePage(res);
//         }).catch((error) => {console.log(error); });
//       }
//   })

}

  redirectLoggedUserToProfilePage(res:any) {
    // As we are calling the Angular router navigation inside a subscribe method, the navigation will be triggered outside Angular zone.
    // That's why we need to wrap the router navigation call inside an ngZone wrapper
    this.ngzone.run(() => {
      // this.router.navigate(['profile']);

    });
  }

  goto_link(){
    // console.log('sdsd')
   this.router.navigateByUrl('/'); 
  }

  store_google_info(res:any){
    // console.log(res)
    var social_data={
      email :res.user.providerData[0].email,
      user_name :res.user.providerData[0].displayName,
      provider :res.user.providerData[0].providerId,
      uid :res.user.providerData[0].uid
    }
  // console.log("Social login",social_data)
  // this.get_customer_info(res.user.providerData[0].email, true);
  // this.db.get_social_login(social_data).subscribe(res => {
  //     console.log("social login data", res.message);
  //     if(res.message){
  //       localStorage.CustomerName =res.message.full_name;
  //       this.db.cust_name = res.message.full_name;
  //       this.router.navigateByUrl('/home');
  //     }
  //     localStorage.provider = res.user.providerData[0].providerId
  // },err => {  console.error(err); })
  }


  // async firebase_fb_login(){
  //   await FirebaseAuthentication.signInWithFacebook();
  //   const result = await FirebaseAuthentication.getCurrentUser();
  //   // console.log(result.user);
  //   result.user.email ? this.store_fb_info(result.user) : this.db.alert('No Email Id is configured in your Facebook account. In order to proceed Hireme24, Email Id is mandatory. Please try Login with different method.')
  //   // this.store_google_info(result.user)

  // }

  // store_fb_info(res){
  //   var social_data:any = {};
  //    social_data={
  //     email : res && res.email ? res.email:'',
  //     user_name :res.displayName,
  //     provider :res.providerId,
  //     uid :res.uid,
  //     phone:res && res.phoneNumber ? res.phoneNumber : '',
  //     // get_user_token:1
  //   }
  //   console.log(social_data);
  //    this.db.get_social_login(social_data).subscribe(res => {
  //       this.get_cus_info(social_data.email)
  //         console.log('--',social_data)
  //         localStorage.user_name = res.message.full_name
  //         localStorage.api_key = res.message.api_key;
  //         localStorage.api_secret = res.message.api_secret;
  //         localStorage.user_email_id = social_data.email,
  //         localStorage.api_key ? this.db.cust_info.api_key = localStorage.api_key : null
  //         localStorage.api_key ? this.db.cust_info.api_secret = localStorage.api_key : null
  //         //     // console.log("social login data", res.message);
  //         //     // localStorage.provider = res.user.providerData[0].providerId
  //       },err => {  console.error(err); })  
  // }
  
  signup(){
    this.router.navigateByUrl('/web-page?page_route=supplier-registration')
  }


}


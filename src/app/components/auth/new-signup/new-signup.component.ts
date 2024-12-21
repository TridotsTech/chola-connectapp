import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
// import {
//   getAuth,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from 'firebase/auth';
// import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
// import { CookieService } from 'ngx-cookie-service';
import { DbService } from 'src/app/services/db.service';
import { MailOtpComponent } from '../mail-otp/mail-otp.component';
// import { OtpLoginComponent } from '../otp-login/otp-login.component';
// import { GetOtpComponent } from '../get-otp/get-otp.component';

@Component({
  selector: 'app-new-signup',
  templateUrl: './new-signup.component.html',
  styleUrls: ['./new-signup.component.scss'],
})
export class NewSignupComponent implements OnInit {
  shake = false; //Focus styling
  alert_message:any;
  show_pass= true;
  register_data :any= {};
  to_register_data:any;
  submitted = false;
  labels = true ;
  focus :any= {};
  verified_number = false;
  show_pass_confirm = false;
  show_pass_confirm1 = false;
  check_pass = false;
  country_codes=['+91','+1']
  default_code='+91';
  windowRef:any;
  otp_verify:any;
  register_form:any = FormGroup;
  phone_no:any;
  // otp_no:any;
  otp_form:any = FormGroup;
  source_array:any;

  @Output() scrollToTop = new EventEmitter();
  constructor(private formBuilder:FormBuilder,private modalCtrl:ModalController,public db:DbService,private loadingCtrl:LoadingController,private router:Router) { }

  ngOnInit() {
    // this.windowRef = this.db.windowRef;
    // this.otp_popup()
    // this.db.affiliated_status = false;
    localStorage['otp_mobile'] && localStorage['otp_mobile'] != undefined && localStorage['otp_mobile'] != 'undefined' ? (this.register_data.phone = localStorage['otp_mobile'], this.verified_number = true) : (this.verified_number = false)
    
    localStorage['referer'] && localStorage['referer'] != null && localStorage['referer'] != 'undefined' ? (this.register_data.referral = localStorage['referer']) : null
    // console.log(localStorage.referer)
    this.source_array =  localStorage['source_array'] ? JSON.parse(localStorage['source_array'])  : '';
    this.db.checkmobile();
    
      this.register_form = this.formBuilder.group({
        first_name : new FormControl('',[Validators.required]),
        last_name :new FormControl(''),
        user_email : new FormControl('',[Validators.required,Validators.email]),
        // education_level : new FormControl('',[Validators.required]),
        // most_recent_job_title : new FormControl(''),
        // salary_type : new FormControl('',[Validators.required]),
        // annual_salary : new FormControl(''),
        // mobile_no : new FormControl('',[Validators.required]),
        password : new FormControl('',[Validators.required]),
        c_password : new FormControl('',[Validators.required]),
        // referral : new FormControl(''),Validators.maxLength(10)]  
        mobile_no: new FormControl('',[Validators.required, Validators.pattern("^((\\+91-?) |0)?[0-9]{10}$")]),
        country_code:new FormControl('')
      }) 

      this.otp_form = this.formBuilder.group({
        otp_no: new FormControl('',[Validators.required]),
      }) 
      this.recaptcha();
  }
   get otp_no(){
    return this.otp_form.get('otp_no')
   }
  get first_name(){
    return this.register_form.get('first_name')
  }

  get last_name(){
    return this.register_form.get('last_name')
  }

  get user_email(){
    return this.register_form.get('user_email')
  }

  get education_level(){
    return this.register_form.get('education_level')
  }

  get most_recent_job_title(){
    return this.register_form.get('most_recent_job_title')
  }

  get annual_salary(){
    return this.register_form.get('annual_salary')
  }

  get salary_type(){
    return this.register_form.get('salary_type')
  }

  get password(){
    return this.register_form.get('password')
  }
  get mobile_no(){
    return this.register_form.get('mobile_no')
    
  }
  get c_password(){
    return this.register_form.get('c_password')
  }

  get phone(){
    return this.register_form.get('phone')
  }

  get website(){
    return this.register_form.get('website')
  }
  get country_code(){
    return this.register_form.get('country_code')
  }
  get promote_us(){
    return this.register_form.get('promote_us')
  }
  get about_us(){
    return this.register_form.get('about_us')
  }
  
  async register() {
    this.submitted = true;
    let mobile_no = this.register_form.controls['country_code'].value + this.register_form.controls['mobile_no'].value
    this.register_data = this.register_form.value;
    this.register_data['mobile_no'] = mobile_no
    
    this.register_data['primary_source'] = localStorage['primary_source'] ? localStorage['primary_source'] : '';
    this.get_check();
    this.to_register_data = {
      data :  JSON.stringify(this.register_data)
    }
    if(this.register_form.status == 'VALID' && this.check_pass){
      // let loader = await this.loadingCtrl.create({ message: 'Please Wait...'});
      // await loader.present();
      // this.db.check_email(this.register_data['user_email']).subscribe(res=>{
      //   if(res.data.length==0){
      //     console.log('send code');          
      //     this.sendLoginCode(mobile_no)
      //   }else{
      //     console.log('registerd');
          
      //     this.db.alert("Email already registered")
      //   }
      // },error=>{console.log(error);
      // })
      

      // this.db.register(data).subscribe(res => {
      //   if(res.status == 'Success'){
      //     setTimeout(() => { loader.dismiss(); }, 50); 
      //     // console.log(res.message.message);
      //     let rec = {
      //       email: this.register_data['user_email'],
      //       password: this.register_data['password'],
      //       // email: res.user_id,
      //       // password: res.pwd,
      //     }
      //     this.db.getLogin(rec).subscribe(data => {
      //       if(data.message.status == "Success"){
      //         // localStorage.CustomerPwd = res.message.password;
      //         this.db.store_customer_info(data);
      //         this.db.side_menu_show = true;
      //         this.router.navigateByUrl('/dashboard');
              
      //         // this.email_verify(data);   
      //       }
      //       this.register_form.reset();
      //       loader.dismiss();
      //       this.submitted = false;
      //     })
      //   }else{
      //     loader.dismiss();
      //     this.shake = true;
      //     if(res.message.message){
      //       this.db.alert(res.message.message); 
      //       // this.alert_message = res.message.message;
      //     }else{
      //       this.alert_message = res.message;
      //     }

      //     setTimeout( () => { this.shake = false },400)
      //   }
      // },err=>{ console.log(err),loader.dismiss();})
    }else{
      this.shake = true;
      setTimeout( () => { this.shake = false },400)
    }
  }

  resend(){
    this.sendLoginCode(this.phone_no);
  }
// send otp function
async sendLoginCode(ph_no:any){
  this.otp_form.controls['otp_no'].setValue('');
  let loader = await this.loadingCtrl.create({ message: 'Please Wait...'});
  await loader.present();
//   this.db.verify_number({phone_no:ph_no}).subscribe(res=>{
//   if(!res.status) {
//     let mobile_no = ph_no.toString()
//     this.phone_no = mobile_no;
//     const appVerifier = this.windowRef.recaptchaVerifier; 
//       setTimeout( ()=>{ this.otp_verify = true 
//         loader.dismiss();
//       },250)
//       const auth = getAuth();
//       signInWithPhoneNumber(auth, mobile_no, appVerifier)
//           .then((confirmationResult) => {
//             // SMS sent. Prompt user to type the code from the message, then sign the
//             // user in with confirmationResult.confirm(code).
//             // window.confirmationResult = confirmationResult;
//             this.windowRef.confirmationResult = confirmationResult;
//             this.db.verificationId = confirmationResult.verificationId;
//             // console.log("otp send")
//             // ...
//           }).catch((error) => {
//             console.log(error)
//             if(error.code == 'auth/invalid-phone-number') {
//               // this.mobile_error = true;
//               // this.otp_submitted = false;
//               this.db.alert("Invalid Phone Number")
//             } else if(error.code == 'auth/too-many-requests') {
//               // this.otp_submitted = false;
//               !this.db.cust_name ? this.db.alert(error.message) : null
//             }
//             grecaptcha.reset();
//           });
//     firebase.auth().signInWithPhoneNumber(ph_no, appVerifier).then(result=>{
//           // console.log(result);
//           // this.otp_verify = result;
//           // this.db.otp_send.next('sent')
//           this.db.verificationId = result.verificationId;
//           // console.log(this.db.verificationId)
//           // console.log(result);
//           // this.otp_popup();
//         if(this.db.ismobile){
//           // this.start_watch();
//         }
//       }).catch(err=>{ console.log(err)

//         if(err.code == 'auth/invalid-phone-number') {
//           // this.mobile_error = true;
//           // this.otp_submitted = false;
//           this.db.alert("Invalid Phone Number")
//         } else if(err.code == 'auth/too-many-requests') {
//           // this.otp_submitted = false;
//           !this.db.cust_name ? this.db.alert(err.message) : null
//         }
//       });

// }else{
//   loader.dismiss();
//   this.db.error_message('Your mobile number is already registered')
// }
// })
}
// get_otp_no(event){
//   this.otp_no = event.target.value;
// }
submit_otp(){
  // console.log(this.otp_form.value.otp_no);
  this.verify_otp(this.otp_form.value.otp_no)
}

  async verify_otp(otp:any) {
    // console.log(this.otp_form.controls.otp)
    let loader = await this.loadingCtrl.create({ message: 'Please Wait...'});
    await loader.present();
      // this.windowRef.confirmationResult.confirm(otp.toString()).then((result) => {
      //     // console.log("success",result)
      //     loader.dismiss()
      //     const user = result.user;
      //     this.otp_form.controls['otp_no'].setValue('')
      //     console.log(this.otp_form.value.otp_no);
      //     this.otp_success(this.to_register_data);
      //   }).catch((error) => {
      //     !this.db.cust_name ?  this.db.alert(error.code) : null
      //     loader.dismiss()
      //     // console.log("error",error)
      //   });
        // var credential = firebase.auth.PhoneAuthProvider.credential(confirmationResult.db.verificationId, code);
        // let signInCredential = firebase.auth.PhoneAuthProvider.credential(this.db.verificationId, this.otp.toString());
        // firebase.auth().signInWithCredential(signInCredential).then((info) => {
        //     this.otp_success();
        // }, error => { this.db.alert(error.code);  })

  }
  async otp_success(data:any){
     let loader = await this.loadingCtrl.create({ message: 'Please Wait...'});
     await loader.present();
      // this.db.register(data).subscribe(res => {
      //   if(res.status == 'Success'){
      //     setTimeout(() => { loader.dismiss(); }, 50); 
      //     // console.log(res.message.message);
      //     let rec = {
      //       email: this.register_data['user_email'],
      //       password: this.register_data['password'],
      //       // email: res.user_id,
      //       // password: res.pwd,
      //     }
      //     this.db.getLogin(rec).subscribe(data => {
      //       if(data.message.status == "Success"){
      //         // localStorage.CustomerPwd = res.message.password;
      //         this.db.store_customer_info(data);
      //         this.db.side_menu_show = true;
      //         this.router.navigateByUrl('/dashboard');
              
      //         // this.email_verify(data);   
      //       }
      //       this.register_form.reset();
      //       loader.dismiss();
      //       this.submitted = false;
      //     })
      //   }else{
      //     loader.dismiss();
      //     this.shake = true;
      //     if(res.message.message){
      //       this.db.alert(res.message.message); 
      //       // this.alert_message = res.message.message;
      //     }else{
      //       this.alert_message = res.message;
      //     }

      //     setTimeout( () => { this.shake = false },400)
      //   }
      // },err=>{ console.log(err),loader.dismiss();})
  }
recaptcha() {
  // const auth = getAuth();
  // this.windowRef.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
  //   'size': 'invisible',
  //   'callback': (response) => {
  //     // reCAPTCHA solved, allow signInWithPhoneNumber.
  //     console.log("recaptcha solved")
  //     // onSignInSubmit();
  //   },
    
  // }, auth);
    // this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
    //   size: 'invisible'
    // });
    // this.windowRef.recaptchaVerifier.render();
}

  values = [{label:'University'},{label: 'High School'}]

  cur_salary = [{label:'Annual', button:false},{label:'Daily', button:false},{label:'Hourly', button:false},{label:'None', button:false}]

  button_true(item:any,val:any){
    item.map((res:any,index:any) =>{
      if(val == index){
        res.button = true;
        // this.register_form['salary_type'].setValue(res.label);
        this.register_form.get('salary_type').setValue(res.label);
      }else{
        res.button = false;
      }
    })
  }

  salary_val(evt:any){
    if(evt.target.innerHTML) {
  		this.register_data.salary_type = evt.target.innerHTML;
  	}
  }

  value_changed(evt:any) {
  	if(evt.detail.value) {
  		this.register_data.education_level = evt.detail.value;
  	}
  }

  get_check(){
    if(this.register_form.value.c_password != this.register_form.value.password){
       this.db.alert("Password & confirm password can't match..!");  
    }else{
      this.check_pass = true;
      // let email = this.register_form.value.user_email != ''? this.register_form.value.user_email : null;
      // if(email != undefined){
      //   // this.email_verify(email);
      // }
    }
  }

  async email_verify(user_data:any) {
        const modal = await this.modalCtrl.create({
          component: MailOtpComponent,
          cssClass:'auth-popup',
          componentProps: {
            user_data: user_data,
            type:'register'
          }
        })
  
        await modal.present();
  
        // await modal.onWillDismiss().then( res =>{    
        // });
  }

  // affiliated_register(){
  //   // console.log(this.register_form)
  //   this.submitted = true;
  //   // this.register_data =  this.register_form.value;
  //   let  data = {
  //     "first_name" : this.register_form.value.first_name,
  //     "last_name" :this.register_form.value.last_name,
  //     "email": this.register_form.value.email,
  //     "new_password": this.register_form.value.pwd,
  //     "website": this.register_form.value.website,
  //     "promote_us": this.register_form.value.promote,
  //     "hear_about_us": this.register_form.value.about_us
  //    }

  //   if(this.register_form.status == 'VALID'){
  //     this.db.insert_affiliate_registration(data).subscribe(res => {
  //       if(res.message.status == 'Success'){
  //         // setTimeout( () => { this.db.alert("Successfully Registered"); },400)
  //           // this.router.navigateByUrl('/')
  //           this.register_form.reset();
  //           this.db.affiliated = true;
  //           this.scrollToTop.emit(); 
  //           this.db.affiliated_status = true;
  //       }else if(res.message.status == 'Failed'){
  //         this.shake = true;
  //         this.alert_message = res.message.message
  //         // var b = JSON.parse(res._server_messages);
  //         // var b1 = JSON.parse(b);
  //         // this.alert_message = b1.message
  //         setTimeout( () => { this.shake = false },400)
  //         // this.db.alert(b1.message)
  //       }
  //     },err=>{ console.log(err)})
  //   }else{
  //     this.shake = true;
  //     setTimeout( () => { this.shake = false },400)
  //   }
  // }


} 

// import 'firebase/compat/auth';

import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

// import {
//   getAuth,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from 'firebase/auth';
// import firebase from 'firebase/compat/app';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-otp-login',
  templateUrl: './otp-login.component.html',
  styleUrls: ['./otp-login.component.scss'],
})
export class OtpLoginComponent implements OnInit {
  otp_form:any = FormGroup;
  otp_verify:any;
  verificationId:any;
  otp:any;
  shake:any;
  windowRef: any;
  otp_submit:any;
  mobile_no:any;
  phone_No:any;
  country_codes=['+91','+1']
  @Input() check_out:any;
  @Input() number_for_checkout:any;
  constructor(private formbuilder:FormBuilder,public db:DbService,private router:Router) { }

  ngOnInit() {
    
    // this.windowRef = this.db.windowRef;
    this.otp_form = this.formbuilder.group({
        mobile_no: ['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        otp: ['',[Validators.required]],
        country_code : ['+91',[Validators.required]],
      })

    // this.db.otp_send.subscribe(res =>{
    //   res == 'sent' ?( this.otp_verify = true ): null
    // })
    this.recaptcha();
  }


  get  otp_verifyy(){
    return this.otp_verify ? true : false;
  }
  

  get phonenumber() {
    return this.otp_form.get('mobile_no');
  }
  get country_code() {
    return this.otp_form.get('country_code');
  }

  async sendLoginCode(){
    this.otp_submit = true;
    let prefi = this.otp_form.controls['country_code'].value; 
    const num = prefi.toString() + this.mobile_no.toString();
  //   this.db.verify_number({phone_no:num}).subscribe(res=>{
  //   if(res.status) {
  //   if(this.otp_form.controls.mobile_no.status == 'VALID'){
  //     this.phone_No = num;
  //     const appVerifier = this.windowRef.recaptchaVerifier;
      
  //       setTimeout( ()=>{ this.otp_verify = true },250)


  //       const auth = getAuth();
  //       signInWithPhoneNumber(auth, num, appVerifier)
  //           .then((confirmationResult) => {
  //             // SMS sent. Prompt user to type the code from the message, then sign the
  //             // user in with confirmationResult.confirm(code).
  //             // window.confirmationResult = confirmationResult;
  //             this.windowRef.confirmationResult = confirmationResult;
  //             this.verificationId = confirmationResult.verificationId;
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


  //     firebase.auth().signInWithPhoneNumber(num, appVerifier).then(result=>{
  //           // console.log(result);
  //           // this.otp_verify = result;
  //           // this.db.otp_send.next('sent')
  //           this.verificationId = result.verificationId;
  //           // console.log(this.verificationId)
  //           // console.log(result);
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

  //   }   
  //   else{
  //     this.shake = true;
  //     setTimeout( () => { this.shake = false },400)
  //   }
  // }else{
  //   this.db.error_message('Your mobile number is not registered')
  // }
  // })
  }


  resend(){
    this.otp_form.controls.otp.setValue('');
    this.sendLoginCode();
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


  verify_otp() {
    // console.log(this.otp_form.controls.otp)
    // if(this.otp_form.controls.otp.status == 'VALID'){
    //   this.windowRef.confirmationResult.confirm(this.otp.toString()).then((result) => {
    //       // console.log("success",result)
    //       const user = result.user;
    //       this.otp_success();
    //     }).catch((error) => {
    //       !this.db.cust_name ?  this.db.alert(error.code) : null
    //       // console.log("error",error)
    //     });

    //     // var credential = firebase.auth.PhoneAuthProvider.credential(confirmationResult.verificationId, code);
    //     // let signInCredential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.otp.toString());
    //     // firebase.auth().signInWithCredential(signInCredential).then((info) => {
    //     //     this.otp_success();
    //     // }, error => { this.db.alert(error.code);  })
    // } else{
    //   this.shake = true;
    //   setTimeout( () => { this.shake = false },400)
    // }
  }


  otp_success(){
    // // this.db.alert("Mobile OTP Success")
    // this.db.cust_details({phone_no : this.phone_No}).subscribe(res => {
    //   console.log("Get mobile number",res)
    //   if (res.message.status = 'Success') {    
    //           this.router.navigateByUrl('/dashboard');
    //           // localStorage.otp_mobile = this.otp_form.controls.mobile_no.value
    //           this.db.store_customer_info(res);
    //   }else{
    //     this.db.alert("Something Went wrong...!");
    //   }
    // },error => { console.error(error)})
  }

  // get_customer_info(data, value) {
  //   // console.log(data);
  //   this.db.customer_Info({email:data}).subscribe(res => {
  //     // console.log(res)
  //     if (res.message) {
  //         this.db.store_customer_info(res)
  //         this.db.dismiss();
  //     } else {
  //       // if(this.db.ismobile){
  //         // this.router.navigateByUrl('/register');
  //         // this.get_customer_info(data, value)
  //       // }else{
  //         this.get_customer_info(data, value)
  //         // this.db.registerform = true;
  //       // }
  //         // this.router.navigateByUrl
  //     }
  //   },error => { this.db.alert('Check E-mail ID / Password'); console.error(error)})
  // }


  // get_country_list() {
  //   this.db.get_country_list().subscribe((r: any) => {
      
  //   }, error => { console.log(error)})
  // }
  
}

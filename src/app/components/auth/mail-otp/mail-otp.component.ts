import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mail-otp',
  templateUrl: './mail-otp.component.html',
  styleUrls: ['./mail-otp.component.scss'],
})
export class MailOtpComponent implements OnInit {
  @Input()  user_data:any;
  @Input() type:any;
  otp:any;
  email_otp:any = FormGroup;
  formBuilder: any;
  alert_message:any;
  alert = false;
  // otp;
  showOtpComponent = true; 
  @ViewChild("ngOtpInput", { static: false }) ngOtpInput: any; 
  // config = { allowNumbersOnly: true, length: 4, isPasswordInput: false, disableAutoFocus: false, placeholder: "*", inputStyles: { width: "50px", height: "50px", }, }; 
  constructor(public db:DbService, public router:Router, public modalCtrl : ModalController) { }

  ngOnInit() {
    this.user_data.message.api_key ? localStorage['api_key'] = this.user_data.message.api_key: null;
    this.user_data.message.api_secret ? localStorage['api_secret'] = this.user_data.message.api_secret: null;
    localStorage['customerUser_id'] = this.user_data.message.user_id;
  }


  validate_otps(){



    if(this.otp && this.otp.length == 4){
      let data = {
        user:this.user_data.message.email,
        otp:this.otp,
        jobseeker_id:this.user_data.message.user_id
      }
    }else{
      this.alert = true;
      this.alert_message = 'OTP is invalid';
    }
 
  }

  resend_otp(){

      let data = {
        user:this.user_data.message.email,
        jobseeker_id:this.user_data.message.user_id
      }
      // this.db.regenerate_jobseeker_otp(data).subscribe(res => {
      //      console.log(res);
      //      if(res.message.status == true){
      //       this.alert_message = res.message.message;
      //       this.alert = true;
      //       setTimeout(()=>{ this.alert = false },3000);
      //      }else if(res.message.status == false){
      //       this.alert = true;
      //       this.alert_message = res.message.message;
      //      }
      // })
 
  }
  // }
  // get otp(){
  //   return this.email_otp.get('otp')
  // }

  onOtpChange(evt:any){
    // console.log("EVENT",evt);
    this.otp = evt;
  }

  // get_check(){
  //   let val = '8430'
  //   if(this.email_otp.value.otp != val){
  //      this.db.alert("Otp Wrong");  
  //   }
  // }

}

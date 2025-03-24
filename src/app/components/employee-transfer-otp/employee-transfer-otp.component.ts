import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-employee-transfer-otp',
  templateUrl: './employee-transfer-otp.component.html',
  styleUrls: ['./employee-transfer-otp.component.scss'],
})
export class EmployeeTransferOtpComponent  implements OnInit {
  @Input() transter_info:any;
  otp_form:any = FormGroup;
  otp:any;
  loader_snipper = false;
  success_alert_message:any;
  alert_message:any;
  shake:any;
  request_id:any;

  constructor(private loadingCtrl:LoadingController,private modalctrl:ModalController,private formbuilder:FormBuilder,public db:DbService) {

   }

  ngOnInit() {
    this.otp_form = this.formbuilder.group({
      otp: ['',[Validators.required]],
    })
    // this.request_id = "17ce3c91-dee6-4eb4-a820-d254ed9301e2"
    // this.alert_message = "OTP sent to registered mobile number"
    this.sendLoginCode()
  }

  verifyOtp(){
    // console.log(this.otp_number,'this.otp_number');
  }

  async sendLoginCode(){
    let loader = await this.loadingCtrl.create({ message: 'Please Wait...'});
    await loader.present();
    this.db.send_aadhaar_otp({aadhaar_number:this.db.employee_img.custom_aadhar_number}).subscribe(res => {
      if (res.message.success == true) {
        this.request_id = res.message.request_id
        this.success_alert_message = res.message.message;
      } else {
        this.alert_message = res.message.error
      }
      setTimeout(()=>{
        loader.dismiss();
      },500)
      loader.dismiss();
      this.clear_alert_message();
    },error => { 
      loader.dismiss();
      console.error(error)
    })
  }

  resend(){
    this.otp_form.controls.otp.setValue('');
    this.sendLoginCode();
  }

  close_modal(){
    this.modalctrl.dismiss();
  }

  async verify_otp() {
    if(this.request_id){
      if(this.otp_form.controls.otp.status == 'VALID'){
        let loader = await this.loadingCtrl.create({ message: 'Please Wait...'});
        await loader.present();
        this.db.verify_otp({aadhaar_number:this.db.employee_img.custom_aadhar_number,otp:this.otp,request_id:this.request_id,id_name:this.transter_info.name}).subscribe((res:any) => {
          if (res.message.verified == true) {
              this.loader_snipper = true;
              setTimeout( () => { this.loader_snipper = false 
                this.modalctrl.dismiss(res.message.verified);
              },2500);
              this.alert_message = res.message.message;
          } else {
            this.alert_message = res.message.error
          }
          setTimeout(()=>{
            loader.dismiss();
          },500)
        this.clear_alert_message();

        },(error: any) => { 
        loader.dismiss();
        console.error(error)
      })

    }else{
      this.shake = true;
      this.alert_message = 'Please enter the otp'
      this.clear_alert_message();
      setTimeout( () => { this.shake = false },400)
    }
  }
  // else
  //   this.alert_message = "Invalid Aadhaar number"
  }

  clear_alert_message(){
    setTimeout( () => { 
      this.success_alert_message = undefined; 
      this.alert_message = undefined; 
    },4500)
  }

}

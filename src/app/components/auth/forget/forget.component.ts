import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { DbService } from 'src/app/services/db.service';

import {
  AlertController,
  ModalController,
} from '@ionic/angular';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss','../registe-r/registe-r.component.scss',],
})
export class ForgetComponent implements OnInit {
  focus :any ={};
  @Input() modal:any;
  @Input() affiliated:any;
  otp_form:any = FormGroup;
  password_form:any = FormGroup;
  submitted = false; 
  shake:any;
  alert_message:any;
  show_pass_old = true;
  show_pass_new = true;
  show_pass_confirm = true;
  
  constructor(public db:DbService,private formbuilder:FormBuilder,private alertCtrl:AlertController,private modalCtrl:ModalController) { }

  ngOnInit() {
    this.otp_form = this.formbuilder.group({
      email : new FormControl ('',[Validators.required,Validators.email]),
    })

    this.password_form = this.formbuilder.group({
      password : new FormControl ('',[Validators.required]),
      old_password : new FormControl ('',[Validators.required]),
      c_password : new FormControl ('',[Validators.required])
    })
  }
  
  get email(){
    return this.otp_form.get('email');
  }

  get password(){
    return this.password_form.get('password');
  }

  get old_password(){
    return this.password_form.get('old_password');
  }

  get c_password(){
    return this.password_form.get('c_password');
  }


  forget_password(){
      this.submitted = true
      if(this.otp_form.controls.email.status == 'VALID'){
            let data  ={  user: this.otp_form.value.email }
          // this.db.forget_password(data).subscribe((res:any) =>{
          //     //  console.log(res)
          //     this.db.alert('Password reset link have been sent to your email address');
          //      if(res.message.status == 'Success'){
          //         // this.shake = true;
          //         setTimeout( () => { this.shake = false },400)
          //         // this.alert_message = res.message;
          //         this.db.alert('Password reset link have been sent to your email address');
          //      } else if(res.message.status == 'Failed') {
          //       this.shake = true;
          //       this.db.alert(res.message.message);
          //       // this.alert_message =''
          //       // var b = JSON.parse(res._server_messages);
          //       // var b1 = JSON.parse(b);
          //       // this.open_alert(b1.message)
          //       // this.alert_message = b1.message
          //      }else{
          //       console.log("test");
          //      }
          // },error=>{
          //   this.db.alert('Something went wrong');
          // })
      } else {
        this.shake = true;
        // console.log("test");
        
        setTimeout( () => { this.shake = false },400)
      }
  }


  async open_alert(message:any){
      const alert = await this.alertCtrl.create({
        header:'Alert',
        message:message,
        buttons:[
          {
            text :'Ok',
            handler:() =>{  
              // this.db.otp_form = false;
              this.modalCtrl.dismiss(); 
            }
          }
        ]
      })
      await alert.present();
  }

  update(){
      this.submitted = true;
    //  console.log(this.password_form)
      if(this.password_form.status == 'VALID'){ 
        // if(this.password_form.value.password == this.password_form.value.c_password){
        //   if( this.password_form.value.old_password != localStorage.CustomerPwd){
        //       this.db.alert("Wrong Old Password")
        //   }  else{
        //     let data = {
             
        //       key: "",
        //       old_password: this.password_form.value.old_password,
        //       user:localStorage.CustomerId,
        //       new_password: this.password_form.value.password,
        //     }
        //     this.db.update_password(data).subscribe(res =>{
        //         console.log(res);
        //         if(res.home_page == '/home-page'){
        //           this.db.alert("Password updated successfully..!")
        //         } else if(res.message.status == "Failed") {
        //           this.db.alert(res.message.message);
        //         }
        //     })
        // }
        // } else {
        //     this.db.alert("Password confirm password can't match..!");
        // }

        this.get_check()
      }
  }

  get_check(){

    if(this.password_form.value.old_password != localStorage['CustomerPwd']){
       this.db.alert("Wrong Old Password");
    }  else if(this.password_form.value.password != this.password_form.value.c_password){
       this.db.alert("Password confirm password can't match..!");  
    }  else if(this.password_form.value.password == localStorage['CustomerPwd']){
      this.db.alert("Old password and new password must not be same..!");
    } else {
      // this.upadating();
    }

  }

  
} 

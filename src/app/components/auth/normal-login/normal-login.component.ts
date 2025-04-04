import {
  Component,
  Input,
  OnInit,
  HostListener,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { MailOtpComponent } from '../mail-otp/mail-otp.component';
import { DbService } from 'src/app/services/db.service';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

@Component({
  selector: 'app-normal-login',
  templateUrl: './normal-login.component.html',
  styleUrls: ['./normal-login.component.scss'],
})

export class NormalLoginComponent implements OnInit {
  focus :any= {}; //Focus styling
  loginform:any = FormGroup;
  submitted = false;
  shake:any;
  alert_message:any;
  show_pass= true;
  sitename_data: any;

  constructor(public db:DbService,private formbuilder:FormBuilder,private router:Router,private modalCtrl:ModalController) { }

  ngOnInit() {
    this.loginform = this.formbuilder.group({
      site_name : new FormControl ('',[Validators.required]),
      email : new FormControl ('',[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      password : new FormControl('',[Validators.required])
    })

    // this.sitename_data = 'dev-chola.tridotstech.com'
    // this.sitename_data = ''
    this.sitename_data = 'stage-hrms.frappe.cloud'

  } 

  @HostListener('document:keydown.enter')
  onDocumentKeydownEnter() {
    if(this.db.path == '/register'){
      this.login()
    }
  }

  get site_name(){
    return this.loginform.get('site_name');
  }
  get email(){
    return this.loginform.get('email');
  }

  get password(){
    return this.loginform.get('password');
  }


  buttonLoader = false;
  //Form login Method..
  login() {
    this.submitted = true;
    this.buttonLoader = true;
    if (this.loginform.status == 'VALID') {
      let site_name = this.loginform.value.site_name;
      this.db.site_values(site_name);
        let data = {
          usr: this.loginform.value.email,
          pwd: this.loginform.value.password
        }
        this.db.getLogin(data).subscribe((data:any) => {
          if(data.message.status == "Success"){
            if(data.message.roles){
              let check = data.message.roles.map(res=> {return res.role == 'HR Manager' || res.role == 'L1 Manager' || res.role == 'L2 Manager'})
              if(check){
                data.message.roles = data.message.roles.filter(res=> {return res.role != 'Employee'})
              }
              this.db.check_project_manager(data.message.roles)
            }

            localStorage['site_name'] = site_name;
            this.db.side_menu_show = true;
            SecureStoragePlugin.set({ key: 'CustomerPwd', value: this.loginform.value.password });
            // localStorage['CustomerPwd'] = this.loginform.value.password;
            data.message.full_name = data.full_name ? data.full_name : '';
            this.db.store_customer_info(data.message);
            
            if(data.message){
              SecureStoragePlugin.set({ key: 'api_key', value: data.message.api_key });
              // localStorage['api_key'] = data.message.api_key;
            }
            this.db.side_menu_show = true;
            this.submitted = false;
            this.loginform.reset();   
            setTimeout(()=>{
              this.buttonLoader = false;
              this.router.navigateByUrl(this.db.ismobile ? '/tabs/dashboard' :'/dashboard'); 
            },800)
          }else{
            this.shake = true;
            this.buttonLoader = false;
            setTimeout( () => { this.shake = false },400);
            if(data.message && data.message.status != 'Success'){
              this.alert_message = data.message.message;
            }
          }
      },(error:any) => {
        this.shake = true;
        this.buttonLoader = false;
        setTimeout( () => { this.shake = false },400)
        this.alert_message = 'Invalid Email/Password';
      });
    }else{
      this.shake = true;
      this.buttonLoader = false;
      setTimeout( () => { this.shake = false },400)
    }
  }


  async email_verify(user_data:any) {
    const modal = await this.modalCtrl.create({
      component: MailOtpComponent,
      cssClass:'auth-popup',
      backdropDismiss:false,
      componentProps: {
        user_data: user_data,
        type:'login'
      }
    })
    await modal.present();
    await modal.onWillDismiss().then( res =>{    
    });
  }
    
}

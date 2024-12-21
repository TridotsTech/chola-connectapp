import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CustomizeFormPage } from '../customize-form/customize-form.page';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  invoice: any = []
  selected_value: any;
  settings_base_role: any;
  constructor(public db:DbService,private router : Router,public modalcntrl : ModalController) { }

  ngOnInit() {
    // this.invoice_format();
    this.get_settings()
  }

  get_settings(){
    if(!this.db.hr_manager_role && !this.db.employee_role && !this.db.sales_manager_role){
      this.settings_base_role = this.settings
    }else{
      this.settings_base_role = this.hr_settings
    }
  }

  settings = [
    { name: 'Customize Form', icon: 'create-outline', route:'/page-settings'},
    { name: 'Invoice Format', icon: 'document-text-outline', route:'/invoice-format'},
    // { name: 'Purchase Invoice', icon: 'document-text-outline', route:'/invoice-format/purchase'}
  ]

  hr_settings = [
    { name: 'Customize Form', icon: 'create-outline', route:'/page-settings'},
    // { name: 'Purchase Invoice', icon: 'document-text-outline', route:'/invoice-format/purchase'}
  ]

  navigate_settings(data){
    this.router.navigateByUrl(data)
  }

  async open_settings_popup(data){
      const modalcontrol = await this.modalcntrl.create({
        component: CustomizeFormPage,
        cssClass: 'web_site_form',
        enterAnimation: this.db.enterAnimation,
        leaveAnimation:this.db.leaveAnimation,
      });
      await modalcontrol.present();
  }
}
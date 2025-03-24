import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EmployeeTransferOtpComponent } from 'src/app/components/employee-transfer-otp/employee-transfer-otp.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-emp-transfer-detail',
  templateUrl: './emp-transfer-detail.page.html',
  styleUrls: ['./emp-transfer-detail.page.scss'],
})
export class EmpTransferDetailPage implements OnInit {
  routeValue:any;
  transter_info:any;
  constructor(public db: DbService,private activatedRoute: ActivatedRoute,public modalCntrl: ModalController) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      // this.routeValue = params.get('id'); // Get the 'route' value from the URL
      this.get_doc(params.get('id'))
    });
  }

  get_doc(id){
    let data = {
      name: id,
      doctype: 'Employee Transfers'
    }
    this.db.doc_detail(data).subscribe(res => {
      if(res.status == 'Success'){
        this.transter_info = res.message[1]
      }
      // console.log(res)
    }, (error: any) => {
    
    })
  }

  async openOtp(){
    const modal = await this.modalCntrl.create({
      component: EmployeeTransferOtpComponent,
      cssClass: 'new-opt-form',
      componentProps: {
        transter_info: this.transter_info
      }
    });
    await modal.present();
    const val = await modal.onWillDismiss();
      // console.log(val)
      if(val && val.data){
        this.transter_info.aadhaar_verified = val.data
      }
  }

}

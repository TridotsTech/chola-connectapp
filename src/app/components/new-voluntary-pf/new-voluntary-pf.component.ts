import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { LeaveTypeComponent } from 'src/app/components/leaves-module/leave-type/leave-type.component';

@Component({
  selector: 'app-new-voluntary-pf',
  templateUrl: './new-voluntary-pf.component.html',
  styleUrls: ['./new-voluntary-pf.component.scss'],
})
export class NewVoluntaryPfComponent  implements OnInit {
  pfDetails: any = {};
  constructor(public db: DbService,public modalCntrl: ModalController) { }

  ngOnInit() {
    this.getVpfDetail();
  }

  getVpfDetail(){
    let data = {
      employee_id: localStorage['employee_id']
    }
    this.db.get_vpf_details(data).subscribe(res => {
      // console.log(res);
      if(res && res.status == 'Success' && res.message){
        this.pfDetails = res.message
      }else if(res._server_messages){
        let d = JSON.parse(res._server_messages)
        let f = JSON.parse(d[0])
        this.db.sendErrorMessage(f.message)
      }
      else{
        // this.db.sendErrorMessage(f.message)
        this.pfDetails = {}
      }
    })
  }

  contributionType = [
    {name: 'Fixed Amount'},
    {name: 'Percentage Salary'}
  ]

  changeAmount(event){
    if(event.target.value){
      let v = (this.pfDetails.basic * Number(event.target.value)) / 100
      // console.log(v,'v')
      this.pfDetails.amount = v
    }else{
      this.pfDetails.amount = 0
    }
  }

  changeAmountType(event){
    this.pfDetails.amount = 0;
  }

  checkSubmit(){
    if(this.pfDetails.contribution_type == 'Percentage Salary' && !this.pfDetails.percentage){
      this.db.sendErrorMessage('Percentage Required');
    }else if(this.pfDetails.contribution_type == 'Fixed Amount' && !this.pfDetails.amount){
      this.db.sendErrorMessage('Amount Required');
    }else if(!this.pfDetails.contribution_type){
      this.db.sendErrorMessage('Amount Required');
    }else{
      this.submit();
    }
  }

  submit(){
    this.pfDetails['doctype'] = 'Employee VPF'
    this.pfDetails.amount = Number(this.pfDetails.amount)
    if(this.pfDetails.percentage){
      this.pfDetails.percentage = Number(this.pfDetails.percentage)
    }

    if(this.pfDetails && this.pfDetails.payroll_months){
      delete this.pfDetails.payroll_months
    }

    this.db.inset_docs({data: this.pfDetails}).subscribe(res => {
      // console.log(res)
      if(res && res.message && res.message.status == 'Success'){
        this.db.sendSuccessMessage('Employee VPF created Succesully');
        this.modalCntrl.dismiss(res.message);
      }else{
        this.db.sendErrorMessage('Failed to create Employee VPF');
      }
    })
  }

  async open_dropdown(type) {
    const modal = await this.modalCntrl.create({
      component: LeaveTypeComponent,
      cssClass: this.db.ismobile ? 'job-detail-popup' : 'filter-popup',
      componentProps: {
        title: type,
        type: type,
        datas: type == 'Effective From' ? this.pfDetails.payroll_months : this.contributionType
      },
    });
    await modal.present();
    const val = await modal.onWillDismiss();
    // console.log(val)
    if(val && val.data && val.role){
      if(val.role == 'Effective From'){
        this.pfDetails.effective_month = val.data;
      }else{
        this.pfDetails.contribution_type = val.data;
      }
      this.changeAmountType(val.data);
    }
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { LeavePreviewWithdrawFormComponent } from '../leave-preview-withdraw-form/leave-preview-withdraw-form.component';

@Component({
  selector: 'app-leave-preview-withdraw',
  templateUrl: './leave-preview-withdraw.component.html',
  styleUrls: ['./leave-preview-withdraw.component.scss'],
})
export class LeavePreviewWithdrawComponent  implements OnInit {
  @Input() leave_withdraw:any = {};
  constructor(public db: DbService,public modalCntrl: ModalController) { }

  ngOnInit() {
    this.getWithdrawalDetails()
  }

  getWithdrawalDetails(){
    let data = {
      doctype: "Leave Withdrawal",
      name: this.leave_withdraw.name
    }
    this.db.doc_detail(data).subscribe(res => {
      if(res && res.message && res.message.length != 0 && res.message[0] && res.message[0].status == 'Success'){
        this.leave_withdraw = res.message[1];
      }else{
        this.leave_withdraw = {};
      }
    })
  }

  addLeaveWithdrawal(event, item){
    event.stopPropagation();
    item['isChecked'] =! item['isChecked']
  }

  eventPropagation(event){
    event.stopPropagation();
  }

  checkBottomBtn(){
    if(this.leave_withdraw && this.leave_withdraw.leave_withdraw_date && this.leave_withdraw.leave_withdraw_date.length != 0){
      let selectedArray = this.leave_withdraw.leave_withdraw_date.filter(res => {return res['isChecked'] == true});
      return selectedArray.length > 0 ? true : false;
      // if(selectedArray.length > 0){
      //   return true;
      // }else{
      //   return false;
      // }
    }else
      return false;
  }

  async submitWithdrawal_reject(type){
    const modal = await this.modalCntrl.create({
      component: LeavePreviewWithdrawFormComponent,
      cssClass: 'job-detail-popup',
      componentProps: {
        title:'Leave Withdrawal Reason',
        type:'Leave Withdrawal Reason',
        editFormValues: {rejected_reason:''}
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const res  = await modal.onWillDismiss();
    if (res && res.data && res.data.rejected_reason) {
      this.submitWithdrawal(type,res.data.rejected_reason)
    }
  }

  submitWithdrawal(type,reason){
    let submit;
    let selectedArray:any=[]
    let check = this.leave_withdraw.leave_withdraw_date.filter(res => {return res['isChecked'] == true});
    if(check.length > 0){
      check.map(res => {
        res.status = type
        selectedArray.push({from_date:res.from_date,status:res.status,rejected_reason:reason})
      })
    }
    let submitArray = this.leave_withdraw.leave_withdraw_date.filter(res => {return res['status'] == 'Rejected' || res['status'] == 'Approved' });
    submitArray.length == this.leave_withdraw.leave_withdraw_date.length ? submit = 1 : submit = 0;
    let data = {
      employee: this.leave_withdraw.employee,
      name: this.leave_withdraw.name,
      leave_withdraw_date: selectedArray,
      docstatus : submit,
      posting_date:this.db.current_event_date
    }
  
    this.db.leave_withdraw_approve_reject(data).subscribe(res => {
        console.log(res)
        if(res.status == 'Success'){
          this.leave_withdraw.leave_withdraw_date.map(res => {res['isChecked'] = false});
          this.db.sendSuccessMessage(res.message)
        }
        else if (res._server_messages) {
          var d = JSON.parse(res._server_messages);
          var d1 = JSON.parse(d);
          this.db.alert(d1.message)
        }
        else{
          this.db.alert(res.message)
        }
        if(submit)
          this.modalCntrl.dismiss(res.message)
      })
  }

}

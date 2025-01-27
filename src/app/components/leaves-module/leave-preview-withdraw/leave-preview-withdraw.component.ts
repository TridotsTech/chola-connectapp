import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-leave-preview-withdraw',
  templateUrl: './leave-preview-withdraw.component.html',
  styleUrls: ['./leave-preview-withdraw.component.scss'],
})
export class LeavePreviewWithdrawComponent  implements OnInit {
  @Input() letterrequestDetail:any = {};
  constructor(public db: DbService,public modalCntrl: ModalController) { }

  ngOnInit() {
    this.getWithdrawalDetails()
  }

  getWithdrawalDetails(){
    let data = {
      doctype: "Leave Withdrawal",
      name: this.letterrequestDetail.name
    }
    this.db.doc_detail(data).subscribe(res => {
      console.log(res);
      if(res && res.message && res.message.length != 0 && res.message[0] && res.message[0].status == 'Success'){
        this.letterrequestDetail = res.message[1];
      }else{
        this.letterrequestDetail = {};
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
    if(this.letterrequestDetail && this.letterrequestDetail.leave_withdraw_date && this.letterrequestDetail.leave_withdraw_date.length != 0){
      let selectedArray = this.letterrequestDetail.leave_withdraw_date.filter(res => {return res['isChecked'] == true});
      if(selectedArray.length > 0){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  submitWithdrawal(type){
    let submit;
    let selectedArray = this.letterrequestDetail.leave_withdraw_date.filter(res => {return res['isChecked'] == true});
    if(selectedArray.length > 0){
      selectedArray.map(resS => {
        resS.status = type
      })
    }
    // console.log(this.letterrequestDetail)

    let submitArray = this.letterrequestDetail.leave_withdraw_date.find(res => {return res['status'] == 'Open'});
    if(submitArray){
      submit = false;
    }else{
      submit = true;
    }

    let data = {
      doctype: "Leave Withdrawal",
      name: this.letterrequestDetail.name,
      leave_withdraw_date: this.letterrequestDetail.leave_withdraw_date,
      // docstatus: submit ? 1 : 0
    }
    this.db.inset_docs({data: data}).subscribe(res => {
      console.log(res)
    })
  }

}

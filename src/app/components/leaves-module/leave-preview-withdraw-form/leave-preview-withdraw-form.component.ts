import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { LeaveTypeComponent } from '../leave-type/leave-type.component';

@Component({
  selector: 'app-leave-preview-withdraw-form',
  templateUrl: './leave-preview-withdraw-form.component.html',
  styleUrls: ['./leave-preview-withdraw-form.component.scss'],
})
export class LeavePreviewWithdrawFormComponent implements OnInit {
  @Input() editFormValues: any;
  @Input() leave_preview: any =[];
  @Input() title: any;
  @Input() type: any;
  posting_date:any = new Date();
  each:any={}
  constructor(public db: DbService, public modalCntrl: ModalController) {}

  ngOnInit() {
    this.each.field_name = 'to_date';
   

    if(this.type == 'leave request'){
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      this.posting_date = formattedDate
    }
    this.db.select_drop_down.subscribe((res: any) => {
      // console.log(res)
      if(res.fieldname == 'country')
        this.editFormValues.country = res.name;
    });
  }

  LeaveType = [
    { name: 'Full Day' },
    { name: 'First Half' },
    { name: 'Second Half' },
  ];

  regularizationReason = [
    { name: 'Forgot to Punch' },
    { name: 'On-duty' },
    { name: 'Training' },
    { name: 'Client Meeting' },
    { name: 'Others' },
  ];

  statusType = [
    { name: 'Open' },
    { name: 'Approved' },
    { name: 'Pending' },
    { name: 'Withdraw' },
  ];

  leaveStatus = [
    { name: 'Pending' },
    { name: 'Approved' },
    { name: 'Rejected' }]

  async open_dropdown() {
     const modal = await this.modalCntrl.create({
        component: LeaveTypeComponent,
        cssClass: this.db.ismobile ? 'job-detail-popup' : 'filter-popup',
        componentProps: {
          title:'Leave Type' 
        },
      });
      await modal.present();
      const val = await modal.onWillDismiss();
      // console.log(val)
      if(val && val.data){
        this.editFormValues.leave_type = val.data.name
      }
  }

  open_country_dropdown() {
    let val = {
      type: 'Country',
      fieldname: 'country',
      fieldname_value: '',
      selected_value: this.editFormValues.country,
      send_all_value: true
    }

    let selected_value = {
      doctype: "Country"
    }
    this.db.open_drop_down_options(val.type, val.fieldname, val.fieldname_value, selected_value)
  }

  datePickerChange(type, event) {
    // console.log(event.value)
    if (type == 'from_date') {
      this.editFormValues.from_date = event.value;
    } 
    else if(type == 'in_time'){
      this.editFormValues.in_time = event.value;
    }
    else {
      this.editFormValues.to_date = event.value;
    }
  }

  changeStatus(event, item) {
    item['status'] = event.detail.value;
  }

  changeDuration(event, item) {
    item['duration'] = event.detail.value;
  }

  changeReason(event, item) {
    item['reg_reason'] = event.detail.value;
  }

  validateInput(event: any) {
    const value = event.target.value;
    // Regular expression for English letters, numbers, and basic punctuation
    const regex = /^[a-zA-Z0-9\s.,!?]*$/;
    // If the value contains invalid characters (e.g., Tamil, special characters), remove them
    if (!regex.test(value)) {
      // Remove the non-English characters
      event.target.value = value.replace(/[^a-zA-Z0-9\s.,!?]/g, '');
      const text = event.target.value; // Update the model
      // console.log(text);
    }
  }

  save() { 
    this.modalCntrl.dismiss(this.editFormValues);
  }

  reg_save() {
    if (this.editFormValues.reg_reason && this.editFormValues.reg_reason == 'Others')
      if (this.editFormValues.description)
        this.modalCntrl.dismiss(this.editFormValues);
      else this.db.sendErrorMessage('Please enter the description');
    else
      this.editFormValues.reg_reason ? this.modalCntrl.dismiss(this.editFormValues) : this.db.sendErrorMessage('Please enter the any reason');
  }

  leave_req_save(){
  
         if (this.editFormValues.rejected_reason)
          this.modalCntrl.dismiss(this.editFormValues);
        else this.db.sendErrorMessage('Please enter the Rejected Reason'); 
  }

  leave_withdraw_reason(){
    if (this.editFormValues.rejected_reason)
      this.modalCntrl.dismiss(this.editFormValues);
    else this.db.sendErrorMessage('Please enter the Rejected Reason');
  }

  // regulariztion_reason(){
  //   if (this.editFormValues.reason)
  //     this.modalCntrl.dismiss(this.editFormValues);
  //   else this.db.sendErrorMessage('Please enter the Reason');
  // }

  leave_req(){
    // console.log(this.leave_preview, 'this.editFormValues');
    if(!this.editFormValues.leave_type)
      this.db.sendErrorMessage('Please enter the Leave Type');
    else if(!this.editFormValues.reason)
      this.db.sendErrorMessage('Please enter the Reason'); 
    else{
      let l_p:any= [];
      let total_leave:any = 0;
      this.leave_preview.map(res =>{
        l_p.push({
          date:res.date,
          duration:res.duration,
          count:res.duration == 'Full Day' ? '1d' :'0.5d',
          status:'Pending',
        })
        total_leave += res.duration == 'Full Day' ? 1 : 0.5;
      })
      let data={
        employee: localStorage['employee_id'],
        employee_name: localStorage['employee_name'],
        posting_date: this.posting_date,
        reason: this.editFormValues.reason,
        leave_type: this.editFormValues.leave_type,
        total_leave_days:total_leave,
        leave_preview: l_p
      }
      this.modalCntrl.dismiss(data)
      // console.log(data)
    } 
  }

  letter_req_save(){
    let flag = 0;
    this.editFormValues.name == 'Visa Letter' ? this.editFormValues.country ? flag = 1: this.db.sendErrorMessage('Please enter the Country') : flag = 1;
    if(flag == 1){
      if (this.editFormValues.remarks)
        this.modalCntrl.dismiss(this.editFormValues);
      else this.db.sendErrorMessage('Please enter the Purpose of the Letter');
  }
  }
}

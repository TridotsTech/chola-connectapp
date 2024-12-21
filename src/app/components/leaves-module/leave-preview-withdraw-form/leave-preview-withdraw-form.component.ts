import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-leave-preview-withdraw-form',
  templateUrl: './leave-preview-withdraw-form.component.html',
  styleUrls: ['./leave-preview-withdraw-form.component.scss'],
})
export class LeavePreviewWithdrawFormComponent  implements OnInit {
@Input() editFormValues: any;
@Input() title: any;
@Input() type: any;
  constructor(public db: DbService,public modalCntrl: ModalController) { }

  ngOnInit() {
    console.log(this.editFormValues,'this.editFormValues')

    this.db.select_drop_down.subscribe((res: any) => {
      this.editFormValues.leave_type = res.name
    });
  }

  LeaveType= [
    {name: 'Full Day'},
    {name: 'First Half'},
    {name: 'Second Half'}]

    regularizationReason= [
      {name: 'Forgot to Punch'},
      {name: 'On-duty'},
      {name: 'Training'},
      {name: 'Client Meeting'},
      {name: 'Others'}]

  statusType = [
    {name: 'Open'},
    {name: 'Approved'},
    {name: 'Pending'},
    {name: 'Withdraw'}
  ]

  open_dropdown() {
    let val = {
      type: 'Leave Type',
      fieldname: 'leave_type',
      fieldname_value: '',
      selected_value: this.editFormValues.leave_type,
      send_all_value: true
    }

    let selected_value = {
      doctype: "Leave Type"
    }
    this.db.open_drop_down_options(val.type, val.fieldname, val.fieldname_value, selected_value)
  }

  datePickerChange(type,event){
    if(type == 'from_date'){
      this.editFormValues.from_date = event.value;
    }else{
      this.editFormValues.to_date = event.value;
    }
  }
  
  changeStatus(event,item){
    item['status'] = event.detail.value
  }

  changeDuration(event,item){
    item['duration'] = event.detail.value
  }

  changeReason(event,item){
    item['reg_reason'] = event.detail.value
  }

  save(){
    console.log(this.editFormValues,'this.editFormValues')
    this.modalCntrl.dismiss(this.editFormValues)
  }

}

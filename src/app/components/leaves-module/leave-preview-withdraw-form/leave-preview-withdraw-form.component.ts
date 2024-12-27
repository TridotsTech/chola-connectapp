import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-leave-preview-withdraw-form',
  templateUrl: './leave-preview-withdraw-form.component.html',
  styleUrls: ['./leave-preview-withdraw-form.component.scss'],
})
export class LeavePreviewWithdrawFormComponent implements OnInit {
  @Input() editFormValues: any;
  @Input() title: any;
  @Input() type: any;
  constructor(public db: DbService, public modalCntrl: ModalController) {}

  ngOnInit() {
    console.log(this.editFormValues, 'this.editFormValues');

    this.db.select_drop_down.subscribe((res: any) => {
      this.editFormValues.leave_type = res.name;
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

  open_dropdown() {
    let val = {
      type: 'Leave Type',
      fieldname: 'leave_type',
      fieldname_value: '',
      selected_value: this.editFormValues.leave_type,
      send_all_value: true,
    };

    let selected_value = {
      doctype: 'Leave Type',
    };
    this.db.open_drop_down_options(
      val.type,
      val.fieldname,
      val.fieldname_value,
      selected_value
    );
  }

  datePickerChange(type, event) {
    console.log(event.value)
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
      console.log(text);
    }
  }

  save() {
    console.log(this.editFormValues, 'this.editFormValues');
    this.modalCntrl.dismiss(this.editFormValues);
  }

  reg_save() {
    if (this.editFormValues.reg_reason && this.editFormValues.reg_reason == 'Others')
      if (this.editFormValues.description)
        this.modalCntrl.dismiss(this.editFormValues);
      else this.db.alert('Please enter the description');
    else
      this.editFormValues.reg_reason ? this.modalCntrl.dismiss(this.editFormValues) : this.db.alert('Please enter the any reason');
  }
}

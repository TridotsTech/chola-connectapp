import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.scss'],
})
export class MarkAttendanceComponent  implements OnInit {
  @Input() selected_employee_count: any;
  @Input() selected_employees: any;
  @Output() sav_mark_data = new EventEmitter<any>();
  select_type: any;
  select_shift_type: any;
  selected_employee: any;
  select_type_error = false;
  @Input() shift_type:any;
  constructor(public db: DbService,public modalcntrl: ModalController) { }

  ngOnInit() {
    console.log(this.shift_type);
    this.selected_employee = this.selected_employee_count

    this.db.mark_employee_count.subscribe((res: any) => {
      if(res && res.status == 'Success'){
        this.selected_employee = res.message
      }
    })
  }

  attendance_type = [
    { name: "Present", value: "Present" },
    { name: "Absent", value: "Absent" },
    { name: "Half Day", value: "Half Day" },
    { name: "Work From Home", value: "Work From Home" },
  ]

  // shift_type = [
  //   { name: "Day Shift", value: "Day Shift" },
  //   { name: "General Shift", value: "General Shift" },
  //   { name: "Night Shift", value: "Night Shift" },
  //   { name: "Other Shift", value: "Other Shift" },
  // ]

  clear_filter(){
    // this.modalcntrl.dismiss('clear')
    this.sav_mark_data.emit('clear')
  }

  save(){
    let data = {
      shift: this.select_shift_type,
      attendance_type: this.select_type,
      late_entry: this.entry_types[0].selected ? 1 : 0,
      early_exit: this.entry_types[1].selected ? 1 : 0
    }
    if(this.select_type){
      this.sav_mark_data.emit(data)
      // this.modalcntrl.dismiss(data)
    }else{
      this.select_type_error = true;
    }
  }

  enable_status(eve){
    if(eve.target.value){
      this.select_type_error = false;
    }else{
      this.select_type_error = true;
    }
  }

  entry_types = [
    { name: "Late Entry", value: "Late Entry", txt: "late_entry", selected: false, type: 'check' },
    { name: "Early Exit", value: "Early Exit", txt: "early_exit", selected: false, type: 'check' }
  ]

  toggleCheckbox(data) {
    data.selected = data.selected ? false : true;
  }

}

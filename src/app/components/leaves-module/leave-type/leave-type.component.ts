import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.scss'],
})
export class LeaveTypeComponent  implements OnInit {
  leaveType:any=[];
  @Input() title:any;
  constructor(public modalCtrl: ModalController, public db: DbService) { }

  ngOnInit() {
    this.get_leave_type();
  }

  get_leave_type() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    let data = {
     "employee_id":localStorage['employee_id'],
    "posting_date":formattedDate
    };
    this.db.leave_remaining_balance(data).subscribe((res: any) => {
      console.log(res)
      this.leaveType = res.message
    },
      (error) => {
      }
    );
  }

  add(item){
    this.modalCtrl.dismiss(item);
  }

}

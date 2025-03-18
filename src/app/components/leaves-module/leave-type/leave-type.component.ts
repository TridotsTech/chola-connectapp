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
  @Input() type:any;
  @Input() datas:any;
  @Input() employee_id:any;
  @Input() value:any;
  list_values:any=[];
  constructor(public modalCtrl: ModalController, public db: DbService) { }

  ngOnInit() {
    if(!this.type){
      this.get_leave_type();
    }
    else if(this.type == 'document')
      this.get_data()
    else if(this.type == 'employee')
      this.get_data_employee()
    else if(this.type == 'emp')
      this.get_data_emp()
    else if(this.type == 'month')
      this.list_values = this.value
  }

  get_leave_type() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    let data = {
     "employee_id":this.employee_id ? this.employee_id : localStorage['employee_id'],
     "posting_date":formattedDate
    };
    this.db.leave_remaining_balance(data).subscribe((res: any) => {
      this.leaveType = res.message
    },
      (error) => {
      }
    );
  }

  get_data(){
    let data = {
      doctype: this.datas,
      page_no: 1,
      page_length: 50,
      search_text: '',
    };
    this.db.label_values(data).subscribe((res: any) => {
      console.log(res);
      this.list_values = res.message
    },
      (error) => {
        
      }
    );
  }

  get_data_employee(){
    let data = {
      l1_manager: localStorage['employee_id'],
      page_no: 1,
      page_length: 50,
      // search_text: '',
    };
    this.db.get_applicable_employees(data).subscribe((res: any) => {
      console.log(res);
      this.list_values = res.message
    },
      (error) => {
        
      }
    );
  }

  get_data_emp(){
    let data = {
      employee_id: localStorage['employee_id'],
      page_no: 1,
      page_length: 100,
    };
    this.db.get_manager_team_members(data).subscribe((res: any) => {
      console.log(res);
      this.list_values = res.message
    },
      (error) => {
        
      }
    );
  }

  add(item){
    if(!this.type){
      this.modalCtrl.dismiss(item);
    }else
      this.modalCtrl.dismiss(item,this.type);
  }

}

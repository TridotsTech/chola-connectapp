import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
@Component({
  selector: 'app-employee-attendance-filter',
  templateUrl: './employee-attendance-filter.component.html',
  styleUrls: ['./employee-attendance-filter.component.scss'],
})
export class EmployeeAttendanceFilterComponent  implements OnInit {
  branch_ : any;
  department_ : any;
  company_ : any;
  @Input() selected_company : any
  @Input() selected_department : any
  @Input() selected_branch : any
  constructor(public db : DbService,public modalCtrl : ModalController) { }

  ngOnInit() {
    this.branch_ = this.selected_branch
    this.department_ = this.selected_department
    this.company_ = this.selected_company ? this.selected_company : (this.db.default_values && this.db.default_values.default_company) ? this.db.default_values.default_company : ''
    this.db.select_drop_down.subscribe((res : any) => {
      if(res){
        // console.log(res)
        if(res.fieldname == "company"){
          this.company_ = res.name
        }else if(res.fieldname == "branch"){
          this.branch_ = res.name
        }else{
          this.department_ = res.name
        }
      }
    })
  }
  
  apply_filter(){
    let apply_data = {
      company : this.company_ ? this.company_ : "",
      branch : this.branch_ ? this.branch_ : "",
      department : this.department_ ? this.department_ : ""
    }
    this.modalCtrl.dismiss(apply_data)
  }

  clear_filter(){
    let apply_data = {
      company : "",
      branch : "",
      department : ""
    }
    this.modalCtrl.dismiss(apply_data)
  }

  clear_value(data){
    data == "branch_" ? this.branch_ = "" : data == "company_" ? this.company_ = "" : data == "department_" ? this.department_ = "" : null
  }

}

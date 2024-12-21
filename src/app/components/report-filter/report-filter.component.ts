import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';


@Component({
  selector: 'app-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.scss'],
})
export class ReportFilterComponent  implements OnInit {
  @Input() page_route: any;
  selected_department: any;
  selected_group: any;
  selected_designation: any;
  selected_employee: any;
  selected_holiday: any;

  constructor(public db: DbService,private modalcntrl: ModalController) { }

  ngOnInit() {

    this.selected_group = this.selected_group
    this.selected_department = this.selected_department
    this.selected_employee = this.selected_employee
    this.selected_designation = this.selected_designation
    this.selected_holiday = this.selected_holiday

    this.db.select_drop_down.subscribe((res : any) => {
      console.log(res)
      if(res && res.status && res.status == 'success'){
        if(res.fieldname == 'department'){
          this.selected_department = res.name != 'ALL' ? res.name : ''
        }else if(res.fieldname == 'group'){
          this.selected_group = res.name != 'ALL' ? res.name : ''
        }else if(res.fieldname == 'designation'){
          this.selected_designation = res.name != 'ALL' ? res.name : ''
        }else if(res.fieldname == 'employee'){
          this.selected_employee = res.name != 'ALL' ? res.name : ''
        }else if(res.fieldname == 'holiday_list'){
          this.selected_holiday = res.name != 'ALL' ? res.name : ''
        }
      }
    })

  }

  save(){
    let data = {
      selected_department: this.selected_department ? this.selected_department : '',
      selected_group: this.selected_group ? this.selected_group : '',
      selected_designation: this.selected_designation ? this.selected_designation : '',
      selected_employee: this.selected_employee ? this.selected_employee : '',
      selected_holiday: this.selected_holiday ? this.selected_holiday : ''
    }
    this.modalcntrl.dismiss(data)
  }

  clear_filter(){
    let data = {
      selected_department: "",
      selected_group: "",
      selected_designation: "",
      selected_employee: "",
      selected_holiday: ""
    }
    this.modalcntrl.dismiss(data)
  }

  open_drop_down_options(data,fieldname){
    this.db.open_drop_down_options2(data,fieldname,'',this.selected_department ? this.selected_department : '')
  }

}

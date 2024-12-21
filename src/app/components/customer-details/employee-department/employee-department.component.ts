import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { ModalController } from '@ionic/angular';
import { DepartmentDropdownComponent } from '../department-dropdown/department-dropdown.component';
import { FiltersComponent } from 'src/app/components/categories/filters/filters.component';

@Component({
  selector: 'app-employee-department',
  templateUrl: './employee-department.component.html',
  styleUrls: ['./employee-department.component.scss','../employee-list/employee-list.component.scss'],
})
export class EmployeeDepartmentComponent  implements OnInit {
  departments: any = [];
  selected_dept: any;
  employee_list: any = [];
  search_text: any = "";
  selected_dept_id: any;
  // departmentName:any;

  @Input() view: any;
  @Input() search_filter: any;
  @Output() go_to_detail = new EventEmitter()

  constructor(public db: DbService, public modalCtrl:ModalController) { }

  ngOnInit() {
    this.get_department()
  }

  get_department(){
    let data = {
      doctype: 'Department',
      fields: ['*'],
      filters: [['company', '=', this.db.default_values.default_company]],
    }
    this.db.get_list(data).subscribe(res => {
      console.log(res)
      if(res && res.message && res.message.length != 0){
        this.departments = res.message
        this.departments[0]['selected'] = true;
        this.selected_dept = this.departments[0].department_name
        this.get_employees(this.departments[0].name)
      }
    })
  }

  select_dept(data,i){
    this.departments.map((res,index) => {
      if(index == i){
        res.selected = true
      }else{
        res.selected = false
      }
    })
    this.selected_dept = data.department_name
    this.selected_dept_id = data.name
    this.get_employees(data.name)
  }

  search_emp(eve){
    this.search_text = eve.target.value
    this.get_employees(this.selected_dept_id)
  }

  get_employees(dept){
    let data = {
      doctype: 'Employee',
      fields: ['*'],
      filters: [['department', '=', dept],["employee_name","like",'%' +this.search_text+ '%']],
    }
    this.db.get_list(data).subscribe(res => {
      if(res && res.message && res.message.length != 0){
        this.employee_list = res.message
      }else{
        this.employee_list = [];
      }
    })
  }

  clear_txt(value){
    this.search_text = ""
    this.get_employees(this.selected_dept_id)
  }

  search_txt_value(eve){
    console.log(eve);
    this.search_text = eve
    this.get_employees(this.selected_dept_id)
  }

  search_data:any = '';

  async open_filter(eve){
    if((typeof(this.search_data) != 'string')){
      let data = Object.keys(this.search_data)
      if(data.length != 0){
        this.search_data = JSON.stringify(this.search_data);
      }
    }

    const modal = await this.modalCtrl.create({
      component: FiltersComponent,
      cssClass: this.db.ismobile ? 'job-detail-popup' : 'filter-popup',
      componentProps: {
        // supplier_id: this.supplier_id,
        search_filter: this.search_filter,
        search_data: (this.search_data && this.search_data != '' ? JSON.parse(this.search_data) : {}),
        doctype: 'Employee'
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
  }

  
  getDateDifference(startDate: Date) {
    const endDate = new Date(); // Current date

    const start = new Date(startDate);
    const end = new Date(endDate);

    let yearsDiff = end.getFullYear() - start.getFullYear();
    let monthsDiff = end.getMonth() - start.getMonth();

    // Adjusting months and years if necessary
    if (monthsDiff < 0) {
      yearsDiff--;
      monthsDiff += 12;
    }

    return `${yearsDiff} yr, ${monthsDiff} m`;
  }

  add_wish(event, data) {
    event.stopPropagation();
    data['fav_employee'] = !data['fav_employee'];
  }

  go_detail(data, index) {
    this.go_to_detail.emit({ item: data, index: index });
  }

  async open_department_filter() {

    const modal = await this.modalCtrl.create({
      component: DepartmentDropdownComponent,
      cssClass: 'department-filter-popup',
      componentProps: {
        departments:this.departments
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if(data && data.item){
      this.select_dept(data.item, data.index);
    }
  }

}

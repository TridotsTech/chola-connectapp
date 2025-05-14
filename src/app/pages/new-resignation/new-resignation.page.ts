import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-resignation',
  templateUrl: './new-resignation.page.html',
  styleUrls: ['./new-resignation.page.scss'],
})
export class NewResignationPage implements OnInit {

    resignation_form: any = FormGroup;
    submitted = false;
    resignationDetails: any;
    resignationId: any;
    workflow_list:any=[];
  constructor(public modalCntrl:ModalController,public db: DbService,private formBuilder: FormBuilder,private nav: NavController,private route: ActivatedRoute) {

   }

  ngOnInit() {
    this.get_emp_info()
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    this.route.params.subscribe(res => {
      if(res && res['id']){
        this.resignationId = res['id'];
        this.getresignationDetails(res['id']);
        this.get_workflow_states(res['id']);
      }
    })

    this.resignation_form = this.formBuilder.group({
      employee: new FormControl('',[Validators.required]),
      employee_name: new FormControl('',[Validators.required]),
      custom_date_of_joining: new FormControl(''),
      custom_total_working_days: new FormControl(''),
      company: new FormControl('',[Validators.required]),
      custom_l1_manager: new FormControl(''),
      custom_l1_manager_name: new FormControl(''),
      designation: new FormControl(''),
      custom_notice_period: new FormControl(''),
      custom_reason_for_leaving: new FormControl('',[Validators.required]),
      custom_personal_email_id: new FormControl(''),
      employee_grade: new FormControl(''),
      custom_date_of_resignation_hr: new FormControl(''),
      custom_attachment: new FormControl(''),
    });

    this.resignation_form.get('employee').setValue(this.db.employee_img.name)
    this.resignation_form.get('employee_name').setValue(this.db.employee_img.employee_name)
    this.resignation_form.get('employee_grade').setValue(this.db.employee_img.grade)
    // this.resignation_form.get('custom_date_of_joining').setValue(this.db.employee_img.date_of_joining)
  }

  get employee_id(){
    return this.resignation_form.get('employee');
  }

  get employee_name(){
    return this.resignation_form.get('employee_name');
  }

  get company(){
    return this.resignation_form.get('company');
  }

  get custom_reason_for_leaving(){
    return this.resignation_form.get('custom_reason_for_leaving');
  }

  getresignationDetails(id){

  }

  get_workflow_states(id){
    let data = {
      doctype: 'Resignation',
      docname: id
    }
    this.db.get_workflow_states(data).subscribe(res => {
      console.log(res)
      if(res && res.message && res.message.length != 0){
        this.workflow_list = res.message;
      }
    })
  }

  get_emp_info(){
    let data = {
      employee: localStorage['employee_id'],
    }
    this.db.get_employee_details(data).subscribe(res => {
      console.log(res)
      if(res.message){
        this.resignation_form.get('custom_date_of_joining').setValue(res.message.custom_date_of_joining)
        this.resignation_form.get('custom_l1_manager_name').setValue(res.message.custom_l1_manager_name)
        this.resignation_form.get('custom_total_working_days').setValue(res.message.custom_total_working_days)
        this.resignation_form.get('custom_l2_manager_name').setValue(res.message.custom_l2_manager_name)
        this.resignation_form.get('employee_grade').setValue(res.message.employee_grade)
      }
      
    })
  }

}

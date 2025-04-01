import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { LeaveTypeComponent } from 'src/app/components/leaves-module/leave-type/leave-type.component';

@Component({
  selector: 'app-performance-evaluation',
  templateUrl: './performance-evaluation.page.html',
  styleUrls: ['./performance-evaluation.page.scss'],
})
export class PerformanceEvaluationPage implements OnInit {
  evaluation_form: any = FormGroup;
  submitted = false;
  evaluationDetails: any = [];
  rating_value = 0;
  performanceDetails: any;
  performanceId: any;
  save_only = false;
  workflow_list:any=[];
  constructor(public modalCntrl:ModalController,public db: DbService,private formBuilder: FormBuilder,private nav: NavController,private route: ActivatedRoute) { }

  ngOnInit() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    this.route.params.subscribe(res => {
      if(res && res['id']){
        this.performanceId = res['id'];
        this.getPerformanceDetails(res['id']);
        this.get_workflow_states(res['id']);
      }
    })

    this.evaluation_form = this.formBuilder.group({
      employee_id: new FormControl('',[Validators.required]),
      employee_name: new FormControl('',[Validators.required]),
      probation_extended: new FormControl('',[Validators.required]),
      evaluator_id: new FormControl(''),
      evaluation_date: new FormControl('',[Validators.required]),
      overall_comments: new FormControl('',[Validators.required]),
      no_more_extention: new FormControl(0),
      grade: new FormControl(''),
      confirmation_due_date: new FormControl(''),
      probation_days: new FormControl(''),
      band: new FormControl(''),
      date_of_joining: new FormControl(''),
    });

    this.db.select_drop_down.subscribe((res: any) => {
      this.evaluation_form.patchValue({
        employee_id: res.name,
        employee_name: res.label
      });
      this.getEmployee_detail(res.name);
    });

    this.evaluation_form.patchValue({
      evaluation_date: formattedDate,
    });

    // if(!this.performanceId){
      this.getPerformanceDetailList();
    // }
  }

  ionViewWillEnter(){
    // if(!this.evaluation_form){
    //   this.save_only = true;
    // }
  }

  get_workflow_states(id){
    let data = {
      doctype: 'Probation Evaluation',
      docname: id
    }
    this.db.get_workflow_states(data).subscribe(res => {
      console.log(res)
      if(res && res.message && res.message.length != 0){
        this.workflow_list = res.message;
      }
    })
  }

  getPerformanceDetails(id){
    let data = {
      doctype: 'Probation Evaluation',
      name: id
    }
    this.db.doc_detail(data).subscribe(res => {
      console.log(res)
      if(res && res.message && res.message.length != 0 && res.status == 'Success'){
        if(res.message[1]){
          this.performanceDetails = res.message[1];
          let key = Object.keys(this.performanceDetails);
          if(key && key.length != 0){
            key.map(resK => {
              this.evaluation_form.patchValue({ [resK]: this.performanceDetails[resK] });
            })
          }
          this.evaluationDetails = this.performanceDetails.evaluation_details
          if(this.performanceDetails.workflow_state == 'Draft')
            this.save_only = true;
        }
      }
    })
  }

  getEmployee_detail(id){
    let data = {
      doctype: 'Employee',
      name: id
    }
    this.db.doc_detail(data).subscribe(res => {
      console.log(res)
      if(res && res.message && res.message.length != 0 && res.status == 'Success'){
        if(res.message[1]){
          this.evaluation_form.patchValue({
            evaluator_id: res.message[1].reports_to
          })
        }
      }
    })
  }

  get employee_id(){
    return this.evaluation_form.get('employee_id');
  }

  get employee_name(){
    return this.evaluation_form.get('employee_name');
  }

  get probation_extended(){
    return this.evaluation_form.get('probation_extended');
  }

  get evaluator_id(){
    return this.evaluation_form.get('evaluator_id');
  }

  get evaluation_date(){
    return this.evaluation_form.get('evaluation_date');
  }

  get overall_comments(){
    return this.evaluation_form.get('overall_comments');
  }

  get no_more_extention(){
    return this.evaluation_form.get('no_more_extention');
  }

  probationType = [
    {name: 'Yes'},
    {name: 'No'}
  ]

  async open_dropdown() {
    const modal = await this.modalCntrl.create({
        component: LeaveTypeComponent,
        cssClass: this.db.ismobile ? 'job-detail-popup' : 'filter-popup',
        componentProps: {
          title:'Employee',
          type:'employee' 
        },
      });
      await modal.present();
      const val = await modal.onWillDismiss();
      console.log(val)
      if(val && val.data){
        this.evaluation_form.get('employee_id').setValue(val.data.name)
        this.evaluation_form.get('employee_name').setValue(val.data.employee_name)
        this.evaluation_form.get('grade').setValue(val.data.grade)
        this.evaluation_form.get('date_of_joining').setValue(val.data.date_of_joining)
        this.evaluation_form.get('band').setValue(val.data.custom_band)
        this.evaluation_form.get('confirmation_due_date').setValue(val.data.custom_confirmation_due_date)
        this.evaluation_form.get('probation_days').setValue(val.data.custom_probation_days)
        // this.evaluation_form.get('total_capitalized_value').setValue(val.data.custom_probation_extension_end_date)
        // this.evaluation_form.get('total_capitalized_value').setValue(val.data.custom_probation_extension_start_date)
      }
    // let val = {
    //   type: 'Employee',
    //   fieldname: 'employee',
    //   fieldname_value: '',
    //   selected_value: this.evaluation_form.value.employee_code,
    //   send_all_value: true
    // }

    // let selected_value = {
    //   doctype: "Employee"
    // }
    // this.db.open_drop_down_options(val.type, val.fieldname, val.fieldname_value, selected_value)
  }

  datePickerChange(fieldname,event){
    // this.evaluation_form.value[fieldname] = event.value;
    this.evaluation_form.patchValue({
      evaluation_date: event.value,
    });
  }

  changeExtension(event){
    // console.log(event,'event')

    this.evaluation_form.patchValue({
      no_more_extention: event.detail.checked ? 1 : 0
    })
  }

  evaluationDetailsType = [
    {name: 'Parameter'},
    {name: 'Rating'},
  ]

  getPerformanceDetailList(){
    let data = {
      doctype: 'Probation Evaluation Parameter',
      fields: ["name","parameter","rating","description"]
    }
    this.db.get_list(data).subscribe(res => {
      if(res && res.message && res.message.length != 0){
        this.evaluationDetails = res.message;
      }else{
        this.evaluationDetails = [];
      }
    })
  }

  get_rating(item,rating){
    // this.rating_value = rating;
    item['rating'] = rating
   
  }

  submit_approval(type){
    let data:any={
       doctype :'Probation Evaluation',
       workflow_state:type
    }
    if(this.performanceDetails && this.performanceDetails.name){
      data.name = this.performanceDetails.name;
    }
    this.db.inset_docs({data: data}).subscribe(res => {
      if (res && res.message && res.message.status == 'Success') {
        type == 'Rejected' ? this.db.sendSuccessMessage("Probation Evaluation Rejected successfully!") :this.db.sendSuccessMessage("Probation Evaluation Approved successfully!")
        setTimeout(() => {
          this.nav.back()
        }, 500);
      }else{
        if(res._server_messages){
          let d = JSON.parse(res._server_messages)
          let f = JSON.parse(d[0])
          this.db.sendErrorMessage(f.message)
        }else{
          this.db.sendErrorMessage(res.message.message)
        }
      }
    })
  }

  submit(){
    this.submitted = true;
    let data: any = {};
    if(this.evaluation_form.status == 'VALID'){
      console.log(this.evaluation_form,'this.evaluation_form')
      data = this.evaluation_form.value
      data.doctype = 'Probation Evaluation'

      if(this.evaluationDetails && this.evaluationDetails.length != 0){
        data.evaluation_details = this.evaluationDetails;
      }

      if(this.performanceDetails && this.performanceDetails.name){
        data.name = this.performanceDetails.name;
      }

      this.save_only ? data.workflow_state = 'Awaiting Approval' : data.workflow_state = 'Draft'

      this.db.inset_docs({data: data}).subscribe(res => {
        if (res && res.message && res.message.status == 'Success') {
          if(data.workflow_state == 'Awaiting Approval'){
          this.db.sendSuccessMessage("Probation Evaluation Send For Approval successfully!")
          setTimeout(() => {
            this.nav.back()
          }, 500);
        }
        else
          this.db.sendSuccessMessage("Probation Evaluation created successfully!")

          this.performanceDetails = res.message.data;
          this.save_only = !this.save_only;
        }else{
          if(res._server_messages){
            let d = JSON.parse(res._server_messages)
            let f = JSON.parse(d[0])
            this.db.sendErrorMessage(f.message)
          }else{
            this.db.sendErrorMessage(res.message.message)
          }
        }
      })
    }
  }

}

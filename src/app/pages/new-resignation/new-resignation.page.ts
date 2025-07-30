import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController, NavController, LoadingController } from '@ionic/angular';
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
    attachment_file: any = {};
    categoryfile: any;
    categoryimagedata: any;
  constructor(public modalCntrl:ModalController,public db: DbService,private formBuilder: FormBuilder,private nav: NavController,private route: ActivatedRoute,public loadingCtrl: LoadingController) {

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
      custom_l2_manager: new FormControl(''),
      custom_l2_manager_name: new FormControl(''),
      custom_hr_manager_name: new FormControl(''),
      custom_hr_manager: new FormControl(''),
      designation: new FormControl(''),
      custom_notice_period: new FormControl(''),
      custom_reason_for_leaving: new FormControl('',[Validators.required]),
      custom_personal_email_id: new FormControl(''),
      custom_official_email_id: new FormControl(''),
      employee_grade: new FormControl(''),
      custom_date_of_resignation_hr: new FormControl('', [Validators.required]),
      custom_relieving_date_as_per_policy: new FormControl(''),
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

  get custom_date_of_resignation_hr(){
    return this.resignation_form.get('custom_date_of_resignation_hr');
  }

  get custom_attachment(){
    return this.resignation_form.get('custom_attachment');
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

  changeListener($event: any) {
    this.base64($event.target);
  }

  async base64(inputValue: any): Promise<void> {

    const loading = await this.loadingCtrl.create({
      message: 'Uploading File...',
    });
    loading.present();

    if (inputValue.files && inputValue.files.length > 0) {
      var file: File = inputValue.files[0];
      var file_size = inputValue.files[0].size;
      this.categoryfile = file.name;
      var myReader: FileReader = new FileReader();

      myReader.onloadend = (e) => {
        this.categoryimagedata = myReader.result;
        // Push file name

        let img_data = {
          file_name: this.categoryfile,
          content: this.categoryimagedata,
        };

        let array_image: any = [];
        array_image.push(img_data);

        if (file_size <= 2000000) {

          let img_data = {
            file_name: this.categoryfile,
            content: this.categoryimagedata,
          };
          // this.attachment_file = img_data;
          this.upload_file(img_data);
        } else if (file_size > 2000000) {
          this.loadingCtrl.dismiss();
          this.db.alert('Please Upload Files Below Size Of 2MB...!');
        } else if (file_size == 0) {
          // loader.dismiss()
          this.loadingCtrl.dismiss();
        }
        console.log(img_data);
      };
      myReader.readAsDataURL(file);
    }else{
      this.loadingCtrl.dismiss();
    }
  }

  async upload_file(img_data) {
    let data = {
      file_name: img_data.file_name,
      content: img_data.content,
      is_private: 0,
      doctype: 'File',
      decode: true,
    };
    this.db.inset_docs({ data: data }).subscribe((res) => {
      this.loadingCtrl.dismiss();
      if (res && res.message && res.message.status == 'Success') {
        this.attachment_file = res.message.data
        // Update form control with file URL
        if (this.attachment_file && this.attachment_file.file_url) {
          this.resignation_form.get('custom_attachment').setValue(this.attachment_file.file_url);
        }
        this.db.sendSuccessMessage('File Uploaded Successfully')
      } else {
        this.db.alert('Something went wrong try again later');
      }
    });
  }

  submit() {
    this.submitted = true;
    if (this.resignation_form.valid) {
      let data: any = {};
      data = this.resignation_form.value
      data.doctype = 'Employee Separation'
      data.employee = localStorage['employee_id']
      if (this.attachment_file && this.attachment_file.file_url) {
        data.custom_attachment = this.attachment_file.file_url
      }
      
      // Call API to submit resignation
      this.db.inset_docs({ data: data }).subscribe(
        res => {
          if (res && res.message && res.message.status == 'Success') {
            this.db.alert('Resignation submitted successfully');
            this.nav.back();
          }
          if(res._server_messages){
            let d = JSON.parse(res._server_messages)
            let f = JSON.parse(d[0])
            this.db.sendErrorMessage(f.message)
          }else{
            this.db.sendErrorMessage(res.message.message)
          }
        },
        error => {
          console.error('Error submitting resignation:', error);
          this.db.alert('Error submitting resignation. Please try again.');
        }
      );
    } else {
      console.log('Form is invalid');
      this.db.alert('Please fill all required fields');
    }
  }

  get_emp_info(){
    let data = {
      employee: localStorage['employee_id'],
    }
    this.db.get_employee_details(data).subscribe(res => {
      console.log(res)
      if(res.message){
        this.resignation_form.get('custom_date_of_joining').setValue(res.message.custom_date_of_joining)
        this.resignation_form.get('company').setValue(res.message.company)
        this.resignation_form.get('custom_l1_manager').setValue(res.message.custom_l1_manager)
        this.resignation_form.get('custom_l1_manager_name').setValue(res.message.custom_l1_manager_name)
        this.resignation_form.get('custom_l2_manager').setValue(res.message.custom_l2_manager)
        this.resignation_form.get('custom_l2_manager_name').setValue(res.message.custom_l2_manager_name)
        this.resignation_form.get('custom_hr_manager').setValue(res.message.custom_hr_manager)
        this.resignation_form.get('custom_hr_manager_name').setValue(res.message.custom_hr_manager_name)
        this.resignation_form.get('custom_notice_period').setValue(res.message.custom_notice_period)
        this.resignation_form.get('custom_official_email_id').setValue(res.message.custom_official_email_id)
        this.resignation_form.get('custom_relieving_date_as_per_policy').setValue(res.message.custom_relieving_date_as_per_policy)
        this.resignation_form.get('custom_total_working_days').setValue(res.message.custom_total_working_days)
        this.resignation_form.get('employee_grade').setValue(res.message.employee_grade)
      }
      
    })
  }

}

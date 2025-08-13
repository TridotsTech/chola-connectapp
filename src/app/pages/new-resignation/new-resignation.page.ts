import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PdfViewerPage } from 'src/app/pages/Go1-onsite/pdf-viewer/PdfViewerPage';
import { ShowImageComponent } from 'src/app/components/show-image/show-image.component';

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

  constructor(public alertController:AlertController,public modalCntrl:ModalController,public db: DbService,private formBuilder: FormBuilder,private nav: NavController,private route: ActivatedRoute,public loadingCtrl: LoadingController) {

   }

  ngOnInit() {
    this.get_emp_info()
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const year = tomorrowDate.getFullYear();
    const month = String(tomorrowDate.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrowDate.getDate()).padStart(2, '0');
    const tomorrowFormattedDate = `${year}-${month}-${day}`;

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
      employee_grade_id: new FormControl(''),
      custom_date_of_resignation_hr: new FormControl(tomorrowFormattedDate, [Validators.required]),
      custom_relieving_date_as_per_policy: new FormControl(''),
      custom_attachment: new FormControl(''),
      custom_resignee_comment: new FormControl(''),
      custom_declaration: new FormControl(1),
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

  get custom_declaration(){
    return this.resignation_form.get('custom_declaration');
  }

  getresignationDetails(id){
    this.db.doc_detail({name: id,doctype: 'Employee Separation'}).subscribe(res => {
        if(res.message && res.message[0].status == 'Success'){
          this.resignationDetails=res.message[1]
          // console.log(this.resignationDetails)
          
          // Set form values from resignation details
          if(this.resignationDetails) {
            this.resignation_form.patchValue({
              employee: this.resignationDetails.employee || '',
              employee_name: this.resignationDetails.employee_name || '',
              custom_date_of_joining: this.resignationDetails.custom_date_of_joining || '',
              custom_total_working_days: this.resignationDetails.custom_total_working_days || '',
              company: this.resignationDetails.company || '',
              custom_l1_manager: this.resignationDetails.custom_l1_manager || '',
              custom_l1_manager_name: this.resignationDetails.custom_l1_manager_name || '',
              custom_l2_manager: this.resignationDetails.custom_l2_manager || '',
              custom_l2_manager_name: this.resignationDetails.custom_l2_manager_name || '',
              custom_hr_manager_name: this.resignationDetails.custom_hr_manager_name || '',
              custom_hr_manager: this.resignationDetails.custom_hr_manager || '',
              designation: this.resignationDetails.designation || '',
              custom_notice_period: this.resignationDetails.custom_notice_period || '',
              custom_reason_for_leaving: this.resignationDetails.custom_reason_for_leaving || '',
              custom_personal_email_id: this.resignationDetails.custom_personal_email_id || '',
              custom_official_email_id: this.resignationDetails.custom_official_email_id || '',
              employee_grade: this.resignationDetails.employee_grade || '',
              employee_grade_id: this.resignationDetails.employee_grade || '',
              custom_date_of_resignation_hr: this.resignationDetails.custom_date_of_resignation_hr || '',
              custom_relieving_date_as_per_policy: this.resignationDetails.custom_relieving_date_as_per_policy || '',
              custom_resignee_comment: this.resignationDetails.custom_resignee_comment || '',
              custom_declaration: this.resignationDetails.custom_declaration || 0,
              custom_attachment: this.resignationDetails.custom_attachment || ''
            });
          }
        }
    })

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
      delete data.designation
      
      
      // Call API to submit resignation
      this.db.inset_docs({ data: data }).subscribe(
        res => {
          if (res && res.message && res.message.status == 'Success') {
            // this.db.alert('Resignation submitted successfully');
            this.nav.back();
          }
          if(res._server_messages){
            let d = JSON.parse(res._server_messages)
            let f = JSON.parse(d[0])
            this.db.sendErrorMessage(f.message)
          }else{
            this.db.sendSuccessMessage(res.message.message)
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

  async submit_data() {
    const alert = await this.alertController.create({
      header: 'Submit',
      message: 'Are you sure do you want to Submit..?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            this.alertController.dismiss();
          },
        },
        {
          text: 'Ok',
          handler: () => {
            var data={
              name: this.resignationDetails.name,
              doctype:'Employee Separation',
              docstatus: 1,
              custom_declaration: this.resignation_form.value.custom_declaration
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
                  this.db.sendSuccessMessage(res.message.message)
                }
              },
              error => {
                console.error('Error submitting resignation:', error);
                this.db.alert('Error submitting resignation. Please try again.');
              }
            );
            // this.submit();
          },
        },
      ],
    });
    await alert.present();
    
  }

  onDeclarationChange(event: any) {
    const isChecked = event.detail.checked;
    this.resignation_form.get('custom_declaration').setValue(isChecked ? 1 : 0);
  }

  onResignationDateChange() {
    const resignationDate = this.resignation_form.get('custom_date_of_resignation_hr').value;
    const noticePeriod = this.resignation_form.get('custom_notice_period').value;
    
    if (resignationDate && noticePeriod) {
      const relievingDate = this.calculateRelievingDate(resignationDate, noticePeriod);
      this.resignation_form.get('custom_relieving_date_as_per_policy').setValue(relievingDate);
    }
  }

  calculateRelievingDate(resignationDate: string, noticePeriod: number): string {
    const resDate = new Date(resignationDate);
    const relievingDate = new Date(resDate);
    relievingDate.setDate(relievingDate.getDate() + noticePeriod);
    
    const year = relievingDate.getFullYear();
    const month = String(relievingDate.getMonth() + 1).padStart(2, '0');
    const day = String(relievingDate.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  get_emp_info(){
    let data = {
      employee: localStorage['employee_id'],
    }
    this.db.get_employee_details(data).subscribe(res => {
      // console.log(res)
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
        this.resignation_form.get('custom_relieving_date_as_per_policy').setValue(res.message.relieving_date_as_per_policy)
        this.resignation_form.get('custom_total_working_days').setValue(res.message.custom_total_working_days)
        this.resignation_form.get('employee_grade').setValue(res.message.employee_grade_id)
        this.resignation_form.get('employee_grade_id').setValue(res.message.employee_grade)
        this.resignation_form.get('designation').setValue(res.message.designation)
        this.resignation_form.get('custom_personal_email_id').setValue(res.message.custom_personal_email_id)

        if(res.message.resignation_id){
          this.resignationId = res.message.resignation_id
          this.getresignationDetails(res.message.resignation_id)
        }

        // Calculate initial relieving date if resignation date is set
        this.onResignationDateChange();
      }
      
    })
  }

  async viewAttachment(event: Event) {
    event.stopPropagation(); // Prevent triggering any parent click events
    
    const attachmentUrl = this.resignationDetails?.custom_attachment || this.attachment_file?.file_url;
    
    if (!attachmentUrl) {
      this.db.alert('No attachment available');
      return;
    }

    const fileUrl = attachmentUrl.includes('/files/') ? this.db.product_img(attachmentUrl) : attachmentUrl;
    const fileExtension = attachmentUrl.split('.').pop()?.toLowerCase();
    
    // Check if it's an image file
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const isImage = imageExtensions.includes(fileExtension || '');
    
    if (isImage) {
      // Open image viewer
      const modal = await this.modalCntrl.create({
        component: ShowImageComponent,
        cssClass: 'web_site_form',
        componentProps: {
          image: fileUrl,
          delete_btn: false
        }
      });
      await modal.present();
    } else {
      // Open PDF viewer for PDFs and other documents
      const modal1 = await this.modalCntrl.create({
        component: PdfViewerPage,
        cssClass: this.db.ismobile ? '' : 'web_site_form',
        componentProps: {
          image: fileUrl,
          modalView: true
        }
      });
      await modal1.present();
    }
  }

  getAttachmentFileName() {
    if (this.resignationDetails?.custom_attachment) {
      return this.resignationDetails.custom_attachment.split('/').pop() || 'View Attachment';
    } else if (this.attachment_file?.file_name) {
      return this.attachment_file.file_name.replaceAll('/files/', '');
    }
    return 'Upload Attachment';
  }

  hasAttachment() {
    return !!(this.resignationDetails?.custom_attachment || this.attachment_file?.file_url);
  }

}

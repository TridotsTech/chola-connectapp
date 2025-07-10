import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-refer-friend-form',
  templateUrl: './refer-friend-form.component.html',
  styleUrls: ['./refer-friend-form.component.scss'],
})
export class ReferFriendFormComponent  implements OnInit {
@Input() jobReferralDetail: any;
refer_form: any = FormGroup;
submitted = false;
categoryfile: any;
categoryimagedata: any;
multiple_array: any = {};
maxDate: string = '';
  constructor(public modalCntrl: ModalController,private formBuilder: FormBuilder,public loadingCtrl: LoadingController,public db: DbService) { }

  // Custom validator to check if person is at least 18 years old
  ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Don't validate if empty (required validator will handle this)
    }
    
    const birthDate = new Date(control.value);
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    
    if (birthDate > eighteenYearsAgo) {
      return { underage: true };
    }
    
    return null;
  }

  ngOnInit() {
    console.log(this.jobReferralDetail,'this.jobReferralDetail')
    
    // Calculate max date (18 years ago from today)
    const today = new Date();
    const maxDateObj = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.maxDate = maxDateObj.toISOString().split('T')[0];

    this.refer_form = this.formBuilder.group({
      // reference_type: new FormControl('', Validators.required),
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      // designation_type: new FormControl('', Validators.required),
      // relationship: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      contact_number: new FormControl('', Validators.required),
      date_of_birth: new FormControl('', [Validators.required, this.ageValidator]),
      friend_image: new FormControl(''),
    })
  }

  get reference_type(){
    return this.refer_form.get('reference_type')
  }

  get first_name(){
    return this.refer_form.get('first_name')
  }

  get last_name(){
    return this.refer_form.get('last_name')
  }

  get designation_type(){
    return this.refer_form.get('designation_type')
  }

  get relationship(){
    return this.refer_form.get('relationship')
  }

  get email(){
    return this.refer_form.get('email')
  }

  get contact_number(){
    return this.refer_form.get('contact_number')
  }

  get date_of_birth(){
    return this.refer_form.get('date_of_birth')
  }

  get friend_image(){
    return this.refer_form.get('friend_image')
  }

  getBeforeDays(date){
    const givenDate = new Date(date);
    const currentDate = new Date();
    const diffInTime = currentDate.getTime() - givenDate.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return '1 day ago';
    } else {
      return `${diffInDays} days ago`;
    }
  }

  referenceType = [
    {name: 'Example1'},
    {name: 'Example2'},
    {name: 'Example3'},
  ]

  designationType = [
    {name: 'Accountant'},
    {name: 'Developer'},
    {name: 'Testing'},
  ]

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
          // this.multiple_array = img_data;
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
        this.multiple_array = res.message.data
        this.db.sendSuccessMessage('Image Uploaded Successfully')
      } else {
        this.db.alert('Something went wrong try again later');
      }
    });
  }

  submit(){
    this.submitted = true;
    console.log(this.refer_form.value)
    if(this.refer_form.status == 'VALID'){
      let data = {
        jobname: this.jobReferralDetail.name,
        ref_details: {
          first_name: this.refer_form.value.first_name,
          last_name: this.refer_form.value.last_name,
          email: this.refer_form.value.email,
          contact_no: this.refer_form.value.contact_number,
          custom_date_of_birth: this.refer_form.value.date_of_birth,
          resume: this.multiple_array.file_url
        }
      }
      this.db.create_referral_entry(data).subscribe(res => {
        console.log(res)
        if(res && res.message && res.message.status == 'success'){
          this.modalCntrl.dismiss();
          this.db.sendSuccessMessage('Referral Sent Successfully')
        }else if(res && res.message && res.message.status == 'failed')
          this.db.alert(res.message.message)
        else{
          this.db.alert('Something went wrong try again later')
        }
      },error => {
        if(error && error.error && error.error._server_messages){
          let b = JSON.parse(error.error._server_messages);
          let e = JSON.parse(b)
          this.db.alert(e.message)
        }
      })
    }
  }

}

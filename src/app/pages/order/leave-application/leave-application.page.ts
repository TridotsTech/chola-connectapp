import { Component, OnInit, Input } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { LeaveTypeComponent } from 'src/app/components/leaves-module/leave-type/leave-type.component';

@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.page.html',
  styleUrls: ['./leave-application.page.scss', '../../../components/forms/wizard-forms/wizard-forms.component.scss'],
})
export class LeaveApplicationPage implements OnInit {
  @Input() inputEmployeeDetails: any;
  @Input() editFormValues: any;
  @Input() selectedTabSec: any;
  @Input() model:any;
  leave_id: any;
  skeleton = false;
  leave_detail: any;
  employee_details: any;
  leave_dashboard: any = []
  leave_form;
  submitted = false;
  sub: any
  leave_preview: any = [];
  save_only = false;
  res_name:any;
  overlapp_msg:any;
  is_maternity = 0;
  image:any;
  constructor(public loadingCtrl:LoadingController,public modalCtrl:ModalController, public db: DbService, private route: ActivatedRoute, public router: Router, private formBuilder: FormBuilder,private nav:NavController,public alertController: AlertController) {
    this.leave_form = this.formBuilder.group({
      leave_type: new FormControl('', [Validators.required]),
      reason: new FormControl('', [Validators.required]),
      total_leave_days: new FormControl('', [Validators.required]),
      from_date: new FormControl('', [Validators.required,Validators.min(this.db.employee_info.date_of_joining)]),
      to_date: new FormControl('', [Validators.required,Validators.min(this.db.employee_info.date_of_joining)]),
    });
  }

  ionViewWillEnter(){
    if(!this.editFormValues){
      this.save_only = true;
    }
    this.db.drop_down_value = {};
    this.db.parentDoctype = 'Leave Request';
  }

  ngOnInit() {

    this.route.params.subscribe((res: any) => {
      
      if(!this.inputEmployeeDetails){
        if(res && res['id'] && res['name']){
          this.leave_id = res['id']+'/'+res['name'];
          this.leave_details(res['id']+'/'+res['name'])
        }else if (res && res['id']) {
          this.leave_id = res['id'];
          this.leave_details(res['id'])
        }else {
          if (typeof window != 'undefined' && localStorage && localStorage['employee_id']) {
            this.get_employee_details(localStorage['employee_id'])
            this.leave_dash_board(localStorage['employee_id'])
            this.get_leave_approver()
          }
        }
      }
    })

    this.sub = this.db.select_drop_down.subscribe((res: any) => {
      this.db.drop_down_value['leave_type'] = res.name ? res.name : res.label
      this.db.drop_down_value['leave_type_label'] = res.label
      this.leave_form['leave_type'].setValue(res.name)
    });

    if(this.inputEmployeeDetails){
      this.leave_details(this.inputEmployeeDetails.name)
      this.leave_dash_board(this.inputEmployeeDetails.employee)
      this.get_employee_details(this.inputEmployeeDetails.employee)
    }

    if(this.editFormValues){
      this.save_only = false;
      this.db.drop_down_value['leave_type'] = this.editFormValues.leave_type ? this.editFormValues.leave_type : ''
      this.leave_form.patchValue(this.editFormValues)
      this.leave_preview = this.editFormValues.leave_preview ? this.editFormValues.leave_preview : []
    }
  }

  durationType = [
    {name: 'Full Day'},
    {name: 'First Half'},
    {name: 'Second Half'},
  ]

  changeDuration(item,event){
    item['duration'] = event.detail.value
    item['count'] = event.detail.value == 'Full Day' ? '1d' : '0.5d'
    let total_leave_days = 0;
    this.leave_preview.map(res =>{
      if(res.count != 'Holiday' && res.duration != "")
        total_leave_days+= res.duration == 'Full Day' ? 1 : 0.5;
    })
    this.leave_form.get('total_leave_days').setValue(total_leave_days)
  }

  leave_details(id) {
    let data = {
      doctype: this.selectedTabSec == 'Pending' || this.selectedTabSec == 'Awaiting Approval' ? "Leave Request" : "Leave Application",
      name: id
    }
    this.db.doc_detail(data).subscribe(res => {
      this.skeleton = false;
      if (res && res.message && res.message.length != 0 && res.message[0].status == "Success") {
        this.leave_detail = res.message[1];
        for (let key in this.leave_detail) {
          let array = ['leave_type', 'reason', 'from_date', 'to_date', 'half_day', 'half_day_date'];
          let find = array.find(res=>{ return res == key})
          if(find){
            this.leave_form.get(key).setValue(this.leave_detail[key]);
            if(key == 'leave_type'){
              this.db.drop_down_value['leave_type'] = this.leave_detail[key]
              this.db.drop_down_value['leave_type_label'] = this.leave_detail[key]
            }
            if(key == 'half_day' && this.leave_detail[key]){
              this.half_day_hide = false;
            }
          }
        }
        this.get_employee_details(this.leave_detail.employee)
        this.leave_dash_board(this.leave_detail.employee)
      } else {
        this.leave_detail = undefined;
      }
    })
  }

  get_employee_details(name) {
    let data = {
      doctype: "Employee",
      name: name
    }
    this.db.doc_detail(data).subscribe(res => {
      this.skeleton = false;
      if (res && res.message && res.message.length != 0 && res.message[0].status == "Success") {
        this.employee_details = res.message[1]
      }
    })
  }

  leave_dash_board(id) {
    // let data = {
    //   employee_id: id,
    //   status: this.status,
    //   year: this.currentYear
    // }

    let data = {
      "search_data": {},
      "page_no": 1,
      "page_length": 20,
      "date": this.db.current_event_date,
      "employee_id": id,
      "dashboard_name": "Employee Leave Application Dashboard"
    }


    this.db.leave_details(data).subscribe(res => {
      this.skeleton = false;
      if (res && res.message && res.message.dashboard && res.message.dashboard.length > 0) {
        // console.log(res.message.data,"res.message.data")
        res.message.dashboard.splice(3, 1)
        this.leave_dashboard = res.message.dashboard

      } else {
        this.leave_dashboard = [];
        // this.no_employee_details = true
      }
    })
  }

  get leave_type() {
    return this.leave_form.get('leave_type');
  }

  get reason() {
    return this.leave_form.get('reason');
  }

  get from_date() {
    return this.leave_form.get('from_date');
  }

  get to_date() {
    return this.leave_form.get('to_date');
  }

  get half_day() {
    return this.leave_form.get('half_day');
  }

  get half_day_date() {
    return this.leave_form.get('half_day_date');
  }

  leave_approver: any;
  leave_approver_name: any;
  get_leave_approver() {
    let data = {
      doctype: 'Leave Applicaion',
      employee_id: localStorage['employee_id'],
    };
    this.db.get_leave_approver(data).subscribe((res) => {
      if (res && res.status && res.status == 'Success') {
        let leave_approver = res.message;
        this.leave_approver = leave_approver.leave_approver;
        this.leave_approver_name = leave_approver.leave_approver_name;
      } else {
        this.db.alert('Failed');
      }
    });
  }

  async sure_submit() {
    this.submitted = true;
    if (this.submitted && this.leave_form && this.leave_form.status == "VALID") {
      const alert = await this.alertController.create({
        header: 'Approval',
        message: 'Are you sure do you want to Send for Approval..?',
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
              this.submit();
            },
          },
        ],
      });
      if(this.is_maternity){
        this.file_url ? await alert.present() : this.db.sendErrorMessage('Pls select the image');  
      }
      else    
        await alert.present();
    }
  }

  async submit() {
        let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
        await loader.present();
        let datas = {
          doctype: "Leave Request",
          employee: localStorage['employee_id'],
          posting_date: this.db.current_event_date,
        }

        if(this.leave_preview && this.leave_preview.length != 0){
          datas['leave_preview'] = this.leave_preview;
        }

        datas = {...datas, ...this.leave_form.value}

        if(this.leave_detail && this.leave_detail.name){
          datas['name'] = this.leave_detail.name;
        }

        if(this.editFormValues && this.editFormValues.name){
          datas['name'] = this.editFormValues.name;
        }

        this.is_maternity ? datas['is_maternity'] = this.is_maternity : ''
        this.file_url ? datas['attach_file'] = this.file_url : ''

        datas['docstatus'] = 0;
        this.res_name = undefined
        datas['workflow_state'] = 'Awaiting Approval';
       
        this.db.inset_docs({ data: datas }).subscribe(res => {
          setTimeout(() => {
            loader.dismiss()
          }, 1000);
          if (res && res.message && res.message.status == 'Success') {  
            if(res.message.data && res.message.data.name)
              datas['name'] = res.message.data.name
             this.res_name = res.message.data.name
              this.db.sendSuccessMessage("Leave Request Send For Approval successfully!")
              setTimeout(() => {
                this.model ? this.modalCtrl.dismiss(datas): this.nav.back();
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
        }, error => {
          setTimeout(() => {
            loader.dismiss()
          }, 1000);
          if(error.error){
            let d = JSON.parse(error.error._server_messages)
            let f = JSON.parse(d[0])
            this.db.sendErrorMessage(f.message)
          }
        })
        setTimeout(() => {
          loader.dismiss()
        }, 10000);
      // }
    // }
  }

  checkImages(data, type) {
    switch (data) {
      case "Total Leaves":
        return type == "color" ? '#5461FF' : type == "class" ? 'color_1' : "/assets/leaves/calendar-purple.svg"
        break;
      case "All Applications":
        return type == "color" ? '#5461FF' : type == "class" ? 'color_1' : "/assets/leaves/calendar-purple.svg"
        break;
      case "Used Leaves":
        return type == "color" ? '#E08700' : type == "class" ? 'color_2' : "/assets/leaves/calendar-yellow.svg"
        break;
      case "Open Applications":
        return type == "color" ? '#E08700' : type == "class" ? 'color_2' : "/assets/leaves/calendar-yellow.svg"
        break;
      case "Available Leaves":
        return type == "color" ? '#458F5A' : type == "class" ? 'color_3' : "/assets/leaves/calendar-green.svg"
        break;
      case "Approved Applications":
        return type == "color" ? '#458F5A' : type == "class" ? 'color_3' : "/assets/leaves/calendar-green.svg"
        break;
      case "Expired Leaves":
        return type == "color" ? '#C01212' : type == "class" ? 'color_4' : "/assets/leaves/calendar-red.svg"
        break;
      case "Rejected Applications":
        return type == "color" ? '#C01212' : type == "class" ? 'color_4' : "/assets/leaves/calendar-red.svg"
        break;
      default:
        return type == "color" ? '#458F5A' : type == "class" ? 'color_3' : "/assets/leaves/calendar-green.svg"
    }
  }

  async open_dropdown() {
    const modal = await this.modalCtrl.create({
    component: LeaveTypeComponent,
    cssClass: this.db.ismobile ? 'job-detail-popup' : 'filter-popup',
    componentProps: {
      title:'Leave Type' 
    },
  });
  await modal.present();
  const val = await modal.onWillDismiss();
  console.log(val)
  if(val && val.data){
    this.leave_form.get('leave_type').setValue(val.data.name)
    this.is_maternity = val.data.is_maternity ? val.data.is_maternity : 0;

  }
  }

  changeListener($event: any): void {
    this.readThis($event.target);
  }
  categoryfile:any;
  categoryimagedata:any;
  file_url:any;

  async readThis(inputValue: any): Promise<void> {
    let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    await loader.present();
    if (inputValue.files.length > 0) {
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
          decode: 'True',
        };

        if (file_size <= 10000000) {
          //10Mb in BYtes

          this.db.upload_image(img_data).subscribe(
            (res: any) => {
              let checks_rep = res ? true : false;
              let unique_name = res.data.name;
              if (checks_rep == true) {
                this.db.upload_image_url(unique_name).subscribe(
                  (url) => {
                    let file_url = url.data.file_url;
                    if (url) {
                      loader.dismiss();
                      this.file_url = file_url;
                    }
                  },
                  (error) => {
                    loader.dismiss();
                  }
                );
              }
            },
            (error: any) => {
              loader.dismiss();
            }
          );
        } else if (file_size > 10000000) {
          loader.dismiss();
          this.db.filSizeAlert();
        } else if (file_size == 0) {
          loader.dismiss();
        }
      };
      myReader.readAsDataURL(file);
    }
    else 
      loader.dismiss();
  }

  approve_leaves(event) {
    this.approve_leave(event.data,event.item, event.type)
  }

  approve_leave(data,item, type) {
    // console.log(data)
    let datas:any=[];
    // data.leave_preview.map(res =>{
      // if(res.isChecked == true){
        // datas.push({date:item.date, status:item.status, rejected_reason:item.rejected_reason})
      // }
  // })
    let res_data ={
      employee:data.employee,
      "from_date":data.from_date,
      "to_date": data.to_date,
      leave_preview:datas
    }
    console.log(res_data)
    // if(datas.length == data.leave_preview.length){
    this.db.leave_approve_reject(res_data).subscribe(res => {
        if(res.status == 'Success'){
          this.db.alert(res.message)
        }
        else if (res._server_messages) {
          var d = JSON.parse(res._server_messages);
          var d1 = JSON.parse(d);
          this.db.alert(d1.message)
        }
        else{
          this.db.alert(res.message)
        }
      })
    // }
    // else
    //   this.db.alert('Pls select the all status')
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

    return `${yearsDiff} yr, ${monthsDiff} mn`;
  }



  // wiz
  half_day_hide = true
  fromDate: any;
  toDate: any;

  datePicker(eve, each) {
    if ((each == 'from_date' || each == 'to_date') && !this.is_maternity) {
      let data = this.leave_form.getRawValue();
      if (data && (data.from_date || data.to_date)) {
        if (data && data.from_date) {
          this.fromDate = data.from_date
        }
        if (data && data.to_date) {
          this.toDate = data.to_date
        }
        if(data && (this.fromDate == this.toDate)){
         this.half_day_hide = true;
        }
      }

      if(this.fromDate && this.toDate){
        this.calculateLeavePreview(this.fromDate,this.toDate,data.leave_type)
      }
      // console.log(this.fromDate)
      // console.log(this.toDate)
      if(this.fromDate >= this.toDate)
        this.fromDate == this.toDate ? '': this.db.sendErrorMessage('Please select the todate greater than from date')
    }
    else if(each == 'from_date' && this.is_maternity){
      let data1 = this.leave_form.getRawValue();
      const currentDate = new Date(data1.from_date);
      // Add 180 days to the current date
      currentDate.setDate(currentDate.getDate() + 179);
      // Format the date as YYYY-MM-DD
      const formattedDate = currentDate.toISOString().split('T')[0];
      this.leave_form.get('to_date').setValue(formattedDate)
      this.leave_form.get('total_leave_days').setValue(180)
      // data.from_date 
    }


  }

  check_box(event: any, each: any) {

    if (each == 'half_day') {

      let data = this.leave_form.getRawValue();

      // Leave Application
      if (data && data.from_date && data.to_date) {

        if (data && data.from_date) {
          this.fromDate = data.from_date
        }

        if (data && data.to_date) {
          this.toDate = data.to_date
        }
        // this.check_box1(event, each);
      }
      this.check_box1(event, each);

    }

  }

  check_box1(event: any, each: any) {
    if (each == 'half_day') {
      this.half_day_hide = this.half_day_hide ? false : true;
    }
  }

  calculateLeavePreview(from_date,to_date,type){
      let data = {
        "employee": localStorage['employee_id'],
        "from_date": from_date,
        "to_date": to_date,
        leave_type:type
      }
      this.db.calculate_leave_preview(data).subscribe(res => {
        if(res && res.message && res.message.leave_preview && res.message.leave_preview.length != 0){
          this.leave_preview = res.message.leave_preview;
          this.leave_form.get('total_leave_days').setValue(res.message.total_leave_days)
        }else{
          this.leave_preview = [];
          this.leave_form.get('total_leave_days').setValue(res.message.total_leave_days)
        }
      })

      this.db.leaves_for_overlapping_team_members({ "employee": localStorage['employee_id'], "from_date": from_date, "to_date": to_date,}).subscribe(res => {
        // console.log(res)
        if(res && res.message)
          this.overlapp_msg = res.message

      })

  }

}

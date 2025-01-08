import { Component, OnInit, Input } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { AlertController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.page.html',
  styleUrls: ['./leave-application.page.scss', '../../../components/forms/wizard-forms/wizard-forms.component.scss'],
})
export class LeaveApplicationPage implements OnInit {
  @Input() inputEmployeeDetails: any;
  @Input() editFormValues: any;
  @Input() selectedTabSec: any;
  leave_id: any;
  skeleton = false;
  leave_detail: any;
  employee_details: any;
  leave_dashboard: any = []
  leave_form;
  submitted = false;
  sub: any
  leave_preview: any = [];
  // search_data:any;
  save_only = false;
  total_leave_days: any = 0;
  res_name:any;
  constructor(public db: DbService, private route: ActivatedRoute, public router: Router, private formBuilder: FormBuilder,private nav:NavController,public alertController: AlertController) {
    this.leave_form = this.formBuilder.group({
      leave_type: new FormControl('', [Validators.required]),
      reason: new FormControl('', [Validators.required]),
      // reason: new FormControl('', [Validators.required]),
      from_date: new FormControl('', [Validators.required]),
      to_date: new FormControl('', [Validators.required]),
      // half_day: new FormControl(''),
      // half_day_date: new FormControl(''),
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
          // console.log(res['id']+'/'+res['name']);
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
        // this.get_employee_details(res['id'])
      }
    })

    this.sub = this.db.select_drop_down.subscribe((res: any) => {
      this.db.drop_down_value['leave_type'] = res.name ? res.name : res.label
      this.db.drop_down_value['leave_type_label'] = res.label
      this.leave_form['leave_type'].setValue(res.name)


      // this.dropdownSelection(res);
      // this.ref.detectChanges()
    });

    // if(!this.leave_id){
    //   this.get_employee_details()
    // }

    if(this.inputEmployeeDetails){
      this.leave_details(this.inputEmployeeDetails.name)
      this.leave_dash_board(this.inputEmployeeDetails.employee)
      this.get_employee_details(this.inputEmployeeDetails.employee)
    }

    console.log(this.editFormValues,'editFormValues')
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
    console.log(event)
    item['duration'] = event.detail.value
  }

  leave_details(id) {
    let data = {
      doctype: this.selectedTabSec == 'Pending' || this.selectedTabSec == 'Awaiting Approval' ? "Leave Request" : "Leave Application",
      name: id
    }

    this.db.doc_detail(data).subscribe(res => {
      this.skeleton = false;
      if (res && res.message && res.message.length != 0 && res.message[0].status == "Success") {
        // console.log(res.message.data,"res.message.data")
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
        // this.no_employee_details = true
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
    if(!this.save_only){
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
      await alert.present();
    }else{
      this.submit();
    }
  }

  submit() {
    this.submitted = true;
    // console.log(this.leave_form, "form")
    if (this.submitted && this.leave_form && this.leave_form.status == "VALID") {
      let val = (this.leave_form.value['half_day_check'] && this.leave_form.value['half_day'] != '') || !this.leave_form.value['half_day_check']
      // 
      if (val) {
        let datas = {
          doctype: "Leave Request",
          employee: localStorage['employee_id'],
          posting_date: this.db.current_event_date,
          total_leave_days: this.total_leave_days ? this.total_leave_days : 0
        }

        if(this.leave_preview && this.leave_preview.length != 0){
          datas['leave_preview'] = this.leave_preview;
        }

        datas = {...datas, ...this.leave_form.value}
        // datas['half_day'] = datas['half_day'] ? 1 : 0;

        if(this.leave_detail && this.leave_detail.name){
          datas['name'] = this.leave_detail.name;
        }

        if(this.editFormValues && this.editFormValues.name){
          datas['name'] = this.editFormValues.name;
        }

        if(this.save_only){
          datas['docstatus'] = 0;
          datas['workflow_state'] = 'Draft';
          this.res_name = undefined
        }else{
          datas['name'] = datas['name'] ? datas['name'] : this.res_name
          datas['workflow_state'] = 'Awaiting Approval';
          // datas['docstatus'] = 1;
        }

        // this.leave_form.value
        this.db.inset_docs({ data: datas }).subscribe(res => {
          // console.log(res)
          if (res && res.message && res.message.status == 'Success') {
            
            if(res.message.data && res.message.data.name)
              datas['name'] = res.message.data.name
             this.res_name = res.message.data.name
            if(datas['workflow_state'] == 'Awaiting Approval'){
              this.db.sendSuccessMessage("Leave Request Send For Approval successfully!")
              setTimeout(() => {
                this.nav.back()
              }, 500);
            }
            else
              this.db.sendSuccessMessage("Leave Request created successfully!")

            this.save_only = !this.save_only;
            // this.save_only = false;
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
          if(error.error){
            let d = JSON.parse(error.error._server_messages)
            let f = JSON.parse(d[0])
            this.db.sendErrorMessage(f.message)
          }
        })
      }
    }
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

  open_dropdown() {
    let val = {
      type: 'Leave Type',
      fieldname: 'leave_type',
      fieldname_value: '',
      selected_value: this.leave_type,
      // select_options: this.select_options,
      send_all_value: true
    }

    this.db.formStoreValues = {}

    this.db.formStoreValues['employee'] = localStorage['employee_id'];

    // doctype
    // :
    // "Leave Type"
    // filter_name
    // :
    // "Employee"
    // filter_value
    // :
    // "13859425"
    // this.type == 'reference_doctype' && this.fieldname == 'reference_docname'

    let selected_value = {
      doctype: "Leave Type"
    }
    this.db.open_drop_down_options(val.type, val.fieldname, val.fieldname_value, selected_value)
  }

  approve_leaves(event) {
    this.approve_leave(event.data,event.item, event.type)
  }

  approve_leave(data,item, type) {
    console.log(data)
    let datas:any=[];
    // data.leave_preview.map(res =>{
      // if(res.isChecked == true){
        datas.push({date:item.date, status:item.status, rejected_reason:item.rejected_reason})
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
        if(res.message.status == 'Success'){
          this.db.alert(res.message.message)
        }
        else if (res._server_messages) {
          var d = JSON.parse(res._server_messages);
          var d1 = JSON.parse(d);
          this.db.alert(d1.message)
        }
        else{
          this.db.alert(res.message.message)
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
    if ((each == 'from_date' || each == 'to_date')) {

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

        const date1: any = new Date(this.fromDate);
        const date2: any = new Date(this.toDate);

        // Calculate the difference in time (milliseconds)
        const timeDifference = date2 - date1;

        // Convert the difference to days
        this.total_leave_days = timeDifference / (1000 * 60 * 60 * 24);

        this.calculateLeavePreview(this.fromDate,this.toDate)
      }
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

  calculateLeavePreview(from_date,to_date){
    let data = {
      "employee": localStorage['employee_id'],
      "from_date": from_date,
      "to_date": to_date,
      "holiday_list": "New Test Holiday - 2024"
    }
    this.db.calculate_leave_preview(data).subscribe(res => {
      console.log(res);
      if(res && res.message && res.message.leave_preview && res.message.leave_preview.length != 0){
        this.leave_preview = res.message.leave_preview;
      }else{
        this.leave_preview = [];
      }
    })
  }

}

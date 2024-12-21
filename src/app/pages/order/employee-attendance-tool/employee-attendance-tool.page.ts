import { Component, OnInit, ViewChild,ChangeDetectorRef } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { EmployeeAttendanceFilterComponent } from 'src/app/components/customer-details/employee-attendance-filter/employee-attendance-filter.component';
import { DbService } from 'src/app/services/db.service';
import { IonCheckbox } from '@ionic/angular';
import { MarkAttendanceComponent } from 'src/app/components/mark-attendance/mark-attendance.component';
@Component({
  selector: 'app-employee-attendance-tool',
  templateUrl: './employee-attendance-tool.page.html',
  styleUrls: ['./employee-attendance-tool.page.scss'],
})
export class EmployeeAttendanceToolPage implements OnInit  {
  unmarked_employee: any = [];
  select_type: any;
  select_shift_type: any;
  current_date: any
  check_box = false;
  skeleton = false
  branch_: any;
  department_: any;
  company_: any;
  showFooter = false
  selectAll = false
  entry_type: any;
  active_tab: any = 'un_marked';
  unmarked_seg = true;
  marked_seg = false;
  marked_employee: any = [];
  marked_employees: any = [];
  un_marked_employees: any  =[]
  showCalendar = false;
  // late_entry: any;
  // early_exit: any;
  search_text: any;
  today: any;
  enable_status = false;
  summary_seg = false;
  summary_details: any;
  search_text_onLeave: any;
  search_text_absent: any;
  absent_collapse = false;
  leave_collapse = false;
  employee_shift: any = []
  on_leave_list: any = [];
  on_leave_list_employees: any = [];
  absent_list: any = [];
  absent_list_employees: any = [];
  marked_sts_employee: any;
  leave_req_collapse = true;
  today_leave_request: any = [];
  button_loader = false;
  showShiftType = false;
  showattendance_type = false;

  filters = [
    {label:'Present', icon:'/assets/attendance/present.svg', activeIcon:'/assets/attendance/present-active.svg', isActive:true},
    {label:'Absent', icon:'/assets/attendance/Absent.svg', activeIcon:'/assets/attendance/Absent-active.svg'},
    {label:'Half Day', icon:'/assets/attendance/Onleave.svg', activeIcon:'/assets/attendance/Onleave-active.svg'},
  ]

  shift_type:any=[];

  constructor(public db: DbService, public modalCtrl: ModalController, public alertCtrl: AlertController,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.today = new Date();
    const currentDate = new Date();
    if(!this.db.ismobile){
      this.summary_seg = false;
      this.unmarked_seg = true;
    }else{
      this.unmarked_seg = false;
    }
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    // console.log(formattedDate);

    this.current_date = formattedDate
    // setTimeout(()=>{
    this.company_ = (this.db.default_values && this.db.default_values.default_company) ? this.db.default_values.default_company : '';
    //   this.get_employee_attendance_tool(this.current_date);
    // },700)
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     if(!this.skeleton){
  //       this.skeleton = false;
  //     }
  //   }, 600);
  //   this.cdr.detectChanges();  // Manually trigger change detection
  // }

  ionViewWillEnter(){
    this.skeleton = true;
    this.absent_collapse = true;
    this.leave_collapse = true;
    if(!this.db.ismobile){
      this.summary_seg = false;
      this.unmarked_seg = true;
    }else{
      this.unmarked_seg = false;
    }
    this.branch_ = ""
    this.department_ = ""
    this.company_ = (this.db.default_values && this.db.default_values.default_company) ? this.db.default_values.default_company : '';
    this.get_employee_attendance_tool(this.current_date);
    this.get_shift_type();
    this.db.tab_buttons(this.profile_menu, 'Unmarked', 'value');
  }

  get_shift_type(){
    this.shift_type = [];
    var data = {
        "doctype":"Shift Type"
    }
    this.db.label_values(data).subscribe((res:any) => {
      if(res.status == 'Success'){
        res.message.map(r =>{
          r.value = r.name
          this.shift_type.push(r);
        })
        // this.shift_type = res.message.message;
      }
    });
  }

  get_employee_attendance_tool(date) {
    this.button_loader = true;
    
    // this.skeleton = this.db.bodySkeleton ? false : true
    let data = {
      date: date,
      company: this.company_ ? this.company_ : (this.db.default_values && this.db.default_values.default_company) ? this.db.default_values.default_company : '',
      branch: this.branch_,
      department: this.department_,
      dashboard: 'Employee Attendance Tool'
    }
    this.db.get_employee_tool(data).subscribe((res:any) => {
      this.button_loader = false;
      this.skeleton = false;
      this.db.bodySkeleton = false
      this.summary_details = {}
      // this.cdr.detectChanges()
      if (res && res.message) {
        if(res.message.unmarked && res.message.unmarked.length != 0){
          let unmarked_employees = JSON.stringify(res.message.unmarked)
          this.un_marked_employees = JSON.parse(unmarked_employees);
          this.unmarked_employee = res.message.unmarked;
        }else{
          this.unmarked_employee = []
        }

        if(res.message.marked && res.message.marked.length != 0){
          let marked_employees = JSON.stringify(res.message.marked)
          this.marked_employees = JSON.parse(marked_employees);
          this.marked_employee = res.message.marked
        }else{
          this.marked_employee = []
          this.marked_employees = []
        }

        if(res.message.leave_request_list && res.message.leave_request_list.length != 0){
          this.today_leave_request = res.message.leave_request_list
        }else{
          this.today_leave_request = [];
          this.leave_req_collapse = false;
        }

        if(res.message.dashboard && res.message.dashboard.length != 0){
          this.employee_shift = res.message.dashboard
        }else{
          this.employee_shift = []
        }


        this.summary_details = res.message.summary

        if(this.summary_details.absent_worforce && this.summary_details.absent_worforce.absent_list && this.summary_details.absent_worforce.absent_list.length != 0){
          let absent_list_employees = JSON.stringify(this.summary_details.absent_worforce.absent_list)
          this.absent_list_employees = JSON.parse(absent_list_employees);
          this.absent_list = this.summary_details.absent_worforce.absent_list
        }else{
          this.absent_collapse = false;
          this.absent_list = []
        }

        if(this.summary_details.onleave && this.summary_details.onleave.on_leave_list && this.summary_details.onleave.on_leave_list.length != 0){
          let on_leave_list_employees = JSON.stringify(this.summary_details.onleave.on_leave_list)
          this.on_leave_list_employees = JSON.parse(on_leave_list_employees);
          this.on_leave_list = this.summary_details.onleave.on_leave_list
        }else{
          this.leave_collapse = false;
          this.on_leave_list = []
        }

        this.attendance_type_filter(this.attendance_type[0].name);
        // console.log(this.unmarked_employee)
      } else {
        this.unmarked_employee = []
      }
      this.cdr.detectChanges()
    },error=>{ 
      this.db.alert('Something went wrong try again later') 
      this.button_loader = false;
      this.summary_details = {}
      this.skeleton = false;
      this.cdr.detectChanges()
    })
  }

  attendance_type = [
    { name: "Present", value: "Present" },
    { name: "Absent", value: "Absent" },
    { name: "Half Day", value: "Half Day" },
    { name: "Work From Home", value: "Work From Home" },
  ]

  attendance_filter  =[
    { name: "Present", value: "Present", selected: true },
    { name: "Absent", value: "Absent", selected: false },
    { name: "Half Day", value: "Absent", selected: false },
    { name: "Work From Home", value: "Absent", selected: false },
    { name: "On Leave", value: "Absent", selected: false },
  ]

  // shift_type = [
  //   { name: "Day Shift", value: "Day Shift" },
  //   { name: "General Shift", value: "General Shift" },
  //   { name: "Night Shift", value: "Night Shift" },
  //   { name: "Other Shift", value: "Other Shift" },
  // ]

  entry_types = [
    { name: "Late Entry", value: "Late Entry", txt: "late_entry", selected: false, type: 'check' },
    { name: "Early Exit", value: "Early Exit", txt: "early_exit", selected: false, type: 'check' }
  ]

  employee_names: any = []

  mark_att() {

    let filter_employee = this.unmarked_employee.filter(res => { return res.selected == true })
    if (this.select_type && filter_employee && filter_employee.length != 0) {

      this.employee_names = [];
      
      filter_employee.map(res => {
        this.employee_names.push(res.employee)
      })

      let data = {
        employee_list: this.employee_names,
        company: this.company_,
        status: this.select_type,
        date: this.current_date,
        late_entry: this.entry_types[0].selected ? 1 : 0,
        early_exit: this.entry_types[1].selected ? 1 : 0,
        shift: this.select_shift_type ? this.select_shift_type : '',
        dashboard: 'Employee Dashboard'
      }
      // this.db.mark_employee_tool(data).subscribe(res => {
      this.db.get_employee_tool(data).subscribe(res => {
        if(res && res.message && res.message.message && res.message.status && res.message.status == 'Success'){
          this.db.sendSuccessMessage(res.message.message)
          this.get_employee_attendance_tool(this.current_date)
          this.employee_names = []
          // this.showFooter = this.db.ismobile ? false : true;
          this.select_shift_type = ''
          this.select_type = ''
          // this.entry_types[0].selected = false;
          // this.entry_types[1].selected = false;
          this.entry_types = [
            { name: "Late Entry", value: "Late Entry", txt: "late_entry", selected: false, type: 'check' },
            { name: "Early Exit", value: "Early Exit", txt: "early_exit", selected: false, type: 'check' }
          ]
        }else{
          this.db.sendErrorMessage('Something went wrong try again later')
        }

      },error=>{ this.db.sendErrorMessage('Something went wrong try again later') })
    } else {
      if (!this.select_type && filter_employee && filter_employee.length == 0) {
        this.db.sendErrorMessage('Select Employee & Status');
      } else if (!this.select_type) {
        this.db.sendErrorMessage('Select Status');
      } else {
        this.db.sendErrorMessage('Select Employee');
      }
    }
  }

  segment_list = [
    { label: "UnMarked", value: "un_marked",name:'UnMarked' },
    { label: "Marked", value: "marked",name:'Marked' }
  ]

  segment_list1 = [
    { label: "Marked Attendance", value: "Marked Attendance",name:'Marked Attendance' },
    { label: "Today Attendance", value: "Today Attendance",name:'Today Attendance' }
  ]

  menu_name1(eve){
    this.active_tab = eve.value
    this.unmarked_seg = this.active_tab == 'Marked Attendance' ? false : true;
    this.db.tab_buttons(this.segment_list1, eve.name, 'value');
  }

  segmentchange(eve) {
    // this.db.attendance_tool_tab = eve.detail.value;
    // console.log(this.db.attendance_tool_tab)
    if (eve.detail.value == 'un_marked') {
      this.unmarked_seg = true
      this.get_employee_attendance_tool(this.current_date)
    } else {
      this.unmarked_seg = false
    }
  }

  mark_employee(data,index) {
    // console.log(data)
    data['selected'] = data['selected'] ? false : true

    this.un_marked_employees.map(res_emp => {
      if (res_emp.employee == data.employee) {
        res_emp['selected'] = data['selected']
      }
    })

    let selectedValues = this.unmarked_employee.find(res => { return res.selected == true })

    let filter_employees = this.unmarked_employee.filter(res => { return res.selected == true })
    let filter_employee = this.un_marked_employees.filter(res => { return res.selected == true })
    this.employee_names = [];
    filter_employee.map(res => {
      this.employee_names.push(res.employee)
    })

    this.showFooter = selectedValues ? true : false;

    if(!this.db.ismobile){
      let data = {
        status : "Success",
        // message : this.employee_names.length,
        message : filter_employees.length,

      }
      this.db.mark_employee_count.next(data)

      this.employee_names = filter_employees
    }
  }

  get_date(data) {
    // console.log(data)
    this.select_type = ''
    this.get_employee_attendance_tool(data.detail.value)
  }

  select_all() {
    // if(this.db.ismobile){
    //   this.selectAll = !this.selectAll
    // }else{
    //   this.selectAll = true
    // }
    this.selectAll = !this.selectAll

    this.showFooter = this.selectAll ? true : false;

    this.unmarked_employee.map(res => {
      // res.selected = true;
      // res.selected =! res.selected;
      res.selected = this.selectAll ? true : false;
    })

    let filter_employee = this.unmarked_employee.filter(res => { return res.selected == true })
    this.employee_names = [];
    filter_employee.map(res => {
      this.employee_names.push(res.employee)
    })

    if(!this.db.ismobile){
      let data = {
        status : "Success",
        message : this.employee_names.length,
      }
      this.db.mark_employee_count.next(data)
    }

    if(!this.selectAll){
      this.employee_names = [];
    }

  }

  unselect_all() {
    this.unmarked_employee.map(res => {
      res.selected = false;
    })

    let filter_employee = this.unmarked_employee.filter(res => { return res.selected == true })
    this.employee_names = [];
    filter_employee.map(res => {
      this.employee_names.push(res.employee)
    })

    if(!this.db.ismobile){
      let data = {
        status : "Success",
        message : this.employee_names.length,
      }
      this.db.mark_employee_count.next(data)
    }
  }

  async open_filter() {
    const modal = await this.modalCtrl.create({
      component: EmployeeAttendanceFilterComponent,
      cssClass: this.db.ismobile ? 'employee-tool-filter' : 'web_site_form_attach',
      componentProps: {
        selected_company: this.company_,
        selected_department: this.department_,
        selected_branch: this.branch_,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      // console.log(data)
      this.branch_ = data.branch ? data.branch : ''
      this.department_ = data.department ? data.department : ''
      this.company_ = data.company ? data.company : ''
      this.get_employee_attendance_tool(this.current_date)
    }
  }

  // mark_entry_type(data) {
  //   // console.log(data.value)
  //   this.entry_type = data.value
  //   if (this.entry_type == 'Late Entry') {
  //     this.late_entry = this.late_entry ? 0 : 1;
  //   } else if (this.entry_type == 'Early Exit') {
  //     this.early_exit = this.early_exit ? 0 : 1;
  //   }
  // }

  toggleCheckbox(checkbox: any, data) {
    // checkbox.checked = checkbox.checked ? false : true;
    data.selected = data.selected ? false : true;
    // this.mark_entry_type(data)
  }

  // employee_shift = [
  //   {
  //     icon: '/assets/img/alert-diamond.svg',
  //     past_month_employee: '10%',
  //     employee_shift: 'Present Workforce',
  //     employee_count: '1,450'
  //   },
  //   {
  //     icon: '/assets/img/office-chair.svg',
  //     past_month_employee: '10%',
  //     employee_shift: 'Absent Workforce',
  //     employee_count: '50'
  //   },
  //   {
  //     icon: '/assets/img/beach.svg',
  //     past_month_employee: '10%',
  //     employee_shift: 'On leave',
  //     employee_count: '38'
  //   }
  // ]

  icons_array = [
    '/assets/img/alert-diamond.svg',
    '/assets/img/office-chair.svg',
    '/assets/img/beach.svg'
  ]

  // menu_name1(eve){
  //   this.active_tab = eve.value
  //   this.db.tab_buttons(this.profile_menu, eve.name, 'value');
  // }

  menu_name(eve){
    // console.log(eve)
    this.showFooter = false;
    if(eve.name == 'Unmarked'){
      this.attendance_filter[0].selected = true;
      this.unmarked_seg = true
      this.summary_seg  =false;
    }else if(eve.name == 'Marked'){
      this.unmarked_seg = false
      this.summary_seg = false;
      this.attendance_type_filter('Present')
    }else{
      this.unmarked_seg = false
      this.summary_seg = true
    }
    this.db.bodySkeleton = true
    this.db.tab_buttons(this.profile_menu, eve.name, 'value');
    this.get_employee_attendance_tool(this.current_date)
  }

  profile_menu = [
    {name: 'Summary',value: 'Summary',icon: '/assets/img/summary.svg',active_icon: '/assets/img/summary-active.svg'},
    {name: 'Unmarked',value: 'Unmarked',icon: '/assets/img/unmarked.svg',active_icon: '/assets/img/unmarked-active.svg'},
    // {name: 'Marked',value: 'Marked',icon: '/assets/img/marked.svg',active_icon: '/assets/img/marked-active.svg'}
  ]

  async open_register(){
    const modal = await this.modalCtrl.create({
      component: MarkAttendanceComponent,
      cssClass: 'mark_attendance',
      componentProps: {
        selected_employee_count: this.employee_names.length,
        selected_employees: this.employee_names
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data){
      if(data == 'clear'){
        this.unselect_all()
      }else{
        // console.log(data)
        this.select_shift_type = data.shift
        this.select_type = data.attendance_type
        this.entry_types[0].selected = data.late_entry
        this.entry_types[1].selected = data.early_exit
        this.mark_att()
      }
    }
  }

  sav_mark_data(data){
    if(data == 'clear'){
      this.unselect_all()
    }else{
      // console.log(data)
      this.select_shift_type = data.shift
      this.select_type = data.attendance_type
      this.entry_types[0].selected = data.late_entry
      this.entry_types[1].selected = data.early_exit
      this.mark_att()
    }
    this.showFooter = false;
    this.employee_names = [];
  }

  formatDate(date: any) {
    this.db.bodySkeleton = true
    this.current_date = date;
    this.get_employee_attendance_tool(date)
  }

  change_select(data,i){
    this.attendance_filter.map((res,index) => {
      if(index == i){
        res.selected = true
        this.attendance_type_filter(data.name)
      }else{
        res.selected = false
      }
    })
  }

  filterItems(eve, type) {
    this.search_text = eve.target.value
    // if(this.search_text != ''){
      if(type == 'attendance'){
        if(this.unmarked_seg){
          this.unmarked_employee = this.un_marked_employees.filter(item => item.employee_name.toLowerCase().includes(this.search_text.toLowerCase()));
        }else{
          this.marked_employee = this.marked_sts_employee.filter(item => item.employee_name.toLowerCase().includes(this.search_text.toLowerCase()));
        }
      }else if(this.summary_seg){
        if(type == 'absent' && this.absent_list){

          if(this.search_text_absent == ""){
            this.absent_list = this.absent_list_employees
          }else{
            this.absent_list = this.absent_list_employees.filter(item => item.employee_name.toLowerCase().includes(this.search_text_absent.toLowerCase()));
          }

        }else if(type == 'on_leave' && this.on_leave_list){

          if(this.search_text_onLeave == ""){
            this.on_leave_list = this.on_leave_list_employees
          }else{
            this.on_leave_list = this.on_leave_list_employees.filter(item => item.employee_name.toLowerCase().includes(this.search_text_onLeave.toLowerCase()));
          }
          
        }
      }
    // }
  }

  clear_txt(type){
    this.search_text = ''
    this.search_text_onLeave = ''
    this.search_text_absent = ''
    this.filterItems({target: { value: "" } },type)
  }

  attendance_type_filter(search_txt){
    // this.get_employee_attendance_tool(this.current_date)
    this.marked_employee = this.marked_employees.filter(item => {return item.status == search_txt})
    let marked_sts_emp = JSON.stringify(this.marked_employee)
    this.marked_sts_employee = JSON.parse(marked_sts_emp)
  }

  // absent_list = [
  //   {employee_name: 'Ramanathan',status: 'Absent',employee: 'EMP-TT-2024-008',designation: 'Software Developer'},
  //   {employee_name: 'Abishek',status: 'Absent',employee: 'EMP-TT-2024-008',designation: 'Software Developer'},
  //   {employee_name: 'Chandrasekar',status: 'Absent',employee: 'EMP-TT-2024-008',designation: 'Software Developer'},
  //   {employee_name: 'Kishore',status: 'Absent',employee: 'EMP-TT-2024-008',designation: 'Software Developer'},
  //   {employee_name: 'Rajkumar',status: 'Absent',employee: 'EMP-TT-2024-008',designation: 'Software Developer'}
  // ]

  get_dash_icon(data){
    if(data == 'Present Workforce'){
      return '/assets/img/alert-diamond.svg'
    }else if(data == 'Absent Workforce'){
      return '/assets/img/office-chair.svg'
    }else if(data == 'On leave'){
      return '/assets/img/beach.svg'
    }else{
      return '/assets/img/beach.svg'
    }
  }

  async sure_approve(data, type,index) {
    const alert = await this.alertCtrl.create({
      header: 'Discard Changes',
      message: 'Are you sure do you want to ' + type + '..?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.alertCtrl.dismiss();
          },
        },
        {
          text: 'Yes',
          handler: () => {
            this.approve_leave(data, type,index)
          },
        },
      ],
    });
    await alert.present();
  }

  // Approve or Reject based on status that picked from alert or List func for the leave application raised the employee. HR
  approve_leave(data, type,index) {
    // console.log(data)
    data.docstatus = 1
    data.status = type == 'Approve' ? 'Approved' : 'Rejected';
    data.doctype = "Leave Application"
    this.db.inset_docs({ data: data }).subscribe(res => {
      // console.log(res)
      if (res && res.message && res.message.status == 'Success') {
        this.db.sendSuccessMessage(type + ' Successfully');
        this.today_leave_request.splice(index, 1)
      }else if(res && res.message && res.message.status == 'failed'){
        var d = JSON.parse(res._server_messages);
        var d1 = JSON.parse(d);
        this.db.sendErrorMessage(d1.message)
      }else{
        this.db.sendErrorMessage('Something went wrong')
      }
    })
  }

  creation_day(value: any) {
    const date = new Date(value);

    const hours24 = date.getHours();
    const minutes = date.getMinutes();
    const period = hours24 >= 12 ? 'pm' : 'am';

    const hours12 = hours24 % 12 || 12; // Convert to 12-hour format, 0 -> 12

    // Determine the part of the day
    let partOfDay = '';
    if (hours24 < 12) {
      partOfDay = 'Morning';
    } else if (hours24 < 17) {
      partOfDay = 'Afternoon';
    } else if (hours24 < 20) {
      partOfDay = 'Evening';
    } else {
      partOfDay = 'Night';
    }

    // Format minutes to always be two digits
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${partOfDay} - ${hours12} : ${formattedMinutes} ${period}`;
  }

  get_attendance_color(data){
    if(data == 'Present'){
      return 'green'
    }else if(data == 'Absent'){
      return 'yellow'
    }else if(data == 'Half Day'){
      return 'orange'
    }else if(data == 'Work From Home'){
      return 'orange'
    }else{
      return 'red'
    }
  }

  hideDiv(){
    this.showCalendar = false;
  }

  onDateChange(event: any) {
    this.current_date = event.detail.value;
    this.get_employee_attendance_tool(event.detail.value)
    this.hideDiv();
  }

  applyFilter(item, index){
     this.filters.map((res,i)=>{
      if(i != index){
        res['isActive'] = false;
      }
      // res['isActive'] = (i == index) ? true : false;
     })
 
     item['isActive'] =! item['isActive']

     if(item['isActive']){
       this.attendance_type_filter(item.label);
     }else{
       this.marked_employee = this.marked_employees;
       let marked_sts_emp = JSON.stringify(this.marked_employee)
       this.marked_sts_employee = JSON.parse(marked_sts_emp)
     }
  }

  selectValue(item){
    this.select_shift_type = item.value;
    this.showShiftType = false
  }

  selectValueattendance_type(item){
    this.select_type = item.value;
    this.showattendance_type = false
  }

  showPopup(type){
    if(type == 'shift'){
      this.showShiftType =! this.showShiftType;
      this.showattendance_type = false 
    }else if(type == 'status'){
      this.showattendance_type =! this.showattendance_type;
      this.showShiftType = false 
    }
  }

}

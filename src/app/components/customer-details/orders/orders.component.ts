import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, Output, EventEmitter, ViewChild, ElementRef, HostListener, NgZone } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { Router } from '@angular/router';
import { DetailDirectoryComponent } from '../detail-directory/detail-directory.component';
import { format } from 'date-fns';
import { CalendarEvent } from 'angular-calendar';
import { DetailComponentComponent } from '../detail-component/detail-component.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})

export class OrdersComponent implements OnInit, OnChanges {

  @ViewChild('tabList') tabList: ElementRef | any; //used to  call the method scrollToIndex() on this element reference
  @ViewChild(EmployeeListComponent) employee_list_component: EmployeeListComponent | any;
  @Input() list_data: any; //Collection data to render  the table with keys
  @Output() do_to_details = new EventEmitter();
  @Output() get_tempate_and_datas = new EventEmitter();
  @Output() click_data = new EventEmitter();
  @Output() load_more = new EventEmitter();
  @Output() createNew = new EventEmitter();
  @Output() menu_name = new EventEmitter();
  @Output() tab_filter = new EventEmitter();
  @Output() send_pagination_count = new EventEmitter();
  @Output() clear_txt = new EventEmitter();
  @Output() supplier_filter = new EventEmitter();
  @Input() height_val: any;
  @Input() no_tabs: any;
  @Input() old_list: any;
  @Input() doc_type: any;
  @Input() tabs_array: any;
  @Input() skeleton: any;
  @Input() dashboard: any;
  @Input() search_data: any;
  @Input() showCalendar: any;

  @Output() getFilters = new EventEmitter()
  @Output() getDateFromCalendar = new EventEmitter()

  @Output() call_clear_txt = new EventEmitter()
  @Output() search_txt_value = new EventEmitter();


  @Input() supplier_id: any;
  @Input() json_filter: any;
  @Input() page_title: any;
  @Input() search_filter: any;
  @Output() filterList = new EventEmitter();
  @Output() load_search = new EventEmitter();

  // Attendance
  @Output() getCalendarDate = new EventEmitter();
  @Output() getDateFromCalendars = new EventEmitter();
  @Input() highlightedDates: any;
  @Input() attendance_dashboard: any;

  alert_animatings: any = [];
  sub1: any;
  show_attendance = true;

  showLetterRequestBanner = true;

  constructor(private router: Router, public db: DbService, private cdr: ChangeDetectorRef, private zone: NgZone, public alertController: AlertController, private modal: ModalController) { }

  ngOnChanges(changes:SimpleChanges) {
    if (this.doc_type == 'Attendance' && (changes && changes['list_data'] && changes['list_data'].currentValue)) {
      this.list_data = changes['list_data'].currentValue
    }else if(changes && changes['highlightedDates'] && changes['highlightedDates'].currentValue) {
      this.highlightedDates = changes['highlightedDates'].currentValue;
      this.cdr.detectChanges();
    }
  }

  ngOnInit() {

    this.sub1 = this.db.alert_animate.subscribe((res: any) => {
      this.alert_animatings.push(res);
      setTimeout(() => { this.alert_animatings.shift(); }, 2500);
    })


    if (this.old_list == 'Lead') {
      this.db.enable_material = true;
    }
    
    this.db.sendViewType.subscribe(res => {
      if(res){
        this.db.viewListType = res;
      }
    })
  }

  checkDateFormat(data, type) {
    const date = new Date(data);
    const formattedDate = format(date, type == 'date' ? 'dd MMM yyyy' : 'EEEE');
    return formattedDate
  }

  handleEvent(action: string, event: CalendarEvent): void {
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe(); //Used destroy the subscribe of Subject
  }

  // To add empty space or add : to dispaly key based  on value
  get_values(data) {
    let value = '';
    if (data) {
      value = data.includes('_') ? (data.replace(/_/g, ' ') + ' : ') : (data + ' : ')
    }
    return value;
  }

  // Validate the datatype of Number to display the currency formatted data for list 
  checkDataType(val) {
    if (typeof val == 'number') {
      return true
    }
    return false
  }

  // Scroll to emit the nativeElement  scroll event for pagination.
  load_data(eve) {
    this.load_more.emit(eve)
  }

  // To detect the current value of the list and emit data to parent using HostListener of key functions.
  send_data(data) {
    data['detail_route'] = this.db.selected_list && this.db.selected_list.detail_route && localStorage['docType'] != 'Content' ? this.db.selected_list.detail_route : undefined;
    this.click_data.emit(data)
  }

  // Activate the row by changing class name from inactive to active using HostListener of key functions.
  active_item(data, index) {
    this.active = index;
    this.db.selected_index = index;

      this.list_data.data.map((res, i) => {
        if (index == i && data.name == res.name) {
          // res['isSelect'] = true;
          this.db.selectedId = res.name
        } else {
          res['isSelect'] = false
        }
      })
    
  }

  // scrollIntoView the activated row in the list .
  check_active(tabs_array: any, index: any, tab: any) {
    if(this.tabList){
      const element = this.tabList.nativeElement.children[index];
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }, 500)
      }
    }
  }

  active: any;
  isHandlingEvent = false;
  sampleIndex: any;

  // To detect the key functions to  navigate through rows using arrow keys.
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.zone.run(() => {
      this.isHandlingEvent = true;

      let key = event.key;
      let current_active = this.active;
      if (key == 'ArrowDown' && this.db.enable_detail) {
        if (current_active + 1 < this.list_data.data.length) {
          this.active = current_active + 1;
          this.db.selected_index = this.active
          this.send_data(this.list_data.data[this.active]);
          this.active_item(this.list_data.data[this.active], this.active);
          // this.scrollToActive();
          if (!this.sampleIndex || (this.sampleIndex != this.active)) {
            this.sampleIndex = this.active;
            this.check_active(this.list_data.data, this.active, '');
          }
        }
        this.employee_list_component ? this.employee_list_component.ngOnInit() : null;
      } else if (key == 'ArrowUp' && this.db.enable_detail) {
        if (current_active - 1 < this.list_data.data.length && current_active - 1 != -1) {
          this.active = current_active - 1;
          this.db.selected_index = this.active
          this.send_data(this.list_data.data[this.active]);
          this.active_item(this.list_data.data[this.active], this.active);
          // this.scrollToActive();
          if (!this.sampleIndex || (this.sampleIndex != this.active)) {
            this.sampleIndex = this.active;
            this.check_active(this.list_data.data, this.active, '');
          }
        }
        this.employee_list_component ? this.employee_list_component.ngOnInit() : null;
      }

      // Reset the flag after a short delay
      setTimeout(() => {
        this.isHandlingEvent = false;
      }, 100);
    });
  }


  // Enable the enable material to load mobile view list into Web view. 
  enable_mat(data, index) {
    this.active_item(data, index)
    setTimeout(() => {
      if (this.doc_type != 'Employee' && this.doc_type != 'Project') {
        this.check_active(this.list_data.data, this.active, '')
      }
    }, 500)
    if ((this.db.selected_list.detail_route || this.db.selected_list.page_name == "Sales Invoice") && this.doc_type != 'Employee') {
      this.db.enable_material = true
    }
  }

  attendanceTable = [
    "employee_name",
    "employee",
    "status",
    "attendance_date",
    "total_hours",
    "name"
  ]

  salary_slip_table1 = [
    "employee_name",
    "status",
    "employee",
    "posting_date",
    "net_pay",
    "name",
  ]

  leave_application_table = [
    { name: "Employee Name" },
    { name: "Actions" },
    { name: "Employee Id" },
    { name: "From Date" },
    { name: "Total Leave Days" },
    // { name: "Id" },
  ]

  employee_table = [
    "employee_name",
    "status",
    "designation",
    "branch",
    "reports_to",
    "name"
  ]

  issue_table1 = [
    "subject",
    "status",
    "priority",
    "raised_by",
    "opening_date",
    "name"
  ]

  hd_ticket_table = [
    { name: "Id" },
    { name: "Subject" },
    { name: "Status" },
    { name: "Contact" },
    { name: "Opening Date" },

  ]

  // Approve Alert control func for HR to approve the leave application raised the employee.
  async sure_approve(data, type, index) {
    const alert = await this.alertController.create({
      header: 'Discard Changes',
      message: 'Are you sure do you want to ' + type + '..?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.alertController.dismiss();
          },
        },
        {
          text: 'Yes',
          handler: () => {
            this.approve_leave(data, type, index)
          },
        },
      ],
    });
    await alert.present();
  }

  // Approve or Reject based on status that picked from alert or List func for the leave application raised the employee. HR
  approve_leave(data, type, index) {
    // console.log(data)
    let datas = {
      doctype: 'Leave Applicaion',
      employee_id: data.employee,
    };
    this.db.get_leave_approver(datas).subscribe((res) => {
      if (res && res.status && res.status == 'Success') {
        let leave_approver = res.message;
        data["leave_approver"] = leave_approver.leave_approver;

        data.docstatus = 1
        data.status = type == 'Approve' ? 'Approved' : 'Rejected';
        data.doctype = "Leave Application"
        this.db.inset_docs({ data: data }).subscribe(resp => {
          // console.log(res)
          if (resp && resp.message && resp.message.status == 'Success') {
            this.db.ismobile ? this.db.alert("Updated Successfully") : this.db.sendSuccessMessage(type + ' Successfully');
            // this.list_data.data.splice(index, 1);
            this.get_tempate_and_datas.emit("Leave Application")
          } else {
            data.docstatus = 0
            data.status = 'Open';
            // data.status = type == 'Approve' ? 'Approved' : 'Rejected';
            this.db.alert(res.message.message)
          }
        })
      } else {
        this.db.alert('Failed');
      }
    });
  }

  leaveConfirm($event) {
    this.sure_approve($event.data, $event.type, $event.index)
  }

  async load_popup(item) {
    this.db.SubjectEvent = false;
    this.db.drop_down_value = {};
    let cssStyle = 'filter-popup-3'
    if(this.doc_type == 'ToDo'){
      cssStyle = 'small_popup'
    }
    const modal = await this.modal.create({
      component: DetailComponentComponent,
      cssClass: cssStyle,
      componentProps: {
        id: item.name,
        doctype: this.doc_type,
        page_route: this.db.seperateJobSection ? 'job-applicant' : this.db.selected_list && this.db.selected_list.detail_route ? this.db.selected_list.detail_route : '',
        page_title: this.db.seperateJobSection ? 'Job Applicant' : this.db.selected_list && this.db.selected_list.page_name ? this.db.selected_list.page_name : ''
      },
      enterAnimation:this.db.enterAnimation,
      leaveAnimation:this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.db.SubjectEvent = true;
    // console.log(data);
  }

  // Dynamic Single List for All Modules based on keys.
  go_to_detail(data, index) {
    let itemToUse = data;
    // , 'Bug Sheet,'Expense Claim', 'Employee Grievance''
    let datas = [];
    let value = datas.find(res => { return res == this.doc_type });

    if (value) {
      this.load_popup(data)
    } else {

      if (data && data.item) {
        itemToUse = data.item;
        index = data.index;
      }

      this.db.selected_index = index

      this.employee_list_component ? this.employee_list_component.ngOnInit() : null;

      if (!this.db.ismobile) {
        this.active_item(itemToUse, index);
        if (this.doc_type != 'Employee' && this.doc_type != 'Project' && this.doc_type != 'Salary Slip') {
          this.check_active(this.list_data.data, index, itemToUse);
        }

        if(this.db.employee_role && this.doc_type == 'Employee'){
          this.openEmployeeDirectory(data.item)
        }else{
          this.send_data(itemToUse)
        }

        if (!this.db.enable_material) {
          this.enable_mat(itemToUse, index);
        }
      }
      this.do_to_details.emit(itemToUse);
    }
  }

  load_all(item) {
    if (item && item.item) {
      this.do_to_details.emit(item.item)
      this.send_data(item.item)
      this.enable_mat(item.item, item.i)
      this.active_item(item.item, item.i)
      this.check_active(this.list_data.data, item.i, item.item)
    }
  }

  attendance_dashboard_icon = [
    {
      icon: '/assets/attendance-ess/calendar-tick.svg',
    },
    {
      icon: '/assets/attendance-ess/check-in.svg',
    },
    {
      icon: '/assets/attendance-ess/check-out.svg',
    },
  ]

  transform_att_date(value: any) {
    const date = new Date(value);
    const day = ('0' + date.getDate()).slice(-2);
    const dayOfWeek = date.toLocaleString('en-us', { weekday: 'short' });
    const month = date.toLocaleString('en-us', { month: 'short' });
    const year = date.getFullYear();

    return `${day} -${dayOfWeek} / ${month} - ${year}`;
  }

  show_att_cal(val:any) {
    this.show_attendance = !this.show_attendance
  }

  get_count_color(data) {
    if (data == 'Total Working Days') {
      return '#5461FF'
    } else if (data == 'Check In') {
      return '#009A3E'
    } else {
      return '#E02323'
    }
  }

  converTime(data) {
    // Split the input string by ':'
    data = String(data)
    let [hours, minutes] = data.split(':');

    // Convert hours to a number
    hours = parseInt(hours);

    // Determine AM or PM suffix
    let suffix = hours >= 12 ? 'PM' : 'AM';

    // Adjust hours for 12-hour format
    hours = (hours % 12) || 12;

    // Add leading zero to minutes if necessary
    if (minutes && minutes.length < 2) {
      minutes = '0' + String(minutes);
    }

    // Construct the new time format
    return `${hours}:${minutes ? minutes : '00'} ${suffix}`
  }

  converHours(data) {
    data = String(data)
    const [time, modifier] = data.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes ? minutes : '00'} Hr`;
  }

  async openEmployeeDirectory(employeeDetail){
    const modal = await this.modal.create({
      component: DetailDirectoryComponent,
      cssClass: 'detailDirecory-popup',
      componentProps: {
        employeeDetail:employeeDetail
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });

    // modal.swipeToCloseEnabled = true;
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data && data.status == 'success'){
      
    }
  }

  goDetailPage(item){
    this.router.navigateByUrl('/leave-request/' + item.name);
  }

  createNewLetterReq(){
    let data = {
      name: "Letter Request",
      route: "/forms/letter-request"
    }
    this.createNew.emit(data);
  }

}
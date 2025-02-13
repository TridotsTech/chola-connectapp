import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import {
  AlertController,
  MenuController,
  LoadingController,
  ModalController,
  AnimationController,
  Platform,
  IonFab,
  IonContent
} from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { LeaveReasonDetailComponent } from 'src/app/components/leave-reason-detail/leave-reason-detail.component';
import { WebsiteFormsComponent } from 'src/app/components/forms/website-forms/website-forms.component';
import { DetailComponentComponent } from 'src/app/components/customer-details/detail-component/detail-component.component';
import { LeaveApplicationPage } from '../leave-application/leave-application.page';
// import { Console } from 'console';

@Component({
  selector: 'app-leave-application-detail',
  templateUrl: './leave-application-detail.page.html',
  styleUrls: ['./leave-application-detail.page.scss'],
})

export class LeaveApplicationDetailPage implements OnInit {
  leave_dashboard: any;
  leave_list: any = [];
  employee_details: any;
  no_employee_details = false;
  employee = false;
  detail_loader = true;
  leaveApplicationDetails: any;
  @ViewChild('tabList') tabList: ElementRef | any;
  fab_lead = [{ name: 'Leave Request', icon: '/assets/dashboard/LeaveApplication-w.svg' }, { name: 'Leave Withdrawal', icon: '/assets/dashboard/CompensatoryLeaveRequest-w.svg' }];
  tabs_array = [{ "name": "All", "route": "All" }, { "name": "Open", "route": "Open" }, { "name": "Approved", "route": "Approved" }, { "name": "Rejected", "route": "Rejected" }]
  status = '';
  employee_id = '';
  currentYear: any;
  today: any
  page_no = 1
  search_data: any = {};
  @ViewChild('fab') fab!: IonFab | any;
  @ViewChild(IonContent, { static: true }) content: IonContent | any;
  options = [{ name: "Pending", route: "Open" }, { name: "Approved", route: "Approved" }]
  search_filter: any = [];
  showCalendar: any;
  sort_by_order: any;
  leave_type = "Leaves"

  // Web view
  page_title: any = "Leaves";
  doc_type: any = "Leave Application"
  skeleton: boolean = true;
  supplier_id: any;
  profile_menu = [
    { name: 'Leaves', value: 'Leaves' },
    { name: 'Leave Requests', value: 'Leave Requests' },
  ]
  edit_form: any;
  page_size = 20;
  skeleton_value = { doc_type: "Leave Application", tabs: true, dashboard: 'dashboard', enable_dashboard: true, date_dash: false, dash_len: [0, 1, 2, 3], tabs_len: [0, 1] }
  skeleton_value_mobile = { doc_type: "Leave Application", tabs: true, tabs_len: [0, 1, 2, 3, 4], enable_dashboard: true, dash_len: [0, 1], dashboard_count: false, filter_len: [0, 1, 2, 3, 4], search: false, month_filter: true, list: true, list_type: '3x2 col', list_len: [0, 1, 2, 3, 4], list_len_count: 10 }

  selectedTabSec = 'Pending'
  constructor(public db: DbService, private route: ActivatedRoute, public modalCtrl: ModalController, public router: Router, public alertController: AlertController,private cdr: ChangeDetectorRef,private ngZone: NgZone) { }

  ngOnInit() {

    this.selectedTabSec = 'Pending'
    // if(this.db.hr_manager_role){
    //   this.options = [{ name: "Pending", route: "Open" }, { name: "Awaiting Approval", route: "awaiting-approval" },{ name: "Approved", route: "Approved" }]
    // }
    this.db.triggerSidemenu.subscribe(res => {
      if (res && res == 'loadPermission') {
        let route = this.db.permission_details.find((r) => { return r.page == 'Leave Application' });
        if (route) {
          localStorage['selected_list'] = JSON.stringify(route);
          this.db.selected_list = localStorage['selected_list'] != "undefined" ? JSON.parse(localStorage['selected_list']) : null;
        }
      }
    })

    this.today = new Date()

    if (this.db.ismobile) {
      this.search_data = { status: "Open" };
    } else {
      this.search_data = {}
    }

    if (this.db.hr_manager_role) {
      this.options = [{ name: "Pending", route: "Open" }, { name: "Awaiting Approval", route: "awaiting-approval" },{ name: "Approved", route: "Approved" }]
      // this.selectedTabSec = 'Awaiting Approval'
      // let val = { name: "My Leaves", route: "my" }
      // this.options.push(val)
      this.employee = false
    } else {
      // this.employee = true
    }

    this.route.params.subscribe((res: any) => {
      const currentDate = new Date();
      this.currentYear = currentDate.getFullYear();

      this.db.leave_skeleton = true
      this.employee_id = res['id'];
      // this.getLeaveRequestList();
      // if(this.selectedTabSec != 'Pending')
        this.leave_details(res['id'])

      this.get_employee_details(res['id'])
    })

    this.get_search_fields()

    if (this.db.employee_role && (this.db.dashboard_values && this.db.dashboard_values.length != 0)) {
      this.leaveApplicationDetails = this.db.dashboard_values.find(res => { return res.page == "Leave Application" })
    }



    this.db.hasClass = false;

    this.db.selectedYearSubject.subscribe((res) => {
      if (res && res == 'getYearLeave') {

        this.currentYear = this.db.selectedYear;
        this.leave_details(this.employee_id)
      }
    })

    // if(this.selectedTabSec == 'Pending'){
    //   this.getLeaveRequestList('Pending');
    // }


  }

  ionViewWillEnter() {
    if (this.db.ismobile) {
      this.search_data = { status: "Open" };
    } else {
      this.search_data = {}
    }

    if(!this.db.ismobile){
      this.db.viewListType = 'Grid';
    }

    this.db.tab_buttons(this.profile_menu, "Leaves", 'value');
    this.db.tab_buttons(this.options, "Pending", 'name');

    if (this.db.permission_details && this.db.permission_details.length != 0) {
      let route = this.db.permission_details.find((r) => { return r.page == 'Leave Application' });
      if (route) {
        localStorage['selected_list'] = JSON.stringify(route);
        this.db.selected_list = localStorage['selected_list'] != "undefined" ? JSON.parse(localStorage['selected_list']) : null;
      }
    }
    if(this.selectedTabSec == 'Pending'){
      this.getLeaveRequestList('Pending');
    }
  }

  // ionViewWillLeave(){
  //   for(let i=0;i<this.tabs_array.length;i++){
  //     this.tabs_array[i]['isActive'] = false
  //   }
  // }

  get_search_fields() {
    this.db.search_fields({ doctype: 'Leave Application' }).subscribe((res) => {
      if (res.status && res.status == 'failed') {
        this.search_filter = [];
      } else {
        this.search_filter = res['message'];
      }
    });
  }

  no_products = false;
  loading = false;
  load_more(event) {
    // this.db.loadMoreButton = true;
    if (!this.no_products && this.db.ismobile && !this.loading) {
      this.loading = true;
      // if (event && typeof (event) == 'string' && event == 'loadmore') {
      if ((this.page_no * 20) == this.leave_list.length) {
        this.page_no += 1;
        this.leave_details(this.employee_id);
      }
      // }

    }

  }

  getLeaveRequestList(type){
    this.db.get_leave_requests_list(type).subscribe(res => {
      // console.log(res)
      if(res && res.message && res.message.length != 0){
        this.leave_list = res.message;
      }else{
        this.leave_list = [];
      }
    })
  }

  list_data: any = {};
  leave_details(id) {
    let data = {
      "search_data": this.search_data,
      "page_no": this.page_no,
      "page_length": this.page_size,
      "date": this.db.current_event_date,
      "employee_id": (this.employee || localStorage['role'] == "Employee") ? localStorage['employee_id'] : id,
      "dashboard_name": (this.db.employee_role) ? "Employee Leave Application Dashboard" : (this.employee && this.db.hr_manager_role) ? "HR Leave Application Dashboard" : "HR Leave Application Dashboard"
    }

    if (this.sort_by_order) {
      data['order_by'] = this.sort_by_order
    }
    // this.db.hr_manager_role && !this.employee && 
    if (this.db.ismobile) {
      const now = new Date(data['date'])
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      let val = { year: this.currentYear ? this.currentYear : year }
      data['month_filter'] = val
    }

    if (this.employee) {
      delete data['search_data']['status']
    }


    this.db.leave_details(data).subscribe(res => {
      this.detail_loader = false;
      this.ngZone.run(() => {
        this.db.leave_skeleton = false;
      })
      // this.cdr.detectChanges();
      console.log(this.db.leave_skeleton,'this.db.leave_skeleton')
      if (res && res.message) {
        if (res.message.dashboard && res.message.dashboard.length > 0) {
          if (this.db.employee_role || this.employee)
            res.message.dashboard.splice(3, 1)
        }
        this.leave_dashboard = res.message.dashboard
        this.list_data['dashboard'] = res.message.dashboard;
        if(this.selectedTabSec != 'Pending'){
          if (res.message.data && res.message.data.length > 0) {
            this.leave_list = this.page_no == 1 ? res.message.data : [...this.leave_list, ...res.message.data]
            this.list_data['data'] = this.page_no == 1 ? res.message.data : [...this.list_data['data'], ...res.message.data]
          } else {
            this.page_no == 1 ? this.leave_list = [] : null
            this.page_no == 1 ? this.list_data['data'] = [] : null
          }
        }
      } else if (res && res.status == "success") {
        this.leave_dashboard = res.dashboard
        this.leave_list = this.page_no == 1 ? res.leave_list : [...this.leave_list, ...res.leave_list]
        this.list_data['data'] = this.page_no == 1 ? res.list_data : [...this.list_data['data'], ...res.list_data]
      } else {
        this.page_no == 1 ? this.leave_list = [] : null;
        this.page_no == 1 ? this.list_data = [] : null;
        this.no_products = true
      }
      this.loading = false;
    })
  }

  get_employee_details(name) {
    let data = {
      doctype: "Employee",
      name: name
    }

    this.db.doc_detail(data).subscribe(res => {
      this.detail_loader = false;
      if (res && res.message && res.message.length != 0 && res.message[0].status == "Success") {
        this.employee_details = res.message[1]
      }
    })
  }


  create_new(data, item) {
    data['route'] = item.name == "Leave Application" ? data.detail_route : '/forms/' + data.detail_route;
    this.router.navigateByUrl(data['route']);
  }


  async openQuickForm(item) {
    // if (this.db.hr_manager_role) {
    // console.log(item,"item")
  // this.router.navigateByUrl(`/leave-application/${item.name}`)
    // } 

    // else {
      const modal = await this.modalCtrl.create({
        component: LeaveApplicationPage,
        cssClass: '',
        componentProps: {
          inputEmployeeDetails: item,
          selectedTabSec: this.selectedTabSec
        },
        enterAnimation: this.db.enterAnimation,
        leaveAnimation: this.db.leaveAnimation,
      });
      await modal.present();
      const { data } = await modal.onWillDismiss();
      // console.log(data)
      // console.log(this.selectedTabSec)
      if(this.selectedTabSec == 'Pending'){
        this.getLeaveRequestList('Pending');
      }
      if(this.selectedTabSec == 'Awaiting Approval'){
        this.getLeaveRequestList('Awaiting Approval');
      }
    //   if (data && data == 'Success') {

    //   }

    // }

  }

  fab_() {
    let val;
    val = document.getElementById('fab');
    val.click();
    this.db.hasClass = false;
  }

  nav() {
    this.db.hasClass = !this.db.hasClass;
  }

  navigate_to_next(item) {

    // let leaveApplicationDetails: any;

    // if (item.name == "Leave Application") {
    //   leaveApplicationDetails = this.db.dashboard_values.find(res => { return res.page == "Leave Application" })
    // } else if (item.name == "Leave Request") {
    //   leaveApplicationDetails = this.db.dashboard_values.find(res => { return res.page == "Compensatory Leave Request" })
    // }
    // this.db.hasClass = !this.db.hasClass;
    // leaveApplicationDetails = JSON.stringify(leaveApplicationDetails);
    // leaveApplicationDetails = JSON.parse(leaveApplicationDetails);
    // this.create_new(leaveApplicationDetails, item)

    this.db.hasClass = !this.db.hasClass;
    // console.log(item)

    if(item.name == 'Leave Withdrawal'){
      this.router.navigate(['/leave-withdrawal/New'])
    }else
      this.router.navigate(['/leave-application'])
  }

  menu_name(eve) {
    // console.log(eve, "eve")
    this.selectedTabSec = eve.name
    this.page_no = 1;
    if (eve.route == "my") {
      this.employee = true
    } else {
      this.employee = false
      this.search_data = { status: eve.route }
      this.status = eve.name == 'All' ? '' : eve.name
    }
    if(this.selectedTabSec == 'Approved')
      this.leave_details(this.employee_id);

    if(this.selectedTabSec == 'Pending'){
      this.getLeaveRequestList('Pending');
    }
    if(this.selectedTabSec == 'Awaiting Approval'){
      this.getLeaveRequestList('Awaiting Approval');
    }

    setTimeout(() => {
      this.content.scrollToTop(0);
    }, 700)
  }

  // getMonth(eve) {
  //   // console.log(eve);
  //   this.currentYear = eve.label;
  // }

  // checkImages(data, type) {
  //   switch (data) {
  //     case "Total Leaves":
  //       return type == "color" ? '#5461FF' : type == "class" ? 'color_1' : "/assets/leaves/calendar-purple.svg"
  //       break;
  //     case "All Applications":
  //       return type == "color" ? '#5461FF' : type == "class" ? 'color_1' : "/assets/leaves/calendar-purple.svg"
  //       break;
  //     case "Used Leaves":
  //       return type == "color" ? '#E08700' : type == "class" ? 'color_2' : "/assets/leaves/calendar-yellow.svg"
  //       break;
  //     case "Open Applications":
  //       return type == "color" ? '#E08700' : type == "class" ? 'color_2' : "/assets/leaves/calendar-yellow.svg"
  //       break;
  //     case "Available Leaves":
  //       return type == "color" ? '#458F5A' : type == "class" ? 'color_3' : "/assets/leaves/calendar-green.svg"
  //       break;
  //     case "Approved Applications":
  //       return type == "color" ? '#458F5A' : type == "class" ? 'color_3' : "/assets/leaves/calendar-green.svg"
  //       break;
  //     case "Expired Leaves":
  //       return type == "color" ? '#C01212' : type == "class" ? 'color_4' : "/assets/leaves/calendar-red.svg"
  //       break;
  //     case "Rejected Applications":
  //       return type == "color" ? '#C01212' : type == "class" ? 'color_4' : "/assets/leaves/calendar-red.svg"
  //       break;
  //     default:
  //       return type == "color" ? '#458F5A' : type == "class" ? 'color_3' : "/assets/leaves/calendar-green.svg"
  //   }
  // }

  getCircleColor(data){
    if(data == 'Total Leaves'){
      return '#6A12D71A'
    }else if(data == 'Used Leaves'){
      return '#e7f8ed'
    }else if(data == 'Available Leaves'){
      return '#008CFF0D'
    }else if(data == 'Pending Leaves' || data == 'Open Leaves'){
      return '#FCAC2B1A'
    }else{
      return '#fff4f4'
    }
  }

  get_leaves_icon(data){
    if(data == 'Total Leaves'){
      return '/assets/Employee-Home/Total-Leaves.svg'
    }else if(data == 'Used Leaves'){
      return '/assets/Employee-Home/Used-Leaves.svg'
    }else if(data == 'Available Leaves'){
      return '/assets/Employee-Home/Available-leaves.svg'
    }else if(data == 'Expired Leaves'){
      return '/assets/Employee-Home/Expired-Leaves.svg'
    }else if(data == 'Pending Leaves' || data == 'Open Leaves'){
      return '/assets/Employee-Home/PendingLeaves.svg'
    }else{
      return '/assets/Employee-Home/Total-Leaves.svg'
    }
  }

  getDateFromCalendar(eve) {
    if (eve.sort) {
      this.sort_by_order = eve['sort_by']
    } else {
      this.db.current_event_date = eve;
    }
    this.leave_details(this.employee_id)
  }

  getFilters(data) {
    this.page_no = 1;
    this.search_data = data.data;
    this.leave_details(this.employee_id);
  }

  leave_application_table = [
    "employee_name",
    "employee",
    "from_date",
    "total_leave_days",
    "actions",
    "modified",
    // "Id",
  ]

  leave_request_table = [
    "employee_name",
    "work_from_date",
    "work_end_date",
    "reason",
    "leave_type",
    "modified",
    // " ",
  ]

  createNew() {
    let doctype = this.leave_type == "Leaves" ? "Leave Application" : "Compensatory Leave Request"
    this.edit_form = 0
    this.openWebFormPopup(doctype);
  }

  async openWebFormPopup(data) {
    this.db.SubjectEvent = false;
    const modal = await this.modalCtrl.create({
      component: WebsiteFormsComponent,
      cssClass: 'childTablecss',
      componentProps: {
        page_title: this.page_title,
        page_route: data == "Compensatory Leave Request" ? 'compensatory-leave-request' : 'leave-application',
        edit_form_values: undefined,
        edit_form: undefined,
        enable_reference: undefined,
        enabled_read_only: 0,
        enable_height: false,
        loader_f: true,
        load_doc: this.doc_type,
        popup_centre: false,
        modal: true
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();

    this.db.SubjectEvent = true;

    if (val && val.data == 'Success') {
      this.leave_details(this.employee_id);
    }
  }

  leaveConfirm($event) {
    this.sure_approve($event.data, $event.type, $event.index)
  }

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

  approve_leave(data, type, index) {
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
          if (resp && resp.message && resp.message.status == 'Success') {
            this.db.sendSuccessMessage(type + ' Successfully');
          } else {
            if (resp._server_messages) {
              var d = JSON.parse(resp._server_messages);
              var d1 = JSON.parse(d);
              this.db.sendErrorMessage(this.stripHtmlTags(d1.message));
            } else {
              let alert = (resp && resp.message && resp.message.message) ? resp.message.message : 'Something went wrong try again later'
              this.db.sendErrorMessage(alert);
              // this.db.alert_animate.next(alert);
            }
            data.docstatus = 0
            data.status = 'Open';
            this.db.alert(res.message.message)
          }
        })
      } else {
        this.db.alert('Failed');
      }
    });
  }

  stripHtmlTags(htmlString: string): string {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  }

  load_all(item) {
    if (item && item.item) {
      // console.log(item, "item")
      // this.do_to_details.emit(item.item)
      // this.send_data(item.item)
      // this.enable_mat(item.item, item.i)
      // this.active_item(item.item, item.i)
      // this.check_active(this.list_data.data, item.i, item.item)

    }
  }

  // Filter
  search = ''
  profile_menu1 = [
    { name: 'All Leaves', value: 'All Leaves', icon: '/assets/img/unmarked.svg', active_icon: '/assets/img/unmarked-active.svg' },
    { name: 'My Leaves', value: 'My Leaves', icon: '/assets/img/summary.svg', active_icon: '/assets/img/summary-active.svg' },
  ]
  async tab_filter(event: any) {
    if (event && event.sort_by) {
      this.sort_by_order = event.sort_by
      await this.leave_details(this.employee_id)
    } else {
      this.db.current_leave_segment = event.name
      this.db.tab_buttons(this.profile_menu, event.name, 'value');
      this.leave_type = event.name
      let value = {status:'success',type:'clear'}
      this.db.clearFilters.next(value)
      if (event.name == "Leave Requests") {
        this.detail_loader = true
        this.list_data = {}
        this.page_title = "Compensatory Leave Request"
        await this.get_tempate_and_datas("Compensatory Leave Request")
      } else {
        this.detail_loader = true
        this.list_data = {}
        this.page_title = "Leave Application"
        await this.leave_details(this.employee_id)
        // this.db.current_leave_segment = 'All Leaves'
        // this.db.tab_buttons(this.profile_menu1, 'All Leaves', 'value');
      }
    }

  }

  get_tempate_and_datas(doctype) {
    // this.db.leave_skeleton = true
    if (this.search_data && typeof this.search_data != 'object') {
      let parseJson = JSON.parse(this.search_data);
      let keys = Object.keys(parseJson)
      if (keys && keys.length != 0) {
        keys.map((res: any) => {
          if (parseJson[res][0] && parseJson[res][1] && (res && res.includes('date'))) {
            parseJson[res][0] = "="
            let stringWithPercent = parseJson[res][1];
            parseJson[res][1] = stringWithPercent.replace(/%/g, '');
          }
        })
      }

      this.search_data = JSON.stringify(parseJson)
    }


    let data = {
      doctype_name: doctype,
      view_type: 'List View',
      search_data: this.search_data,
      docname: '',
      fetch_child: true,
      page_no: this.page_no,
      page_length: this.page_size
    };

    if (this.sort_by_order) {
      data['order_by'] = this.sort_by_order
    }


    this.db.get_tempate_and_datas(data).subscribe((res) => {
      // if(this.doc_type != "Holiday List")
      this.db.leave_skeleton = false;
      this.detail_loader = false
      if (res && res.message && res.message.data && res.message.data.length > 0) {
        if (this.page_no == 1) {
          this.list_data = {}
          this.list_data['data'] = res.message.data
          this.list_data['dashboard'] = res.message.dashboard
        } else {
          this.list_data['data'] = [...this.list_data['data'], ...res.message.data]
        }
      } else {
        this.page_no == 1 ? this.list_data['data'] = [] : null
      }
      // this.spinner_loader = false;
      // this.loadDatas = true;

      setTimeout(() => {
        this.db.listSkeleton = false;
      }, 800)

    })

  }


  // Pagination
  pagination_count = [
    { 'count': 20, 'selected': true },
    { 'count': 50, 'selected': false },
    { 'count': 100, 'selected': false }
  ]
  plus_count = 20;
  send_pagination(data, i) {
    // console.log('pagination', data)

    this.pagination_count.map((res, index) => {
      if (i == index) {
        res['selected'] = true;
      } else {
        res['selected'] = false;
      }
    })
    this.db.store_old_pagination = data.count
    this.send_pagination_count(data.count)
  }

  add_pagination() {
    this.plus_count += 20;
    this.send_pagination_count(this.plus_count)
  }

  async send_pagination_count(pagination) {
    this.page_no = 1
    this.page_size = pagination;
    if (this.leave_type == "Leave Requests") {
      await this.get_tempate_and_datas("Compensatory Leave Request")
    } else {
      await this.leave_details(this.employee_id)
    }

    // this.get_tempate_and_datas(this.doc_type);
  }

  async load_popup(item) {
    // console.log(this.db.selected_list, "this.db.selected_list")
    const modal = await this.modalCtrl.create({
      component: DetailComponentComponent,
      cssClass: 'filter-popup-3',
      componentProps: {
        id: item.name,
        doctype: this.leave_type == "Leaves" ? "Leave Application" : "Compensatory Leave Request",
        // page_route: this.db.selected_list && this.db.selected_list.detail_route ? this.db.selected_list.detail_route : '',
        // page_title: this.db.selected_list && this.db.selected_list.page_name ? this.db.selected_list.page_name : ''
        page_route: this.leave_type == "Leaves" ? 'leave-application' : 'compensatory-leave-request',
        page_title: this.leave_type == "Leaves" ? 'Leave Application' : 'Leave Request'
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    // console.log(data);
  }

  filterList(data) {
    // this.loadBodySkeleon();
    this.db.listSkeleton = true;

    if (!this.db.ismobile)
      this.db.tab_filter = true
    if (data && data.status == 'success') {

      let search: any = Object.fromEntries(
        // Object.entries(data.data).map(([key, value]) => [key, [key == 'status' ? '=' : 'Like', `%${value}%`]])
        Object.entries(data.data).map(([key, value]) => [key, ['Like', `%${value}%`]])

        // Object.entries(data.data).map(([key, value]) => [key, value])
      );

      if (this.doc_type && this.doc_type == 'Employee') {
        if (search && search['status']) {
          search['status'] = ['=', 'Active']
        }
      }

      this.search_data = search ? search : this.search_data;
      this.leave_list = [];
      this.no_products = false;
      // this.no_dash = false;
      this.page_no = 1;
      // this.filter = true;
      let doctypes = ['Project', 'Employee', 'Salary Slip', 'Leave Application']
      let checkDoc = doctypes.find((res, i) => { return this.doc_type == res })
      checkDoc ? null : this.db.leave_skeleton = true;
      // this.checkStatus(data)
      // this.get_tempate_and_datas(this.doc_type);
      if(this.leave_type == "Leaves"){
        this.leave_details(this.employee_id)
      }else{
        this.get_tempate_and_datas("Compensatory Leave Request")
      }
    }

    // let array = this.search_data ? JSON.parse(this.search_data) : [];
    // this.selected_filter_numbers = Object.keys(array).length
  }

  
  viewList = [
    { icon: 'grid-outline', view: 'Grid', isSelected: true },
    { icon: 'list-outline', view: 'Table', isSelected: false },
  ]

  sendViewType(data, i) {
    this.viewList.map((res, index) => {
      if (index == i) {
        res.isSelected = true;
      } else {
        res.isSelected = false;
      }
    })
    
    this.db.viewListType = data.view;
  }


}

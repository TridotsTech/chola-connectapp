import { Component, OnInit, OnChanges, SimpleChanges, Input, ViewChild, OnDestroy } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { FiltersComponent } from 'src/app/components/categories/filters/filters.component';
import { WebsiteFormsComponent } from 'src/app/components/forms/website-forms/website-forms.component';
// import { PaymentMoneyComponent } from 'src/app/components/meena-gas/payment-money/payment-money.component';
import { EditWebsiteFormsComponent } from 'src/app/components/forms/edit-website-forms/edit-website-forms.component';
import { DetailComponent } from 'src/app/components/customer-details/detail/detail.component';
import { PayrollDetailComponent } from 'src/app/components/customer-details/payroll-detail/payroll-detail.component';
import { QuickFormsComponent } from 'src/app/components/forms/quick-forms/quick-forms.component';
import { EditFormsPage } from '../../web-form/edit-forms/edit-forms.page';
import { trigger, state, style, transition, animate } from '@angular/animations';
// import { UpdateTimesheetComponent } from 'src/app/components/Timesheet/update-timesheet/update-timesheet.component';
// import { TaskKanbanComponent } from 'src/app/components/customer-details/task-kanban/task-kanban.component';
// import { NewTaskFormComponent } from '../../../components/task/new-task-form/new-task-form.component';
import { JobApplicantListPage } from '../../job-applicant-list/job-applicant-list.page';
import { FreezeColumnComponent } from 'src/app/components/freeze-column/freeze-column.component';
import { JobOpeningListComponent } from 'src/app/components/customer-details/job-opening-list/job-opening-list.component';
import { RegularizationFormComponent } from 'src/app/components/leaves-module/regularization-form/regularization-form.component';
import { RegularizationDetailComponent } from 'src/app/components/regularization-detail/regularization-detail.component';
import { LetterRequestDetailComponent } from 'src/app/components/letter-request-detail/letter-request-detail.component';
import { CreateLetterRequestComponent } from 'src/app/components/create-letter-request/create-letter-request.component';
import { BuybackFormComponent } from 'src/app/components/customer-details/buyback-form/buyback-form.component';
// import { BugsheetQuickformComponent } from 'src/app/components/bug-sheets/bugsheet-quickform/bugsheet-quickform.component';

@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.page.html',
  styleUrls: ['./sales-order-list.page.scss'],
  animations: [
    // trigger('fadeInOut', [
    //   state('void', style({
    //     opacity: 0
    //   })),
    //   transition('void <=> *', animate(1000)),
    // ])
  ]
})

export class SalesOrderListPage implements OnInit, OnChanges, OnDestroy {

  no_products = false;
  // no_dash = false;
  page_no = 1;
  page_size = 20;
  search_data: any = '';
  // loader = true;
  status = '';
  detail_doc: any = {};
  enabled_read_only = false;
  page_route: any;
  new_route: any;
  page_title: any;
  new_title: any;
  doc_type: any;
  filter = false;
  skeleton = true;
  segment_value = 'show_list';
  skeleton_detail = true;
  enable_reference = false;
  // Attendence:
  loader = true;
  // no_products = false;
  attendance_list: any;
  changedDate: any;
  time: any;
  checkin_time: any;
  checkout_time: any;
  checkin = true;
  checkout = true;
  spinner = true;
  attendence_page_no = 1;
  supplier_id: any;
  supplier_route = false;
  search_filter: any = [];
  order_detail: any;
  kanban: any = false;
  order_id: any;
  order_detail_list: any;
  success: any;
  active_tab: any = 'details';
  loader_gas = false;
  contact_number: any;
  contact_email: any;
  order_detail_id: any;
  creation = true;
  search_list_data: any;
  spinner_loader = false;
  @Input() routers: any;
  @Input() method: any;
  @Input() height_val: any;
  navigate_key: any;
  customer_number: any;
  event_data: any = [];
  event_route: any;
  loadDatas = true;
  task_route: any;
  task_data: any = [];
  @ViewChild(DetailComponent) appDetailComponent: DetailComponent | any;
  // @ViewChild(TaskKanbanComponent) taskKanbanFunction: TaskKanbanComponent | any;
  sub: any;
  select_proj_name: any;
  selected_filter_numbers: any = 0;
  search_text: any;
  search_date: any;
  open_notification = false;
  employee_task_list: any = [];
  json_filter: object = {};
  load_detail_screen = false;
  detailName: any;
  current_navigation_tab: any;
  today: any;
  sort_by_order: any;
  hideFilters: any;
  salary_no_route = true;
  showCalendar: any;
  currentMonth: any;
  currentYear: any;
  attendance_dashboard: any = [];
  selctedGroupBy: any;
  designationValue: any;
  viewList: any = [];
  salarySlipDate: any;
  selectedJobOpening: any;
  finalDataKeys: any = [];

  constructor(
    private loadingCtrl: LoadingController,
    public db: DbService,
    public route: ActivatedRoute,
    private modalCtrl: ModalController,
    private router: Router,
    public location: Location,
    public alertController: AlertController
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['get_saleslist']) {
      // this.zone.run(() => { this.list_data = changes['list_data'].currentValue });
      this.db.get_saleslist = changes['get_saleslist'].currentValue

      // this.search_filter = changes['search_filter'].currentValue
      // this.cdr.markForCheck(); 
    }
  }

  ngOnInit() {

    const currentDate = new Date();
    this.db.currentYearValue = currentDate.getFullYear(); // Returns the 4-digit year (e.g., 2024)
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 to convert to 1-based index
    this.db.currentMonthValue = currentMonth.toString().padStart(2, '0');

    this.months.map((res, i) => {
      if (i == (currentMonth - 1)) {
        res['selected'] = true;
      }
    })

    // this.today = Date.now()
    const parts = this.db.current_event_date.split('-');

    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);

    this.currentMonth = month
    this.db.currentMonth = month
    this.db.currentYear = year
    this.currentYear = year
    this.today = new Date();
    // this.db.selected_project_name = '';
    // this.db.full_width = true;
    // this.search_data = {}
    this.db.enabled_hidden_fields = false;
    if (this.db.kanban) {
      this.kanban = this.db.kanban;
      this.db.kanban = false;
    }
    this.db.load_notify_one = true;
    this.db.drop_down_value = {};
    let route = this.db.path ? this.db.path.split(' ') : '';
    if (this.doc_type != 'HD Ticket' && localStorage['docType'] != 'HD Ticket') {
      this.db.enable_detail = false;
    }
    if (this.db.permission_details && this.db.permission_details.length == 0) {
      this.db.permission_details = JSON.parse(
        localStorage['permission_details']
      );
    }
    if (this.routers && (this.routers == 'Customer' || this.routers == 'Lead')) {
      this.page_title = this.routers;
      this.get_tempate_and_datas(this.routers);
      this.db.enable_detail = true;
    } else {

      this.route.params.subscribe((res) => {


        if (res && (res['route_1'] == 'hd-ticket' || (res['route_1'] == 'timesheet' && !this.db.ismobile))) {
          this.db.full_width = true;

          if (this.doc_type == 'HD Ticket') {
            this.db.detail_route_bread = '';
            this.db.hd_ticket_show = false;
            this.db.profile_side_menu = false;
          }
        }

        if (res && res['route_1']) {

          if (res && res['route_1'] == 'job-applicant' && res['route_2'] && this.db.ismobile) {
            this.page_route = '/job-applicant-list';
            // this.page_route = res['route_1'];
            this.designationValue = res['route_2'];
            this.search_data = {
              job_title: ['=', res['route_2']]
            }
            this.search_data = JSON.stringify(this.search_data)
          } else if (res && res['route_1'] == 'job-applicant' && !this.db.ismobile) {
            this.page_route = '/job-applicant-list';
            // this.page_route = res['route_1'];
            this.search_data = {
              // job_title: ['=', this.db.selectedJobApplicant]
            }
            this.search_data = JSON.stringify(this.search_data)
          } else {
            this.page_route = res['route_1'];
          }


          let route = this.db.permission_details.find(
            (r) => r.route == '/list/' + this.page_route
          );

          if (!route) {
            route = this.db.permission_details.find(
              (r) => r.route == this.page_route
            );
          }

          route ? route['detail_page_route'] = '/detail/' + res['route_1'] : null;
          localStorage['selected_list'] = JSON.stringify(route);
          this.db.selected_list = localStorage['selected_list'] != "undefined" ? JSON.parse(localStorage['selected_list']) : null;



          let check = this.db.check_permission(route ? route.page : null, 'create');
          this.doc_type = route ? route.page : null;
          // console.log(this.doc_type,'Find this.doc_type')
          if (this.doc_type == "Holiday List") {
            this.navigate_key = "Holiday";
          }
          //  || this.doc_type == 'Lead'
          if (this.doc_type == 'Project' || this.doc_type == 'Employee' || this.doc_type == 'Holiday List') {
            this.db.viewListType = 'Grid';
          } else if (this.doc_type == 'Attendance' || this.doc_type == 'Probation Evaluation') {
            this.db.viewListType = 'Table';
          } else if (this.doc_type == 'Lead' || this.doc_type == 'Quotation' || this.doc_type == 'Opportunity' || this.doc_type == 'Customer' || this.doc_type == 'ToDo' || this.doc_type == 'Employee Advance') {
            this.db.viewListType = 'Table';
          } else if (this.doc_type == 'Task') {
            if (!this.db.project_emp_role) {
              this.db.viewListType = 'Gallery';
            } else {
              this.db.viewListType = 'Grid';
            }
          } else {
            this.db.viewListType = '';
          }

          if (this.doc_type == 'Attendance') {
            this.get_attendance();
          }

          this.page_title = route ? route.page_name : null;
          //  || this.doc_type == 'Task'
          if (((this.doc_type != 'Project' || (this.doc_type == 'Project' && this.db.ismobile)) && this.doc_type != 'Attendance' && this.doc_type != 'Salary Slip' && this.doc_type != 'Timesheet' && this.doc_type != 'Task') || (this.db.ismobile && (this.doc_type == 'Timesheet'))) {

            res['route_2'] ? null : this.get_tempate_and_datas(route ? route.page : null);
          }

          if (this.doc_type == 'Project' && !this.db.ismobile) {
            setTimeout(() => {
              this.db.get_saleslist['template_name'] = 'Project Mobile'
              this.skeleton = false
              this.db.bodySkeleton = false
            }, 500)
          }

          // if(this.doc_type == 'Task'){
          //   this.get_employee_task_list()
          // }


          if (check && route) {
            if (route.page_name == 'Purchase Orders') {
              route.page_name = 'purchase-order-form';
              this.detail_doc['name'] = route.page_name;
              this.detail_doc['route'] = '/forms/' + route.page_name;
            } else if (route.page_name == 'Customer Feedback') {
              route.page_name = 'customer-feedback';
              this.detail_doc['name'] = route.page_name;
              this.detail_doc['route'] = '/forms/' + route.page_name;
            } else {
              this.detail_doc['name'] = route.page_name;
              this.detail_doc['route'] = '/forms/' + res['route_1'];
            }
          }
        }

        // if (res && res['route_1'] && res['route_2']) {
        //   this.supplier_route = true;
        //   let search_data = { supplier: res['route_2'] };
        //   this.search_data = JSON.stringify(search_data);
        //   this.get_tempate_and_datas(this.db.selected_list.page);
        //   this.supplier_id = res['route_2'];
        // }

        // && res['route_1'] != 'Lead'
        // || res['route_1'] == 'Lead'
        // || res['route_1'] == 'Lead'
        // && res['route_1'] != 'Opportunity'
        // || res['route_1'] == 'Opportunity' 
        // || res['route_1'] == 'Opportunity' 
        if (res && res['route_1'] && res['route_2'] && res['route_1'] != 'project' && res['route_1'] != 'employee' && res['route_1'] != 'salary-slip') {
          if (res['route_1'] == 'Lead' || res['route_1'] == 'Opportunity') {
            this.db.rightSideDetailSection = true;
          }
          this.db.selectedId = res['route_2']
          this.db.enable_material = true;
          this.load_detail_screen = true;
          this.db.enable_detail = true;
          this.skeleton_detail = false;
          this.db.skeleton_detail = false;
          this.db.show_detail_datas = true;
          this.db.load_name = res['route_2'];
          this.db.detail_route_bread = res['route_2'];
          this.detailName = res['route_2'];
          this.get_doc_detail(res['route_2']);
        } else if ((res['route_1'] == 'project' || res['route_1'] == 'salary-slip' || res['route_1'] == 'employee') && res['route_2'] && !res['route_3']) {
          this.db.full_width = true;
          this.db.load_name = res['route_2']
          this.db.detail_route_bread = res['route_2'];
        } else if ((res['route_1'] == 'project' || res['route_1'] == 'salary-slip' || res['route_1'] == 'employee') && res['route_2'] && res['route_3']) {
          this.db.full_width = true;
          this.db.load_name = res['route_2']
          this.db.detail_route_bread = res['route_2'];
          this.current_navigation_tab = res['route_3']
        } else {
          this.load_detail_screen = false;
          this.db.enable_material = false;
          this.db.enable_detail = false;
        }

        if (res['route_1'] == 'bug-sheet') {
          this.supplier_route = true;
        }

        if (res['route_1'] == 'project' && !res['route_2']) {
          if (
            localStorage['project_filter'] &&
            JSON.parse(localStorage['project_filter'])
          ) {
            localStorage.removeItem('project_filter');
          }
        }

        // if (res && ((res['route_1'] != 'meeting') && (res['route_1'] != 'tasks'))) {
        // if (this.check_filter()) {
        //   this.db.search_fields({ doctype: this.doc_type }).subscribe((res) => {
        //     if (res.status && res.status == 'failed') {
        //       this.search_filter = [];
        //     } else {
        //       this.search_filter = res['message'];
        //     }
        //   });
        // }
        // }
      });

      // let that = this
      this.sub = this.db.selectedYearSubject.subscribe((res) => {
        // console.log('this.db.path ',this.db.path);
        // console.log('this.db.path ',this.doc_type);

        if (this.db.path.includes('/list/salary-slip')) {
          this.doc_type = 'Salary Slip'
        } else if (this.db.path == '/list/employee-advance') {
          this.doc_type = 'Employee Advance'
        } else if (this.db.path == '/list/expense-claim') {
          this.doc_type = 'Expense Claim'
        }

        // res == 'getYear' && 
        if (res && this.db.selected_year && (this.db.path.includes('/list/salary-slip') || this.db.path == '/list/employee-advance' || this.db.path == '/list/expense-claim')) {
          this.db.skeletonLoader = true;
          this.db.bodySkeleton = false;
          this.page_no = 1
          this.no_products = false;
          this.db.get_saleslist.data = [];
          // this.loadBodySkeleon('');
          this.db.currentYearValue = this.db.selectedYear
          // this.get_tempate_and_datas(this.doc_type)
          if (this.doc_type == 'Event') {
            this.loadBodySkeleon('');
            this.skeleton = true;
            this.page_no = 1
            this.no_products = false

          } else {
            this.get_tempate_and_datas(this.db.selected_list.page);
            this.get_dashboard_details(this.db.current_event_date)
          }
          this.db.selected_year = false
        }


      })

      this.db.breadCrumb.subscribe((res) => {
        if (res && (res == 'timesheet' || res == 'task' || res == 'tickets')) {
          this.db.full_width = true;
        }
      })

    }


    this.sub = this.db.select_drop_down.subscribe((res: any) => {
      // const topModal = this.modalCtrl.getTop();
      // res.name != 'ALL' && 

      if (this.db.SubjectEvent) {
        if (!this.kanban && res.fieldname == 'project' && this.doc_type == 'Task' && this.db.ismobile) {

          // this.db.selected_project_name = res;
          let search: any;
          if (this.search_data != '') {
            search = JSON.parse(this.search_data)
            search[res.fieldname] = res.name == "ALL" ? '' : res.name
          } else {
            search = { project: res.name, };
          }
          this.search_data = JSON.stringify(search)
          this.page_no = 1;
          this.filter = true;
          this.get_tempate_and_datas('Task');

        }
      }

    });


    this.db.load_template_datas.subscribe((res) => {
      if (res == 'Success') {
        this.page_no = 1;
        this.filter = true;
        this.skeleton = true;
        this.get_tempate_and_datas(this.doc_type);
      }
    });


    this.db.load_template_datas_list.subscribe((res) => {
      if (res && res == 'Success' && this.db.loadTemplateList) {
        this.db.loadTemplateList = false;
        this.search_data = '';
        this.page_no = 1;
        if (this.doc_type == 'HD Ticket') {
          this.filter = true;
          if (!this.db.ismobile) {
            this.db.full_width = true
          }
        }
        this.get_tempate_and_datas(this.doc_type);
      }
    });

    this.checkSkeletons()
    this.checkFilters();
    if (this.doc_type != "Project") {
      this.get_dashboard_details(this.db.current_event_date)
    }
    if ((this.db.selected_list && this.db.selected_list.page && this.db.selected_list.page == 'Attendance') && this.db.ismobile) {
      this.get_attendance_dashboard_counts()
      // this.get_ess_dashboard()
    }

    // this.db.sendTaskSubmit.subscribe(res => {
    //   if(res == 'Success' && this.db.updateTaskList){
    //     this.get_tempate_and_datas(this.doc_type);
    //   }
    // })

    this.db.store_old_pagination = 0;

    this.db.clearSearchFilterInList.subscribe(resFilter => {
      if (resFilter == 'Success' && this.db.clearFilterAccess && this.doc_type != 'Bug Sheet') {
        this.search_data = {};
        this.page_no = 1;
        this.get_tempate_and_datas(localStorage['docType']);
      }
    })

    if (this.doc_type == 'Bug Sheet' && this.db.project_role && !this.db.ismobile && localStorage['selectedBugSheetProject']) {
      let eve = {
        name: localStorage['selectedBugSheetProject']
      }
      this.changeBugSheetFilter(eve);
    }
  }

  checkFilters() {
    // 'Project' 'Issue',, 'Salary Slip', 
    let data = ['Project', 'Task', 'Holiday List', 'Employee', 'Leave Application'];
    let value = data.find(res => { return res == this.doc_type });
    this.hideFilters = value ? false : true;
  }

  changeBugSheetFilter(eve) {
    let data: any
    data = ''
    console.log(eve)
    data = {
      project: eve.name
    }
    this.search_data = { ...data };
    this.page_no = 1;
    this.search_data = JSON.stringify(this.search_data)
    this.get_tempate_and_datas('Bug Sheet');

    // this.db.clearSearchFilterInList.subscribe(resFilter => {
    //   if (resFilter == 'Success' && this.db.clearFilterAccess) {
    //     this.search_data = {};
    //     this.page_no = 1;
    //     this.get_tempate_and_datas('Bug Sheet');
    //   }
    // })
  }

  receiveBugscreenFilter(eve) {
    let data: any
    data = ''
    console.log(eve)
    if (eve.filterType == 'Module') {
      data = {
        module: eve.module
      }
    } else {
      data = {
        screen: eve.screen
      }
    }
    this.search_data = { ...data };
    this.page_no = 1;
    this.search_data = JSON.stringify(this.search_data)
    this.get_tempate_and_datas('Bug Sheet');
  }

  checkBorderB(){
    if(this.doc_type == 'Employee Letter Request' || this.doc_type == 'Resignation Letter' || this.doc_type == 'Job Opening' || this.doc_type == 'Leave Withdrawal' || this.doc_type == 'Probation Evaluation'){
      return true
    }else{
      return false
    }
  }

  skeleton_value: any;
  checkSkeletons() {

    let data: any = []

    if (this.db.ismobile) {
      data = [
        { doc_type: "Salary Slip", tabs: this.db.hr_manager_role ? true : false, tabs_len: [0, 1], enable_dashboard: this.db.hr_manager_role ? true : false, dash_len: [0, 1], filter_len: [0, 1, 2, 3, 4], search: true, list: true, list_type: '3x2 col', list_len: [0, 1, 2, 3, 4] },
        { doc_type: "Employee Advance", tabs: true, tabs_len: [0, 1, 2, 3, 4], enable_dashboard: false, dash_len: [0, 1], dashboard_count: true, filter_len: [0, 1, 2, 3, 4], search: true, month_filter: true, list: true, list_type: '3x2 col', list_len: [0, 1, 2, 3, 4] },
        { doc_type: "Expense Claim", tabs: true, tabs_len: [0, 1, 2, 3, 4], enable_dashboard: false, dash_len: [0, 1], dashboard_count: true, filter_len: [0, 1, 2, 3, 4], search: true, month_filter: true, list: true, list_type: '3x2 col', list_len: [0, 1, 2, 3, 4] },
        { doc_type: "Employee Grievance", tabs: true, tabs_len: [0, 1, 2, 3, 4], enable_dashboard: false, dash_len: [0, 1], dashboard_count: false, filter_len: [0, 1, 2, 3, 4], search: true, month_filter: false, list: true, list_type: 'left3_right1', list_len: [0, 1, 2, 3, 4], list_len_count: 10 },
        { doc_type: "Employee", tabs: false, tabs_len: [0, 1], enable_dashboard: this.db.employee_role ? false : true, dash_len: [0, 1], filter_len: [0, 1, 2, 3, 4], search: true, list: true, list_type: 'img_list', list_len_count: 15 },
        { doc_type: "Job Applicant", tabs: true, tabs_len: [0, 1, 2, 3, 4], enable_dashboard: false, dash_len: [0, 1], filter_len: [0, 1, 2, 3, 4], search: true, list: true, list_type: 'img_list', list_len_count: 15 },
        { doc_type: "Holiday List", tabs: false, tabs_len: [0, 1], enable_dashboard: true, dash_len: [0, 1], filter_len: [0, 1, 2, 3, 4], search: true, list: true, list_type: 'holiday_list', list_len_count: 15, img_sec: true },
        { doc_type: "Lead", tabs: true, tabs_len: [0, 1], enable_dashboard: false, dash_len: [0, 1], search: true, list: true, list_type: 'lead', list_len_count: 15, },
        { doc_type: "Opportunity", tabs: true, tabs_len: [0, 1], enable_dashboard: false, dash_len: [0, 1], search: true, list: true, list_type: 'lead', list_len_count: 15, },
        { doc_type: "Event", tabs: false, tabs_len: [0, 1], enable_dashboard: false, dash_len: [0, 1], search: true, list: true, list_type: '3x2 col', list_len_count: 15, },
        { doc_type: "ToDo", tabs: false, tabs_len: [0, 1], enable_dashboard: false, dash_len: [0, 1], search: true, list: true, list_type: '3x2 col', list_len_count: 15, },
        { doc_type: "Customer Feedback", tabs: false, tabs_len: [0, 1], enable_dashboard: false, dash_len: [0, 1], search: true, list: true, list_type: 'avatar_left3_right1', list_len_count: 15, },
        { doc_type: "Quotation", tabs: true, tabs_len: [0, 1, 2, 3, 4, 5], enable_dashboard: false, dash_len: [0, 1], search: true, list: true, list_type: 'avatar_left2_right2', list_len_count: 15, },
        { doc_type: "Customer", tabs: false, tabs_len: [0, 1], enable_dashboard: false, dash_len: [0, 1], search: true, list: true, list_type: 'avatar_left3_right1', list_len_count: 15, },
        { doc_type: "Bug Sheet", tabs: false, tabs_len: [0, 1], enable_dashboard: false, dash_len: [0, 1], search: true, list: true, list_type: 'avatar_left3_right1', list_len_count: 15, },
        { doc_type: "Test Case", tabs: false, tabs_len: [0, 1], enable_dashboard: false, dash_len: [0, 1], search: true, list: true, list_type: 'avatar_left3_right1', list_len_count: 15, },
        { doc_type: "Issue", tabs: true, tabs_len: [0, 1, 2, 3, 4], enable_dashboard: false, dash_len: [0, 1], dashboard_count: false, filter_len: [0, 1, 2, 3, 4], search: true, month_filter: false, list: true, list_type: 'left3_right1', list_len: [0, 1, 2, 3, 4], list_len_count: 10 },
        { doc_type: "Compensatory Leave Request", tabs: false, tabs_len: [0, 1, 2, 3, 4], enable_dashboard: false, dash_len: [0, 1], list: true, list_type: '3x2 col', list_len: [0, 1, 2, 3, 4] },
        { doc_type: "Leave Withdrawal", tabs: false, tabs_len: [0, 1, 2, 3, 4], enable_dashboard: false, dash_len: [0, 1], list: true, list_type: '3x2 col', list_len: [0, 1, 2, 3, 4,5,6,7,8,9,10] },
        { doc_type: "Resignation Letter", tabs: false, tabs_len: [0, 1, 2, 3, 4], enable_dashboard: false, dash_len: [0, 1], list: true, list_type: '3x2 col', list_len: [0, 1, 2, 3, 4,5,6,7,8,9,10] },
        { doc_type: "Job Opening", tabs: false, tabs_len: [0, 1, 2, 3, 4], enable_dashboard: false, dash_len: [0, 1], list: true, list_type: '3x2 col', list_len: [0, 1, 2, 3, 4,5,6,7,8,9,10] },
        { doc_type: "Probation Evaluation", tabs: false, tabs_len: [0, 1, 2, 3, 4], enable_dashboard: false, dash_len: [0, 1], list: true, list_type: '3x2 col', list_len: [0, 1, 2, 3, 4,5,6,7,8,9,10] },
        { doc_type: "Voluntary PF", tabs: false, tabs_len: [0, 1, 2, 3, 4], enable_dashboard: false, dash_len: [0, 1], list: true, list_type: '3x2 col', list_len: [0, 1, 2, 3, 4,5,6,7,8,9,10] },
        { doc_type: "Regularization", tabs: false, tabs_len: [0, 1, 2, 3, 4], enable_dashboard: false, dash_len: [0, 1], list: true, list_type: '3x2 col', list_len: [0, 1, 2, 3, 4,5,6,7,8,9,10] },
      ]
    } else {
      data = [
        { doc_type: "Salary Slip", filters: this.db.hr_manager_role ? true : false, dashboard: 'date-dashboard', enable_dashboard: false, date_dash: this.db.hr_manager_role ? true : false, dash_len: [0, 1, 2], filter_len: [0, 1, 2, 3, 4] },
        // { doc_type: "Salary Slip", filters: this.db.hr_manager_role ? true : false, dashboard: 'date-dashboard', enable_dashboard: this.db.hr_manager_role ? true : false, date_dash: this.db.hr_manager_role ? true : false, dash_len: [0, 1, 2], filter_len: [0, 1, 2, 3, 4] },
        { doc_type: "Leave Application", filters: true, dashboard: 'dashboard', enable_dashboard: true, date_dash: false, dash_len: [0, 1, 2, 3], filter_len: [0, 1, 2, 3] },
        { doc_type: "Employee", filters: true, dashboard: 'dashboard', enable_dashboard: true, date_dash: false, dash_len: [0, 1, 2, 3], filter_len: [0, 1], custom_list: true },
        { doc_type: "Project", filters: true, dashboard: 'dashboard', enable_dashboard: true, date_dash: false, dash_len: [0, 1, 2, 3], filter_len: [0, 1, 2, 3], custom_list: true },
        { doc_type: "Issue", filters: true, dashboard: 'dashboard', enable_dashboard: true, date_dash: false, dash_len: [0, 1, 2, 3], filter_len: [0, 1, 2] },
        { doc_type: "Event", filters: true, dashboard: 'dashboard', enable_dashboard: true, date_dash: false, dash_len: [0, 1, 2, 3], filter_len: [0, 1, 2] },
        { doc_type: "Holiday List", filters: false, dashboard: 'dashboard', enable_dashboard: true, date_dash: false, dash_len: [0, 1, 2, 3], custom_list: true },
        // { doc_type: "Task", filters: true, dashboard: 'dashboard', enable_dashboard: true, date_dash: false, dash_len: [0, 1, 2, 3], filter_len: [0, 1, 2]},

        { doc_type: "Attendance", filters: true, enable_dashboard: false, custom_list: true, list_len_count: 15, },
        { doc_type: "Employee Advance", filters: true, enable_dashboard: false, custom_list: true, list_len_count: 15, },
        { doc_type: "Task", filters: true, enable_dashboard: false, custom_list: true, list_len_count: 15, },
        { doc_type: "Expense Claim", filters: true, enable_dashboard: false, custom_list: true, list_len_count: 15, },
        { doc_type: "Job Applicant", filters: true, enable_dashboard: false, custom_list: true, list_len_count: 15, },
        { doc_type: "Bug Sheet", filters: true, filter_len: [0, 1, 2], enable_dashboard: false },
        { doc_type: "Test Case", filters: true, filter_len: [0, 1, 2], enable_dashboard: false },
        { doc_type: "Employee Grievance", filters: true, enable_dashboard: false, custom_list: true, list_len_count: 15, },
        { doc_type: "Compensatory Leave Request", filters: true, enable_dashboard: false, custom_list: false, list_len_count: 15, },
        { doc_type: "Lead", filters: true, enable_dashboard: false, custom_list: true, list_len_count: 15, },
        { doc_type: "Opportunity", filters: true, enable_dashboard: false, custom_list: true, list_len_count: 15, },
        { doc_type: "Quotation", filters: true, enable_dashboard: false, custom_list: true, list_len_count: 15, },
        { doc_type: "Customer Feedback", filters: true, enable_dashboard: false, custom_list: false },


        // { doc_type: "Attendance", filters: false, dashboard: 'dashboard', enable_dashboard: true, date_dash: true, dash_len: [0, 1, 2, 3], filter_len: [0, 1, 2, 3], custom_list: true },

        // 'Project', 'Task', 'Holiday List', 'Salary Slip', 'Issue', 'Employee', 'Leave Application'
      ];
    }


    // console.log(this.doc_type,"this.doc_type")
    let value = data.find(res => {
      if (res.doc_type == this.doc_type) return res
    });

    // console.log(value,'value')


    this.skeleton_value = value
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // {
  //   doctype: "Salary Slip"
  // },


  pagination_count = [
    { 'count': 20, 'selected': true },
    { 'count': 50, 'selected': false },
    { 'count': 100, 'selected': false }
  ]
  plus_count = 20;
  send_pagination(data, i) {


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
    this.plus_count += this.db.store_old_pagination ? this.db.store_old_pagination : 20;
    this.send_pagination_count(this.plus_count)
  }

  send_pagination_count(pagination) {
    this.page_no = 1
    this.page_size = pagination;
    if (this.doc_type == "Attendance") {
      this.get_ess_dashboard()
    } else {

      this.get_tempate_and_datas(this.doc_type);

    }
  }

  check_filter() {
    // "Project", 
    // "Employee Advance", 
    // , "Employee Grievance"
    // , "Task"
    // "Compensatory Leave Request",
    let no_filters = ["Quality Feedback", "HD Ticket", "Quality Feedback", "Supplier", "Timesheet"]
    for (let i = 0; i < no_filters.length; i++) {
      if (no_filters[i] == this.doc_type) {
        return false;
      }
    }

    return true;
  }

  open_notification_focus() {
    this.open_notification = !this.open_notification
    this.db.hasClass = true;
  }

  fab_() {
    let val;
    val = document.getElementById('fab');
    val.click();
    this.db.hasClass = false;
    this.open_notification = false;
  }

  ionViewWillEnter() {
    this.skeleton = true;
    this.page_no = 1;
    this.no_products = false;
    this.db.get_saleslist = {};
    this.db.listSkeleton = false;
    this.db.bodySkeleton = false;

    this.getViewList();
    // if(this.doc_type == "Expense Claim" && this.db.employee_role && this.db.ismobile)
    //   this.db.tabs_button(this.db.get_saleslist.options,"Pending",'value')
    // this.db.selectedMonth = undefined
    if (!this.db.selectedMonth) {
      const date = new Date();
      this.db.selectedMonth = date.getMonth() + 1
      this.db.selectedYear = date.getFullYear()
    }

    if (this.doc_type == 'Employee Advance') {
      this.db.tab_filter = true;
    }

    if (this.doc_type == 'Employee') {
      this.page_size = 21;
      this.db.get_employee_type_counts("Employee Dashboard", this.db.current_event_date)
    } else if (this.doc_type == 'Attendance') {
      this.get_dashboard_details(this.db.current_event_date)
      this.page_size = 21;
    }

    this.db.hasClass = false;
    this.db.total_notification_count = 0;
    // this.db.selected_project_name = ''
    this.db.drop_down_value = {};
    this.db.enabled_hidden_fields = false;
    this.open_notification = false;
    if (!this.db.ismobile && this.db.get_saleslist && this.db.get_saleslist.options) {
      this.db.tab_buttons(this.db.get_saleslist.options, 'ALL', '');
    }
    this.kanban = false;
    if (this.doc_type != 'HD Ticket' && !this.load_detail_screen) {
      this.db.enable_detail = false;
    }
    this.doc_type = this.routers ? this.routers : this.doc_type;
    this.db.event_list_form = false;


    // if (this.check_filter() && this.doc_type != 'Salary Slip') {
    if (this.check_filter()) {
      this.db.search_fields({ doctype: this.doc_type }).subscribe((res) => {
        if (res.status && res.status == 'failed') {
          this.search_filter = [];
        } else {
          this.search_filter = res['message'];

          if (this.db.ismobile && this.doc_type == 'Employee') {
            // this.search_filter.push({ "fieldname": "favourite", "label": "Favourite", "fieldtype": "Check" })
          }

          this.removeFilter()
        }
        this.db.search_filter = this.search_filter;

      });
    }

    if (this.event_route == 'meeting') {
      this.json_filter['event_category'] = "Meeting"

    } else if ((this.doc_type != 'Timesheet') || (this.db.ismobile && (this.doc_type == 'Timesheet'))) {
      // if(this.doc_type != "Project"){
      //   this.get_tempate_and_datas(this.doc_type);
      // }
      this.get_tempate_and_datas(this.doc_type);
      // else{
      //   setTimeout(()=>{
      //     this.db.get_saleslist['template_name'] = 'Project Mobile'
      //     this.skeleton = false
      //     this.db.bodySkeleton = false
      //   },4000)

      //   if(this.db.ismobile){
      //     this.get_tempate_and_datas(this.doc_type);
      //   }
      // }
    }

    // if(this.doc_type == 'Job Applicant' && !this.db.ismobile){
    //   this.skeleton = false;
    //   this.spinner_loader = false;
    //   console.log('Job Opening Popup')
    //   this.openJobApplicant();
    // }


    if (!this.db.ismobile && this.doc_type == 'Timesheet') {
      this.skeleton = false;
      this.spinner_loader = false;
      this.loadDatas = true;
    }

    // else {
    //   this.get_tempate_and_datas(this.doc_type);
    // }

    if (this.db.ismobile) {
      // this.db.get_permission_details();
    }

    if (this.db.kanban) {
      this.kanban = this.db.kanban;
      this.db.kanban = false;
    }

    if (this.doc_type == 'HD Ticket' && this.db.load_notify_one) {
      // this.page_no_notification = 0;
      this.db.get_notification_list()
    }
    //  || this.doc_type == 'Task'
    if (this.doc_type == 'Timesheet') {
      this.db.full_width = true;
    }

    if (this.doc_type == "Attendance" && !this.db.ismobile) {
      this.get_ess_dashboard()
    }

    if (this.doc_type == 'Bug Sheet' && !this.db.ismobile && localStorage['docType'] == 'Bug Sheet') {
      this.db.clearFilterAccess = true;
      // this.db.clearSearchFilterInList.next('Success');
    }

  }


  removeFilter() {
    const unWantedFields = [{ type: 'Link', options: 'Employee' }, { type: 'Link', options: "Department" }, { type: 'Link', options: "Salary Structure" }];

    for (let i = 0; i < this.search_filter.length; i++) {
      for (let j = 0; j < unWantedFields.length; j++) {
        if (this.db.employee_role) {
          if (this.search_filter[i]['fieldname'] == 'employee_name') {
            this.search_filter.splice(i, 1)
          }

          if ((this.search_filter[i]['fieldtype'] == unWantedFields[j]['type']) && (this.search_filter[i]['options'] == unWantedFields[j]['options'])) {
            this.search_filter.splice(i, 1)
          }
        }

      }
    }

    this.db.search_filter = this.search_filter;
  }

  ionViewWillLeave() {

    // this.search_data = ""
    this.kanban = false;
    this.db.kanban = false;

    // this.db.profile_side_menu =! this.db.profile_side_menu
    // this.db.get_saleslist = {}
    // this.search_filter = []
    // this.db.searchDataValues = this.search_data

    this.selectedJobOpening = '';

    if (this.doc_type == 'Bug Sheet' && !this.db.ismobile) {
      this.search_data = {}
    }
    this.db.highlightedDates = []
  }


  async supplier_filter(event) {
    const modal = await this.modalCtrl.create({
      component: FiltersComponent,
      cssClass: this.db.ismobile ? 'job-detail-popup' : 'filter-popup',
      componentProps: {
        supplier_id: this.supplier_id,
        search_filter: this.search_filter,
        search_data: (this.page_title == 'meeting' || this.page_title == 'tasks') ? this.json_filter : (this.search_data && this.search_data != '' && Object.keys(this.search_data).length != 0 ? JSON.parse(this.search_data) : {}),
        doctype: this.doc_type,
        noClearButton: true
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.filterList(data);
    }
  }

  filterList(data) {
    this.loadBodySkeleon('');
    this.db.listSkeleton = true;

    if (!this.db.ismobile)
      this.db.tab_filter = true
    if (data && data.status == 'success' && data.data && (this.page_title != 'meeting' && this.page_title != 'tasks')) {


      // if(this.doc_type == "Salary Slip" && !this.db.ismobile){

      // }

      let search: any = Object.fromEntries(
        // Object.entries(data.data).map(([key, value]) => [key, [key == 'status' ? '=' : 'Like', `%${value}%`]])
        Object.entries(data.data).map(([key, value]) => [key, ['Like', `%${value}%`]])

        // Object.entries(data.data).map(([key, value]) => [key, value])
      );

      // if (this.doc_type && this.doc_type == 'Employee') {
      //   if (search && search['status']) {
      //     search['status'] = ['=', 'Active']
      //   }
      // }

      if ((this.doc_type == "Salary Slip" && !this.db.ismobile) && (search && search.employee)) {
        search.employee = data.data.employee
      }

      this.search_data = search ? JSON.stringify(search) : this.search_data;
      this.db.get_saleslist.data = [];
      this.no_products = false;
      // this.no_dash = false;
      this.page_no = 1;
      this.filter = true;
      let doctypes = ['Project', 'Employee', 'Salary Slip', 'Leave Application']
      let checkDoc = doctypes.find((res, i) => { return this.doc_type == res })
      checkDoc ? null : this.skeleton = true;
      this.checkStatus(data)
      this.get_tempate_and_datas(this.doc_type);


    } else if (data && data.status == 'success' && this.page_title == 'meeting') {

      this.search_date = data.data.starts_on;
      this.page_no = 1;
      this.filter = true;
      this.skeleton = true;
      data.data['event_category'] = "Meeting";
      this.json_filter = data.data;

    } else if (data && data.status == 'success' && this.page_title == 'tasks') {
      this.search_date = data.data.date;
      this.page_no = 1;
      this.filter = true;
      this.skeleton = true;
      data.data['event_category'] = "Task";
      this.json_filter = data.data;
    }

    // let array = this.search_data ? JSON.parse(this.search_data) : [];
    // this.selected_filter_numbers = Object.keys(array).length

    let array = this.search_data ? JSON.parse(this.search_data) : null;
    // console.log(Object.keys(array), 'Filter Count')
    this.selected_filter_numbers = 0;
    Object.keys(array).map(res => {
      if (res != 'status') {
        this.selected_filter_numbers += 1
      }
    })
  }




  checkStatus(data) {
    if (data && data.status == 'success' && this.db.get_saleslist && this.db.get_saleslist.options && this.db.get_saleslist.options.length != 0) {
      let findValue = this.db.get_saleslist.options.find(res => { return res.isActive })
      if (findValue && findValue.name != 'ALL') {
        let search = {};
        this.search_data = JSON.parse(this.search_data)
        findValue.route ? search['status'] = findValue.route : null;
        this.search_data = { ...this.search_data, ...search };
        this.search_data = JSON.stringify(this.search_data);
      }
    }
  }

  clear_txt(event) {
    // this.search_text = ""
    // this.search_data = {}
    // this.get_tempate_and_datas(this.doc_type);

    this.loadBodySkeleon('');

    this.db.listSkeleton = true;

    if (this.doc_type == 'Event' || this.doc_type == 'ToDo') {
      this.search_data = ''
    } else {
      this.search_data = (this.search_data && this.doc_type != "Holiday List") ? JSON.parse(this.search_data) : {}
      this.search_text = ""
      if (this.search_data && this.search_data.employee_name) {
        delete this.search_data.employee_name
      } else if (this.search_data && this.search_data.name) {
        delete this.search_data.name
      } else if (this.search_data && this.search_data.subject) {
        delete this.search_data.subject
      } else {
        this.search_data = {}
      }
    }


    if (this.doc_type == 'Event') {
      this.search_data = '';
      this.json_filter['event_category'] = "Meeting"

    } else {
      this.search_data = this.doc_type == "Holiday List" ? "" : this.search_data ? JSON.stringify(this.search_data) : {}
      this.get_tempate_and_datas(this.doc_type);
    }

  }

  async task_filter() {
    const modal = await this.modalCtrl.create({
      component: FiltersComponent,
      cssClass: 'web_site_form',
      componentProps: {
        projects: this.db.get_saleslist ? this.db.get_saleslist.projects : null,
        selected_project: this.select_proj_name,
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data && data.status == 'Success') {
      if (data.selected_project_name != 'ALL') {
        let datas = { project: data.selected_project_name };
        this.search_data = JSON.stringify(datas);
        this.db.get_saleslist.data = [];
        this.no_products = false;
        this.page_no = 1;
        this.filter = true;
        this.skeleton = true;
      } else {
        this.search_data = '';
      }
      this.select_proj_name = data.selected_project_name;
      this.get_tempate_and_datas(this.doc_type);
    }
  }

  get_attendance() {
    let today = new Date();
    this.time = new Date().toLocaleTimeString([], { hour12: false });
    this.changedDate = '';
    let pipe = new DatePipe('en-US');
    let ChangedFormat = pipe.transform(today, 'YYYY-MM-dd');
    this.changedDate = ChangedFormat;
    // this.segment_value = 'check';
    // this.db.getCurrentLocation();
    // this.get_attendance_list();
    // this.checkIn();
  }

  checkIn() {
    this.db.checkIn({ date: this.changedDate }).subscribe((res) => {
      if (res && res.data.length != 0) {
        this.db.emp_checkIn({ id: res.data[0].name }).subscribe((res) => {
          if (res && res.data) {
            res.data.map((res) => {
              this.spinner = false;
              if (res.log_type == 'IN') {
                this.checkin = false;
                // this.checkin_time = res.time;
                let data = res.time.split(' ');
                this.checkin_time = data[1];
              } else if (res.log_type == 'OUT') {
                this.checkout = false;
                // this.checkout_time = res.time;
                let data = res.time.split(' ');
                this.checkout_time = data[1];
              }
            });
          }
        });
      } else {
        this.spinner = false;
      }
    });
  }

  tabs_array = [
    { name: 'All', route: 'All' },
    { name: 'Completed', route: 'Completed' },
    { name: 'Draft', route: 'Draft' },
    { name: 'To Bill', route: 'To Bill' },
    { name: 'To Receive and Bill', route: 'To Receive and Bill' },
    { name: 'On Hold', route: 'On Hold' },
    { name: 'To Receive', route: 'To Receive' },
    { name: 'Cancelled', route: 'Cancelled' },
    { name: 'Closed', route: 'Closed' },
    { name: 'Delivered', route: 'Delivered' },
  ];

  select_change(eve: any) {

    this.kanban = false;
    this.skeleton = true;
    this.db.get_saleslist.data = [];
    this.no_products = false;
    this.page_no = 1;

    if (eve.name != 'ALL') {
      let search_data: any = {};
      // let search_data_1 = JSON.parse(this.search_data)
      let search_data_1 = this.search_data ? JSON.parse(this.search_data) : {};
      search_data_1.project = eve.name;
      search_data = { ...search_data, ...search_data_1 };
      this.search_data = JSON.stringify(search_data);
    } else if (eve.name == 'ALL') {
      let search_data: any = {};
      // let search_data_1 = JSON.parse(this.search_data);
      let search_data_1 = this.search_data ? JSON.parse(this.search_data) : {};
      search_data_1.project ? delete search_data_1.project : null;
      search_data = { ...search_data, ...search_data_1 };
      this.search_data = JSON.stringify(search_data);
    }

    this.filter = true;
    this.get_tempate_and_datas(this.doc_type);
  }

  menu_name(eve: any) {
    if (this.doc_type && (this.doc_type == 'Employee Advance' || this.doc_type == 'Expense Claim')) {
      if (eve.name) {
        let index = this.months.findIndex(res => { return res.name == eve.name })
        if (index >= 0) {
          index = index + 1;
          this.db.currentMonthValue = index.toString().padStart(2, '0');
          this.db.selectedMonth = index
          // this.db.currentMonthValue = index;
          this.skeleton = true;
          this.db.get_saleslist.data = [];
          this.page_no = 1
          this.no_products = false
          this.get_tempate_and_datas(this.doc_type);
          this.get_dashboard_details(this.db.current_event_date)
        }
      }
    } else if (this.doc_type && (this.doc_type == 'Event')) {
      let index = this.months.findIndex(res => { return res.name == eve.name })
      if (index >= 0) {
        index = index + 1;
        this.db.currentMonthValue = index.toString().padStart(2, '0');
        this.db.selectedMonth = index
        this.skeleton = true;
        this.page_no = 1
        this.no_products = false

      }
    } else {
      this.loadBodySkeleon('tab');
      this.menu_name1(eve)
    }
  }

  menu_name1(eve: any) {
    // {"status":["in",["Draft", "Unpaid"]]}

    // this.db.tabs_button(this.db.get_saleslist.options,eve.name,'value')
    this.navigate_key = eve.name;
    // this.db.enable_detail = false
    if (this.doc_type != 'Project' && this.doc_type != 'Task' && this.doc_type != 'Bug Sheet' && this.doc_type != 'Holiday List') {
      this.skeleton = true;
    }


    this.db.get_saleslist.data = [];

    this.no_products = false;
    this.page_no = 1;

    // if(eve.route == 'ALL'){
    //   this.search_data = '';
    // }else{
    // let search_data = { 'status':eve.route }
    // this.search_data = JSON.stringify(search_data);
    // }

    if (eve.route != 'ALL') {

      if (this.doc_type == 'Employee Advance') {
        let search_data: any = {};
        let search_data_1 = this.search_data ? JSON.parse(this.search_data) : {};
        search_data_1.status = ['=', eve.route];
        search_data = { ...search_data, ...search_data_1 };
        this.search_data = JSON.stringify(search_data);
        // this.db.store_old_tab = this.search_data;
      } else {
        let search_data: any = {};
        let search_data_1 = (this.search_data && Object.keys(this.search_data).length != 0) ? JSON.parse(this.search_data) : {};
        search_data_1.status = eve.route;
        search_data = { ...search_data, ...search_data_1 };
        this.search_data = JSON.stringify(search_data);
        // this.db.store_old_tab = this.search_data;
      }

    } else if (eve.route == 'ALL') {
      // this.db.store_old_tab = '';
      let search_data: any = {};
      // let search_data_1 = JSON.parse(this.search_data)
      let search_data_1 = (this.search_data && Object.keys(this.search_data).length != 0) ? JSON.parse(this.search_data) : {};

      search_data_1.status ? delete search_data_1.status : null;
      search_data = { ...search_data, ...search_data_1 };
      this.search_data = JSON.stringify(search_data);
    }

    if (this.doc_type == 'Employee' && this.search_data == "{}") {
      this.search_data = "{\"status\":[\"=\",\"Active\"]}"
    }

    if (this.doc_type == 'Holiday List' && this.search_data && this.search_data != "") {
      if (JSON.parse(this.search_data).status) {
        this.search_data = JSON.parse(this.search_data)
        delete this.search_data.status
        this.search_data = (this.search_data && Object.keys(this.search_data).length > 0) ? JSON.stringify(this.search_data) : ""
      }
    }

    if (!this.db.ismobile && this.doc_type == 'Holiday List') {
      this.db.holiday_list_loader = true
    }


    this.filter = true;
    // this.status = eve.route = eve.route == 'All' ? '' : eve.route;
    this.get_tempate_and_datas(this.doc_type);
    // this.get_sales_order_list();
    // this.segment_value = (this.doc_type && this.doc_type == 'Attendance') ? 'show_list' : 'hide_show_list';
  }

  getMonth(eve) {
    this.get_tempate_and_datas(this.doc_type)
  }

  list_keys: any;

  changeDate(event) {
    // console.log(event, 'event')
    this.salarySlipDate = event
    this.get_tempate_and_datas(this.doc_type)
  }

  search: any = '';

  async tab_filter(event: any) {
    this.loadBodySkeleon('');
    this.db.listSkeleton = true;
    let val = {};
    val[event['fieldname']] = event[event['fieldname']];

    if (event['fieldname'] == 'search') {
      this.search = event['search']
      delete val['search']
    }

    if (this.search_data && Object.keys(this.search_data).length != 0) {
      this.search_data = JSON.parse(this.search_data)
      if (event['fieldname'] == "") {
        this.search_data['fieldname'] ? delete this.search_data['fieldname'] : null;
      }
      this.search_data = { ...this.search_data, ...val }
    } else {
      this.search_data = val
    }

    if (event && event.sort_by) {
      this.page_no = 1;
      this.sort_by_order = event.sort_by
    }

    this.search_data = JSON.stringify(this.search_data)

    await this.get_tempate_and_datas(this.doc_type)
  }

  dashboard: any;

  get_dashboard_details(date) {
    let tdy = new Date(date)
    let month = (tdy.getMonth() + 1).toString().padStart(2, '0');
    const year = tdy.getFullYear();
    // this.db.selectedMonth = parts[1];
    // this.db.selectedYear = parts[0];
    let data: any = {
      "dashboard_name": this.doc_type + " Dashboard",
      month_filters: {
        "month": this.db.currentMonthValue,
        "year": this.db.currentYearValue
      },
      // "month_filters": {
      //   "month":  this.db.selectedMonth ?  this.db.selectedMonth : month,
      //   "year": this.db.selectedYear ? this.db.selectedYear : year
      // },
      page_no: this.page_no,
      page_length: 10,

    }

    if (localStorage['role'] == 'Employee' || localStorage['role'] == 'Tridots Employee') {
      data["employee_id"] = localStorage['employee_id']
    }

    if (this.sort_by_order && this.doc_type == "Attendance" && this.db.ismobile) {
      data['order_by'] = this.sort_by_order
    }

    if (this.doc_type == "Attendance" && this.db.ismobile && (this.search_data)) {
      data['filters'] = this.search_data
    }

    // if(!this.db.ismobile && this.doc_type == "Attendance"){
    //   delete data['month_filters'].month
    //   delete data['month_filters'].year
    // }

    if (data['dashboard_name'] && data['dashboard_name'] == 'Attendance Dashboard' && this.db.employee_role) {
      data['filters'] = { employee: localStorage['employee_id'] }
      // data['month_filters'] = {};
    }



    this.db.get_dashboard_details(data).subscribe((res) => {
      if (res && res.status == "Success") {

        this.dashboard = res.message.dashboard;
        this.db.dashboardValues = res.message.dashboard;
        // this.db.ismobile &&
        if (this.doc_type == 'Attendance') {
          if (res.message.data && res.message.data.length > 0) {
            if (this.page_no == 1) {
              this.db.get_saleslist = {};
              this.db.get_saleslist['data'] = res.message.data
            } else {
              this.db.get_saleslist['data'] = [...this.db.get_saleslist['data'], ...res.message.data]
            }
            this.no_products = false
          } else {
            this.page_no == 1 ? this.db.get_saleslist['data'] = [] : null;
            this.no_products = true
          }
          // this.db.get_saleslist['data'] = res.message.data
          this.skeleton = false;
          this.spinner_loader = false;
          this.generateHighlightedDates(res.message.dashboard)
        }
      } else {
        // this.db.alert(res.message.message)
      }
    })

  }

  get_ess_dashboard() {
    let data = {
      dashboard_name: 'Attendance Dashboard',
      employee_id: (this.db.employee && this.doc_type == "Attendance") ? this.db.employee : localStorage['employee_id'],
      month_filters: {
        month: this.db.currentMonth,
        year: this.db.currentYear,
      },
      page_no: this.page_no,
      page_length: this.page_size,

    };


    this.db.get_dashboard_details(data).subscribe(res => {

      if (res && res.message && res.status == 'Success') {
        // this.ess_dashboard_data = res.message;
        if (this.db.hr_manager_role && this.doc_type == "Attendance") {
          if (this.page_no == 1) {
            this.db.get_saleslist = {};
            this.db.get_saleslist['data'] = res.message.data
          } else {
            this.db.get_saleslist['data'] = [...this.db.get_saleslist['data'], ...res.message.data]
          }
        }
        this.generateHighlightedDates(res.message.data)
      }
    })
  }


  highlightedDates: any = []
  generateHighlightedDates(data) {
    const presentDates: any = [];
    const absentDates: any = [];

    if (data && data.length != 0) {

      data.map((record: any) => {
        switch (record.status) {
          case 'Present':
          case 'Half Day':
          case 'Work From Home':
            presentDates.push(record.attendance_date);
            break;
          case 'On Leave':
          case 'Absent':
            absentDates.push(record.attendance_date);
            break;
        }
      });
    }

    const dynamicGreenDates = presentDates;
    const dynamicRedDates = absentDates;

    this.highlightedDates = [
      ...dynamicGreenDates.map(date => ({
        date,
        textColor: '#000',
        backgroundColor: '#1DAC4526',
      })),
      ...dynamicRedDates.map(date => ({
        date,
        textColor: '#000',
        backgroundColor: '#AC1D1D26',
      })),
    ];

    this.db.highlightedDates = this.highlightedDates;
    this.db.monthChange.next('success')
  }

  getCalendarDate(eve) {

    // console.log(eve,"getCalendarDate eve")
    const parts = eve.detail.value.split('-');

    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);

    this.currentMonth = month
    this.currentYear = year
    this.db.currentMonth = month
    this.db.currentYear = year
    this.db.currentMonthValue = month
    this.db.currentYearValue = year
    this.get_dashboard_details(this.db.current_event_date)
    // this.get_ess_dashboard()
  }

  getDateFromCalendars(eve) {

    // this.no_dash = false;
    this.get_attendance_dashboard_counts()
    this.getDateFromCalendar(eve)
  }

  get_attendance_dashboard_counts() {
    let data = {
      employee_id: localStorage['employee_id'],
      month_filters: {
        "month": this.db.selectedMonth ? this.db.selectedMonth : this.currentMonth,
        "year": this.db.selectedYear
      },
    }
    // this.get_attendance_dashboard_counts()

    this.db.get_attendance_dashboard(data).subscribe(res => {
      if (res && res.message && res.message.lenght != 0) {
        this.attendance_dashboard = res.message
      }
    })
  }

  getDateFromCalendar(eve) {

    // this.db.get_saleslist.data = [];
    // this.no_products = false;
    this.page_no = 1;
    if (eve.sort) {
      this.db.listSkeleton = true;
      this.sort_by_order = eve['sort_by']
    } else {
      // this.db.current_event_date = eve;

      const parts = eve.split('-');
      this.db.selectedMonth = parts[1];
      this.db.selectedYear = parts[0];
      this.db.currentMonthValue = this.db.selectedMonth
      this.db.currentYearValue = this.db.selectedYear
      // let val = { posting_date: eve }
      // if (this.search_data != "") {
      //   this.search_data = JSON.parse(this.search_data)
      //   this.search_data = { ...this.search_data, ...val }
      // } else {
      //   this.search_data = val
      // }
      // this.search_data = JSON.stringify(this.search_data)
      this.get_dashboard_details(eve)
    }

    if (this.doc_type == "Attendance" && this.db.ismobile) {
      this.get_dashboard_details(this.db.current_event_date)
    } else {
      this.get_tempate_and_datas(this.doc_type);
    }
  }

  async getFilters(data) {
    // this.db.get_saleslist.data = [];
    // this.no_products = false;
    this.page_no = 1;

    // if (data && data.sort_by) {
    //   this.sort_by_order = data.sort_by
    // }

    let search = Object.fromEntries(
      Object.entries(data.data).map(([key, value]) => [key, ['Like', `%${value}%`]])
    );

    if ((search && search['employee']) && (this.doc_type == "Attendance" && this.db.ismobile)) {
      this.db.tab_filter = true
      delete search['employee']
      search['employee'] = data.data.employee
    }



    this.search_data = search ? search : this.search_data;
    // this.search_datas = search ? JSON.stringify(search) : this.search_datas;
    // console.log(data,"data")

    // let val = data.data
    // if (this.search_data != "" && typeof this.search_data != 'object') {
    //   this.search_data = JSON.parse(this.search_data)
    //   this.search_data = { ...this.search_data, ...val }
    // } else {
    //   this.search_data = val
    // }

    // this.get_dashboard_details(this.db.current_event_date)
    if (this.doc_type == "Attendance" && this.db.ismobile && (this.search_data)) {
      await this.get_dashboard_details(this.db.current_event_date)
    } else {
      this.search_data = JSON.stringify(this.search_data)
    }
    // this.search_data = data.data;
    // this.get_tempate_and_datas();
  }

  get_tempate_and_datas(doctype) {

    // if(this.db.searchDataValues != ''){
    //   this.search_data = this.db.searchDataValues;
    // }


    if (this.search_data && (!this.db.tab_filter || this.doc_type == 'Attendance' || this.doc_type == 'Employee' || this.doc_type == 'Quotation')) {
      if (this.search_data && Object.keys(this.search_data).length != 0) {
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
    }

    if (this.doc_type == 'Employee' && this.search_data == "") {
      this.search_data = "{\"status\":[\"=\",\"Active\"]}"
    }

    // if (this.doc_type == 'Expense Claim' && this.db.employee_role && this.db.ismobile && this.search_data == "") {
    //   // this.search_data = "{\"status\":\"Unpaid\"}"
    // }

    if ((this.doc_type == 'Expense Claim' || this.doc_type == 'Employee Advance') && this.db.hr_manager_role && this.db.ismobile) {
      this.db.tab_filter = true
    }

    if ((this.db.hr_manager_role) && doctype == "Salary Slip" && this.db.ismobile && this.search_data == "") {
      //  this.db.employee_role ||
      this.search_data = "{\"status\":\"Submitted\"}"
      this.db.tab_filter = true

    }


    // if(this.db.hr_manager_role && doctype == "Salary Slip" && this.db.ismobile){
    //   this.db.tab_filter = true
    // }

    // if(this.db.employee_role && doctype == "Salary Slip" && this.db.ismobile){
    //   this.search_data = "{\"status\":\"Submitted\"}"
    //   this.db.tab_filter = true
    // }

    // if(this.doc_type == 'Employee'){
    //   this.page_size = 21;
    // }

    let data = {
      doctype_name: doctype,
      // view_type: 'List View',
      search_data: this.search_data,
      docname: '',
      fetch_child: true,
      page_no: this.page_no,
      page_length: this.page_size
    };

    if (this.sort_by_order) {
      data['order_by'] = this.sort_by_order
    }

    if (this.doc_type == 'Leave Application') {
      data['date'] = this.db.current_event_date
      // if(this.db.employee_role)
      // this.search_data = JSON.parse(this.search_data)
      // this.search_data['employee'] = localStorage['employee_id']
    }

    // && !this.db.ismobile
    if (this.doc_type == "Salary Slip") {
      const today = this.salarySlipDate ? new Date(this.salarySlipDate) : new Date(this.db.current_date)
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      let val = JSON.parse(localStorage['default_values'])
      // data['month'] = month
      // data['year'] = year
      data['company'] = val.default_company
      // if(data.search_data && Object.keys(data.search_data).length > 0){
      //   data['search'] = this.search
      //   data.search_data.search ? delete data.search_data.search : null;
      // }else{
      // if(!this.db.ismobile){
      //   data['date'] = this.db.current_event_date
      // }

      data['filters'] = this.db.ismobile ? {} : { "month": month, "year": year }
      // if(this.db.hr_manager_role)
      //   data['search'] = this.search
      // }
    }

    if (this.kanban) {
      data['list_type'] = "Kanban View"
      data['view_type'] = 'List View'
    } else {
      data['view_type'] = 'List View'
    }

    if ((doctype == 'Attendance') && this.db.ismobile) {

      if (this.db.selectedMonth || this.db.selectedYear) {
        data['filters'] = { "month": this.db.selectedMonth, "year": this.db.selectedYear ? this.db.selectedYear.toString() : null }
      }

    }


    if ((doctype == "Expense Claim" || doctype == "Employee Advance") && this.db.ismobile) {
      // let val = { month: this.db.selectedMonth ? this.db.selectedMonth : this.currentMonth, year: this.db.selectedYear }
      let val = { month: this.db.currentMonthValue, year: this.db.currentYearValue }
      data['month_filters'] = val
    }

    if (doctype == "Salary Slip" && this.db.ismobile) {
      let val = { year: this.db.currentYearValue }
      data['month_filters'] = val
    }

    // if(doctype == "Task" && !this.db.ismobile){

    //   if(!this.db.sendGroupBy){
    //     data['group_by'] = 'project'
    //   }else{
    //     data['group_by'] = this.selctedGroupBy
    //   }

    //   this.db.sendGroupBySelect.subscribe(res => {
    //     if(res && this.db.sendGroupBy){
    //       this.selctedGroupBy = res
    //       this.db.get_saleslist.data = [];
    //       this.get_tempate_and_datas('Task')
    //     }
    //   })
    // }

    if (doctype == "Expense Claim" || doctype == 'Employee Advance') {
      if (typeof (data.search_data) == 'string' || data.search_data == '') {
        let parameters = (data.search_data == '') ? {} : JSON.parse(data.search_data)
        if (parameters && parameters.status && parameters.status[1] && parameters.status[1].includes('%')) {
          parameters.status[1] = parameters.status[1].replace(/%/g, '')
          parameters.status = ['=', parameters.status[1]]
          data.search_data = JSON.stringify(parameters)
        }
      }
    }

    if (this.doc_type == "Holiday List") {
      data['holiday_type'] = this.navigate_key

      // this.db.sendViewType.subscribe(res => {
      //   if(res){
      //     data['holiday_type'] = this.db.get_saleslist['options'][0].name
      //   }
      // })
    }

    if (this.doc_type == "Expense Claim") {
      data['company'] = (this.db.default_values && this.db.default_values.default_company) ? this.db.default_values.default_company : ''
    }

    if (this.doc_type == 'Employee') {
      data['order_by'] = data['order_by'] == 'creation ASC' ? 'creation DESC' : 'creation ASC';
    }
    
    if(this.doc_type == 'Leave Withdrawal'){
      let val = JSON.parse(localStorage['default_values'])
      data['company'] = val.default_company
    }

    if ((this.db.ismobile || !this.db.ismobile) && (this.doc_type != "Attendance")) {
      this.db.get_tempate_and_datas(data).subscribe((res) => {
        // if(this.doc_type != "Holiday List")
        this.skeleton = false;
        this.db.skeletonLoader = false;
        this.spinner_loader = false;
        this.loadDatas = true;
        this.db.bodySkeleton = false;
        this.db.holiday_list_loader = false
        setTimeout(() => {
          this.db.listSkeleton = false;
        }, 800)

        if (this.doc_type == "Attendance" && !this.db.ismobile) {
          this.db.tab_filter = true
        }


        if (this.db.hr_manager_role && doctype == "Salary Slip" && this.db.ismobile) {
          // (this.db.employee_role || 
          res.message['options'] = [{ name: "Paid", route: "Submitted" }, { name: "Pending", route: "Draft" }];
          (res.message['dashboard'] && res.message['dashboard'].length > 0) ? res.message['dashboard'].splice(0, 1) : null;
          // this.db.get_saleslist={}
          // this.db.get_saleslist['options'] = res.message['options']
        }

        if (res.message && res.message['options'] && (this.doc_type == 'Employee Advance' || this.doc_type == 'Expense Claim')) {
          // if (res.message.options && res.message.options.length != 0) {
          // let option = res.message.options.filter(res_option => { return res_option.name != 'Closed' && res_option.name != 'On Hold' && res_option.name != 'To Deliver' })
          // res.message['options'] = res.message['options'] ? res.message['options'] : [];
          res.message.options = this.months;
          // }
        }

        if (res && res.message && res.message.data && res.message.data.length != 0) {

          // if (this.db.employee_role && doctype == "Expense Claim" && this.db.ismobile) {
          //   res.message.options = [{ name: "Pending", route: "Unpaid" }, { name: "Claimed", route: "Paid" }]
          //   this.db.tab_filter = true
          // }


          if (this.doc_type == 'Customer' && res && res.message && res.message.keys) {
            const index = res.message.keys.indexOf('disabled');
            if (index != -1) {
              res.message.keys.splice(index, 1, 'status');
            }
            res.message.data.map(res => {
              if (res.disabled == 0) {
                res['status'] = 'Enabled';
              } else {
                res['status'] = 'Disabled';
              }
            })
          } else if (this.doc_type == 'Sales Invoice') {
            if (res.message.options && res.message.options.length != 0) {
              let option = res.message.options.filter(res_option => { return res_option.name != 'Return' && res_option.name != 'Credit Note Issued' && res_option.name != 'Submitted' && res_option.name != 'Partly Paid' && res_option.name != 'Unpaid and Discounted' && res_option.name != 'Partly Paid and Discounted' && res_option.name != 'Overdue and Discounted' && res_option.name != 'Overdue' && res_option.name != 'Cancelled' && res_option.name != 'Internal Transfer' })

              res.message.options = option
            }
          } else if (this.doc_type == 'Sales Order') {
            if (res.message.options && res.message.options.length != 0) {
              let option = res.message.options.filter(res_option => { return res_option.name != 'Closed' && res_option.name != 'On Hold' && res_option.name != 'To Deliver' })

              res.message.options = option
            }
          }

          if (this.page_no == 1) {
            if (this.filter) {

              if (this.doc_type == 'HD Ticket') {
                this.db.get_saleslist = res.message;
              } else {
                this.db.get_saleslist.data = res.message.data;

                let rawData = JSON.stringify(res.message.data)
                this.finalDataKeys = JSON.parse(rawData)

                // console.log(finalDataKeys)

                if (this.finalDataKeys && this.finalDataKeys.length != 0) {
                  Object.keys(this.finalDataKeys[0]).map(reskey => {
                    if (reskey && (reskey.includes('shared_to') || reskey.includes('assigned_to') || reskey.includes('project_name') || reskey.includes('_user_tags') || reskey.includes('task_count') || reskey.includes('events_days_difference') || reskey.includes('module_name') || reskey.includes('assign_to') || reskey.includes('creation') || reskey.includes('image'))) {
                      if (res.message.keys && res.message.keys.length != 0) {
                        if (reskey == 'project_name' && this.doc_type == 'Job Applicant') {
                          res.message.keys.splice(0, 0, reskey)
                        } else {
                          res.message.keys.push(reskey)
                        }
                      }
                    }
                  })
                }
              }

              if (this.db.get_saleslist.data && this.db.get_saleslist.data.length != 0 && this.db.enable_detail && !this.search_data && !this.db.ismobile) {
                let first_data = this.db.get_saleslist.data[0];

                // this.db.detail_route_name = first_data.detail_route
                // this.db.load_name = first_data.name
                if (this.db.enable_detail) {
                  this.get_list_detail(first_data);
                }
                // this.get_doc_detail(first_data.name)
                this.db.show_detail_datas = true;
                // let datas = {
                //   load_name_detail : first_data.name,
                //   status : 'Success'
                // }
                // this.db.get_form_new_data.next(datas);
              } else if (this.search_data && !this.db.ismobile) {
                let first_data_search = this.db.get_saleslist.data[0];

                // this.db.detail_route_name = first_data_search.detail_route
                // this.db.load_name = first_data_search.name
                if (this.db.enable_detail) {
                  this.get_list_detail(first_data_search);
                }
                this.db.show_detail_datas = true;
                // let datas = {
                //   load_name_detail : first_data_search.name,
                //   status : 'Success'
                // }
                // this.db.get_form_new_data.next(datas);
                // this.get_doc_detail(first_data_search.name)
              }

              if (res.message.projects && res.message.projects.length != 0) {
                this.db.get_saleslist.projects = [{ label: 'ALL', name: 'ALL' }];
                this.db.get_saleslist.projects = [...this.db.get_saleslist.projects, ...res.message.projects];
              } else {
                this.db.get_saleslist.projects = [];
              }
            } else {
              this.db.get_saleslist = res.message;

              let rawData = JSON.stringify(res.message.data)
              this.finalDataKeys = JSON.parse(rawData)

              // console.log(finalDataKeys)

              if (this.finalDataKeys && this.finalDataKeys.length != 0) {
                Object.keys(this.finalDataKeys[0]).map(reskey => {
                  if (reskey && (reskey.includes('shared_to') || reskey.includes('assigned_to') || reskey.includes('project_name') || reskey.includes('_user_tags') || reskey.includes('task_count') || reskey.includes('events_days_difference') || reskey.includes('module_name') || reskey.includes('assign_to') || reskey.includes('creation') || reskey.includes('image'))) {
                    if (res.message.keys && res.message.keys.length != 0) {
                      if (reskey == 'project_name' && this.doc_type == 'Job Applicant') {
                        res.message.keys.splice(0, 0, reskey)
                      } else {
                        res.message.keys.push(reskey)
                      }
                    }
                  }
                })
              }

              // console.log(res.message.keys,'res.message.keys')

              // this.list_keys = this.db.filter_keys(res.message.keys,)
              if (res.message && res.message.keys) {
                let dub = JSON.stringify(res.message.keys)
                dub = JSON.parse(dub)
                this.spread_keys(res.message.keys)
                this.db.get_saleslist.keys = dub;
              }
              if (this.db.get_saleslist.options && this.db.get_saleslist.options.length != 0) {
                if (this.doc_type == 'Employee Advance' || this.doc_type == 'Expense Claim') {
                  let monthValue = Number(this.db.currentMonthValue) - 1;
                  this.db.selectedMonth = monthValue + 1;;
                  this.db.tab_buttons(this.db.get_saleslist.options, this.db.get_saleslist.options[monthValue].name, 'name');
                } else if (this.doc_type == 'Holiday List') {
                  this.db.get_saleslist['options'] = [{ name: "Holiday", route: "holidays_list" }, { name: "Week off", route: "weekoff_list" }]
                  this.db.tab_buttons(this.db.get_saleslist.options, this.db.get_saleslist.options[0].route, 'route');
                } else {
                  this.db.tab_buttons(this.db.get_saleslist.options, this.db.get_saleslist.options[0].route, 'route');
                }
                // this.db.tab_buttons(this.db.get_saleslist.options, 'ALL', 'route');
              }

              if (this.doc_type == 'Holiday List') {
                this.db.get_saleslist['options'] = [{ name: "Holiday", route: "holidays_list" }, { name: "Week off", route: "weekoff_list" }]
                this.db.get_saleslist['data'] = res.message.list_details
                this.db.tab_buttons(this.db.get_saleslist.options, this.db.get_saleslist.options[0].route, 'route');
              }

            }

            // this.rows = res.message.keys
            // if (!this.db.ismobile && this.rows && this.rows.length != 0) {
            //   this.db.get_saleslist['table'] = []
            //   this.columns = []
            //   this.rows.map((res_upper,index) => {
            //     let result = res_upper.toUpperCase();
            //     if (result && result.includes('_')) {
            //     result = result.replace(/_/g, ' ')
            //     } 

            //     this.columns.push({ name: result, prop: res_upper, size: index == 0 ? 450 : res_upper == 'employee_name' ? 400 : 200 })
            //   // this.columns.push({ name: result, prop: res_upper, size: res_upper == 'employee_name' ? 450 : 300 })
            //   })

            //   this.db.get_saleslist['table'] = this.columns;

            //   for (let i = 0; i < this.db.get_saleslist.data.length; i++) {
            //     for (let val in this.db.get_saleslist.data[i]) {
            //       if (!this.rows.includes(val)) {
            //         delete this.db.get_saleslist.data[i][val]
            //       }
            //     }
            //   }            
            // }
            this.db.grid_table_creation(res)

            //  this.db.get_saleslist.template_name = 'Layout 1';
          } else if (this.db.get_saleslist && this.db.get_saleslist.data) {
            // if(!this.db.ismobile && this.rows && this.db.rows.length > 0){
            //   for (let i = 0; i < res.message.data.length; i++) {
            //     for (let val in res.message.data[i]) {
            //       if (!this.db.rows.includes(val)) {
            //         delete res.message.data[i][val]
            //       }
            //     }
            //   }  
            // }
            this.db.remove_pagination_keys(res)
            this.db.get_saleslist.data = [...this.db.get_saleslist.data, ...res.message.data];
          }

          this.doc_type == 'Holiday List' ? this.db.get_saleslist['data'] = res.message.list_details : null


          // if (doctype == 'Request for Quotation') {
          //   this.revoGridAssigning();
          // }

          //   if(this.db.employee_role && doctype == "Expense Claim" && this.db.ismobile){
          //     // let val = this.db.get_saleslist.options

          //     // {"status":["in",["Draft", "Unpaid"]]}
          //     this.db.get_saleslist.options = [
          //       {
          //       name: "Pending",
          //       route: "Unpaid",
          //       // isActive:true
          //     },
          //     {
          //       name:"Claimed",
          //       route: "Paid",
          //       // isActive:false
          //     }
          //   ]

          // // this.db.tab_buttons(this.db.get_saleslist.options, 'ALL', '');

          //   // this.db.get_saleslist.options = val1

          //   }



        }
        // else if (res && res.status == 'failed') {
        //   this.router.navigateByUrl('/page-not-found');
        //   this.db.side_menu_show = false;
        // }
        else {
          this.skeleton = false;
          this.db.skeletonLoader = false;
          this.no_products = true;
          this.db.loadMoreButton = false;

          if (this.db.hr_manager_role && (doctype == "Salary Slip") && this.db.ismobile && ((this.db.get_saleslist && !this.db.get_saleslist.options) || !this.db.get_saleslist)) {
            //doctype == "Expense Claim" || 
            //  doctype == "Expense Claim" ? [{ name: "Pending", route: "Unpaid" }, { name: "Claimed", route: "Paid" }] : 
            let options = [{ name: "Paid", route: "Submitted" }, { name: "Pending", route: "Draft" }]
            // res.message.options = [{ name: "Pending", route: "Unpaid" }, { name: "Claimed", route: "Paid" }]
            this.db.tab_filter = true
            this.db.get_saleslist = {}
            this.db.get_saleslist['data'] = []
            this.db.get_saleslist['options'] = options
            // this.db.tab_buttons(this.db.get_saleslist.options, this.db.get_saleslist.options[0].route, 'route');
          } else if (doctype == "Employee") {
            this.db.tab_filter = true
          }

          if (this.page_no == 1) {



            if (this.doc_type == 'Employee Advance' || this.doc_type == 'Expense Claim') {
              this.db.get_saleslist = res.message
              if (this.db.get_saleslist && this.db.get_saleslist.options && this.db.get_saleslist.options.length != 0) {
                let monthValue = Number(this.db.currentMonthValue) - 1;
                this.db.selectedMonth = monthValue + 1;
                this.db.tab_buttons(this.db.get_saleslist.options, this.db.get_saleslist.options[monthValue].name, 'name')
              }
            } else {
              if (this.db.get_saleslist && this.db.get_saleslist.options) {
                this.db.get_saleslist['data'] = res.message.data;
              } else {
                this.db.get_saleslist = res.message;
                if (this.db.get_saleslist.options && this.db.get_saleslist.options.lenth > 0) {
                  this.db.tab_buttons(this.db.get_saleslist.options, this.db.get_saleslist.options[0].name, 'name')
                }
              }

              // this.db.get_saleslist['data'] = []
            }

            // (this.db.get_saleslist && this.db.get_saleslist.data) ? (this.db.get_saleslist.data = []) : null;
          }

          // if(this.db.employee_role && doctype == "Salary Slip" && this.db.ismobile && this.db.get_saleslist && !this.db.get_saleslist.options){
          //   let options = [{ name: "Paid", route: "Submitted" }, { name: "Pending", route: "Draft" }]
          //   this.db.get_saleslist = {}
          //   this.db.get_saleslist['data'] = []
          //   this.db.get_saleslist['options'] = options
          //   this.db.tab_filter = true
          //   this.db.tab_buttons(this.db.get_saleslist.options, this.db.get_saleslist.options[0].route, 'route');
          // }
        }

        if (this.detailName && this.db.get_saleslist && this.db.get_saleslist.data && this.db.get_saleslist.data.length != 0) {
          this.db.get_saleslist.data.map((res: any) => {
            if (res.name == this.detailName) {
              res.isSelect = true;
            } else {
              res.isSelect = false;
            }
          })
        }

        // this.db.sendGroupBy = false;

      },
        (error: any) => {

          // loader.dismiss();
          // this.db.listSkeleton = false;
          this.db.alert('Something went wrong try again later');
          // this.location.back();
        }
      );
    } else {
      if (this.db.ismobile && this.doc_type == "Attendance") {
        this.skeleton = false;
        this.spinner_loader = false;
      }
    }


    // this.db.load_data_list = false;
    this.db.selected_year = false;
    this.db.clearFilterAccess = false;
    // this.db.listSkeleton = false;
  }

  docLists = [

    // CRM
    {
      doctype: 'Lead',
      key: ['company_name', 'source'],
      mob_keys: {
        0: 'title',
        1: 'name',
        2: 'mobile_no',
        4: 'status',
        5: 'source',
      }
    },
    {
      doctype: 'Opportunity',
      key: ['contact_email', 'source']
    },
    {
      doctype: 'Quotation',
      key: ['contact_display', 'contact_mobile', 'source', 'customer_name']
    },
    {
      doctype: 'Customer',
      key: ['customer_group']
      // key: ['customer_group']
    },

    // HR
    {
      doctype: 'Expense Claim',
      key: ['company', 'total_sanctioned_amount', 'total_amount_reimbursed', 'posting_date']
    },
    {
      doctype: 'Attendance',
      key: []
    },
    {
      doctype: 'Timesheet',
      key: ['employee_name', 'total_hours', 'start_date']
    },
    {
      doctype: 'Employee Advance',
      key: ['company', 'advance_amount', 'start_date']
    },
    {
      doctype: 'Salary Slip',
      key: this.db.employee_role ? ['company'] : ['company']
    },
    {
      doctype: 'Leave Application',
      key: ['posting_date', 'employee', 'to_date', 'company', 'leave_type']
    },
    {
      doctype: 'Compensatory Leave Request',
      key: ['leave_type']
    },
    {
      doctype: 'Task',
      key: []
    },
    {
      doctype: 'Holiday List',
      key: []
    },
    {
      doctype: 'Employee Grievance',
      key: []
    },
    {
      doctype: 'Issue',
      key: ['opening_date', 'customer_name']
    },
    {
      doctype: 'Report',
      key: ['module']
    },
    {
      doctype: 'Project',
      key: ['company', 'percent_complete', 'project_type', 'customer']
    },
    {
      doctype: 'Employee',
      key: []
    },

    // business
    {
      doctype: 'Sales Order',
      key: []
    },
    {
      doctype: 'Sales Invoice',
      key: []
    },
    {
      doctype: 'Payment Entry',
      key: []
    },
    {
      doctype: 'Quality Feedback',
      key: []
    },
    {
      doctype: 'HD Ticket',
      key: ['priority', 'raised_by', 'customer']
      // key: []
    },

    // Purchase
    {
      doctype: 'Material Request',
      key: []
    },
    {
      doctype: 'Purchase Order',
      key: []
    },
    {
      doctype: 'Purchase Receipt',
      key: []
    },
    {
      doctype: 'Supplier',
      key: []
    },

    // Employee
    // {
    //   doctype: 'Salary Slip',
    //   key: ['company']
    // }

  ]


  // mob_list_key:any;
  async spread_keys(val: any) {

    for (let i = 0; i < this.docLists.length; i++) {
      if (this.docLists[i]['doctype'] == this.doc_type) {
        this.list_keys = await this.db.filter_keys(val, this.docLists[i].key);
        // this.mob_list_key = this.docLists[i]['mob_keys']


      }
    }

    // let keys = val.slice(0, 5)
    // this.list_keys = this.db.filter_keys(val, keys);
  }


  loadData(data: any) {


    if (!this.no_products && !(this.db.hr_manager_role && this.db.ismobile && this.doc_type == "Attendance")) {
      this.page_no = this.page_no + 1;

      this.get_tempate_and_datas(this.doc_type);
      // this.page_size = this.page_size + 10;
      // this.get_sales_order_list();
      setTimeout(() => {
        data.target.complete();
      }, 400);
    }

    if (!this.no_products && this.db.hr_manager_role && this.db.ismobile && this.doc_type == "Attendance") {
      this.page_no = this.page_no + 1;
      this.get_dashboard_details(this.db.current_event_date);
      setTimeout(() => {
        data.target.complete();
      }, 400);
    }

  }

  navigateToDetails(data) {
    // Header For detail start

    if (this.doc_type == 'Project') {
      localStorage['selected_project_id'] = (data.item && data.item.name) ? data.item.name : data.name;
    }

    let order_detail = data;
    if (order_detail && order_detail.title && order_detail.title.includes('{')) {
      let value = order_detail.title.slice(1, -1);
      order_detail.title = order_detail[value] ? order_detail[value] : 'New ' + this.page_title;
    } else if (order_detail && !order_detail.title && (this.doc_type == 'Task' || this.doc_type == 'Project')) {
      let value;
      if (this.doc_type == 'Task') {
        value = 'subject';
      } else if (this.doc_type == 'Project') {
        value = 'project_name';
      }
      order_detail.title = order_detail[value] ? order_detail[value] : 'New ' + this.page_title;
    } else if (order_detail.title) {
      order_detail.title = order_detail.title;
    } else if (order_detail && (order_detail.customer_name || order_detail.customer)) {
      order_detail.title = order_detail.customer_name ? order_detail.customer_name : order_detail.customer;
    } else if (order_detail && order_detail.name) {
      order_detail.title = order_detail.name;
    } else {
      order_detail.title = 'Detail( ' + order_detail.name + ' )';
    }

    this.db.detailHeaderName = order_detail.title;
    let number = order_detail.mobile_no ? order_detail.mobile_no : order_detail.contact_mobile;
    // this.db.detailheadernum = number;
    // this.db.detailheadersts = order_detail.status;
    // this.db.store_address_customer_id = order_detail.customer_name;

    // Header For detail end

    if (this.doc_type && this.doc_type == 'Employee Advance') {
      this.router.navigateByUrl('/advance-detail/' + data.name);
    }
   

    // if (this.doc_type == localStorage['docType'] == 'Salary Slip' && (this.db.employee_role || this.db.hr_manager_role)) {
    if (this.doc_type == 'Salary Slip' && (this.db.employee_role || this.db.hr_manager_role)) {
      this.salary_no_route = false;
      this.open_salary_slip(data);
    }

    // if (this.db.selected_list.page == 'Salary Slip' && this.db.hr_manager_role) {
    //   if (data.name.includes('/')) {
    //     data.name = data.name.replaceAll('/', '%2F');
    //     this.router.navigateByUrl(
    //       this.db.selected_list.detail_page_route + '/' + data.name
    //     );
    //   }
    // }
    // else if(this.doc_type && this.doc_type == 'Task'){
    //   this.router.navigateByUrl('/task-detail/' + data.name);
    // }
    // else if(this.doc_type && this.doc_type == 'Project'){
    //   this.router.navigateByUrl('/project-detail/' + data.name);
    // }
    else if (this.doc_type && this.doc_type == 'Supplier') {
      this.router.navigateByUrl('/supplier-detail/' + data.name);
    } else if (this.doc_type && this.doc_type == 'Leave Application') {
      this.router.navigateByUrl('/leave-application-detail/' + data.employee);
    } else if (this.doc_type && this.doc_type == 'Customer') {
      this.router.navigateByUrl('/detail/customer/' + data.name);
    } else if (this.doc_type && this.doc_type == 'Timesheet') {
      // this.db.employee_role && this.db.ismobile && 
      this.router.navigateByUrl('/timesheet-detail/' + data.name);
    } else if (this.doc_type && this.doc_type == 'Leave Withdrawal') {
      this.router.navigateByUrl('/leave-withdrawal/' + data.name);
    } else if (this.doc_type && this.doc_type == 'Probation Evaluation') {
      this.router.navigateByUrl('/performance-evaluation/' + data.name);
    } else if (this.doc_type && this.doc_type == 'Regularization') {
      this.openRegularizationDetail(data)
    }else if (this.doc_type && this.doc_type == 'Employee Letter Request') {
      this.openletterrequestDetail(data)
    }
     else if (this.db.selected_list && this.db.selected_list.detail_route && this.salary_no_route) {
      if (this.db.selected_list.page == "Project" && this.db.ismobile) {
        if (this.db.hr_manager_role) {
          this.router.navigateByUrl(this.db.selected_list.detail_page_route + '/' + data.item.name);
        } else {
          this.router.navigateByUrl(this.db.selected_list.detail_page_route + '/' + data.name);
        }
      } else {
        this.router.navigateByUrl(this.db.selected_list.detail_page_route + '/' + data.name);
      }
    }
  }

  async openletterrequestDetail(data) {
    const modal = await this.modalCtrl.create({
      component: LetterRequestDetailComponent,
      cssClass: 'regularization-popup',
      componentProps: {
        letterrequestDetail: data,
      },
    });
    await modal.present();
    const val = await modal.onWillDismiss();
  }

  async openRegularizationDetail(data) {
    const modal = await this.modalCtrl.create({
      component: RegularizationDetailComponent,
      cssClass: 'regularization-popup',
      componentProps: {
        regularizationDetail: data,
      },
    });
    await modal.present();
    const val = await modal.onWillDismiss();
    console.log(val)
    if(val && val.data)
      data.status = val.data.status
  }


  async open_salary_slip(data) {
    const modal = await this.modalCtrl.create({
      component: PayrollDetailComponent,
      cssClass: 'salary-slip-popup',
      componentProps: {
        detail_name: data.name,
        employee: data.employee,
      },
    });
    await modal.present();
    const val = await modal.onWillDismiss();
  }

  segment(eve) {
    // if(!this.db.ismobile && eve.detail.value == "show_list"){
    //   this.db.enable_material = false;
    // }
    this.db.enable_material = false;
    this.db.enable_detail = false;
    this.segment_value = eve.detail.value;
  }

  // get_sales_order_list(){
  //   let data = {
  //     doctype : "Sales Order",
  //     fields : ["name","grand_total","status",'transaction_date','customer_name'],
  //     filters : this.status ? {status : this.status } : '',
  //     page_no : this.page_no,
  //     page_size : this.page_size,
  //     order_by : "creation desc",
  //     "child_fields":["Sales Order Item"],
  //   }
  //   this.db.sub_product_category(data).subscribe(res => {
  //     if(res && res.message && res.message.length != 0){
  //      if(this.page_no == 1){
  //       this.db.get_saleslist = res.message
  //      }else{
  //       this.db.get_saleslist = [...this.db.get_saleslist,...res.message]
  //      }
  //     }else{
  //       this.no_products = true;
  //       this.page_no == 1 ? this.db.get_saleslist = [] : null;
  //     }

  //   })
  // }

  updateDetails(data) {
    let detailValues = data && data.data ? data.data : undefined;
    if (
      detailValues &&
      this.db.get_saleslist &&
      this.db.get_saleslist.data &&
      this.db.get_saleslist.data.length != 0
    ) {
      let index = this.db.get_saleslist.data.findIndex((res) => {
        return res.name == detailValues.name;
      });
      if (index >= 0) {
        this.db.get_saleslist.data[index] = detailValues;
      }

      this.page_no = 1;
      this.search_data = '';
      this.no_products = false;
      this.db.enable_detail = true;
      this.filter = true;
      this.get_tempate_and_datas(detailValues.doctype);
    }
  }

  get_list_detail(data) {

    this.db.selectedId = data.name;

    if (data && !data.detail_route) {
      data['detail_route'] = (this.db.selected_list && this.db.selected_list.detail_route) ? this.db.selected_list.detail_route : undefined;
    }

    this.db.drop_down_value = {};

    if (this.doc_type == 'Bug Sheet' && !this.db.ismobile) {
      this.db.profile_side_menu = true;
    }

    data.isSelect = true;
    // this.db.get_saleslist.data[0].isSelect = true;

    this.db.verify_key = true;
    this.db.hasClass = false;
    this.skeleton_detail = true;
    this.db.skeleton_detail = true;

    if (this.page_route == 'salary-slip') {
      this.db.apply_padding(null)
    }

    if (this.db.selected_list.detail_route) {
      // if (this.page_route != 'employee' && this.page_route != 'project' && this.page_route != 'hd-ticket' && this.page_route != 'timesheet' && this.page_route != 'salary-slip') {
      if ((this.page_route != 'employee' && this.page_route != 'hd-ticket' && this.page_route != 'timesheet' && this.page_route != 'salary-slip') && ((this.page_route == 'project' || this.page_route != 'project'))) {

        if (this.db.rightSideDetailSection && (this.doc_type == 'Project' || this.doc_type == 'Task')) {
          this.db.enable_detail = true;
          this.kanban = false;
          let currentUrl = this.router.url;
          let urls = currentUrl.split('/');
          if (urls && urls.length == 4) {
            currentUrl = urls[1] + '/' + urls[2];
          }
          window.history.pushState('', '', currentUrl + '/' + data.name);
          this.location.replaceState(currentUrl + '/' + data.name);
          this.db.detail_route_bread = data.name
          // this.router.navigate([currentUrl + '/' + data.name]);
        } else if (!this.db.rightSideDetailSection && (this.doc_type == 'Project' || this.doc_type == 'Task' || this.doc_type == 'Lead' || this.doc_type == 'Opportunity')) {
          this.db.full_width = true;
          let currentUrl = this.router.url;
          let urls = currentUrl.split('/');
          if (urls && urls.length == 4) {
            currentUrl = urls[1] + '/' + urls[2];
          }
          window.history.pushState('', '', currentUrl + '/' + data.name);
          this.location.replaceState(currentUrl + '/' + data.name);
          this.db.detail_route_bread = data.name
        } else {
          this.db.enable_detail = true;
          this.kanban = false;
          let currentUrl = this.router.url;
          let urls = currentUrl.split('/');
          if (urls && urls.length == 4) {
            currentUrl = urls[1] + '/' + urls[2];
          }
          window.history.pushState('', '', currentUrl + '/' + data.name);
          this.location.replaceState(currentUrl + '/' + data.name);
          this.db.detail_route_bread = data.name
          // this.router.navigate([currentUrl + '/' + data.name]);
        }
      } else {
        this.db.full_width = true;
        if (this.doc_type != 'HD Ticket') {
          let currentUrl = this.router.url;
          let urls = currentUrl.split('/');
          if (urls && urls.length == 4) {
            currentUrl = urls[1] + '/' + urls[2];
          }
          window.history.pushState('', '', currentUrl + '/' + data.name);
          this.location.replaceState(currentUrl + '/' + data.name);
        }
        this.db.detail_route_bread = data.name

      }
    } else {
      this.db.alert("You Don't have enough access to read this!");
    }

    this.db.show_detail_datas = true;

    this.db.detail_route_name = data.detail_route;
    this.db.load_name = data.name;
    // let datas = {
    //   load_name_detail : this.load_name,
    //   status : 'Success'
    // }
    // this.db.get_form_new_data.next(datas);

    if (localStorage['docType'] == 'HD Ticket') {
      this.db.hd_ticket_show = true;
      // this.db.get_all_conversation(data.name)
      this.db.profile_side_menu = true;
      this.db.mail_send_to = data
    }
    setTimeout(() => {
      this.skeleton_detail = false;
      this.db.skeleton_detail = false;
    }, 500);
    // this.db.getLoadDetail.next('load');

  }

  get_doc_detail(id) {
    // let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    // await loader.present();

    // if(this.db.get_saleslist && this.db.get_saleslist.data && this.db.get_saleslist.data.length != 0){
    //   this.db.get_saleslist.data.map((res:any)=>{
    //      if(res.name == id){
    //        res.isSelect = true;
    //      }
    //   })
    // }

    this.skeleton_detail = true;

    if (this.page_title == 'Projects') {
      this.page_title = 'Project';
    } else if (this.page_title == 'Purchase Orders') {
      this.page_title = 'Purchase Order';
    }
    let data = {
      doctype: this.page_title,
      name: id,
    };
    this.db.doc_detail(data).subscribe((res) => {
      // this.db.show_form_details = false;
      this.skeleton_detail = false;
      // && res.message && res.message.length != 0 && res.message[0].status == "Success"
      if (res) {
        this.enable_reference = false;
        // this.enabled_read_only = true;
        this.order_detail = (res.message && res.message.length != 0) ? res.message[1] : res.message;

        // this.db.enable_detail = true;
        // this.db.profile_side_menu = true
        // this.get_new_data('Success')
        // loader.dismiss()
      }
    });
  }

  load_more(event) {
    this.db.loadMoreButton = true;
    if (!this.no_products && (this.db.ismobile || this.db.enable_detail)) {
      if (event && typeof (event) == 'string' && event == 'loadmore') {
        let value;
        if (this.event_route != 'meeting' && this.task_route != 'tasks') {
          // if (this.loadDatas && value + 150 >= event.target.scrollHeight && (this.event_route != 'meeting' && this.task_route != 'tasks')) {
          this.loadDatas = false;
          this.spinner_loader = true;
          this.page_no += 1;
          this.doc_type = this.doc_type ? this.doc_type : this.routers;
          this.get_tempate_and_datas(this.doc_type);
        } else if (this.event_route == 'meeting') {
          if ((this.page_no * this.page_size) == this.event_data.length) {
            this.loadDatas = false;
            this.spinner_loader = true;
            this.page_no += 1;
            this.json_filter['event_category'] = "Meeting"

          }
        }
      } else {
        let value;
        value = event.target.offsetHeight + event.target.scrollTop + 1;
        value = value.toFixed();
        if (this.loadDatas && (Number(value) + 1400) >= event.target.scrollHeight && (this.event_route != 'meeting' && this.task_route != 'tasks' && this.doc_type != 'Attendance')) {
          // if (this.loadDatas && value + 150 >= event.target.scrollHeight && (this.event_route != 'meeting' && this.task_route != 'tasks')) {
          this.loadDatas = false;
          this.spinner_loader = true;
          this.page_no += 1;
          this.doc_type = this.doc_type ? this.doc_type : this.routers;
          this.get_tempate_and_datas(this.doc_type);
        } else if (this.loadDatas && value >= event.target.scrollHeight && this.event_route == 'meeting') {
          if ((this.page_no * this.page_size) == this.event_data.length) {
            this.loadDatas = false;
            this.spinner_loader = true;
            this.page_no += 1;
            this.json_filter['event_category'] = "Meeting"

          }
        } else if (value >= event.target.scrollHeight && this.doc_type == 'Attendance') {
          if ((this.page_no * 10) == this.db.get_saleslist['data'].length) {
            // this.loadDatas = false;
            this.spinner_loader = true;
            this.page_no += 1;
            this.get_dashboard_details(this.db.current_event_date)
          }
        }
      }
    } else {
      this.db.loadMoreButton = false;
      // this.db.sendErrorMessage('No records found');
    }
  }


  employeeDetail: any;
  edit_form: any;

  get_claim_details(datas) {
    let data = {
      employee_id: localStorage['employee_id'],
    };
    this.db.employee_claim_details(data).subscribe(
      (res) => {
        if (res && res.status && res.status == 'Success') {
          this.employeeDetail = res.message;
          this.openWebFormPopup(datas);
        } else {
          this.db.sendErrorMessage('Something went wrong try again later');
        }
      },
      (error) => {
        this.db.sendErrorMessage('Something went wrong try again later');
      }
    );
  }

  async open_route(data: any) {


    if (data.name) {
      if (data.name == 'Timesheet' && this.db.employee_role) {
        this.openTimeSheet()
      } else if (data.name == 'Task' && (this.db.hr_manager_role || this.db.project_role)) {
        this.newTaskForm()
      } else if (data.name == 'Bug Sheet') {
        this.openBugQuickForm()
      } else {
        // this.edit_form = 1;
        // if (localStorage['employee_id'] != 'undefined' && this.db.sales_dashboard != 'Stock Manager' && this.doc_type != 'Timesheet') {
        //   this.get_claim_details(data);
        // } else {
        //   this.edit_form = 0;
        //   this.openWebFormPopup(data);
        // }
        this.openWebFormPopup(data);
      }
    }
    else {
      this.edit_form = 0
      this.openWebFormPopup(data);
    }
  }

  async openTimeSheet() {
    // <div class="h-100" *ngIf="NewSheet">
    //     <app-update-timesheet [page]="true" doctype='Timesheet' [newTimesheet]="true"></app-update-timesheet>
    // </div>
    // this.db.wiz_form = true
    // const modal = await this.modalCtrl.create({
    //   component: UpdateTimesheetComponent,
    //   cssClass: 'web_site_form',
    //   componentProps: {
    //     page: true,
    //     doctype: "Timesheet",
    //     newTimesheet: true
    //   },
    //   enterAnimation: this.db.enterAnimation,
    //   leaveAnimation: this.db.leaveAnimation,
    // });
    // await modal.present();
    // const val = await modal.onWillDismiss();

    // if (val && val.data == 'Success') {
    //   this.get_tempate_and_datas(this.doc_type);
    //   this.db.wiz_form = false
    // }
  }

  async openWebFormPopup(data) {

    this.db.SubjectEvent = false;
    let cssStyle = '';

    if (this.doc_type == 'Supplier Quotation') {
      cssStyle = 'width_web_site_form'
    } else if (this.doc_type == 'ToDo') {
      cssStyle = 'small_popup'
    } else {
      // cssStyle = 'web_site_form'
      cssStyle = 'childTablecss'
    }

    console.log(this.page_route, "this.page_route")
    const modal = await this.modalCtrl.create({
      component: WebsiteFormsComponent,
      cssClass: data.name == 'Lead' || data.name == 'Opportunity' || data.name == 'Quotation' || data.name == 'Customer' ? 'Crm_site_form' : this.doc_type == 'HD Ticket' ? 'hd_ticket_form' : cssStyle,
      componentProps: {
        page_title: (this.page_title == 'meeting') ? 'Event' : this.page_title,
        page_route: (this.page_title == 'meeting') ? 'Event' : (this.page_title == 'tasks' && this.db.sales_manager_role) ? 'todo' : this.page_route,
        edit_form_values: this.employeeDetail ? this.employeeDetail : undefined,
        edit_form: this.edit_form ? this.edit_form : undefined,
        enable_reference: this.enable_reference,
        enabled_read_only: this.enabled_read_only,
        enable_height: data.name == 'Lead' || data.doctype == 'Opportunity' || data.doctype == 'Quotation' || data.doctype == 'Customer' || data.name == 'Customer' ? true : false,
        loader_f: true,
        load_doc: this.doc_type,
        popup_centre: this.doc_type == 'HD Ticket' ? true : false,
        modal: true
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();

    this.db.SubjectEvent = true;
    // this.db.createEmployeeTask = false;
    if (val && val.data == 'Success') {
      // if (this.db.createEmployeeTask) {
        // this.taskKanbanFunction ? this.taskKanbanFunction.get_task_list_details() : null;
      // } else {
        this.get_tempate_and_datas(this.doc_type);
      // }
    }
  }

  loadBodySkeleon(type) {
    // this.checkSkeletons()
    this.skeleton = false;
    if (this.db.get_saleslist && this.db.get_saleslist.data) {
      this.db.get_saleslist.data = [];
    }

    // let array = [];
    let array = ['Salary Slip'];
    if (type != 'tab' && (array && array.length > 0)) {
      array.splice(0, 1)
    }

    let load = (array && array.length > 0) ? array.find(res => { return res == this.doc_type }) : false;
    if (load) {
      this.skeleton = true;
    } else {
      this.db.bodySkeleton = true
    }

  }

  // db.bodySkeleton = false;
  load_search(term: any) {
    this.loadBodySkeleon('');
    //  this.search_text = this.db.ismobile ? term.detail.value : term.target.value 
    this.search_text = term.target.value;

    let doctypes = ['Employee', 'Project', 'Holiday List']
    let checkDoc = doctypes.find((res, i) => { return this.doc_type == res })

    if (this.db.ismobile) {
      doctypes = ['Expense Claim', 'Employee Advance', 'Employee', 'Job Applicant']
      checkDoc = doctypes.find((res, i) => { return this.doc_type == res })
    }

    this.db.listSkeleton = true;

    if (this.doc_type == 'Event') {
      this.page_no = 1;
      // this.skeleton = true;
      // let data = {
      //   title: term.detail.value
      // }
      // this.search_data = JSON.stringify(data);
      this.search_data = this.search_text;
      this.json_filter['event_category'] = "Meeting"
    } else {
      if ((this.db.employee_role || this.db.hr_manager_role) && this.doc_type == "Salary Slip" && this.db.ismobile) {

      } else {
        if (!checkDoc) {
          this.skeleton = true;
        }
      }
      // this.db.get_saleslist.data = [];
      this.page_no = 1;


      if (this.search_text) {
        this.search_data = this.doc_type == 'Holiday List' ? this.search_text : (this.search_data && Object.keys(this.search_data).length != 0) ? JSON.parse(this.search_data) : {}
        let data: any;
        if (this.doc_type == 'Sales Order' || this.doc_type == 'Customer') {
          data = {
            customer_name: ['Like', '%' + this.search_text + '%']
            // customer_name: this.search_text 
          }

          // || this.doc_type == 'Lead'
        } else if (this.doc_type == 'Sales Invoice' || this.doc_type == 'Opportunity' || this.doc_type == 'Quotation') {
          data = {
            title: ['Like', '%' + this.search_text + '%'],
            // title: term.detail.value ,
          }
          // this.search_data = JSON.stringify(data);
        } else if (this.doc_type == 'Employee Grievance' || this.doc_type == 'Issue') {
          data = {
            subject: ['Like', '%' + term.target.value + '%'],
            // status: this.search_data.status,
            // subject: term.detail.value ,
          }
          // this.search_data = JSON.stringify(data);
        } else if (this.doc_type == 'Customer Feedback') {
          data = {
            customer: ['Like', '%' + term.target.value + '%'],
          }
        } else if (this.doc_type == 'Lead') {
          data = {
            lead_name: ['Like', '%' + term.target.value + '%'],
            // status: this.search_data.status,
            // subject: term.detail.value ,
          }
          // data = {...data,...this.search_data};
          // this.search_data = JSON.stringify(data);
        } else if (this.doc_type == 'Salary Slip' || this.doc_type == 'Compensatory Leave Request') {
          // this.db.ismobile ? term.target.value :
          data = {
            employee_name: ['Like', '%' + term.target.value + '%'],
            // status: this.search_data.status,
            // subject: term.detail.value ,
          }

          // this.search_data = JSON.stringify(data);
        } else if (this.doc_type == 'Job Applicant') {
          // this.db.ismobile ? term.target.value :
          data = {
            applicant_name: ['Like', '%' + term.target.value + '%'],
            // status: this.search_data.status,
            // subject: term.detail.value ,
          }

          // this.search_data = JSON.stringify(data);
        } else if (this.doc_type == 'Bug Sheet') {
          // this.db.ismobile ? term.target.value :
          data = {
            bug_title: ['Like', '%' + term.target.value + '%'],
            // status: this.search_data.status,
            // subject: term.detail.value ,
          }

          // this.search_data = JSON.stringify(data);
        } else if (this.doc_type == 'Test Case') {
          let searchProjectName = this.finalDataKeys.find(resFind => {
            return resFind.project_name.toLowerCase().includes(term.target.value.toLowerCase());
          });
          if (searchProjectName) {
            data = {
              project: ['Like', '%' + searchProjectName.project + '%'],
            };
          }
        } else if (this.doc_type == 'Supplier Quotation' || this.doc_type == 'Supplier Invoice' || this.doc_type == 'Purchase Order') {
          // let data: any
          if (this.doc_type == 'Supplier Quotation') {
            data = {
              title: ['Like', '%' + term.target.value + '%'],
              status: this.search_data.status,
            }
          } else if (this.doc_type == 'Purchase Order') {
            data = {
              supplier: ['Like', '%' + term.target.value + '%'],
              // status: this.search_data.status,
            }
          } else if (this.doc_type == 'Supplier Invoice') {
            data = {
              supplier_name: ['Like', '%' + term.target.value + '%'],
              status: this.search_data.status,
            }
          }
          // this.search_data = JSON.stringify(data);
        } else if (this.doc_type == 'Employee Advance') {
          data = {
            employee_name: ['Like', '%' + term.target.value + '%'],
            status: this.search_data.status,
            // subject: term.detail.value ,
          }
          // this.search_data = JSON.stringify(data);
        } else if (this.doc_type == 'Expense Claim' || this.doc_type == 'Timesheet') {
          data = {
            employee_name: ['Like', '%' + term.target.value + '%'],
            // employee_name: term.detail.value ,
          }

          if (this.doc_type == 'Expense Claim') {
            data['status'] = this.search_data.status;
          } else if (this.doc_type == 'Timesheet' && this.search_data.parent_project) {
            data['parent_project'] = this.search_data.parent_project;
          }


          // this.search_data = JSON.stringify(data);
        } else if (this.doc_type == 'Attendance' || this.doc_type == 'Employee' || this.doc_type == 'Resignation Letter' || this.doc_type == 'Probation Evaluation' || this.doc_type == 'Regularization') {
          data = {
            employee_name: ['Like', '%' + term.target.value + '%'],
            status: this.search_data.status,
            // employee_name: term.detail.value ,
          }

          // this.search_data = JSON.stringify(data);
        } else if (this.doc_type == 'Project') {
          data = {
            project_name: ['Like', '%' + term.target.value + '%'],
            status: this.search_data.status
          }
        } else if (this.doc_type == "Holiday List") {
          this.db.tab_filter = true;
          this.search_data = this.search_text
        } else {
          data = {
            name: ['Like', '%' + this.search_text + '%'],
            status: this.search_data.status,
            // name:term.detail.value 
          }
          // this.search_data = JSON.stringify(data);
        }

        if (this.doc_type != "Holiday List") {
          data = { ...this.search_data, ...data };
          this.search_data = JSON.stringify(data);
        }

      } else {
        let search_data: any = {};
        let search_data_1 = (this.search_data && this.doc_type != "Holiday List") ? JSON.parse(this.search_data) : {};
        search_data_1.title ? delete search_data_1.title : null;
        search_data_1.customer_name ? delete search_data_1.customer_name : null;
        search_data = { ...search_data, ...search_data_1 };
        if (this.search_text == '') {
          this.search_data = ""
          if (search_data && search_data.subject) {
            delete search_data.subject
          } else if (search_data && search_data.employee_name) {
            delete search_data.employee_name
          } else if (search_data && search_data.name) {
            delete search_data.name
          } else {
            search_data = ''
          }
        }
        if (this.search_data != "" && search_data != "") {
          this.search_data = JSON.stringify(search_data);
        }
      }

      if (!checkDoc) {
        this.filter = true;
      }

      this.get_tempate_and_datas(this.doc_type);
    }
  }

  toggleKanbans() {

    this.toggle_reset()
    this.db.kanban = this.kanban;
  }

  toggleKanbans_task() {
    this.toggle_reset()
  }

  toggle_reset() {
    //  || this.doc_type == 'Task'
    if (this.doc_type == 'Timesheet') {
      this.db.full_width = this.db.full_width ? false : true;
    } else {
      this.db.full_width = false;
    }
    // this.db.createEmployeeTask = undefined;
    // this.kanban = !this.kanban;
    if (!this.db.ismobile && this.doc_type != 'Timesheet') {
      this.kanban = true;
    } else {
      this.kanban = !this.kanban;
    }
    this.db.profile_side_menu = false;
    this.db.enable_detail = false;
    this.db.enabled_hidden_fields = false;
    this.db.show_detail_datas = false;
    this.db.show_form_details = false;
    this.db.enable_material = false;
  }

  info(event) {

    this.db.profile_side_menu = true;
    this.get_doc_detail(event.name);
  }

  get_invoice_detail(id) {
    if (id) {
      let data = {
        doctype: 'Sales Invoice',
        name: id,
      };
      this.db.doc_detail(data).subscribe((res) => {

        if (res && res.message && res.message[0].status == 'Success') {
          this.order_detail_list = res.message[1];
        }
      });
    }
  }


  async next_doc(name) {
    this.loader_gas = true;
    // let loader = await this.loadingCtrl.create({ message: 'Please Wait...'});
    // await loader.present();

    let data = {
      doctype: 'Sales Invoice',
      value: this.order_id,
      filters: [],
      prev: name,
    };
    this.db.next_doc(data).subscribe(
      (res) => {

        if (res && res.status == 'Failed') {
          // this.order_detail_list = undefined;
          var d = JSON.parse(res._server_messages);
          var d1 = JSON.parse(d);
          this.db.alert(d1.message);
          this.loader_gas = false;
          // this.check_permissions(res.message,loader,doctype_name);
        } else {
          // if(res && res.status && res.status == 'Success')
          this.order_detail_list = res.message;
          // this.content.scrollToTop(400);
          this.order_id = res.message;
          this.loader_gas = false;
          this.get_invoice_detail(this.order_detail);
          this.active_tab = 'details';
          //  loader.dismiss();
        }
      },
      (error: any) => {

        // loader.dismiss();
        this.db.alert('Something went wrong try again later');
      }
    );
  }

  getSearchScreens(){
    if(this.doc_type == 'Resignation Letter' || this.doc_type == 'Employee Grievance' || this.doc_type == 'Probation Evaluation' || this.doc_type == 'Voluntary PF' || this.doc_type == 'Regularization'){
      return true
    }else{
      return false
    }
  }

  submit_draft() {
    this.order_detail.docstatus = 1;
    this.order_detail.payment_schedule = [];
    this.order_detail.due_date = this.order_detail.posting_date;
    this.db.inset_docs({ data: this.order_detail }).subscribe((res) => {

      if (res && res.message && res.message.status == 'Success') {
        this.db.alert(res.message.message);
        this.router.navigateByUrl('/list/sales-invoice');
      } else if (res.status == 'failed') {
        this.db.alert(res.message);
      }
    });
  }

  async get_create_detail(doctype, name, type) {
    doctype = doctype.toLocaleLowerCase();
    if (doctype.includes(' ')) {
      doctype = doctype.replace(/ /g, '_');
    } else {
      doctype = doctype;
    }
    let data = {
      doctype: doctype,
      doc_id: name,
      method: type,
    };
    this.db.get_default_data(data).subscribe((res) => {
      if (res && res.status && res.status == 'Success') {
        this.order_detail = res.message;
        let next_doc_details;
        this.db.permission_details = JSON.parse(
          localStorage['permission_details']
        );
        if (this.db.selected_list.next_doc) {
          next_doc_details = this.db.permission_details.find(
            (r) => r.page == this.db.selected_list.next_doc
          );
        }
        let selected_list;
        if (this.creation) {
          selected_list = this.db.selected_list;
          this.db.selected_list.submitted = selected_list.submit;
        } else {
          selected_list = next_doc_details
            ? next_doc_details
            : this.db.selected_list;
          this.db.selected_list.submitted = selected_list.submit;
        }
        if (doctype == 'lead') {
          next_doc_details.create = 0;
        }
        if (
          (doctype == 'lead' ||
            doctype == 'Opportunity' ||
            doctype == 'Sales Order') &&
          selected_list.write == 1
        ) {
          this.order_id = this.order_detail_id;
          this.enabled_read_only = false;
        }
        // let check;
        // if (next_doc_details && next_doc_details.page) {
        //   check = this.db.check_permission(next_doc_details.page, 'create');
        // }
        this.order_detail.title = 'New ' + this.db.selected_list.next_doc;
        this.new_title = this.order_detail.title;
        this.enable_reference = true;

        this.edit_route(this.order_detail);
      }
    });
  }

  async edit_route(data) {

    const modal = await this.modalCtrl.create({
      component: EditWebsiteFormsComponent,
      cssClass: 'web_site_form',
      componentProps: {
        page_title: this.new_title,
        page_route: this.new_route,
        edit_form_values: data,
        enable_reference: this.enable_reference,
        enabled_read_only: this.enabled_read_only,
        modal: true
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();

    if (val && val.data == 'Success') {
      this.db.enable_detail = false;
    } else {
      this.get_doc_detail(data.party_name);
    }
  }

  share_Customer(data) {

    if (data && this.method != 'Gmail') {
      if (data.mobile_no) {
        let indianPhoneNumberPattern = /^[6789]\d{9}$/;
        if (indianPhoneNumberPattern.test(data.mobile_no)) {
          this.customer_number = data.mobile_no;
          this.modalCtrl.dismiss(data);
        } else {
          let obj =
            "This Customer Doesn't Have a Valid Whatsapp Number. Please Enter Your 10 Digit Number";
          this.db.alert_animate.next(obj);
        }
      } else {
        let obj = 'Mobile number is required.';
        this.db.alert_animate.next(obj);
      }
    } else if (data && this.method == 'Gmail') {
      if (data.email_id) {
        // Email validation using a regular expression
        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailPattern.test(data.email_id)) {
          // Email is valid
          this.modalCtrl.dismiss(data);
        } else {
          let obj = "This customer doesn't have a valid email address.";
          this.db.alert_animate.next(obj);
        }
      } else {
        let obj = 'Email address is required.';
        this.db.alert_animate.next(obj);
      }
    }
  }

  openWhatsApp(data) {

    if (data) {
      // let url;
      let url = `https://api.whatsapp.com/send?phone=${data}`;
      window.open(url, '_system');
    } else {
      this.db.sendErrorMessage(
        "This customer doesn't have a Whatsapp number.so, can't connect"
      );
    }
  }

  call(data) {
    if (data) {
      let number = 'tel:' + data;
      let element = document.createElement('a');
      element.setAttribute('href', number);
      element.click();
    } else {
      this.db.sendErrorMessage(
        "This customer doesn't have a phone number.so, can't connect"
      );
    }
  }

  toggle_list() {
    this.kanban = false;
    this.db.enable_detail = true;
  }

  async openQuickForm(detail_doc) {
    this.db.SubjectEvent = false;
    const modal = await this.modalCtrl.create({
      component: QuickFormsComponent,
      cssClass: 'quickForms',
      componentProps: {
        detail_doc: detail_doc
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.db.SubjectEvent = true;

    if (data) {
      if (this.doc_type == 'Employee') {
        this.skeleton = true;
        this.page_no = 1
        this.no_products = false;
        this.get_tempate_and_datas(this.db.selected_list.page);
      }
    }
  }

  createnewFrom(data) {
    // this.db.employee_role && 
    if (data && data.name && data.name == 'Timesheet') {
      this.router.navigateByUrl('/timesheet-detail');
    }else if (data && data.name && data.name == 'Leave Withdrawal') {
      this.router.navigateByUrl('/leave-withdrawal/New');
    }else if (data && data.name && data.name == 'Probation Evaluation') {
      this.router.navigateByUrl('/performance-evaluation');
    }else if (data && data.name && data.name == 'Regularization') {
      this.openRegularizationForm();
    }
    else if (data && data.name && data.name == 'Letter Request') {
      this.openLetterRequestForm();
    }
    else if (data && data.name && data.name == 'Buyback') {
      this.openBuybackForm();
    }
    // else if(data.name == 'Timesheet' && this.db.ismobile){
    //   this.router.navigateByUrl('/timesheet-detail')
    // }
    else {
      this.create_new(data['route'])
      // this.create_new(data['route'])
    }
  }

  async openRegularizationForm() {
    const modal = await this.modalCtrl.create({
      component: RegularizationFormComponent,
      cssClass: '',
      componentProps: {
        title: 'Regularization'
      },
      // enterAnimation: this.db.enterAnimation,
      // leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    // if(data)
    //   this.get_tempate_and_datas(this.doc_type)
  }

  async openBuybackForm() {
    const modal = await this.modalCtrl.create({
      component: BuybackFormComponent,
      // regularization-popup
      cssClass: '',
      componentProps: {
        title: 'Add Buyback'
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data)
      this.get_tempate_and_datas(this.doc_type)
  }

  async openLetterRequestForm() {
    const modal = await this.modalCtrl.create({
      component: CreateLetterRequestComponent,
      // regularization-popup
      cssClass: '',
      componentProps: {
        title: 'Add Letter Request'
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data)
      this.get_tempate_and_datas(this.doc_type)
  }

  create_new(data) {
    if (data == '/forms/event' || data == '/forms/todo') {
      this.db.event_list_form = true;
    }

    if (this.navigate_key == 'Quotation' || this.navigate_key == 'Opportunity') {
      data = this.navigate_key ? '/forms/' + this.navigate_key : data;
    }

    // if (this.db.ismobile && data.includes('advance')) {
    //   data = data.replace('advance', 'employee-advance');
    // }

    if (data) {

      if (this.router.url === data) {

        return;
      }

      this.router.navigateByUrl(data);
    }
  }


  createNew(detail_doc) {
    if ((detail_doc && !detail_doc.name) && detail_doc.route.includes('/event')) {
      detail_doc['name'] = 'Event'
    }
    this.db.drop_down_value = {};
    if (this.db.get_saleslist && this.db.get_saleslist.quick_entry == 1) {
      this.openQuickForm(detail_doc)
    } else {

      this.db.ismobile ? this.createnewFrom(this.detail_doc) : this.open_route(detail_doc)
    }
  }


  // Using Bubble sort Algo to sort the values  by date in ascending order
  sort_by_date(value: any) {
    const n = value.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        const dateA = new Date(value[j].date);
        const dateB = new Date(value[j + 1].date);
        if (dateA.getTime() < dateB.getTime()) {
          // Swap value[j] and value[j+1]

          // const temp = value[j];
          // value[j] = value[j + 1];
          // value[j + 1] = temp;
          [value[j], value[j + 1]] = [value[j + 1], value[j]]; // Swap the values
        }
      }
    }

    value.forEach((task: any) => {
      if (task.description) {
        task.description = task.description.replace(/(<([^>]+)>)/gi, '');
      }
    });

    return value;
  }

  filtermeetingDate(eve) {
    // console.log(eve, 'eve')
    this.search_date = eve;
    this.page_no = 1;
  }

  async edit_event(item: any) {
    const modal = await this.modalCtrl.create({
      component: EditFormsPage,
      cssClass: this.db.ismobile ? 'crm-edit-event' : 'web_site_form',
      componentProps: {
        name: item.name,
        page_route: 'event',
        page_name: 'Event',
        page_route_name: 'event',
        title: 'Edit Event'
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data && data.status && data.status == 'Success') {

    }
  }

  async delete_event(item) {
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Are you sure do you want to Delete..?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => { },
        },
        {
          text: 'Ok',
          handler: () => {
            this.delete_e(item);
          },
        },
      ],
    });
    await alert.present();
  }

  async delete_e(item) {
    let loader;
    loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    await loader.present();
    let data = {
      doctype: 'Event',
      filters: { name: item.name },
    };
    this.db.delete_docs(data).subscribe((res) => {
      if (res && res.status == 'Success') {
        this.db.sendSuccessMessage(res.message);
        this.json_filter['event_category'] = "Event"
        loader.dismiss();
        this.modalCtrl.dismiss();
      }
    });
  }

  async edit_task(item: any) {
    this.db.event_list_form = true;
    const modal = await this.modalCtrl.create({
      component: EditFormsPage,
      cssClass: this.db.ismobile ? 'crm-edit-task' : 'web_site_form',
      componentProps: {
        name: item.reference_name,
        order_detail: item,
        page_route: 'todo',
        page_name: 'todo',
        page_route_name: 'todo',
        title: 'Edit Task',
        task_doctype: item.reference_type,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data && data.status && data.status == 'Success') {
    }
  }

  async delete_task(item) {
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Are you sure do you want to Delete..?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => { },
        },
        {
          text: 'Ok',
          handler: () => {
            this.delete_t(item);
          },
        },
      ],
    });
    await alert.present();
  }

  async delete_t(item) {
    let loader;
    loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    await loader.present();
    let data = {
      doctype: 'ToDo',
      filters: { name: item.name },
    };
    this.db.delete_docs(data).subscribe((res) => {
      if (res && res.status == 'Success') {
        this.db.sendSuccessMessage(res.message);
        loader.dismiss()
      }
    });
  }



  revoGridAssigning() {

    if (this.db.get_saleslist.data.length != 0) {
      this.db.get_saleslist.data.map((res: any) => {
        if (res.modified && !res.modifiedDay) {
          res.modified = this.db.getTimecal(res.modified)
          res.modifiedDay = res.modified
        } else if (res.message_for_supplier) {
          res.message_for_supplier = this.transforms(res.message_for_supplier)
        }
      })

      this.db.rows = this.db.get_saleslist.data;
      // this.db.columns = [];
      this.db.loadMoreButton = false;

      if (this.db.loadCoumns) {
        this.db.loadCoumns = false;
        this.db.get_saleslist.keys.push('modified');
        this.db.get_saleslist.keys.map((res_upper: any, i) => {
          let result = res_upper.toUpperCase();
          if (result && result.includes('_')) {
            result = result.replace(/_/g, ' ')
          }
          if (result == 'NAME') {
            result = 'ID'
          }

          // this.columns.push({field: res_upper, label: result})
          if (i == 0) {
            this.db.columns.push({
              name: result, prop: res_upper, size: res_upper == 'employee_name' ? 250 : 250, order: 'asc', sortable: true, pin: 'colPinStart', type: 'col',
              cellProperties: ({ prop, model, data, column }) => {

                return {
                  style: {
                    color: 'var(--CRM-primary-color)'
                  },
                  class: {
                    'bank': true
                  }
                };
              },
            })
          } else if (i == (this.db.get_saleslist.keys.length - 1)) {
            this.db.columns.push({ name: result, prop: res_upper, size: res_upper == 'employee_name' ? 100 : 100, order: 'asc', sortable: true, pin: 'colPinEnd', })
          } else {
            this.db.columns.push({ name: result, prop: res_upper, size: res_upper == 'employee_name' ? 450 : 300, order: 'asc', sortable: true })
          }
        })
      }

    }
  }

  transforms(value: any) {
    const domParser = new DOMParser();
    const htmlElement = domParser.parseFromString(value, 'text/html');
    const plainText = htmlElement.body.textContent;

    return (plainText && plainText != '') ? plainText : value
    // return value ? value.replace(/<[^>]*>/g, '') : '';
  }


  // HD Ticket
  load_all(item) {

    if (item && item.item) {
      this.navigateToDetails(item.item)
      this.send_data(item.item)
      this.enable_mat(item.item, item.i)
      this.active_item(item.item, item.i)
      this.check_active(this.db.get_saleslist.data, item.i, item.item)

    }
  }

  send_data(data) {
    data['detail_route'] = this.db.selected_list && this.db.selected_list.detail_route && localStorage['docType'] != 'Content' ? this.db.selected_list.detail_route : undefined;
    this.get_list_detail(data)
  }

  active: any;
  // Enable the enable material to load mobile view list into Web view. 
  enable_mat(data, index) {
    this.active_item(data, index)
    setTimeout(() => {
      if (this.doc_type != 'Employee' && this.doc_type != 'Project') {
        this.check_active(this.db.get_saleslist.data, this.active, '')
      }
    }, 500)
    if ((this.db.selected_list.detail_route || this.db.selected_list.page_name == "Sales Invoice") && this.doc_type != 'Employee') {
      this.db.enable_material = true
      this.db.hd_ticket_show = true
    }
    // else if(this.db.selected_list.page_name == "Sales Invoice"){
    //   this.db.enable_material = true
    // }
  }

  active_item(data, index) {

    this.active = index;
    this.db.selected_index = index;
    this.db.get_saleslist.data.map((res, i) => {
      if (index == i && data.name == res.name) {
        // res['isSelect'] = true;
        this.db.selectedId = res.name
      } else {
        res['isSelect'] = false
      }
    })

    // this.employee_list_component ? this.employee_list_component.ngOnInit() : null;
  }

  check_active(tabs_array: any, index: any, tab: any) {
    // const element = this.tabList.nativeElement.children[index];

    // if (element) {
    //   setTimeout(() => {
    //     element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    //   }, 500)
    // }
  }

  async newTaskForm() {
    // const modal = await this.modalCtrl.create({
    //   component: NewTaskFormComponent,
    //   cssClass: 'newTaskForm',
    //   enterAnimation: this.db.enterAnimation,
    //   leaveAnimation: this.db.leaveAnimation,
    // });
    // await modal.present();
    // const { data } = await modal.onWillDismiss();
  }

  async openBugQuickForm() {
    // const modal = await this.modalCtrl.create({
    //   component: BugsheetQuickformComponent,
    //   cssClass: 'newBugForm',
    //   // enterAnimation: this.db.enterAnimation,
    //   // leaveAnimation: this.db.leaveAnimation,
    // });
    // await modal.present();
    // const { data } = await modal.onWillDismiss();
    // if (data && data == 'Success') {
    //   // console.log(data)
    //   this.get_tempate_and_datas('Bug Sheet');
    // }
  }


  leave_app_json = [
    {
      name: "name",
      placeholder: "ID",
      type: "text",
      page_no: 1,
      page_length: 20,
      search_text: ""
    },
    {
      name: "employee",
      placeholder: "Employee",
      type: "Link",
      doctype: "Employee",
      page_no: 1,
      page_length: 20,
      search_text: ""
    },
    {
      name: "employee_name",
      placeholder: "Employee Name",
      type: "Link",
      doctype: "Employee",
      page_no: 1,
      page_length: 20,
      search_text: ""
    },
    {
      name: "status",
      placeholder: "Status",
      type: "select",
      options: [],
      page_no: 1,
      page_length: 20,
      search_text: ""
    },
  ]

  months = [
    { value: "January", name: "Jan", },
    { value: "February", name: "Feb" },
    { value: "March", name: "Mar" },
    { value: "April", name: "Apr" },
    { value: "May", name: "May" },
    { value: "June", name: "Jun" },
    { value: "July", name: "Jul" },
    { value: "August", name: "Aug" },
    { value: "September", name: "Sep" },
    { value: "October", name: "Oct" },
    { value: "November", name: "Nov" },
    { value: "December", name: "Dec" }
  ]


  async openPopup() {

    const modalcontrol = await this.modalCtrl.create({
      component: JobApplicantListPage,
      cssClass: 'timesheet_popups',
      componentProps: {
        selectedName: this.designationValue,
        modalPopup: true
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modalcontrol.present();
    const value: any = await modalcontrol.onWillDismiss();
    if (value && value.data && value.data['status'] == 'success') {
      this.designationValue = value.data['value'];
      this.db.tab_buttons(this.db.get_saleslist.options, 'ALL', '');
      this.search_data = {};
      this.search_data = {
        job_title: ['=', this.designationValue]
      }
      this.search_data = JSON.stringify(this.search_data)
      this.page_no = 1;
      this.skeleton = true;
      this.no_products = false;
      this.get_tempate_and_datas(this.doc_type);
    }
  }

  go_back() {
    this.router.navigateByUrl('/job-applicant-list');
  }

  receiveSmartData(event) {
    // console.log(event, 'Submit')
    this.insertReceiveData(event)
  }

  insertReceiveData(data) {
    this.db.inset_docs({ data: data }).subscribe(res => {
      // console.log(res)
      if (res && res.message && res.message.status && res.message.status == 'Success') {
        this.get_tempate_and_datas(this.doc_type);
      }
    })
  }

  getViewList() {
    this.viewList = [
      { icon: 'grid-outline', view: 'Grid', isSelected: true },
      { icon: 'list-outline', view: 'Table', isSelected: false },
    ]

    if (this.doc_type == 'Task') {
      if (!this.db.project_emp_role && this.db.app_name == 'Go1 Project') {
        // this.viewList[0].isSelected = false;
        // let tabs = [{ icon: 'image-outline', view: 'Gallery', isSelected: true },{ icon: 'bar-chart-outline', view: 'Kanban', isSelected: false }]
        // this.viewList = [...tabs,...this.viewList]
        this.viewList = [
          { icon: 'image-outline', view: 'Gallery', isSelected: true },
          { icon: 'grid-outline', view: 'Grid', isSelected: false },
          { icon: 'list-outline', view: 'Table', isSelected: false },
          { icon: 'bar-chart-outline', view: 'Kanban', isSelected: false }
        ]
      } else {
        this.viewList[2] = { icon: 'bar-chart-outline', view: 'Kanban', isSelected: false };
      }
    }

    if (this.doc_type == 'Lead') {
      this.viewList = [
        { icon: 'grid-outline', view: 'Lead Grid', isSelected: false },
        { icon: 'list-outline', view: 'Table', isSelected: true },
        { icon: 'bar-chart-outline', view: 'Kanban', isSelected: false }
      ]
    }

    if (this.doc_type == 'Attendance') {
      this.viewList[0].isSelected = false;
      this.viewList[1].isSelected = true;
    }

    if (this.doc_type == 'Attendance' || this.doc_type == 'Holiday List') {
      this.viewList[2] = { icon: 'menu-outline', view: 'GridTable' }
    }
  }

  sendViewType(data, i) {
    if (this.db.get_saleslist && (this.db.get_saleslist.options && this.db.get_saleslist.options.length > 0)) {
      this.db.tab_buttons(this.db.get_saleslist.options, 'ALL', '');
    }

    this.viewList.map((res, index) => {
      if (index == i) {
        res.isSelected = true;
      } else {
        res.isSelected = false;
      }
    })

    this.db.rightSideDetailSection = false;

    // if(this.doc_type == "Lead"){
    //   this.toggleKanbans()
    // }else{

    //   this.db.sendViewType.next(data.view)

    //   if (data.view == 'Kanban') {
    //     this.kanban = true;
    //   } else {
    //     this.kanban = undefined;
    //     this.db.viewListType = data.view
    //   }

    //   if (this.doc_type == 'Task' && data.view == 'Table') {
    //     this.skeleton = true;
    //     this.page_no = 1;
    //     this.get_tempate_and_datas('Task')
    //   }
    // }



    if (data.view == 'Kanban') {
      this.toggleKanbans()
    } else {
      this.kanban = undefined;
      this.db.viewListType = data.view
    }

    this.db.sendViewType.next(data.view)

    if (this.doc_type == 'Task' && data.view == 'Table') {
      this.skeleton = true;
      this.page_no = 1;
      this.get_tempate_and_datas('Task')
    }

    // if (data.view == "Gallery") {
    //   this.db.sendViewType.next(data.view)
    // }

  }
  columns: any = [];
  rows: any = [];
  selectValue: any;
  async freezeEvent($event) {

    const modal = await this.modalCtrl.create({
      component: FreezeColumnComponent,
      cssClass: 'freezeComponent-css',
      componentProps: {
        columns: this.db.columns,
        selectValue: this.selectValue
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();
    // console.log(val);
    if (val && val.data && val.data.name) {
      if (val.data.name == 'nullValue') {
        this.selectValue = undefined;
        this.loadRevoGrid(undefined);
      } else {
        this.selectValue = val.data;
        this.loadRevoGrid(this.selectValue);
      }
      // this.page_route = val.data
      // this.get_report(val.data)
    }
  }

  task_table1 = [
    "subject",
    "status",
    "priority",
    "project",
    "expected_end_date ",
    "name"
  ]

  loadRevoGrid(colPinStart) {
    let columnsValue: any = [];
    // Object.keys(this.rows[0]).map(res_upper => {

    //   // let result = res_upper.toUpperCase();
    //   let result = res_upper;
    //   if(result && result.includes('_')){
    //     result = result.replace(/_/g, ' ')
    //   }
    //   if(result == 'NAME'){
    //     result = 'ID'
    //   }

    //   columnsValue.push({name: result,prop:res_upper,size: 165, })
    //   // columnsValue.push({name: result,prop:res_upper,size: res_upper == 'employee_name' ? 180 : 150, })

    // })


    this.db.rows.map((res_upper, index) => {
      let result = res_upper.toUpperCase();
      if (result && result.includes('_')) {
        result = result.replace(/_/g, ' ')
      }

      columnsValue.push({ name: result, prop: res_upper, size: res_upper == 'employee_name' ? 400 : 165 })
      // this.columns.push({ name: result, prop: res_upper, size: res_upper == 'employee_name' ? 450 : 300 })
    })

    let findIndexValue = -1
    if (colPinStart) {
      findIndexValue = columnsValue.findIndex((res) => { return res.prop == colPinStart.prop })
    }

    if (findIndexValue >= 0) {
      columnsValue = this.moveItem(columnsValue, findIndexValue, 0);
      columnsValue[0].pin = 'colPinStart'
      columnsValue[0].size = (colPinStart && colPinStart.width) ? colPinStart.width : columnsValue[0].size
    }

    // columnsValue[0].size = 400

    // console.log(columnsValue,"columnsValue")
    this.db.columns = columnsValue;
    if (this.db.selected_list.page == "Task") {
      this.task_data['table'] = this.db.columns
      this.db.get_saleslist['table'] = this.db.columns
    } else {
      this.db.get_saleslist['table'] = this.db.columns
    }

    // for(let i=0;i<this.columns.length;i++){
    //   if(i <= 5){
    //     this.db.get_saleslist['table'][i] = this.columns[i]['prop']
    //     // this.task_table1[i] = this.columns[i]['name']
    //   }
    // }

    // console.log(this.task_table1,"this.task_table1")
  }

  moveItem(array, fromIndex, toIndex) {
    // Check if indices are within bounds
    if (fromIndex >= array.length || toIndex >= array.length || fromIndex < 0 || toIndex < 0) {
      throw new Error('Index out of bounds');
    }

    // Remove the item from the original position
    const [item] = array.splice(fromIndex, 1);

    // Insert the item at the new position
    array.splice(toIndex, 0, item);

    return array;
  }

  async openJobApplicant() {
    const modal = await this.modalCtrl.create({
      component: JobOpeningListComponent,
      backdropDismiss: false,
      cssClass: 'jobpplicant-popup',
      componentProps: {
        doctype: this.doc_type,
        selectedValue: this.selectedJobOpening ? this.selectedJobOpening : null
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();
    if (val && val.data) {
      this.selectedJobOpening = val.data.name
      let jobValue = {
        job_title: ['Like', '%' + val.data.name + '%']
      }
      this.search_data = JSON.stringify(jobValue);
      this.get_tempate_and_datas(this.doc_type);
    }
  }


}

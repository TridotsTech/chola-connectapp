import { Injectable } from '@angular/core';
import {
  AlertController,
  ModalController,
  NavController,
  AnimationController,
  Platform,
  LoadingController,
  MenuController
} from '@ionic/angular';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { SelectDropdownPage } from '../pages/seller/select-dropdown/select-dropdown.page';
import { Router, NavigationEnd } from '@angular/router';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { YearPopupComponent } from '../components/year-popup/year-popup.component';
import { DetailComponentComponent } from '../components/customer-details/detail-component/detail-component.component';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import OneSignal from 'onesignal-cordova-plugin';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

@Injectable({
  providedIn: 'root',
})

export class DbService {
  domain_site = localStorage['site_name'] ? localStorage['site_name'] : '';
  domain = this.domain_site;
  domainurl = this.domain_site;
  baseUrl = `https://${this.domainurl}/`;
  baseResource = `https://${this.domainurl}/api/resource/`;
  baseMethod = `https://${this.domainurl}/api/method/`;

  go1_apps_apis_hrmls = 'go1_apps.go1_apps.apis.hrms.'
  go1_apps_apis_projects = 'go1_apps.go1_apps.apis.project.'
  go1_apps_api = 'go1_apps.go1_apps.api.'
  go1_apps_custom_api = 'go1_apps.go1_apps.custom_api.'
  
  app_name = 'Go1 HR';
  currentRole = 'HR';

  ismobile: any;
  modal = false;
  product_box = { view: 'List View', row_count: 4 };
  website_settings = { currency: '₹', default_products_per_row: '4' };
  httpOptions: any;
  httpHeaders: any;
  next_previous = new Subject();
  clearFilters = new Subject();
  reg_selectAll = new Subject();
  listSkeleton = false;
  bodySkeleton = false;
  profile_side_menu = false;
  side_menu_show = true;
  cust_name: any;
  cust_email: any;
  enable_detail = false;
  user_list: any = [];
  registerform: any;
  otp_form = false;
  guest_form: any;
  normal_login = true; //Selected login type
  scroll_event: any = {}; //Scrolling data
  selected_mail: any;
  cart_items: any = []; //Cart  items later
  select_drop_down = new Subject();
  custom_form_update = new Subject();
  skeleton_detail: any;
  order_detail: any;
  ref_doc_type: any;
  map_fields_get = new Subject();
  loadTask = new Subject();
  location_info: any = {
    zipcode: '',
    country: '',
    state: '',
    city: '',
    address: '',
    latitude: '',
    longitude: '',
  };
  location: any;
  city: any;
  all_link_opts = {};
  drop_down_value: any = {};
  duplicate_drop_down_value: any = {};
  drop_down_value_task: any = {};
  form_values: any;
  formStoreValues: any;
  form_doctype: any;
  current_address: any;
  permission_details: any = [];
  default_values: any;
  company_detail: any;
  selected_list: any = {};
  dashboard_values: any;
  dashboard_cards_value: any;
  path: any;
  chartOptions: any = {};//later
  attachment_menu = false;
  loader = true;
  hasClass = false;
  sales_manager_role: any; //later
  hr_manager_role: any;
  current_event_date: any;
  kanban_array: any = []; //later
  sales_dashboard: any; //later
  hasClass1 = false;
  load_template_datas = new Subject();
  side_tab_dashboard: any = [];
  select_options: any = [];
  show_form_details = false;
  customize_form_details = false;
  load_template_datas_list = new Subject();
  alert_animate = new Subject();
  success_animate = new Subject();
  error_animate = new Subject();
  enabled_hidden_fields = false;
  show_detail_datas = false;
  detail_route_name: any;
  load_name: any;
  tabs_items: any;
  show_tabs = false;
  scroll_top = true;
  enable_material = false;
  employee_role: any;
  edit_web_forms = false;
  success_alert = false;
  verify_key = false;
  update_id = false;
  detailHeaderName: any;
  selected_from_employee: any;
  event_list_form = false;
  selecting_drop_down = false;
  cust_designation: any;
  employee_img: any;
  selectedYear: any;
  selectedMonth: any;
  selectedYearSubject = new Subject();
  employee_id: any;
  selected_year = false;
  profile_loader = false;
  kanban = false;
  store_old_id: any;
  addressLinks: any = []
  mail_send_to: any //later
  hd_ticket_show = false;

  checkInOutDetail: any;
  checkInOutTime: any;

  checkin: any = true;
  all_notification_list: any;
  notification_key: any = [];
  page_no_notification = 0;
  total_notification_count = 0;
  no_products_notification = false;
  load_notify_one = true;
  centerFabShow: any = true;
  selected_index: any = 0;
  jobOpeningName: any;
  full_width = false;
  mark_employee_count = new Subject();
  loadTemplateList: any

  rows: any = [];
  columns: any = [];
  loadCoumns = true;
  loadMoreButton = false;
  employee_shift_dash: any = [];
  selectedId: any;
  detail_route_bread: any;
  tab_filter: boolean = false
  store_old_pagination = 0;
  search_filter: any = [];
  current_leave_segment: any;
  breadCrumb = new Subject();
  save_button = false;

  triggerSidemenu = new Subject();
  clearFilter = new Subject();
  monthChange = new Subject();
  filter_count: any = 0
  tableHeaders: any = [];
  monthLists = [
    { 'label': 'January', 'name': 'Jan' }, { 'label': 'February', 'name': 'Feb' },
    { 'label': 'March', 'name': 'Mar' }, { 'label': 'April', 'name': 'Apr' },
    { 'label': 'May', 'name': 'May' }, { 'label': 'June', 'name': 'Jun' },
    { 'label': 'July', 'name': 'Jul' }, { 'label': 'August', 'name': 'Aug' },
    { 'label': 'September', 'name': 'Sep' }, { 'label': 'October', 'name': 'Oct' },
    { 'label': 'November', 'name': 'Nov' }, { 'label': 'December', 'name': 'Dec' },
  ]
  employee: any;
  SubjectEvent = true;
  skeletonLoader = false;
  currentMonth: any;
  currentYear: any;
  get_saleslist: any = {};
  dashboardValues: any;
  currentMonthValue: any;
  currentYearValue: any;
  form_route: any;
  selfView = false;
  show_selfView = false;
  reportView: any;
  hr_dashboard_data: any;
  project_role: any; //later
  project_emp_role: any; //later
  parentDoctype: any;
  highlightedDates: any = [];
  appScreen: any;
  current_dateAttendance: any;
  sendViewType = new Subject();
  viewListType: any;
  rightSideDetailSection = false;
  holiday_list_loader = false
  seperateJobSection = false;

  clearFilterAccess = false;
  clearSearchFilterInList = new Subject();

  randomClassNameCommonGrid: any;
  commonGridNavigationInput: any;

  routeAttendancePage: any;
  roles:any;

  ticket_details: any = []
  loadTicketDetails = new Subject();
  loadTicketDetailName = false;
  allocate_agent = false;
  text_width = false;

  leave_skeleton = false;

  employee_info:any;

  api_key:any;
  api_secret:any;
  constructor(
    private animationCtrl: AnimationController,
    private http: HttpClient,
    private router: Router,
    private geo: Geolocation,
    public modalCtrl: ModalController,
    private navCtrl: NavController,
    public alertCtrl: AlertController,
    private platform: Platform,
    public loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    private locationAccuracy: LocationAccuracy,
  ) {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    this.current_event_date = `${year}-${month}-${day}`;
  }

  site_values(site) {
    this.baseUrl = `https://${site}/`;
    this.baseResource = `https://${site}/api/resource/`;
    this.baseMethod = `https://${site}/api/method/`;
  }
  sendSuccessMessage(message) {
    this.success_alert = true;
    this.success_animate.next(message);
  }

  sendErrorMessage(message) {
    this.success_alert = false;
    this.error_animate.next(message);
  }

  checkmobile(): any {
    let width = this.platform.width();
    if (width > 768) {
      this.ismobile = false;
      return false;
    } else if (width < 768) {
      this.ismobile = true;
      return true;
    }
  }

  // Check web image image
  product_img(data: any) {
    if (data) {
      if (data.indexOf('https') == -1) {
        return this.baseUrl + data;
      } else if (data.indexOf('https') == 0) {
        return data;
      }
    }
  }

  back() {
    if (this.modal) {
      this.modal = false;
      this.modalCtrl.dismiss();
    } else {
      this.navCtrl.back();
    }
  }

  async alert(data: any) {
    if (this.ismobile) {
      const domParser = new DOMParser();
      const htmlElement = domParser.parseFromString(data, 'text/html');
      const plainText = htmlElement.body.textContent || data;

      const alert = await this.alertCtrl.create({
        header: 'Alert',
        subHeader: (plainText && plainText != '') ? plainText : data,
        buttons: ['Ok'],
      });
      await alert.present();
      await alert.onWillDismiss().then((res: any) => { });
    } else {
      this.alert_animate.next(data);
    }
  }

  get_style(data: any): any {
    switch (data) {
      case 'Submitted': {
        return 'submitted';
      }
      case 'Overdue': {
        return 'overdue';
      }
      case 'Absent': {
        return 'overdue';
      }
      case 'On Leave': {
        return 'overdue';
      }
      case 'Present': {
        return 'completed';
      }
      case 'Work From Home': {
        return 'completed';
      }
      case 'Working': {
        return 'Working';
      }
      case 'Half Day': {
        return 'pending_review';
      }

      case 'Pending Review': {
        return 'pending_review';
      }
      case 'Pending': {
        return 'pending_review';
      }
      case 'Closed': {
        return 'closed';
      }
      case 'Not Applicable': {
        return 'not-applicable';
      }
      case 'Draft': {
        return 'draft';
      }
      case 'Open': {
        return 'draft';
      }
      case 'Cancelled': {
        return 'cancelled';
      }
      case 'Completed': {
        return 'completed';
      }
      case 'Received': {
        return 'to-deliver';
      }
      case 'Expired': {
        return 'expired';
      }
      case 'Yes': {
        return 'completed';
      }
      case 'Resolved': {
        return 'approved';
      }
      case 'Approved': {
        return 'approved';
      }
      case 'Rejected': {
        return 'rejected';
      }
      case 'No': {
        return 'expired';
      }
      default: {
        return 'default';
      }
    }
  }

  OneSignalInit(key: any): void {
    
    OneSignal.setAppId(key);
    OneSignal.setNotificationOpenedHandler((data) => {
      
    });

    OneSignal.setNotificationWillShowInForegroundHandler((data: any) => {
     
    });

    OneSignal.setInAppMessageClickHandler((data: any) => {
     
    });
    OneSignal.promptForPushNotificationsWithUserResponse((accepted: any) => {
      console.log('User accepted notifications: ' + accepted);
    });
    OneSignal.getDeviceState((res) => {
      localStorage['player_id'] = res.userId;
      localStorage['player_id'] != undefined && localStorage['player_id'] != 'undefined' && localStorage['employee_id'] != undefined && localStorage['employee_id'] != 'undefined' ? this.update_onsignal_id().subscribe(res => { console.log("one signal id updated..", res) }) : null
    })
  }

  update_onsignal_id() {
    var data = {
      document: 'Employee',
      user: localStorage['employee_id'],
      device_id: localStorage['player_id'],
      enabled: 1
    }
    let endpoint = 'notification.notification.api.update_user_device_id';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_employee_detail() {
    let data = {
      name: localStorage['employee_id'],
      doctype: 'Employee'
    }
    this.doc_detail(data).subscribe(res => {
      this.profile_loader = false;
      if (res && res.message && res.message[0].status == 'Success') {
        this.employee_info = res.message[1] 
        res.message[1]['user_image'] = res.message[1]['image'] ? res.message[1]['image'] : undefined;
        this.employee_img = res.message[1]
      } else {
        this.employee_img = ''
      }
    })
  }

  async close_modal() {
    this.modalCtrl.dismiss();
  }

  tab_buttons(sub_header_data: any, route: any, type: any) {
    if (sub_header_data && sub_header_data.length != 0) {
      sub_header_data.map((r: any) => {

        if (r[type] == route) {
          r['isActive'] = true;
        } else if (r.name == route) {
          r['isActive'] = true;
        } else {
          r['isActive'] = false;
        }
      });
    }
  }

  scrolled(data: any) {

    if (data.detail.scrollTop > 220) {
      this.scroll_event.menupage = true;
    } else {
      this.scroll_event.menupage = false;
    }

    if (data.detail.scrollTop > 75) {
      this.scroll_event.detail_head = true;
    } else {
      this.scroll_event.detail_head = false;
    }
  }

  sortings = [
    { text: 'Relevance', role: '' },
    { text: 'Name: A-Z', role: 'name_asc' },
    { text: 'Name: Z-A', role: 'name_desc' },
    { text: 'Price: Low-High', role: 'price_asc' },
    { text: 'Price: High-Low', role: 'price_desc' },
  ];

  store_customer_info(res: any) {
    SecureStoragePlugin.set({ key: 'api_key', value: res.api_key ? res.api_key :'' });
    SecureStoragePlugin.set({ key: 'api_secret', value: res.api_secret ? res.api_secret :'' });
    this.api_key = res.api_key;
    this.api_secret = res.api_secret;
    // localStorage['api_key'] = res.api_key;
    // localStorage['api_secret'] = res.api_secret;

    localStorage['CustomerName'] = res.full_name;
    localStorage['customerRefId'] = res.user_id;
    localStorage['employee_id'] = res.employee_id;
    localStorage['customer_id'] = res.customer_id ? res.customer_id : null;
    localStorage['employee_name'] = res.employee_name ? res.employee_name : null;
    localStorage['designation'] = res.designation ? res.designation : null;
    localStorage['role'] = (res.roles && res.roles.length != 0) ? res.roles[0].role : ''
    this.get_sec_value()

    this.get_customer_values();
    this.get_dashboard();
  }

  cust_role: any;
  get_customer_values() {
    if (localStorage['employee_id']) {
      this.cust_name = localStorage['CustomerName'];
      this.cust_email = localStorage['customerRefId'];
      this.cust_designation = localStorage['designation'];
      this.cust_role = localStorage['role'];
      this.employee_id = localStorage['employee_id']
      localStorage['selfView'] ? this.selfView = true : false;
      localStorage['show_selfView'] ? this.show_selfView = true : false;
      localStorage['reportView'] ? this.reportView = true : false;

      if (this.selfView) {
        this.employee_role = true;
        this.app_name = 'Go1 Employee'
      }
      this.get_permission_details();
      // this.sale_person_id = localStorage['CustomerId'];
    }

  }

  async selfViewFn() {
    this.ismobile ? this.menuCtrl.close() : this.router.navigateByUrl('/dashboard');
    this.dashboard_values = [];
    this.permission_details = [];
    if (this.selfView) {
      this.selfView = false;
      localStorage.removeItem('selfView');
      this.app_name = 'Go1 HR'
    } else {
      this.selfView = true;
      localStorage['selfView'] = true;
      this.app_name = 'Go1 Employee'
      this.currentRole = 'Employee'
    }

    // this.hr_manager_role = this.selfView ? undefined : true;
    // this.employee_role = this.selfView ? true : undefined;

    this.clearData();
    this.get_permission_details();

    let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    await loader.present();

    setTimeout(() => {
      loader.dismiss();
    }, 1500);

    // this.router.navigateByUrl('/tabs/dashboard')
    // location.reload();
  }

  get_permission_details() {


    let data: any = {
      user_id: localStorage['customerRefId'],
      app_name: this.app_name
    };

    if (this.employee_role) {
      // data['module'] = 'Employee'
    }

    this.get_permission_detail(data).subscribe((res) => {
      if (res && res.message) {
        // this.ismobile ? this.get_dashboard() : null;
        let appScreen = res.app_screen ? res.app_screen : [];
        if (appScreen.length != 0) {
          this.appScreen = appScreen.find((res) => { return res.app_name == this.app_name })
        }

        this.get_dashboard()
        this.get_employee_detail()
        this.permission_details = res.message;
        localStorage['role'] = (res.message && res.message.length != 0) ? res.message[0].role : ''
        localStorage['permission_details'] = JSON.stringify(this.permission_details);
        this.default_values = res.default_values;
        if (res.company_details) {
          this.company_detail = res.company_details;
        }
        localStorage['default_values'] = JSON.stringify(this.default_values);
        this.check_project_manager(res.roles);
        localStorage['reportView'] =res.reporting_person
        this.roles = res.roles;
        // this.check_project_manager(this.permission_details);
        this.checkMobileMenu();

        if (this.employee_role && this.ismobile) {
          this.permission_details.map(res => {
            if (res.page == "Leave Application") {
              res.route = '/leave-application-detail/' + localStorage['employee_id']
              res.detail_route = '/leave-application'
            }
          })

        }


        if (this.hr_manager_role && this.ismobile) {
          if (this.dashboard_values && this.dashboard_values.length > 0) {
            this.dashboard_values.map(res => {
              if (res.page == "Leave Application") {
                res.route = '/leave-application-detail'
                res.detail_route = '/leave-application'
              }
            })
          }

          if (this.permission_details && this.permission_details.length > 0) {
            this.permission_details.map(res => {
              if (res.page == "Leave Application") {
                res.route = '/leave-application-detail'
                res.detail_route = '/leave-application'
              }
            })
          }

          if (this.side_tab_dashboard && this.side_tab_dashboard.length > 0) {
            this.side_tab_dashboard.map(res => {
              if (res.page == "Leave Application") {
                res.route = '/leave-application-detail'
                res.detail_route = '/leave-application'
              }
            })
          }

        }

      }
    });

    setTimeout(() => { this.triggerSidemenu.next('loadPermission'); }, 1200);

  }

  checkMobileMenu() {
    if (this.ismobile) {
      if (this.hr_manager_role || this.employee_role) {
        this.permission_details.find((res) => {
          if (res.page == 'Holiday List') {
            res.route = '/holiday-list'
          }

        });
      }

      if (this.hr_manager_role) {
        if (this.dashboard_values && this.dashboard_values.length > 0) {
          this.dashboard_values.map(res => {
            if (res.page == "Leave Application") {
              res.route = '/leave-application-detail'
              res.detail_route = '/leave-application'
            }
          })
        }

        if (this.permission_details && this.permission_details.length > 0) {
          this.permission_details.map(res => {
            if (res.page == "Leave Application") {
              res.route = '/leave-application-detail'
              res.detail_route = '/leave-application'
            }
          })
        }

        if (this.side_tab_dashboard && this.side_tab_dashboard.length > 0) {
          this.side_tab_dashboard.map(res => {
            if (res.page == "Leave Application") {
              res.route = '/leave-application-detail'
              res.detail_route = '/leave-application'
            }
          })
        }
      }

    } else {
      this.permission_details.find((res) => {
        if (res.page == 'Holiday List') {
          res.route = '/list/holiday-list'
        }
      });

    }
  }

  check_permission(doctype, type) {
    let data = this.permission_details.find((r) => r.page == doctype);

    if (data) {
      if (type == 'create') {
        return data.create == 1 ? true : false;
      } else if (type == 'read') {
        return data.read == 1 ? true : false;
      } else if (type == 'write') {
        return data.write == 1 ? true : false;
      }
    } else {
      return true;
    }
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Are you sure do you want to logout..?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            this.alertCtrl.dismiss();
          },
        },
        {
          text: 'Ok',
          handler: () => {
            this.cust_name = undefined;
            this.side_menu_show = false;
            this.profile_side_menu = false;

            this.hr_manager_role = undefined
            this.employee_role = undefined;
            this.app_name = 'Go1 HR';
            localStorage.clear();
            this.clearData();
            this.router.navigateByUrl('/register');
          },
        },
      ],
    });
    await alert.present();
  }

  clearData() {

    this.dashboard_values = undefined;
    this.sales_manager_role = undefined
    // this.hr_manager_role = undefined;
    // this.employee_role = undefined;
    this.project_role = undefined;
    this.show_selfView = false;
    this.selfView = false;
  }

  checkTabItems() {
    if (this.hr_manager_role) {
      this.tabs_items = this.tabs_items_hr;
      this.show_tabs = true;
    } else if (this.employee_role) {
      this.tabs_items = this.employee_items;
      this.show_tabs = true;
    } else {
      this.show_tabs = false;
      this.tabs_items = [];
    }
  }

  tabs_items_hr = [
    {
      title: 'Home',
      route: '/tabs/dashboard',
      icon: '/assets/icon/Nav_tabs/homeicon.svg',
      active_icon: '/assets/icon/Nav_tabs/homeicon-active.svg',
      tab: 'dashboard',
      enable: 1,
    },
    {
      title: 'Leaves',
      route: '/tabs/leave-application-detail',
      icon: '/assets/icon/Nav_tabs/LeaveApplication.svg',
      active_icon: '/assets/icon/Nav_tabs/LeaveApplication-active.svg',
      tab: 'leave-application-detail',
      enable: 1
    },
    {
      title: 'Attendance',
      route: '/tabs/list/attendance',
      icon: '/assets/icon/Nav_tabs/Attendance.svg',
      active_icon: '/assets/icon/Nav_tabs/Attendance-active.svg',
      tab: 'list/attendance',
      enable: 1,
    },
    {
      title: 'Account',
      route: '/tabs/my-profile',
      icon: '/assets/icon/Nav_tabs/profile.svg',
      active_icon: '/assets/icon/Nav_tabs/profile-active.svg',
      tab: 'my-profile',
      enable: 1,
    },
  ];

  employee_items = [
    {
      title: 'Home',
      route: '/tabs/dashboard',
      icon: '/assets/icon/Nav_tabs/homeicon.svg',
      active_icon: '/assets/icon/Nav_tabs/homeicon-active.svg',
      tab: 'dashboard',
      enable: 1,
    },
    {
      title: 'Attendance',
      route: '/tabs/list/attendance',
      icon: '/assets/icon/Nav_tabs/Attendance.svg',
      active_icon: '/assets/icon/Nav_tabs/Attendance-active.svg',
      // tab: 'messages',
      enable: 1,
    },
    // {
    //   title: 'Salary Slip',
    //   route: '/tabs/list/salary-slip',
    //   icon: '/assets/icon/Nav_tabs/SalarySlip.svg',
    //   active_icon: '/assets/icon/Nav_tabs/SalarySlip-active.svg',
    //   tab: 'list/salary-slip',
    //   enable: 1
    // },
    {
      title: 'Leaves',
      route: '/tabs/leave-application-detail',
      icon: '/assets/icon/Nav_tabs/LeaveApplication.svg',
      active_icon: '/assets/icon/Nav_tabs/LeaveApplication-active.svg',
      tab: 'leave-application-detail',
      enable: 1
    },
    {
      title: 'Account',
      route: '/tabs/my-profile',
      icon: '/assets/icon/Nav_tabs/profile.svg',
      active_icon: '/assets/icon/Nav_tabs/profile-active.svg',
      tab: 'my-profile',
      enable: 1,
    },
  ];

  get(endpoint: string) {
    if (this.api_key != undefined) {
    // if (localStorage['api_key'] != undefined) {
      this.httpHeaders = new HttpHeaders({
        Authorization:
          'token ' + this.api_key + ':' + this.api_secret,
      });
    }
    else
      this.get_sec_value()

    if (this.api_key != undefined) {
      this.httpOptions = { headers: this.httpHeaders };
    } else {
      this.httpOptions = {};
    }

    return this.http.get(endpoint, this.httpOptions);
  }

  get_sec_value(){
    Promise.all([
      SecureStoragePlugin.get({ key: 'api_key' }),
      SecureStoragePlugin.get({ key: 'api_secret' })
    ])
      .then(results => {
        console.log(results[0].value)
        this.api_key = results[0].value;
        this.api_secret = results[1].value;
      })
      .catch(error => {
        console.error('Error retrieving data securely:', error);
      });
  }

  postmethod(endpoint: string, data: any) {
    if (this.api_key != undefined) {
      this.httpHeaders = new HttpHeaders({
        Authorization:
          'token ' + this.api_key + ':' + this.api_secret,
      });
    }
    else
      this.get_sec_value()

    if ((data["doctype_name"] != "Project" && data["doctype_name"] != "Bug Sheet" && data["doctype_name"] != "Project") && localStorage['selfView'] && (endpoint == (this.baseMethod + this.go1_apps_api + 'get_tempate_and_datas') || endpoint == (this.baseMethod + this.go1_apps_api + 'get_salary_slip_details'))) {
      let employee: any = {};

      if (data["doctype_name"] == "Employee Grievance") {
        employee = { raised_by: ['=', localStorage['employee_id']] };
      } 
      else if(data["doctype_name"] == "Leave Withdrawal" || data["doctype_name"] == "Regularization" || data["doctype_name"] == "LTA Request"){
        employee = { employee: ['=', localStorage['employee_id']] };
      }
      else if(data["doctype_name"] == "Asset Buyback"){
        employee = { employee_code: ['=', localStorage['employee_id']] };
      }
      else if(endpoint.includes("go1_apps.go1_apps.api.get_salary_slip_details")){
        // employee = { employee_code: ['=', localStorage['employee_id']] };
      }
      else {
        employee = { employee_id: ['=', localStorage['employee_id']] };
      }

      if (typeof (data.search_data) == 'string' || data.search_data == '') {
        let parameters = (data.search_data == '') ? {} : JSON.parse(data.search_data)
        data.search_data = { ...parameters, ...employee }
        data.search_data = JSON.stringify(data.search_data)
      } else if (typeof (data.search_data) == 'object') {
        data.search_data = { ...data.search_data, ...employee };
      }
    }
    else if(localStorage['show_selfView'] && !endpoint.includes("go1_apps.go1_apps.apis.hrms.get_emp_holiday_list") && !endpoint.includes("go1_apps.go1_apps.apis.hrms.get_employee_attendance_list") && !endpoint.includes("go1_apps.go1_apps.api.get_leave_application")){
      let employee: any = {};

      if(data["doctype_name"] == "Leave Withdrawal" || data["doctype_name"] == "Regularization" || data["doctype_name"] == "LTA Request"){
        employee = { employee: ['!=', localStorage['employee_id']] };
      }
      else if(data["doctype_name"] == "Asset Buyback"){
        employee = { employee_code: ['!=', localStorage['employee_id']] };
      }
      else if(endpoint.includes("go1_apps.go1_apps.api.get_salary_slip_details") || endpoint.includes("go1_apps.go1_apps.apis.hrms.get_employee_attendance_list") || endpoint.includes("go1_apps.go1_apps.api.get_hd_ticket_details")

        || endpoint.includes("go1_apps.go1_apps.apis.hrms.get_emp_holiday_list")
        || data["doctype_name"] == "Probation Evaluation" || data["doctype_name"] == "Employee VPF"){
          // employee = ""
      }
      else {
        employee = { employee_id: ['!=', localStorage['employee_id']] };
      }
      if (typeof (data.search_data) == 'string'  || data.search_data == '') {
        let parameters = (data.search_data == '') ? {} : JSON.parse(data.search_data)
          data.search_data = { ...parameters, ...employee }
          data.search_data = JSON.stringify(data.search_data)
      } else if (typeof (data.search_data) == 'object') {
        data.search_data = { ...data.search_data, ...employee };
      }
    }
    else if(localStorage['show_selfView'] && endpoint.includes("go1_apps.go1_apps.api.get_leave_application")){
      // let employee: any = {};
        data.employee_id = localStorage['employee_id'];
        // if(this.show_selfView && !this.selfView && data.search_data && data.search_data.status == 'Rejected'){
        // let employee:any={};
        // delete data['employee_id']
        //  employee = { employee_id: ['!=', localStorage['employee_id']] };
        //  if (data.search_data != '') {
        //   // let parameters = (data.search_data == '') ? {} : JSON.parse(data.search_data)
        //     data.search_data = { ...parameters, ...employee }
        //     data.search_data = JSON.stringify(data.search_data)
        // } else if (typeof (data.search_data) == 'object') {
        //   data.search_data = { ...data.search_data, ...employee };
        // }
        // }
      // if (typeof (data.search_data) == 'string'  || data.search_data == '') {
      //   let parameters = (data.search_data == '') ? {} : JSON.parse(data.search_data)
      //     data.search_data = { ...parameters, ...employee }
      //     data.search_data = JSON.stringify(data.search_data)
      // } else if (typeof (data.search_data) == 'object') {
      //   data.search_data = { ...data.search_data, ...employee };
      // }
    }

    // localStorage['customerRefId'] &&
    if (this.api_key != undefined) {
      this.httpOptions = { headers: this.httpHeaders };
    } else {
      this.httpOptions = {};
    }
    return this.http.post(endpoint, data, this.httpOptions);
  }

  employee_claim_details(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'employee_claim_details';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  salary_structure_details(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'salary_structure_details';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_contact_person(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_link_title';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_lta_block_period(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_lta_block_period';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_lta_availeble_years(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_lta_availeble_years';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_lta_amount(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_lta_amount';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  getLogin(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'login';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  sub_product_category(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_list';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_items(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_items';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  tax_details(data: any): Observable<any> { // later
    let endpoint = this.go1_apps_api + 'tax_details';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  print_pdf(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'print_pdf';
    return this.postmethod(this.baseMethod + endpoint, data);
  }


  //Dashboard
  Dashboard_details(data: any): Observable<any> {

    if (localStorage['selfView']) {
      data.self_view = 1
    }

    data['app_name'] = this.app_name;

    let endpoint = this.go1_apps_api + 'se_dashboard';
    // let endpoint = (this.erp14 ? this.seapi_api:  this.go1_apps_api) + 'se_dashboard1';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  doc_detail(Info: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'doc_detail';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  get_master_values(Info: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_master_values';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  label_values(Info: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'label_values';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  get_default_account(Info: any): Observable<any> { //later
    let endpoint = this.go1_apps_api + 'get_default_account';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  validate_link(Info: any): Observable<any> { //later
    let endpoint = 'frappe.client.validate_link';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  get_address_display(Info: any): Observable<any> {
    let endpoint =
      'frappe.contacts.doctype.address.address.get_address_display';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  tax_template(Info: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'tax_template';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  checkIn(Info): Observable<any> {
    // let endpoint ='Attendance' +`?filters=[["attendance_date","=","${Info.date}"],["employee_name","=","${localStorage['CustomerName']}"]]`;
    // let endpoint = 'Attendance' + `?filters=[["attendance_date","=","${Info.date}"],["employee","=","${localStorage['employee_id']}"]]`;
    // let endpoint = 'Employee Checkin' + `?filters=[["time", ["Between", ["2024-07-15 00:00:00", "2024-07-15 23:59:59"]]],["employee","=","${localStorage['employee_id']}"]]`;
    let endpoint = 'td_shift_and_attendance.td_shift_and_attendance.utils.mobile_api.check_attendance';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  create_leave_request(Info): Observable<any> {
    let endpoint = 'td_shift_and_attendance.td_shift_and_attendance.doctype.attendance_adjustment_tool.attendance_adjustment_tool.create_leave_request';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  emp_checkIn(Info): Observable<any> {
    // let endpoint = 'Employee Checkin' + `?fields=["employee","name","log_type","time"]&filters=[["attendance","=","${Info.id}"]]`;
    let endpoint = 'Employee Checkin' + `?fields=["employee","name","log_type","time"]&filters=[["attendance","=","${Info.id}"]]&order_by=name%20desc`;

    return this.get(this.baseResource + endpoint);
  }

  action_data(Info): Observable<any> {
    let endpoint =
      'Employee Checkin' +
      `?fields=["*"]&filters=[["attendance","=","${Info.id}"]]`;
    return this.get(this.baseResource + endpoint);
  }

  employee_checkin(Info): Observable<any> {
    let endpoint = this.go1_apps_custom_api + 'insert_check_in';
    // let endpoint = (this.erp14 ? this.seapi_api:  this.go1_apps_custom_api) + 'employee_checkin';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }


  attendance_checkin(Info): Observable<any> {
    let endpoint = 'td_shift_and_attendance.td_shift_and_attendance.utils.api.checkin';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  get_missing_punched_days(Info): Observable<any> {
    let endpoint = 'td_shift_and_attendance.td_shift_and_attendance.utils.attendance_management.get_missing_punched_days';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  create_regularization_before_save(Info): Observable<any> {
    let endpoint = 'td_shift_and_attendance.td_shift_and_attendance.utils.mobile_api.create_regularization_before_save';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  get_manager_team_members(Info): Observable<any> {
    let endpoint = 'td_shift_and_attendance.td_shift_and_attendance.utils.mobile_api.get_manager_team_members';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  validate_asset(Info): Observable<any> {
    let endpoint = 'tdasset.tdasset.doctype.buyback_calculator.buyback_calculator.validate_asset';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  fetch_buyback_years(Info): Observable<any> {
    let endpoint = 'tdasset.tdasset.doctype.buyback_calculator.buyback_calculator.fetch_buyback_years';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  buyback_calculator_asset(Info): Observable<any> {
    let endpoint = 'tdasset.tdasset.doctype.buyback_calculator.buyback_calculator.asset';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  get_asset_detail(Info): Observable<any> {
    let endpoint = 'tdasset.tdasset.doctype.buyback_calculator.buyback_calculator.get_asset_detail';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  permission_fields(Info): Observable<any> {
    let endpoint = 'tdasset.api.permission_fields';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }


  delete_docs(data: any): Observable<any> { //later
    let endpoint = this.go1_apps_api + 'delete_doc';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  assigned_to(data): Observable<any> {
    // let endpoint = (this.erp14 ? this.seapi_api:  this.go1_apps_api) + 'assigned_to';
    let endpoint = this.go1_apps_api + 'insert_assign_to';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  search_fields(data): Observable<any> {
    let endpoint = this.go1_apps_api + 'search_fields';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_doc_data(doctype): Observable<any> {
    let datas = { doctype: doctype };
    //   let data = {
    //     doctype:"Material Request Item",
    //     input_fields:["item_code","schedule_date","qty"]
    // }
    let endpoint = 'frappe.desk.form.load.getdoctype?doctype=';
    return this.postmethod(this.baseMethod + endpoint, datas);
    // return this.get(this.baseMethod + endpoint + doc_name);
  }

  preview_image(url) {
    window.open(url, '_blank');
  }

  inset_docs(data): Observable<any> {
    let endpoint = this.go1_apps_api + 'insert_doc';
    return this.postmethod(this.baseMethod + endpoint, data);
  }


  get_permission_detail(data): Observable<any> {
    // let endpoint = (this.erp14 ? this.seapi_api:  this.go1_apps_api) + 'get_permission_detail';
    if (localStorage['selfView']) {
      data.self_view = 1
    }

    let endpoint = this.go1_apps_api + 'get_all_permission_detail';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_link_field_options_child(refdoc): Observable<any> {
    let filter:any;
    if (refdoc == 'Classified Category') {
      filter = `?limit_page_length=100&fields=["category_name","name","parent_category"]&order_by=name%20asc`;
    } else if (refdoc == 'Job Category') {
      filter = `?limit_page_length=100&fields=["category_name","name","parent_category"]&order_by=category_name%20asc`;
    } else if (refdoc == 'Job Role') {
      filter = `?fields=["*"]`;
    } else if (refdoc == 'Expected Salary Type') {
      // let parent_salary_type = '/' + this.salary_type;
      // filter = parent_salary_type;
    }

    let endpoint = this.ref_doc_type + filter;
    return this.get(this.baseResource + endpoint);
  }

  web_form_dynamic(data): Observable<any> {
    let endpoint = 'Web Form/' + data;
    return this.get(this.baseResource + endpoint);
  }

  get_link_field_options_parent(refdoc): Observable<any> {
    let filter:any;
    if (refdoc == 'Classified Category') {
      filter =
        '?limit_page_length=100&filters=[["is_group","=","1"]]&fields=["category_name","name"]&order_by=name%20asc';
    } else if (refdoc == 'Job Category') {
      filter =
        '?limit_page_length=100&filters=[["is_group","=","1"]]&fields=["category_name","name"]&order_by=category_name%20asc';
    } else if (refdoc == 'Job Role') {
      // filter= `?fields=["*"]`
      filter =
        '?limit_page_length=100&order_by=name%20asc&filters=[["is_group","=",1]]';
    } else if (refdoc == 'Expected Salary Type') {
      filter = '';
    }

    let endpoint = this.ref_doc_type + filter;
    return this.get(this.baseResource + endpoint);
  }

  // Get
  page_length = '?limit_page_length=100&order_by=name%20asc';

  get_link_field_options(): Observable<any> {
    if (this.ref_doc_type == 'Recruiter Company Size') {
      this.page_length = '?limit_page_length=100&order_by=creation%20desc';
    } else if (this.ref_doc_type == 'Country') {
      this.page_length = '?limit_page_length=10000&order_by=name%20asc';
    }
    let endpoint = this.ref_doc_type + this.page_length;
    return this.get(this.baseResource + endpoint);
  }

  // Upload image
  upload_image(data: any): Observable<any> {
    let endpoint = 'File';
    return this.postmethod(this.baseResource + endpoint, data);
  }

  upload_image_url(unique_name: any): Observable<any> {
    let endpoint = 'File/';
    return this.get(this.baseResource + endpoint + unique_name);
  }

  async filSizeAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-alert-class',
      header: 'File Size Exceeded.!',
      message: 'Please Upload Files Below Size Of 10.0 MB...!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.alertCtrl.dismiss();
          },
        },
      ],
    });
    await alert.present();
  }

  check_device_type() {
    if (this.platform.is('android')) {
      return 'Android Mobile App';
    } else if (this.platform.is('ios')) {
      return 'IOS Mobile App';
    } else {
      return 'Website';
    }
  }


  async open_drop_down_options(type, fieldname, fieldname_value, selected_value) {
    // this.SubjectEvent = false;
    const modal = await this.modalCtrl.create({
      component: SelectDropdownPage,
      cssClass: this.ismobile ? 'job-detail-popup' : 'filter-popup',
      componentProps: {
        type: type,
        fieldname: fieldname,
        fieldname_value: fieldname_value,
        selected_value: selected_value,
        select_options: this.select_options,
        form_values: this.formStoreValues,
        parent_doctype: this.form_route,
        hideALlOption: true
        // selectDropDown: (fieldname_value && fieldname_value == 'select') ? true : false
      },
    });
    await modal.present();
    // this.SubjectEvent = true;
  }

  async open_drop_down_options2(type, fieldname, fieldname_value, selected_value) {
    const modal = await this.modalCtrl.create({
      component: SelectDropdownPage,
      cssClass: this.ismobile ? 'job-detail-popup' : 'filter-popup',
      componentProps: {
        type: type,
        fieldname: fieldname,
        fieldname_value: fieldname_value,
        selected_value: selected_value,
        select_options: this.select_options,
        send_all_value: true
      },
    });
    await modal.present();
  }

  getRandomColor(data) {

    if (data && data.length != 0) {
      data.map(r => {
        var color = Math.floor(Math.random() * 16777215).toString(16);
        color = '#' + ('000000' + color).slice(-6);
        r.color = color;
        r.bg_color = this.hexToRgb(r.color, 0.1);
      })
    }
  }

  hexToRgb(hex, alpha) {
    hex = hex.replace('#', '');
    var r = parseInt(hex.length == 3 ? hex.slice(0, 1).repeat(2) : hex.slice(0, 2), 16);
    var g = parseInt(hex.length == 3 ? hex.slice(1, 2).repeat(2) : hex.slice(2, 4), 16);
    var b = parseInt(hex.length == 3 ? hex.slice(2, 3).repeat(2) : hex.slice(4, 6), 16);
    if (alpha) {
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    }
    else {
      return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
  }

  get_all_conversation(name) {
    let data = {
      ticket: name,
      page_size: 100,
      page_no: 0
    }
    this.get_all_conversations(data).subscribe(res => {

      if (res && res.status == 'success') {
        this.skeleton_detail = false;
        this.skeleton_detail = false;
        this.ticket_details = res.message

        let ticket = `ticket${this.ticket_details.length - 1}`
        let el = document.getElementById(ticket)

        el?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      }
    })
  }

  attach_filter(data, color) {
    var str = data.split('.');
    let value = str[1];
    value = value.toLowerCase();
    if (
      value &&
      (value == 'apng' ||
        value == 'avif' ||
        value == 'gif' ||
        value == 'jpeg' ||
        value == 'jfif' ||
        value == 'pjpeg' ||
        value == 'pjp' ||
        value == 'webp' ||
        value == 'png' ||
        value == 'svg' ||
        value == 'jpg')
    ) {
      return `/assets/icon/msg/photo${color}.svg`;
    } else if (value && value == 'pdf') {
      return `/assets/icon/msg/pdf${color}.svg`;
    } else if (value && value == 'ppt') {
      return `/assets/icon/msg/ppt${color}.svg`;
    } else if (
      value &&
      (value == 'webm' ||
        value == 'mpg' ||
        value == 'mp2' ||
        value == 'mpe' ||
        value == 'ogg' ||
        value == 'mp4' ||
        value == 'm4v' ||
        value == 'avi' ||
        value == 'wmv' ||
        value == 'mov' ||
        value == 'qt' ||
        value == 'flv' ||
        value == 'swf' ||
        value == 'avchd')
    ) {
      return `/assets/icon/msg/video${color}.svg`;
    } else if (value && value == 'zip') {
      return `/assets/icon/msg/zip${color}.svg`;
    } else {
      return `/assets/icon/msg/pdf${color}.svg`;
    }
  }

  get_customer = '';
  get_company = '';


  get_master_value(doctype, fieldname) {

    let doctype_name = doctype;
    doctype = doctype + fieldname;

    let array = this.all_link_opts[doctype] ? this.all_link_opts[doctype] : [];
    array = array ? array : [];
    let count = array.length - 1;
    let page_no;
    let page_length = 20;
    let search_text = this.all_link_opts[doctype + 'search_text'] ? this.all_link_opts[doctype + 'search_text'] : '';
    page_no = this.all_link_opts[doctype + 'page_no'] ? this.all_link_opts[doctype + 'page_no'] + 1 : 1;
    //  if(array.length == 0 || (array.length != 0 && !array[count].no_products)){
    if (array.length == 0 || !this.all_link_opts[doctype + 'no_products']) {
      //  page_no = array.length == 0 ? 1 : ((array.length/page_length) + 1);
      if (array.length == 0) {
        page_no = 1;
        this.all_link_opts[doctype + 'page_no'] = page_no;
      } else {
        this.all_link_opts[doctype + 'page_no'] = page_no;
      }
      let data = {
        doctype: doctype_name,
        page_no: page_no,
        page_length: page_length,
        search_text: search_text,
      };


      if (this.form_doctype == 'Expense Claim') {
        if (doctype_name == 'Cost Center') {
          data['filter_name'] = 'Company';
          data['filter_value'] = this.form_values && this.form_values['company'] ? this.form_values['company'] : '';
        } else if (fieldname == 'payable_account' || doctype_name == 'Account') {
          data['reference'] = fieldname;
          data['filter_name'] = 'Company';
          data['filter_value'] = this.form_values && this.form_values['company'] ? this.form_values['company'] : '';
        } else if (doctype_name == 'Account') {
          data['filter_name'] = 'Company';
          data['filter_value'] = this.form_values && this.form_values['company'] ? this.form_values['company'] : '';
        } else if (doctype_name == 'Task') {
          data['filter_name'] = 'Project';
          data['filter_value'] = this.form_values && this.form_values['project'] ? this.form_values['project'] : '';
        } else if (doctype_name == 'Employee Advance') {
          data['filter_name'] = 'Employee';
          data['filter_value'] = this.form_values && this.form_values['employee'] ? this.form_values['employee'] : '';
        }
      }

      if (fieldname == 'taxes_and_charges' || doctype_name == 'Warehouse' || doctype_name == 'Currency') {
        data['filter_name'] = 'Company';
        data['filter_value'] = this.form_values && this.form_values['company'] ? this.form_values['company'] : '';
      }

      if ((this.hr_manager_role || this.employee_role) && !data['filter_value']) {
        if (doctype_name == 'Department' || doctype_name == 'Employee' || doctype_name == 'Salary Structure') {
          data['filter_name'] = 'Company';
          data['filter_value'] = (this.default_values && this.default_values.default_company) ? this.default_values.default_company : '';
        }
      }

      if (data['filter_name'] == "Company" && !data['filter_value']) {
        let default_values = localStorage['default_values'] ? (JSON.parse(localStorage['default_values'])) : '';
        data['filter_value'] = (default_values && default_values.default_company) ? default_values.default_company : '';
      }

      this.label_values(data).subscribe((res) => {
        if (res && res.message && res.message.length != 0) {

          if (page_no == 1) {
            array = [{ label: "All", name: 'ALL' }];
            // array = [{ label: '', name: '' }];
            array ? (array = [...array, ...res.message]) : '';
            this.all_link_opts[doctype] = array;
          } else {
            array ? (array = [...array, ...res.message]) : '';
            this.all_link_opts[doctype] = array;
          }
        } else {
          page_no == 1 ? (this.all_link_opts[doctype] = []) : null;
          this.all_link_opts[doctype + 'no_products'] = true;
          // this.all_link_opts[doctype] = [];
        }

      });
    }
  }

  get_dashboard() {
    let data = {
      employee_id: localStorage['customerRefId'],
    };
    this.Dashboard_details(data).subscribe((res) => {
      this.loader = false;
      if (res && res.status == 'Success') {
        if (res.pages && res.pages.length != 0) {
          let arr = res.pages;
          let uniqueArr = Array.from(new Set(arr));
          res.pages = uniqueArr;
        }

        let dash_board = res;
        this.dashboard_values = res.message;

        let cards_value = JSON.stringify(res.message)
        this.dashboard_cards_value = JSON.parse(cards_value)
        this.sales_dashboard = (this.dashboard_values && this.dashboard_values.length) ? this.dashboard_values[0].role : '';
        this.set_primary_color(this.sales_dashboard);
        let side_tab_dashboard = JSON.stringify(res.message);
        this.side_tab_dashboard = JSON.parse(side_tab_dashboard);
        if (!this.ismobile) {
          let push_data = {
            page: 'Dashboard',
            page_name: 'Dashboard',
            route: '/dashboard',
          };
          // let push_employee_att = {
          //   page: 'Employee Attendance Tool',
          //   page_name: 'Attendance Tool',
          //   route: '/employee-attendance-tool',
          // };

          let push_buyback_calc = {
            page: 'Buyback Calculator',
            page_name: 'Buyback Calculator',
            route: '/buy-back-calculator',
          }

          let push_my_slip = {
            page: 'My Slip',
            page_name: 'My Slip',
            route: '/my-slips',
          }


          // console.log(this.side_tab_dashboard,"side_tab_dashboard before")
          this.side_tab_dashboard.map(res => {
            if (res.page == "Leave Application") {
              res.route = this.hr_manager_role ? '/leave-application-detail' : '/leave-application-detail/' + localStorage['employee_id']
            }
          })
          this.employee_role ? this.dashboard_values.splice(this.dashboard_values.length, 0, push_buyback_calc) : null;
          this.employee_role ? this.dashboard_values.splice(this.dashboard_values.length, 0, push_my_slip) : null;
          // this.hr_manager_role ? this.dashboard_values.splice(0, 0, push_employee_att) : null;
          // this.hr_manager_role ? this.side_tab_dashboard.splice(0, 0, push_employee_att) : null;

          // this.hr_manager_role ? this.dashboard_values.splice(this.dashboard_values.length, 0, push_buyback_calc) : null;

          !this.sales_manager_role ? this.side_tab_dashboard.splice(0, 0, push_data) : null;

        } else {
          // if (this.employee_role) {


          if (this.hr_manager_role || this.employee_role) {
            this.dashboard_values.find((res) => {
              if (res.page_name == 'Holiday List') {
                res.route = '/holiday-list'
              }
            });

            this.dashboard_values.find((res) => {
              if (res.page_name == 'Timesheet') {
                res.route = '/timesheet-detail'
              }
            });

            this.dashboard_cards_value.find((res) => {
              if (res.page_name == 'Timesheet') {
                res.route = '/timesheet-detail'
              } else if (res.page_name == 'Task') {
                res.route = '/task-list'
              }
            });

            this.dashboard_cards_value.find((res) => {
              if (res.page_name == 'Holiday List') {
                res.route = '/holiday-list'
              }
            });
          } else {
            this.dashboard_values.find((res) => {
              if (res.page_name == 'Holiday List') {
                res.route = '/list/holiday-list'
              }
            });

            this.dashboard_cards_value.find((res) => {
              if (res.page_name == 'Holiday List') {
                res.route = '/list/holiday-list'
              }
            });
          }

          if (this.employee_role) {
            this.dashboard_values.map(res => {
              if (res.page == "Leave Application") {
                res.route = '/leave-application-detail/' + localStorage['employee_id']
                res.detail_route = '/leave-application'
              }
            })

            this.side_tab_dashboard.map(res => {
              if (res.page == "Leave Application") {
                res.route = '/leave-application-detail/' + localStorage['employee_id']
                res.detail_route = '/leave-application'
              }
            })
          }

          if (this.hr_manager_role && this.ismobile) {
            this.dashboard_values.map(res => {
              if (res.page == "Leave Application") {
                res.route = '/leave-application-detail'
                res.detail_route = '/leave-application'
              }
            })
          }

          // let push_employee_att = {
          //   page: 'Employee Attendance Tool',
          //   page_name: 'Attendance Tool',
          //   route: '/employee-attendance-tool',
          // };

          let push_buyback_calc = {
            page: 'Buyback Calculator',
            page_name: 'Buyback Calculator',
            route: '/buy-back-calculator',
          }

          let push_my_slip = {
            page: 'My Slip',
            page_name: 'My Slip',
            route: '/my-slips',
          }

          // let pushProjectMeeting = [
          //   {
          //     page: 'Meeting',
          //     page_name: 'Meeting',
          //     route: '/list/meeting',
          //   },
          //   {
          //     page: 'Daily Update',
          //     page_name: 'Daily Update',
          //     route: '/daily-updates',
          //   },
          // ];

          let approval_screen = [
            {
              page: 'Approvals',
              page_name: 'Approvals',
              route: '/approvals',
            }
          ]

          // this.project_role ? this.dashboard_values.splice(0, 0, pushProjectMeeting) : null;
          this.employee_role ? this.dashboard_values.splice(this.dashboard_values.length, 0, push_buyback_calc) : null;
          this.employee_role ? this.dashboard_values.splice(this.dashboard_values.length, 0, push_my_slip) : null;
          // this.project_role ? this.dashboard_values = [...this.dashboard_values, ...pushProjectMeeting] : null;
          this.hr_manager_role ? this.dashboard_values = [...this.dashboard_values,...approval_screen] : null;
          // this.hr_manager_role ? this.dashboard_values.splice(0, 0, approval_screen) : null;
          // this.hr_manager_role ? this.dashboard_values.splice(0, 0, push_employee_att) : null;

          // this.hr_manager_role ? this.dashboard_values.splice(this.dashboard_values.length, 0, push_buyback_calc) : null;

        }
        this.chartOptions.series = dash_board.values;
        this.chartOptions.labels = dash_board.pages;
        // this.get_chart(dash_board);

        setTimeout(() => { this.triggerSidemenu.next('loadMenu'); }, 800);

        if (localStorage['QuickView']) {
          let data = JSON.parse(localStorage['QuickView'])
          this.dashboard_values = data
        }
      }
    });
  }

  decode(latlng, type) {
    const geocoder = new google.maps.Geocoder();
    // const infowindow = new google.maps.InfoWindow();
    geocoder.geocode({ location: latlng }, (data: any, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        data[0].address_components.map((res) => {
          this.location_info.latitude = data[0].geometry.location.lat();
          this.location_info.longitude = data[0].geometry.location.lng();

          if (res.types[0] == 'postal_code') {
            this.location_info.zipcode = res.long_name;
            // this.zipcode_availbility(this.location_info.zipcode, data);
          }
          res.types[0] == 'country'
            ? (this.location_info.country = res.long_name)
            : null;
          res.types[0] == 'administrative_area_level_1'
            ? (this.location_info.state = res.long_name)
            : null;
          res.types[0] == 'locality'
            ? (this.city, (this.location_info.city = res.long_name))
            : null;
          this.location = data[0].formatted_address;
          this.location_info.address = data[0].formatted_address
            .split(this.location_info.city)[0]
            .trim();
          this.current_address =
            this.location_info.address +
            this.location_info.city +
            ',' +
            this.location_info.state +
            ',' +
            this.location_info.country +
            ',' +
            this.location_info.zipcode;
          if (type == 'get_map_fields') {
            this.map_fields_get.next('get_values');
          }

        });
      }
    });
  }

  enable_location() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
          this.getCurrentLocation();
        },
        error => {
          setTimeout(() => {
            this.getCurrentLocation();
          }, 1500)
          console.log('Error requesting location permissions', error)
        }
      )
    }), error => console.log('Error requesting location permissions', error);
  }

  getCurrentLocation() {
    this.geo
      .getCurrentPosition()
      .then((resp) => {
        const latitude = resp.coords.latitude;
        const longitude = resp.coords.longitude;
        this.location_info.latitude = latitude;
        this.location_info.longitude = longitude;
        return resp
      })
      .catch((error) => {
        console.log('Error getting address', error);
        setTimeout(() => {
          this.enable_location()
        }, 1000)
      });
  }

  getAddressFromCoordinates(latitude: any, longitude: any) {
    const apiKey = 'AIzaSyCJ8kAd5UrYk_dQJxiNYVj3ISaZj9xOMDg';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    return this.http.get(url).pipe(
      map((response: any) => {

        if (response.results && response.results.length > 0) {
          this.current_address = response.results[0].formatted_address;

          return this.current_address;
        } else {
          throw new Error('Unable to geocode coordinates');
        }
      })
    );
  }

  doctype_select(item) {
    // console.log(item,"item DbService")
    localStorage['docType'] = item;
  }

  get_employee_type_counts(doctype, date) {
    let data = {
      dashboard: doctype,
      company: (this.default_values && this.default_values.default_company) ? this.default_values.default_company : '',
      date: date
    }
    this.get_employee_type_count(data).subscribe(res => {

      if (res && res.status && res.status == "Success") {
        this.employee_shift_dash = res.dashboard;
      }
    })
  }

  menu = [
    {
      title: 'Dashboard',
      route: '/dashboard',
      icon: '/assets/icon/home.svg',
      enable: 1,
    },
    {
      title: 'Employee Advance',
      route: '/list/advance',
      icon: '/assets/dashboard/EmployeeAdvance.svg',
      enable: 1,
    },
    {
      title: 'Expense Claim',
      route: '/list/expense-claim',
      icon: '/assets/dashboard/ExpenseClaim.svg',
      enable: 1,
    },
    {
      title: 'Project',
      route: '/list/project',
      icon: '/assets/dashboard/Project.svg',
      enable: 1,
    },
    {
      title: 'Attendance',
      route: '/list/attendance-list',
      icon: '/assets/dashboard/Attendance.svg',
      enable: 1,
    },
  ];

  get_list(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_list';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_customer_list(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_list';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_customer_details(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'doc_detail';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  // get_activity(): Observable<any> {
  //   let endPoint = 'Activity Type';
  //   return this.get(this.baseResource + endPoint);
  // }

  get_ip(): Observable<any> {
    let endpoint = 'https://jsonip.com';
    return this.get(endpoint);
  }

  get_Employees(): Observable<any> {
    let endPoint = 'Employee?fields=["employee_name","employee"]';
    return this.get(this.baseResource + endPoint);
  }

  get_employee_attendance_details(data: any) {
    let endpoint = this.go1_apps_apis_hrmls + 'get_employee_attendance_details';
    return this.postmethod(this.baseMethod + endpoint, data);
  }
  

  current_date: any
  get_tempate_and_datas(data: any): Observable<any> {

    // let endpoint = (this.erp14 ? this.seapi_api:  this.go1_apps_api) + 'get_tempate_and_datas';
    let endpoint;

    if (data['doctype_name'] == 'HD Ticket') {

      endpoint = this.go1_apps_api + 'get_hd_ticket_details';

      (data.docname || data.docname == "") ? delete data.docname : null;
      data.view_type ? delete data.view_type : null;
      data.fetch_child ? delete data.fetch_child : null;
      data.doctype_name ? delete data['doctype_name'] : null;
      data["search_value"] = ""

      if (data.search_data && data.search_data != "") {
        let searchValue = JSON.parse(data.search_data)

        data["search_data"] = searchValue
      } else {
        data.search_data = data.search_data == "" ? {} : data.search_data
      }

    } else if (data['doctype_name'] == 'Holiday List') {
      endpoint = this.go1_apps_apis_hrmls + 'get_emp_holiday_list';
      (data.docname || data.docname == "") ? delete data.docname : null;
      data.view_type ? delete data.view_type : null;
      data.page_no ? delete data.page_no : null;
      data.page_length ? delete data.page_length : null;
      data.fetch_child ? delete data.fetch_child : null;
      data.doctype_name ? delete data['doctype_name'] : null;
      data['employee_id'] = localStorage['employee_id']

    } else if (data['doctype_name'] == 'Leave Application') {
      endpoint = this.go1_apps_api + "get_leave_application";
      (data.docname || data.docname == "") ? delete data.docname : null;
      data.view_type ? delete data.view_type : null;
      data.fetch_child ? delete data.fetch_child : null;
      data.doctype_name ? delete data['doctype_name'] : null;
      data['dashboard_name'] = this.hr_manager_role ? 'HR Leave Application Dashboard' : 'Employee Leave Application Dashboard'
      if (this.current_leave_segment && this.current_leave_segment != "All Leaves" && this.hr_manager_role) {
        data['employee_id'] = localStorage['employee_id'];
        data['dashboard_name'] = 'HR Leave Application Dashboard'
      } else if (this.employee_role) {
        data['employee_id'] = localStorage['employee_id'];
      }

      if (data['search_data'] == "")
        data['search_data'] = {}
      // && !this.ismobile
    } else if (data['doctype_name'] == 'Salary Slip') {
      endpoint = this.go1_apps_api + "get_salary_slip_details"
      data.view_type ? delete data.view_type : null;
      data.fetch_child ? delete data.fetch_child : null;
      (data.docname || data.docname == "") ? delete data.docname : null;
      data.doctype_name ? delete data['doctype_name'] : null;

      if (data["search_data"] != "") {
        data["search_data"] = JSON.parse(data["search_data"])
        console.log(data["search_data"])
        delete data["search_data"]['status']
      }
      else
        data["search_data"] = {}

      if (this.employee_role) {
        if (data["search_data"] != "") {
          data["search_data"]['employee'] = localStorage['employee_id']
        }
      }


      if (data['filters']) {
        data['filters']['role'] = this.hr_manager_role ? "HR Manager" : "Employee"
      }
    } else if (this.employee_role && data['doctype_name'] == 'Employee') {
      endpoint = this.go1_apps_apis_hrmls + "get_employee_details"
      data.view_type ? delete data.view_type : null;
      data.fetch_child ? delete data.fetch_child : null;
      (data.docname || data.docname == "") ? delete data.docname : null;
      data.doctype_name ? delete data['doctype_name'] : null;

      if (data["search_data"] != "") {
        data["search_data"] = JSON.parse(data["search_data"])
      } else {
        data["search_data"] = {}
      }

      data['employee_filters'] = { ...data["search_data"] }
      data['employee_filters']['status'] = ['=', 'Active']
      delete data['search_data']

      if (data['employee_filters'] && data['employee_filters'].favourite) {
        data['employee_filters'].favourite = data['employee_filters'].favourite[1] ? 1 : 0;
      }

      if (data['filters']) {
        data['filters']['role'] = this.hr_manager_role ? "HR Manager" : "Employee"
      }
    } else {
      endpoint = this.go1_apps_api + 'get_tempate_and_datas';

    }

    return this.postmethod(this.baseMethod + endpoint, data);
  }

  addTowishList(item) {
    let data = {
      "doctype": "Employee",
      "name": item.name,
      "add": item['liked_status'] == "Yes" ? "No" : "Yes"
    }

    this.add_wishlist(data).subscribe((res) => {
      if (res && res.message && res.message.status && res.message.status == 'Success') {
        item['liked_status'] = (item['liked_status'] == "Yes") ? "No" : "Yes";
      } else {
        this.alert('Soemthing went wrong try again later');
      }
    }, error => {
      this.alert('Soemthing went wrong try again later');
    })
  }

  add_wishlist(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'add_wishlist';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  next_doc(Info): Observable<any> {
    if (localStorage['selfView'] || this.employee_role) {
      Info['filters'] = { "employee": localStorage['employee_id'] }
    }

    let endpoint = this.go1_apps_api + 'next_doc';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  get_default_data(Info): Observable<any> {
    let endpoint = this.go1_apps_api + 'mapped_data';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  get_doc_fields(Info): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_doc_fields';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  get_salary_slip_content(Info): Observable<any> {
    let endpoint = 'td_payroll.apis.payroll_api.get_pdf_files';
    // let endpoint = 'td_payroll.tdpayroll.doctype.my_slips.my_slips.get_salary_slip_content';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  get_vpf_details(Info): Observable<any> {
    let endpoint = 'td_payroll.apis.payroll_api.get_vpf_details';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  get_workflow_states(Info): Observable<any> {
    let endpoint = 'td_dashboard_data.td_dashboard_data.api.get_workflow_states';
    // let endpoint = 'td_payroll.tdpayroll.doctype.my_slips.my_slips.get_salary_slip_content';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  employee_letter_request_download(Info): Observable<any> {
    let endpoint = 'go1_elc.go1_elc.doctype.employee_letter_request.employee_letter_request.download_pdf';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  get_employee_details(Info): Observable<any> {
    let endpoint = 'td_payroll.apis.payroll_api.get_employee_details';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  send_aadhaar_otp(Info): Observable<any> {
    let endpoint = 'go1_elc.utils.employee_transfer_verification.send_aadhaar_otp';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  verify_otp(Info): Observable<any> {
    let endpoint = 'go1_elc.utils.karza_integration.verification.verify_aadhaar_otp';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  get_employee_transfers(Info): Observable<any> {
    let endpoint = 'go1_elc.utils.employee_transfer.get_employee_transfers';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  custom_doc_fields(Info): Observable<any> {
    // let endpoint = (this.erp14 ? this.seapi_api:  this.go1_apps_api) + 'get_fields';
    let endpoint = this.go1_apps_api + 'get_form_fields';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  get_all_conversations(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_all_conversations';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  update_hd_ticket(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'update_hd_ticket';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  set_ticket_value(data: any): Observable<any> {
    let endpoint = 'frappe.client.set_value';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  submit_conversation_via_agent(data): Observable<any> {
    let endpoint = this.go1_apps_api + 'submit_conversation_via_agent';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  set_allocate_assign(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_hd_ticket_allocated_to';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  set_allocate_member(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'hd_ticket_allocate_to';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_ticket_notification(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'notification';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_holiday_list(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_holiday_list';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  insert_attendance(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'insert_attendance';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_leave_approver(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_leave_approver';
    return this.postmethod(this.baseMethod + endpoint, data);
  }


  get_rating_list(data: any): Observable<any> {
    let endpoint = 'frappe.client.get_list';
    return this.postmethod(this.baseMethod + endpoint, data);
  }


  leave_details(data: any): Observable<any> {
    if (localStorage['selfView']) {
      let employee: any = { employee: ['=', localStorage['employee_id']] }
      if (typeof (data.search_data) == 'string' || data.search_data == '') {
        let parameters = (data.search_data == '') ? {} : JSON.parse(data.search_data)
        data.search_data = { ...parameters, ...employee }
        data.search_data = JSON.stringify(data.search_data)
      } else if (typeof (data.search_data) == 'object') {
        data.search_data = { ...data.search_data, ...employee };
      }
    }
    // let endpoint = localStorage['role'] == "Employee" ? (this.erp14 ? this.seapi_api:  this.go1_apps_api) + 'get_leave_application' : (this.erp14 ? this.seapi_api:  this.go1_apps_api) + 'leave_details';
    let endpoint = this.go1_apps_api + 'get_leave_application';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  report_data(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_hr_report_data';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_employee_type_count(data: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_employee_type_count';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_employee_tool(data: any): Observable<any> {
    // let endpoint = 'hrms.hr.doctype.employee_attendance_tool.employee_attendance_tool.get_employees';
    let endpoint = this.go1_apps_api + 'employee_attendance_tool';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_hr_attendance_dashboard(data: any): Observable<any> {
    let endpoint = this.go1_apps_apis_hrmls + 'get_hr_attendance_dashboard';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_attendance_dashboard(data: any): Observable<any> {
    if (data && this.current_event_date) {
      data.date = this.current_event_date
    }

    let endpoint = this.go1_apps_apis_hrmls + 'get_working_days_details';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  mark_employee_tool(data: any): Observable<any> {
    let endpoint = 'hrms.hr.doctype.employee_attendance_tool.employee_attendance_tool.mark_employee_attendance';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_employee_first_checkin(data: any): Observable<any> {
    let endpoint = "td_shift_and_attendance.td_shift_and_attendance.utils.mobile_api.get_employee_first_attendance";
    // let endpoint = this.go1_apps_apis_hrmls + "get_employee_first_checkin";
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  employee_monthwise_checkins(data: any): Observable<any> {
    let endpoint = this.go1_apps_apis_hrmls + "employee_monthwise_checkins";
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  job_applicant_dashboard(data: any): Observable<any> {
    let endpoint = this.go1_apps_apis_hrmls + "job_applicant_dashboard";
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_attendance_statistics_details(data: any): Observable<any> {
    let endpoint = this.go1_apps_apis_hrmls + "get_attendance_statistics_details";
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_dashboard_details(data: any): Observable<any> {
    let endpoint = this.go1_apps_apis_hrmls + "get_dashboard_details";
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_billable_details(data: any): Observable<any> {
    let endpoint = 'erpnext.projects.doctype.timesheet.timesheet.get_activity_cost';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  calculate_leave_preview(data: any): Observable<any> {
    let endpoint = 'td_leave_management.td_leave_management.api.mobile_api.calculate_leave_preview';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  leave_remaining_balance(data: any): Observable<any> {
    let endpoint = 'td_leave_management.td_leave_management.api.mobile_api.leave_remaining_balance';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_job_opening(): Observable<any> {
    let endpoint = 'candidate_portal.api.get_job_opening';
    return this.get(this.baseMethod + endpoint);
  }

  get_jobs(data: any): Observable<any> {
    let endpoint = 'td_dashboard_data.td_dashboard_data.api.get_jobs';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  create_referral_entry(data: any): Observable<any> {
    let endpoint = 'td_dashboard_data.td_dashboard_data.api.create_referral_entry';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_leave_requests_list(type): Observable<any> {
    let data={
      employee: localStorage['employee_id']
    }
    let endpoint = 'td_leave_management.td_leave_management.api.mobile_api.';
    let apipoint = type == 'Pending' ? 'get_leave_requests_list_for_employee' :'get_leave_requests_list_for_manager'
    return this.postmethod(this.baseMethod + endpoint + apipoint, data)
    // let endpoint = 'td_leave_management.td_leave_management.api.mobile_api.get_leave_requests_list';
    // return this.get(this.baseMethod + endpoint);
  }

  leave_approve_reject(data): Observable<any> {
    let endpoint = 'td_leave_management.td_leave_management.api.mobile_api.leave_approve_reject_api';
    return this.postmethod(this.baseMethod + endpoint, data)
  }

  leave_withdraw_approve_reject(data): Observable<any> {
    let endpoint = 'td_leave_management.td_leave_management.api.mobile_api.leave_withdraw_approve_reject_api';
    return this.postmethod(this.baseMethod + endpoint, data)
  }

  auto_submit_leave_withdrawal(data): Observable<any> {
    let endpoint = 'td_leave_management.td_leave_management.api.mobile_api.auto_submit_leave_withdrawal';
    return this.postmethod(this.baseMethod + endpoint, data)
  }

  auto_submit_leave_request(data): Observable<any> {
    let endpoint = 'td_leave_management.td_leave_management.api.mobile_api.auto_submit_leave_request';
    return this.postmethod(this.baseMethod + endpoint, data)
  }

  leaves_for_overlapping_team_members(data): Observable<any> {
    let endpoint = 'td_leave_management.td_leave_management.api.mobile_api.leaves_for_overlapping_team_members';
    return this.postmethod(this.baseMethod + endpoint, data)
  }

  get_leave_withdraw_preview(data: any): Observable<any> {
    // let endpoint = 'td_leave_management.td_leave_management.api.mobile_api.get_leave_withdraw_preview';
    let endpoint = 'td_leave_management.td_leave_management.api.mobile_api.get_filter_leave_withdraw_preview';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_applicable_employees(data: any): Observable<any> {
    let endpoint = 'go1_elc.go1_elc.doctype.probation_evaluation.probation_evaluation.get_applicable_employees';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  probation_completed(data: any): Observable<any> {
    let endpoint = 'go1_elc.go1_elc.doctype.probation_evaluation.probation_evaluation.probation_evaluation_created';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_pdf(data: any): Observable<any> {
    let endpoint = 'go1_elc.go1_elc.doctype.probation_evaluation.probation_evaluation.get_pdf';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_employee_attendance_list(data): Observable<any> {
    let endpoint = this.go1_apps_apis_hrmls + 'get_employee_attendance_list';
    return this.postmethod(this.baseMethod + endpoint, data);
  }

  get_app_version(): Observable<any> {
    let endpoint = 'https://chola-hr-default-rtdb.firebaseio.com/app_version.json'
    return this.http.get(endpoint);
  }

  get_onesignal(): Observable<any> {
    let endpoint = 'https://chola-hr-default-rtdb.firebaseio.com/onesignal_id.json';
    return this.http.get(endpoint);
  }

  color_list = [
    '#FF4131',
    '#FF6138',
    '#A760FF',
    '#F94892',
    '#FEBD00',
    '#0086F9',
    '#BE6DB7',
    '#00AA4A',
    '#B85C38',
  ];

  get_icon(value) {
    let img = '';
    let data = '';
    if (value && value.includes(' ')) {
      value = value.replace(/ /g, '');
      data = '/assets/dashboard/' + value + '.svg';
    } else if (value) {
      data = '/assets/dashboard/' + value + '.svg';
    } else {
      data = img;
    }

    return data;

    // return data ? data : img
  }

  onSearch(event) {

    // this function must to declare
  }
  search_master_value(eve, doctype, fieldname) {
    eve = eve.target.value;
    let doc = doctype + fieldname;

    this.all_link_opts[doc + 'search_text'] = eve;
    this.all_link_opts[doc + 'no_products'] = false;
    this.all_link_opts[doc + 'page_no'] = 0;
    // this.all_link_opts[doctype] = [];


    this.get_master_value(doctype, fieldname);
  }

  CustomSearch(term: string, item) {
    // this function call used to custome search box (ll place search box inside the derop down)


    var String_list: any = typeof item === 'number' ? item.toString() : null;
    var String_list: any = typeof item === 'string' ? item : null;
    if (typeof item == 'object') {
      var keys = Object.keys(item);
      if (keys?.length == 1) {
        const [first] = keys;
        String_list = item[first];
      } else if (keys?.length > 1) {
        keys.map((res) => {
          if (
            res == 'options' ||
            res == 'language_name' ||
            res == 'value' ||
            res == 'category_name'
          ) {
            String_list = item[res];
          }
        });
      }
    }
    term = term.toLocaleLowerCase();

    return String_list.toLocaleLowerCase().indexOf(term) > -1;
  }

  get_home_icon(value) {
    let img = '';
    let data = '';
    if (value && value.includes(' ')) {
      value = value.replace(/ /g, '');
      data = '/assets/Employee-Home/' + value + '.svg';
    } else if (value) {
      data = '/assets/Employee-Home/' + value + '.svg';
    } else {
      data = img;
    }

    return data;
  }

  get_home_icon1(value, obj) {
    let img = '';
    let data = '';
    if (value && value.includes(' ')) {
      value = value.replace(/ /g, '');
      data = '/assets/Employee-Home/' + value + '.svg';
    } else if (value) {
      data = '/assets/Employee-Home/' + value + '.svg';
    } else {
      data = img;
    }


    obj.imageUrl = data;
    // console.log(obj)
    return data;
  }

  get_icon_mobile_menu(value) {

    let img = '';
    let data = '';
    // let data = '/assets/dashboard/' + value + '.svg'
    if (value && value.includes(' ')) {
      value = value.replace(/ /g, '');
      data = '/assets/mobile-menu/' + value + '.svg';
    } else if (value) {
      data = '/assets/mobile-menu/' + value + '.svg';
    } else {
      data = img;
    }

    return data;

    // return data ? data : img
  }

  get_icon_mobile_menu_active(value) {
    let img = '';
    let data = '';
    // let data = '/assets/dashboard/' + value + '.svg'
    if (value && value.includes(' ')) {
      value = value.replace(/ /g, '');
      data = '/assets/mobile-menu/' + value + '-active.svg';
    } else if (value) {
      data = '/assets/mobile-menu/' + value + '-active.svg';
    } else {
      data = img;
    }

    return data;

    // return data ? data : img
  }

  get_active_icon(value) {
    let img = '';
    let data = '';


    // let data = '/assets/dashboard/' + value + '.svg'
    if (value && value.includes(' ')) {
      value = value.replace(/ /g, '');
      data = '/assets/dashboard/' + value + '-active.svg';
    } else if (value) {
      data = '/assets/dashboard/' + value + '-active.svg';
    } else {
      data = img;
    }

    return data;

    // return data ? data : img
  }

  create_new(data) {
    if (data) {
      this.router.navigateByUrl(data);
    }
  }

  headers_search_icon() {
    this.router.navigateByUrl('/search');
  }

  Get_tags(Info: any): Observable<any> {
    // http://192.168.0.183:8019/api/method/seapi.seapi.api.get_tags
    // let endpoint = "frappe.desk.doctype.tag.tag.get_tags";
    let endpoint = this.go1_apps_api + 'get_tags';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  update_tags(Info: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'add_tags';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  remove_tags(Info: any): Observable<any> {
    let endpoint = this.go1_apps_api + 'remove_tags';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  check_role(role,emp){
    // console.log(emp)
    let check = this.roles.find(obj => obj.role == role)
    return emp == '' ? check ? true : false : check && emp != localStorage['employee_id'] ? true : false
  }


  check_project_manager(permission) {

    localStorage['show_selfView'] ? this.show_selfView = true : false;
    localStorage['selfView'] ? this.selfView = true : false;

    if (this.app_name == 'Go1 HR') {
      let check = permission.find(obj => obj.role == 'HR Manager' || obj.role == 'HR User' || obj.role == 'L1 Manager' || obj.role == 'L2 Manager')
      let check_team = permission.find(obj => obj.role == 'L1 Manager' || obj.role == 'L2 Manager')
      check_team ? this.reportView = true : this.reportView = false
      if (check && this.app_name == 'Go1 HR') {
        this.hr_manager_role = true;
        this.show_selfView = true;
        localStorage['show_selfView'] = true;
      } else {
        let check_emp = permission.find(obj => (obj.role == 'Employee' || obj.role == 'Tridots Employee'))
        if (check_emp) {
          this.selfView = true;
          this.show_selfView = false;
          this.employee_role = true;
        }
      }
      // this.show_selfView = true;
    }

    if (this.hr_manager_role || this.employee_role) {
      this.hr_manager_role = this.selfView ? undefined : true;
      this.employee_role = this.selfView ? true : undefined;
    }

    this.checkTabItems();


  }


  getReadableFileSizeString(fileSizeInBytes) {

    let i = -1;
    const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];

    do {
      fileSizeInBytes /= 1024;
      i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
  }

  transform(value) {

    const currentDate = new Date();
    const inputDate = new Date(value);

    const timeDifferenceInSeconds = Math.floor(
      (currentDate.getTime() - inputDate.getTime()) / 1000
    );

    if (timeDifferenceInSeconds < 60) {
      return 'Just now';
    } else if (timeDifferenceInSeconds < 3600) {
      const minutes = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (timeDifferenceInSeconds < 86400) {
      const hours = Math.floor(timeDifferenceInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(timeDifferenceInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  get_path() {
    this.router.events.subscribe((event: any) => {

      if (event instanceof NavigationEnd) {
        this.path = event.url;
        this.path = event.url;
        let url = this.path.split('/');
        if (this.path == '/register' || url[1] == 'register') {
          this.side_menu_show = false;
        } else {
          this.side_menu_show = true;
        }
      }
    });
  }

  async load_popup(item, doctype) {

    const modal = await this.modalCtrl.create({
      component: DetailComponentComponent,
      cssClass: 'filter-popup-3',
      componentProps: {
        id: item.name,
        doctype: doctype,
        // forms_route: this.selected_list && this.selected_list.detail_page_route ? this.selected_list.detail_page_route : ''
        forms_route: this.selected_list && this.selected_list.detail_route ? this.selected_list.detail_route : ''
      },
    });
    await modal.present();
  }


  enterAnimationLeftToRight = (baseEl: any) => {
    var root: any = baseEl.shadowRoot;
    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0.09', transform: 'translateX(-100%)' },
        { offset: 1, opacity: '1', transform: 'translateX(0)' },
      ]);
    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimationLeftToRight = (baseEl: any) => {
    return this.enterAnimationLeftToRight(baseEl).direction('reverse');
  };

  enterAnimation = (baseEl: any) => {
    var root: any = baseEl.shadowRoot;
    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        this.ismobile ? { offset: 0, opacity: '0.09', transform: 'translateY(100%)' } : { offset: 0, opacity: '0.09', transform: 'translateX(100%)' },
        this.ismobile ? { offset: 1, opacity: '1', transform: 'translateY(0)' } : { offset: 1, opacity: '1', transform: 'translateX(0)' },
      ]);
    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(200)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: any) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };

  getImageSource(data) {
    // if (data) {
    //   return '/assets/chola/chola-logo.svg';
    // } else if (this.hr_manager_role) {
    //   return '/assets/icon/Go1-HR-logo.svg';
    //   // return '/assets/icon/Go1-HR-logo-white.svg';
    // } else if (this.employee_role) {
    //   return '/assets/mobile-menu/ESS-logo-white.svg';
    //   // return '/assets/mobile-menu/ESS-logo.svg';
    // }

    return '/assets/chola/chola-logo.svg';
  }

  getLogoSource() {
    return '/assets/icon/favicon.png';
  }

  set_primary_color(data) {
    // setTimeout(() => {
    return {
      // '--dynamic-color': 'var(--header-color)',
      '--heaader-color': 'var(--header-color)',
      '--dynamic-color': 'var(--primary-color)',
      '--dynamic-font-family': "'Poppins', sans-serif",
    };

    // }, 300)
  }

  async yearPopUp(showYear) {
    const modal = await this.modalCtrl.create({
      component: YearPopupComponent,
      cssClass: 'yearPopup',
      componentProps: {
        selectedYear: this.selectedYear
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.name) {
      this.selectedYear = data.name;
      this.selected_year = true;
      this.selectedYearSubject.next(showYear)
    }
  }

  // yearSubject = false;
  async monthPopUp() {
    const modal = await this.modalCtrl.create({
      component: YearPopupComponent,
      cssClass: 'yearPopup',
      componentProps: {
        selectedMonth: this.selectedMonth,
        showMonth: true
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.name) {
      let month = this.monthLists.findIndex((res) => { return res.name == data.name })
      console.log(month)
      this.selectedMonth = Number(month) + 1;
      this.selected_year = true;
      this.selectedYearSubject.next(this.selectedMonth);
    }
  }

  load_icon(image) {
    const firstLetter = image ? image.charAt(0).toLowerCase() : null;

    switch (firstLetter) {
      case 't':
        return '/assets/avatar/1.svg';
      case 'r':
        return '/assets/avatar/2.svg';
      case 'a':
        return '/assets/avatar/3.svg';
      case 'b':
        return '/assets/avatar/4.svg';
      case 'c':
        return '/assets/avatar/5.svg';
      case 'd':
        return '/assets/avatar/6.svg';
      case 'e':
        return '/assets/avatar/7.svg';
      case 'f':
        return '/assets/avatar/8.svg';
      case 'g':
        return '/assets/avatar/9.svg';
      case 'h':
        return '/assets/avatar/10.svg';
      case 'i':
        return '/assets/avatar/11.svg';
      case 'j':
        return '/assets/avatar/12.svg';
      case 'k':
        return '/assets/avatar/13.svg';
      case 'l':
        return '/assets/avatar/14.svg';
      case 'm':
        return '/assets/avatar/15.svg';
      case 'n':
        return '/assets/avatar/16.svg';
      case 'o':
        return '/assets/avatar/17.svg';
      case 'p':
        return '/assets/avatar/18.svg';
      case 'q':
        return '/assets/avatar/19.svg';
      case 's':
        return '/assets/avatar/20.svg';
      case 'u':
        return '/assets/avatar/1.svg';
      case 'v':
        return '/assets/avatar/2.svg';
      case 'w':
        return '/assets/avatar/3.svg';
      case 'x':
        return '/assets/avatar/4.svg';
      case 'y':
        return '/assets/avatar/5.svg';
      case 'z':
        return '/assets/avatar/6.svg';
      default:
        // Handle cases where the first letter is not one of the specified options.
        return '/assets/home-genie/man.svg';
    }
  }


  


  // For dynamic list
  filter_keys(keys: any, keyValue: any) {
    if (keys && keys.length > 0) {
      for (let i = 0; i < keys.length; i++) {
        for (let j = 0; j < keyValue.length; j++) {
          if ((keys[i] && keyValue[j]) && (keys[i].toLowerCase() == keyValue[j].toLowerCase())) {
            keys.splice(i, 1);
          }
        }
      }
      return keys;
    }
  }

  get_employee_checkin(Info): Observable<any> {
    let endpoint = this.go1_apps_api + 'get_employee_checkin';
    return this.postmethod(this.baseMethod + endpoint, Info);
  }

  load_more_notification(event) {
    if (!this.no_products_notification) {
      let value = event.target.offsetHeight + event.target.scrollTop + 1;
      value = value.toFixed();
      if (value >= event.target.scrollHeight) {
        this.page_no_notification += 1;
        this.get_notification_list()
      }
    }
  }

  get_notification_list() {
    let data = {
      user_id: localStorage['customerRefId'],
      page_no: this.page_no_notification,
      page_size: 20
    }
    this.get_ticket_notification(data).subscribe(res => {
      if (res && res.notification) {
        // this.db.all_notification_list = res.notification

        // this.db.notification_key = Object.keys(this.db.all_notification_list)
        if (Object.keys(res.notification) && Object.keys(res.notification).length != 0) {
          if (this.page_no_notification == 0) {
            this.all_notification_list = res.notification
            this.notification_key = Object.keys(this.all_notification_list)
          } else {
            this.all_notification_list = { ...this.all_notification_list, ...res.notification }
            this.notification_key = [...this.notification_key, ...Object.keys(this.all_notification_list)]

          }
          Object.keys(res.notification).map(res_count => {

            this.total_notification_count += res.notification[res_count].length
          })

        } else {
          this.no_products_notification = true;
          this.page_no_notification == 0 ? this.notification_key = [] : null;
        }
      }
    })
    this.load_notify_one = false;
  }

  profileImg(data: any, item) {
    if (data) {
      if (data.indexOf('https') == -1) {
        return this.baseUrl + data;
      } else if (data.indexOf('https') == 0) {
        return data;
      }
    } else {
      item.UserAvatar = item.UserAvatar ? item.UserAvatar : this.getUserAvatar(item.gender);
    }
  }

  getUserAvatar(gender) {
    let male = ['/assets/profile/male1.svg', '/assets/profile/male2.svg', '/assets/profile/male3.svg']
    let female = ['/assets/profile/female1.svg', '/assets/profile/famale2.svg']
    if (gender && gender == 'Female') {
      return female[Math.floor(Math.random() * female.length)];
    } else {
      return male[Math.floor(Math.random() * male.length)];
    }
  }

  getTimecal(time) {
    const timestamp = new Date(time).getTime();

    // Current time
    const now = new Date().getTime();

    // Calculate the difference in milliseconds
    const difference = now - timestamp;

    // Convert milliseconds to seconds
    const seconds = Math.floor(difference / 1000);

    // Convert seconds to minutes
    const minutes = Math.floor(seconds / 60);

    // Convert minutes to hours
    const hours = Math.floor(minutes / 60);

    // Convert hours to days
    const days = Math.floor(hours / 24);

    // Convert days to weeks
    const weeks = Math.floor(days / 7);

    // Convert days to months (approximate)
    const months = Math.floor(days / 30.44);

    // Convert days to years (approximate)
    const years = Math.floor(days / 365.25);

    let formattedTime = '';

    if (years > 0) {
      formattedTime = years === 1 ? '1 y' : years + ' y';
    } else if (months > 0) {
      formattedTime = months === 1 ? '1 m' : months + ' m';
    } else if (weeks > 0) {
      formattedTime = weeks === 1 ? '1 w' : weeks + ' w';
    } else if (days > 0) {
      formattedTime = days === 1 ? '1 d' : days + ' d';
    } else if (hours > 0) {
      formattedTime = hours === 1 ? '1 hr' : hours + ' hrs';
    } else if (minutes > 0) {
      formattedTime = minutes === 1 ? '1 min' : minutes + ' min';
    } else {
      formattedTime = seconds === 1 ? '1 s' : seconds + ' s';
    }

    return formattedTime
  }


  apply_padding(data) {
    if (this.enable_detail) {
      return { padding: '0px' };
    } else if (data != 'Project') {
      return { padding: '0px' };
    }
  }

  // beachValue = [
  //   { icon: '/assets/beach/blue.svg', color: '#5461FF' },
  //   { icon: '/assets/beach/orange.svg', color: '#FFB949' },
  //   { icon: '/assets/beach/green.svg', color: '#069855' },
  // ]

  // projectValue = [
  //   { icon: '/assets/projects/blue.svg', color: '#5461FF' },
  //   { icon: '/assets/projects/orange.svg', color: '#FFB949' },
  //   { icon: '/assets/projects/green.svg', color: '#069855' },
  // ]

  employeeList = [
    { icon: '/assets/employees/blue.svg', color: '#5461FF' },
    { icon: '/assets/employees/green.svg', color: '#069855' },
    { icon: '/assets/employees/red.svg', color: '#E02323' },
  ]

  formatDateTo12Hour(val) {
    let date = new Date(val)
    let hours = date.getHours();
    const minutes = date.getMinutes();
    // const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const formattedTime = [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      // seconds.toString().padStart(2, '0')
    ].join(':');

    return val ? `${formattedTime} ${ampm}` : `00:00`;
  }

  grid_table_creation(res) {
    this.rows = res.message.keys
    if (!this.ismobile && this.rows && this.rows.length != 0) {
      this.get_saleslist['table'] = []
      this.columns = []
      this.rows.map((res_upper, index) => {
        let result = res_upper.toUpperCase();
        if (result && result.includes('_')) {
          result = result.replace(/_/g, ' ')
        }

        this.columns.push({ name: result, prop: res_upper, size: index == 0 ? 450 : res_upper == 'employee_name' ? 400 : 200 })
        // this.columns.push({ name: result, prop: res_upper, size: res_upper == 'employee_name' ? 450 : 300 })
      })

      this.get_saleslist['table'] = this.columns;

      for (let i = 0; i < this.get_saleslist.data.length; i++) {
        for (let val in this.get_saleslist.data[i]) {
          if (!this.rows.includes(val)) {
            delete this.get_saleslist.data[i][val]
          }
        }
      }
    }
  }

  remove_pagination_keys(res) {
    if (!this.ismobile && this.rows && this.rows.length > 0) {
      for (let i = 0; i < res.message.data.length; i++) {
        for (let val in res.message.data[i]) {
          if (!this.rows.includes(val)) {
            delete res.message.data[i][val]
          }
        }
      }
    }
  }


  getNotFoundImage(doctype){
    return `assets/not-found/${doctype}.svg`
  }

}



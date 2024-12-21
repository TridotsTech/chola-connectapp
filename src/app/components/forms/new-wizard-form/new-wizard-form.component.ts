import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, Output, NgZone, EventEmitter, OnInit, OnDestroy, AfterViewInit, ViewChild, Type, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Geolocation, GeolocationOptions, Geoposition } from '@awesome-cordova-plugins/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { ActivatedRoute, Router  } from '@angular/router';
import $ from 'jquery';
import { RecaptchaErrorParameters } from 'ng-recaptcha';
import { DbService } from 'src/app/services/db.service';
import { CartService } from 'src/app/services/cart.service';
import { AlertController, ModalController, LoadingController} from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { async } from '@angular/core/testing';
import { EditWebformchildPage } from 'src/app/pages/edit-webformchild/edit-webformchild.page';
import { WebformChildPage } from 'src/app/pages/webform-child/webform-child.page';
import { map } from 'rxjs';
import { SalesOrderDetailsPage } from 'src/app/pages/order/sales-order-details/sales-order-details.page';
// import { ReceiptDetailsPage } from 'src/app/pages/purchase/receipt-details/receipt-details.page';
// import { ProductListPage } from 'src/app/pages/product-list/product-list.page';
import { IonContent } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { EditFormsPage } from '../../../pages/web-form/edit-forms/edit-forms.page';
// import { ActionComponent } from '../../CRM/action/action.component';
import { WebsiteFormsComponent } from 'src/app/components/forms/website-forms/website-forms.component';
import { AttachmentsComponent } from 'src/app/components/customer-details/attachments/attachments.component';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
// import { TimesheetPopupComponent } from '../../Timesheet/timesheet-popup/timesheet-popup.component';
// import { UpdateTimesheetComponent } from '../../Timesheet/update-timesheet/update-timesheet.component';
import { UserListPage } from 'src/app/pages/user-list/user-list.page';

import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

@Component({
  selector: 'app-new-wizard-form',
  templateUrl: './new-wizard-form.component.html',
  styleUrls: ['./new-wizard-form.component.scss','../wizard-forms/wizard-forms.component.scss'],
})
export class NewWizardFormComponent  implements OnInit,OnDestroy {

  lightGallerySettings = {
    selector: 'a',
    plugins: [lgThumbnail, lgZoom],
    thumbnail: false,
    zoom: true,
    fullScreen: true,
    download: true,
    share: true,
    actualSize: true,
  };

  @Input() web_form;
  @Input() new_form;
  @Input() modal;
  @Input() page;
  @Input() tabs_left: any;
  @Input() tabs_top: any;
  @Input() stricky_top: any;
  @Input() type: any;
  @Input() isModel: any = false;
  @Input() model_path: any;
  @Input() forms_route;
  @Input() edit_form_values;
  @Input() enable_reference;
  @Input() items_values;
  @Input() edit_form;
  @Input() enabled_read_only;
  @Input() enable_readonly;
  @Input() cancle_btn_hide;
  @Input() button_positions;
  @Input() reference_id;
  @Input() sale_order_id;
  @Input() top;
  @Input() sticky;
  @Input() task_doctype;
  @Input() event_doctype;
  @Input() add_new_form;
  @Input() enable_header;
  @Input() custom_header_css;
  @Input() enable_create_option;
  @Input() action_meet;
  @Input() stopNavigation;
  @Input() popup_centre;
  @Input() enable_leadcomment;
  @Input() enable_activities;
  @Input() edit_new_form = false;
  @Input() web_forms;
  @Input() enable_height;
  @Input() edit_values;
  @Input() edit_web_forms;
  @Input() enable_save;
  @Input() quickForm;
  @Input() loader_f;
  @Input() load_doc;
  @Input()  lead_comments: any = [];
  @Input()  save_details_only: any;
  @Input() registerCss;
  @Input() createNew;
  @Input() createForm;
  @Input() removeHeight;
  @Input() removeSubmitButton;
  @Input() loaderTabs;
  @Input() loaderEnabled;
  @Input() loaderEnabledHeight;
  @Input() hideCosting;
  @Input() parentTaskName;
  @Input() parentTaskId: any;
  @Input() parentTaskCreate: any;
  @Input() convertedStatusTo: any;
  @Input() noRouteBack: any;
  @Input() dailyUpdateDetail: any;

  @Output() lead_tabs = new EventEmitter<any>();
  @Output() scrollToTop = new EventEmitter();
  @Output() goto_rating = new EventEmitter();
  @Output() onClose = new EventEmitter();
  @Output() open_pop_up = new EventEmitter();
  @Output() change_status = new EventEmitter<any>();
  @Output() scroll_to_top = new EventEmitter();
  @Output() updateDetails = new EventEmitter();
  @Output() returnSubmitValues = new EventEmitter();

  @ViewChild('formDirective') private formDirective!: NgForm;
  @ViewChild('customInput', { static: false }) customInput!: ElementRef;
  @ViewChild(IonContent) content!: IonContent;
  @ViewChild('addresstext') addresstext!: ElementRef;
  @ViewChild('file_upload', { static: false }) file_upload!: ElementRef<HTMLInputElement>;

  saveWithoutNext = false;
  submitted = false;
  captcha = false;
  signatureImg: any;
  signaturePadOptions: Object = {
    minWidth: 2,
    canvasWidth: 700,
    canvasHeight: 300,
  };
  // select_value='ranjith'
  tab_items = [
    { label: 'Details', value: 'Lead' },
    { value: 'Insights', label: 'Insights' },
  ];
  detail: any;
  lead_data: any;
  notes: any;
  half_day_hide = true;
  edit_data_details: any = {};
  name: any;
  newName: any;
  opportunityNumber: any = 1;
  next_value: any;
  changedDate: any;
  signature_fieldname: any = [];
  signature_base64_url = [];
  tabs_array: any;
  categoryfile: any;
  categoryimagedata: any;
  field_name: any = [];
  base64_url: any = [];
  item;
  file_name: any = [];
  enable_comment = true;
  inputValue: any = '';
  lead_tab_name: any = '';
  url: any;
  info: any = [];
  form_data: any = FormGroup;
  form_ctrl_data: any = {};
  json_data;
  section_datas;
  wizard_json: any = [];
  task_values: any;
  event_values: any;
  multiple_array: any = [];
  doctype;
  form_tile;
  link_flelds_name: any = [];
  link_w_fields_name: any = [];
  expense_approver_name: any;
  image_field_check = 'no uploads';
  field_data;
  current_path = 'events';
  img_file_name: any = [];
  current_page;
  page_props: any = {};
  retrict_duplicate = false;
  navigation_count = 0;
  wizard_form;
  final_child_category = {};
  sub_category = true;
  terms_value: any;
  leave_approver_name: any;
  leave_approver: any;
  tab_View_Ads_Navigation = [
    { text: 'General', route: '/classifieds/webform/insert' },
    { text: 'Jobs', route: '/jobs/webform/insert' },
    { text: 'Autos', route: '/autos/webform/insert' },
    { text: 'Realestate', route: '/realestates/webform/insert' },
    { text: 'Roommate', route: '/roommates/webform/insert' },
  ];
  send_data = {};
  source_data: any;
  sales_Address: any;
  selectedItems = {};
  dropdownSettings = {};
  profile_menu: any = [];
  destroy;
  Total_amount: any;
  comment_id: any;
  image_id: any;
  Convert_route: any;
  data: any = {};
  store_old_data: any = {};
  edit_success: any;
  sub: any;
  next_form_value = false;

  editorConfig = {
    toolbar: [
      // ['bold', 'italic', 'underline'],  // Include only bold, italic, and underline
    ],
  };
  // assign_to = false;
  selectedStartTime: any;
  startTime: any;
  stopTime: any;
  elapsedTime: any;
  timerInterval: any;
  isTimerRunning = false;
  current_date: any;
  grievance_against_party: any;
  Detail_height = false;
  formValues: any = {};
  store_customer_name: any;
  store_company_name: any;
  quotation_value: any;
  Send_message = false;
  opportunity_Value: any;
  Payment_type: any;
  toolbar = false;
  event_toolbar = false;
  tasks_toolbar = false;
  file_toolbar = false;
  each:any;
  image_datas;
  post_image;
  total_working_hours: any = 0
  completed_by_on = false;
  form_is_edited = false;
  lost_quo = false;
  lost_reason:any;
  current_time:any;
  project_name: any;
  existing_invoice = false;
  form_loader = false;
  rating_value = 0;
  rating_feedback_option : any = []
  selected_option_value: any;
  sub_fields: any = [];
  hasChange = true;

  alert_animate = false;
  alert_animatings: any = [];
  // list_data:any = {};
  sub1: any;

  k = 1;
  child_category = {};
  selected_values: any = [];
  info_w_hidden_obj: any;
  free_navigation = false;
  ref_doc: any = [];
  salary_parent;
  parent_id;

  // Filter the section for section break and if a form having without section breake last if conditon will work
  section_break_data = {};
  each_sec_data: any = [];
  section_break_name: any = [];
  test_section_break_data: any = [];
  test_section_break_name: any = [];
  store_field_type: any = [];
  // if api have column break or not column break and not have section breake the value will be sstore here
  no_sec_col: any = [];
  //end

  flex_margin: any = '10px';

  // Check and assign a section brake fields into another section break if section comes without label
  label_name;
  section_break_data_2: any = undefined;
  count = 0;

  // user IP address
  ip_address: any;
  posted_from;
  browser_name;
  fromDate:any;
  toDate:any;

  //Image attach and Path finder
  image_count: any = [];
  images_array: any = [];
  // Child table function to get json data of child table
  all_child_data: any = [];
  c_field_name;
  child_data: any = {};
  each_child_data;
  child_table_field_name: any = [];
  child_header_label: any = [];
  header_flex_margin: string = '0px';
  test_child_data: any = {};

  // Modal pop-up
  store_child_fields: any = {};
  arrayFields: any = [];

  currentDate:any;
  todayDate:any;
  // db.save_button = false;
  submitBtn = false;

  setValue:any = {};
  referencesValue:any = [];
  store_employeeDetail: any = {};

  next_without_saving = false;
  show_button = true;
  buttonLoader = false;

  callListApi = true;
  holdRawDataItem: any;

  httpHeaders: any;
  httpOptions: any;

  constructor(public location: Location, private http: HttpClient, public ref: ChangeDetectorRef, public ngZone :NgZone, public db: DbService, public ngcart: CartService, private formBuilder: FormBuilder, public alertController: AlertController, public modalCtrl: ModalController,  public router: Router,  public route: ActivatedRoute, private loadingCtrl: LoadingController, private geolocation: Geolocation, private platform: Platform, private datePipe: DatePipe) {}

  ngOnInit() {
    // console.log(this.convertedStatusTo,'this.convertedStatusTo')
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    this.current_date = formattedDate;
    this.current_time = formattedTime;
    this.profile_menu = [];


    // console.log('forms_route',this.forms_route)
    if(this.edit_form_values && this.edit_form_values.references){
      let referencesValue = JSON.stringify(this.edit_form_values.references);
      this.referencesValue = JSON.parse(referencesValue);
      // console.log(this.edit_form_values.referencesValue)
    }else if(this.edit_form_values && this.edit_form_values.expenses){
      let referencesValue = JSON.stringify(this.edit_form_values.expenses);
      this.referencesValue = JSON.parse(referencesValue);
      // console.log(this.edit_form_values.referencesValue)
    }

    this.route.paramMap.subscribe((res) => {
      if (res && res['params'] && (res['params'].route_1 || res['params'].id)) {
        this.Convert_route = res['params'].route_1 ? res['params'].route_1 : res['params'].id;
      }else if(this.router && this.router.url){
        let currentUrl = this.router.url;
        let urls = currentUrl.split('/');
        this.Convert_route = urls[2]; 
      } 
    });


    this.db.all_link_opts = {};
    // this.db.customer_details = {};
    this.clear_cart();

    this.sub1 = this.db.alert_animate.subscribe((res: any) => {
      this.alert_animate = true;
      this.alert_animatings.push(res);
      setTimeout(() => { this.alert_animatings.shift(); },2500);
    })

    if (this.forms_route) {
      this.form_loader = true;
      if (this.forms_route == 'Lead' && !this.loader_f) {
        this.forms_route = 'lead';
        this.get_image_list();
      } 
      this.db.form_route = this.forms_route;
      this.get_form(this.forms_route);
    } else {
      this.get_form_values();
    }

    if(this.forms_route == 'bug-sheet' && !this.add_new_form){
      this.get_image_list();
    }

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 100,
      allowSearchFilter: true,
    };


    this.db.custom_form_update.subscribe((res) => {
      if (res && res == 'custom_field') {
        if (this.db.customize_form_details) {
          this.web_form = JSON.parse(localStorage['form_json']);
          this.get_form_values();
        }
      }
    });

    this.sub = this.db.select_drop_down.subscribe((res: any) => {
      // if((this.db.hr_manager_role && this.this.doctype == 'Timesheet')){
      //   this.db.drop_down_value['employee'] = res.name
      //   this.db.drop_down_value['employee_name'] = res.label
      // }else{
      // }
      // console.log('Drop down value : ', res);

      if(this.forms_route == "daily-update"){
        if(res.fieldname == "project" && this.db.drop_down_value['project'] != res.name){
          this.db.drop_down_value["subject"] = ""
          this.db.drop_down_value["task"] = ""
          this.db.drop_down_value["task_name"] = ""
          this.db.drop_down_value["description"] = ""
          this.db.drop_down_value["timesheet_description"] = ""
          this.db.drop_down_value["expected_hrs"] = ""

          this.form_ctrl_data["subject"].setValue("")
          this.form_ctrl_data["task"].setValue("")
          // this.form_ctrl_data["task_name"].setValue("")
          this.form_ctrl_data["description"].setValue("")
          this.form_ctrl_data["description"] = ""
          this.form_ctrl_data["timesheet_description"].setValue("")
          this.form_ctrl_data["timesheet_description"] = ""
          this.form_ctrl_data["expected_hrs"].setValue("")
        }
      }


      this.db.drop_down_value[res.fieldname] = res.name ? res.name : res.label
      this.db.drop_down_value[res.fieldname + '_name'] = res.label


      this.dropdownSelection(res);
      this.ref.detectChanges()
    });


    if(this.edit_form_values && this.edit_form_values.doctype){
      this.checkSubmitBtn(this.edit_form_values.doctype)
    }

    if ( this.edit_form_values && (this.edit_form_values.address_display || this.edit_form_values.company_address_display) ) {
      if (this.edit_form_values.address_display) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = this.edit_form_values.address_display;
        const textContent = tempElement.textContent || tempElement.innerText;
        this.edit_form_values.address_display = textContent;
      }
      if (this.edit_form_values.company_address_display) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = this.edit_form_values.company_address_display;
        const textContent = tempElement.textContent || tempElement.innerText;
        this.edit_form_values.company_address_display = textContent;
      }
    }

    if (this.edit_form_values && this.edit_form_values.events) {
      this.edit_form_values.events.sort((a, b) => {
        const dateA = new Date(a.starts_on);
        const dateB = new Date(b.starts_on);
        return dateB.getTime() - dateA.getTime();
      });
    }

    if (this.edit_form_values && this.edit_form_values.tasks) {
      this.edit_form_values.tasks.forEach(task => {
        if (task.description) {
          task.description = task.description.replace(/(<([^>]+)>)/gi, '');
        }
      });
    }

    if (this.edit_form_values && this.edit_form_values.events) {
      this.edit_form_values.events.forEach(task => {
        if (task.description) {
          task.description = task.description.replace(/(<([^>]+)>)/gi, '');
        }
      });
    }

    if(this.edit_form_values && this.edit_form_values.description){
      this.edit_form_values.description = this.edit_form_values.description.replace(/(<([^>]+)>)/gi,'');
    }
 
    if(this.edit_form_values && (this.edit_form_values.customer || this.edit_form_values.customer_name) ){
      this.sales_Address = this.edit_form_values.customer ? this.edit_form_values.customer : this.edit_form_values.customer_name
    }

    if(this.forms_route == 'employee-detail' || this.forms_route == 'project-detail' || this.forms_route == 'salary-slip-detail'){
      this.next_without_saving = true;
    }else{
      this.next_without_saving = false;
    }

    if(this.edit_form_values && this.edit_form_values.doctype == 'Supplier Invoice' && this.edit_form_values.name && this.Convert_route == 'supplier-invoice'){
      this.show_button = this.edit_form_values.docstatus == 1 ? false : true;
    }

    if(this.edit_form_values && this.edit_form_values.docstatus && this.edit_form_values.docstatus == 1){
      this.nextBtn = false
    }

    if(this.edit_form_values && this.edit_form_values.doctype == 'Supplier Invoice' && this.edit_form_values.name && this.Convert_route == 'purchase-order'){
      this.nextBtn = true
    }

    if(this.edit_form_values && this.edit_form_values.doctype == 'Supplier Invoice' ){
      this.saveWithoutNext = true;
    }else if(this.forms_route == 'employee' && this.db.ismobile){
      this.saveWithoutNext = true;
    }

    setTimeout(()=>{
      this.loaderEnabled = false
    },1200)

    // this.loadLightGallery()

    console.log(this.sale_order_id,'this.sale_order_id')
    
}

//  loadLightGallery() {
//   setTimeout(() => {
//       const $lightGallery = $("#lightgallery");
//       if ($lightGallery && $lightGallery.lightGallery()) {
//           $lightGallery.lightGallery();
//       }
//   }, 5000)
// }

  get_contact_person(data){
    this.db.get_contact_person(data).subscribe(res => {
      if(res && res.message){
        let data = res.message
      this.form_ctrl_data.contact_person.setValue(data.name);
      }
    })
  }

  checkSubmitBtn(doctype){
    let doc_details = this.db.permission_details.find(r => r.page == doctype);
    if(doc_details){
      this.submitBtn = doc_details.submit == 1 ? true : false
    }
    // console.log('this.submitBtn',this.submitBtn);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  

  // Start = > After selecting any one of the value from the dropdown, Here we worked on to set it to form controller.

  checkEmail(eve, each){
    // console.log(eve);
    if(each && (each.fieldname == 'company_email' || each.fieldname == 'personal_email')){
      let emailValue = (eve && eve.target && eve.target.value) ? eve.target.value : '';
      let prefered_contact_email = (this.form_ctrl_data && this.form_ctrl_data['prefered_contact_email'] && this.form_ctrl_data['prefered_contact_email'].value) ? this.form_ctrl_data['prefered_contact_email'].value : ''
      
      if(prefered_contact_email && ((prefered_contact_email == 'Company Email' && each.fieldname == 'company_email') || (prefered_contact_email == 'Personal Email' && each.fieldname == 'personal_email')))
      this.form_ctrl_data['prefered_email'].setValue(emailValue)
      this.info.map((r:any)=>{
       if(r.fieldname == 'prefered_email'){
          r.inputValue = emailValue;
       }
      })

    }
  }

  dropdownSelection(res){  
      // console.log(res)
      if (res.fieldname == 'suggestions') {
        this.selected_value(res);
      }else if (res.fieldname == 'prefered_contact_email') {
         let emailValue = ''; 
         if(res.label == 'Company Email'){
           emailValue = (this.form_ctrl_data && this.form_ctrl_data['company_email'] && this.form_ctrl_data['company_email'].value) ? this.form_ctrl_data['company_email'].value : ''
         }else if(res.label == 'Personal Email'){
           emailValue = (this.form_ctrl_data && this.form_ctrl_data['personal_email'] && this.form_ctrl_data['personal_email'].value) ? this.form_ctrl_data['personal_email'].value : ''
         }

         this.form_ctrl_data['prefered_email'].setValue(emailValue)
         
         this.info.map((r:any)=>{
          if(r.fieldname == 'prefered_email'){
             r.inputValue = emailValue;
          }
         })

      } else if (res) {
        // console.log(res);
        if (res.fieldname == 'party_name') {
          this.store_customer_name = res.name;
          this.formValues[res.fieldname] = res.name;
          let data ={
              doctype :"Contact",
              docname: res.name,
              ref_doctype : this.quotation_value
          }
          this.get_contact_person(data);
        } else if(res.fieldname == 'party_type') {
          this.source_data = res.name ? res.name : res.label
        }else if (this.doctype == 'Sales Order' && res.fieldname =='customer_address'){
          const addressParts = res.address.split(',');
          const billingAddress = addressParts[0].trim();
          const remainingAddress = addressParts.slice(1).join(',').trim();
          this.db.drop_down_value[res.fieldname] = billingAddress;
          this.form_ctrl_data.address_display && this.form_ctrl_data.address_display.value == '' ? this.form_ctrl_data.address_display.setValue(remainingAddress)  : this.form_ctrl_data.company_address_display.setValue(remainingAddress);
        } else if (res.fieldname == 'party') {
          this.Payment_type = res.label;
        }else if(res.fieldname == 'reference_type' && this.edit_form_values) {
          this.source_data = res.label;
          this.db.event_list_form = false;
        } else if(res.fieldname == 'reference_type') {
          this.source_data = res.label;
        }else if(res.fieldname == 'status' && this.doctype == 'Task'){
          if(res.label == 'Completed'){
            this.completed_by_on = true;

            this.info.map(res => {
              if(this.doctype == "Task"){
                // || res.fieldname == "completed" 
                if(res.fieldname == "completed_on"){
                  res.reqd = 1;
                  this.form_ctrl_data['completed_on'].setValidators([
                    Validators.required,
                  ]);
                }
              }
            })

          }else{
            this.completed_by_on = false;
            this.info.map(res => {
              if(this.doctype == "Task"){
                // || res.fieldname == "completed" 
                if(res.fieldname == "completed_on"){
                  res.reqd = 0;
                  this.form_ctrl_data['completed_on'].setValidators(null);
                  this.form_ctrl_data['completed_on'].updateValueAndValidity();
                }
              }
            })
          }
        }else if(res.fieldname == 'employee' && this.doctype == 'Expense Claim'){
          this.db.selected_from_employee = res.name
        }else if(res.fieldname == 'employee' && localStorage['selected_project_id']){
          this.form_ctrl_data['employee_name'].setValue(res.label)
        }else if(res.fieldname == 'raised_by' && this.doctype == 'Employee Grievance'){
          this.form_ctrl_data['employee_name'].setValue(res.label)
        }else if(res.fieldname == 'employee' && this.doctype == 'Attendance'){
          this.form_ctrl_data['employee_name'].setValue(res.label)
        }else if(this.doctype == 'Employee Grievance' && res.fieldname == 'status'){

          let status = res.label

          this.info.map((r,i)=>{
            
            if(status == 'Open' || status == 'Invalid'){
              if(r.fieldname == "cause_of_grievance" || r.fieldname == "resolved_by" || r.fieldname == "resolution_date" || r.fieldname == "employee_responsible" || r.fieldname == "resolution_detail"){
                r.hidden = 1
                r.reqd = 0
              }
            }else if(status == 'Investigated'){
              if(r.fieldname == "cause_of_grievance" || r.fieldname == "resolved_by" || r.fieldname == "resolution_date" || r.fieldname == "employee_responsible" || r.fieldname == "resolution_detail"){
                r.hidden = 1
                r.reqd = 0
                if(r.fieldname == "cause_of_grievance"){
                  r.hidden = 0
                  r.reqd = 1
                }
              }
            }else if(status == 'Resolved'){
              if(r.fieldname == "cause_of_grievance" || r.fieldname == "resolved_by" || r.fieldname == "resolution_date" || r.fieldname == "employee_responsible" || r.fieldname == "resolution_detail"){
                  r.hidden = 0
                  r.reqd = 1
              }
            }

            if(r.fieldname == "cause_of_grievance" || r.fieldname == "resolved_by" || r.fieldname == "resolution_date" || r.fieldname == "employee_responsible" || r.fieldname == "resolution_detail"){
              if(r.reqd == 1){
                this.form_data.setControl(r.fieldname, this.formBuilder.control('', [Validators.required]));
                // this.form_ctrl_data[r.fieldname].setValidators([
                //   Validators.required,
                // ]);

              }else{
                this.form_data.setControl(r.fieldname, this.formBuilder.control(''));
                // this.form_ctrl_data[r.fieldname].setValidators(null);
                //  this.form_ctrl_data[r.fieldname].updateValueAndValidity();
              }
            }


          })

          // this.filter_section_break();
        }else if(this.doctype == 'Employee Letter Request' && res.fieldname == 'letter_type'){
          this.info.map(resM => {
            if(resM.fieldname == "from_date" || resM.fieldname == "to_date"){
              if(res.name == 'Visa Letter'){
                resM.hidden = 0;
              }else{
                resM.hidden = 1;
              }
            }
          })
        }

        

        (this.form_ctrl_data && this.form_ctrl_data[res.fieldname]) ? this.form_ctrl_data[res.fieldname].setValue(res.name) : '';
        if (((res.fieldname == 'project' && this.doctype == 'Sales Order') || (res.fieldname == 'cost_center' || res.fieldname == 'project' || res.fieldname == 'payable_account' || res.fieldname == 'advance_account' || res.fieldname == 'parent_project' || res.fieldname == 'salary_structure' || res.fieldname == 'employee' || res.fieldname == 'employee_name' || res.fieldname == 'leave_allocation' || res.fieldname == 'issue' || res.fieldname == 'department' || res.fieldname == 'project' || res.fieldname == 'parent_task' || res.fieldname == 'customer' || res.fieldname == 'customer_address' || res.fieldname == 'billing_address' || res.fieldname == 'shipping_address' || res.fieldname == 'supplier_address'))) {
          // this.db.drop_down_value[res.fieldname] = res.name;
          // this.form_ctrl_data[res.fieldname].setValue(res.name);
          
          // created by john to overwrite employee field for timesheet  entry of HR module.
          if((this.db.hr_manager_role && this.doctype == 'Timesheet')){
            this.form_ctrl_data[res.fieldname].setValue(this.db.drop_down_value[res.fieldname]);
            this.form_ctrl_data['employee_name'].setValue(this.db.drop_down_value['employee_name']);
            // this.form_ctrl_data[res.fieldname].setValue(res.label);
          }else{
            this.form_ctrl_data[res.fieldname].setValue(res.name ? res.name : res.label ? res.label : res.address);
            this.formValues[res.fieldname] = res.name ? res.name : res.address;
            
            if(res.fieldname == 'shipping_address' && this.form_ctrl_data['address_display'] && res.address){
              this.form_ctrl_data['shipping_address_display'].setValue(res.address);
              this.form_ctrl_data['address_display'].setValue(res.address);
            }else if(res.fieldname == 'billing_address' && this.form_ctrl_data['billing_address_display'] && res.address){
              this.form_ctrl_data['billing_address_display'].setValue(res.address);
            }

          }
        } else {
          // issue fixed by john dropdown values
          if((this.db.hr_manager_role && this.doctype == 'Timesheet')){
          }else{
            (this.form_ctrl_data && this.form_ctrl_data[res.fieldname]) ? this.form_ctrl_data[res.fieldname].setValue(res.label) : null;
            this.formValues[res.fieldname] = res.name ? res.name : res.label ? res.label : res.address;
          }

          this.source_data = res.label;
          if (res.fieldname == 'quotation_to' && res.status == 'success') {
            this.quotation_value = res.label;
            this.db.form_values['quotation_to'] = res.label;
          } else if ( res.fieldname == 'opportunity_from' && res.status == 'success' ) {
            this.formValues[res.fieldname] = res.label;
            this.opportunity_Value = res.label;
            localStorage['opportunity_from'] = this.opportunity_Value;

            // this.form_ctrl_data.party_name = '';
          }
          this.doctype == 'Material Request' ? (this.db.drop_down_value[res.fieldname] = res.label) : null;
          ((!this.db.hr_manager_role && this.doctype == 'Timesheet' && res.fieldname == 'employee') && (this.doctype != 'Material Request' && this.form_ctrl_data)) ? this.form_ctrl_data[res.fieldname].setValue(res.label) : null;
        }

        if((res.fieldname == 'module' || res.fieldname == 'screen') && this.doctype == 'Bug Sheet'){
          this.db.form_values[res.fieldname] = res.label;
        }

        if(this.doctype == 'Opportunity' && res.fieldname == 'party_name'){
          console.log(this.form_ctrl_data['opportunity_from'].value)
          this.fillOpportunityDetails(this.form_ctrl_data['opportunity_from'].value,res.name)
        }

        if(this.doctype == 'Customer' && res.fieldname == 'lead_name'){
          this.fillOpportunityDetails('Lead',res.name)
        }

        if (res.fieldname == 'tc_name' && (this.doctype == 'Material Request' || this.doctype == 'Sales Order')) {
          let set_field = 'terms';
          this.terms_value = res.name;
          this.tax_template(res, set_field, res);
        } else if (res.fieldname == 'material_request_type' && this.doctype == 'Material Request' && this.db.enabled_hidden_fields ) {
          if (res.label == 'Purchase') {
            this.get_form(this.forms_route);
            let form_hidden_json = JSON.parse(localStorage['form_json']);
            let web_form_values = form_hidden_json.web_form_fields;
            let hidden_fields = web_form_values.filter((res) => { return (res.fieldname == 'customer' ||  res.fieldname == 'set_from_warehouse') });
            let show_fields = web_form_values.filter((res) => { return res.fieldname == 'set_warehouse' });
            hidden_fields.map((res) => {
              res.hidden = 1;
            });
            show_fields.map((res) => {
              res.hidden = 0;
            });
            localStorage['form_json'] = JSON.stringify(form_hidden_json);
          } else if (res.label == 'Material Transfer') {
            this.get_form(this.forms_route);
            let form_hidden_json = JSON.parse(localStorage['form_json']);
            let web_form_values = form_hidden_json.web_form_fields;
            let hidden_fields = web_form_values.filter((res) => { return res.fieldname == 'customer' });
            let show_fields = web_form_values.filter((res) => { return ( res.fieldname == 'set_warehouse' || res.fieldname == 'set_from_warehouse' ) });
            hidden_fields.map((res) => {
              res.hidden = 1;
            });
            show_fields.map((res) => {
              res.hidden = 0;
            });
            localStorage['form_json'] = JSON.stringify(form_hidden_json);
          } else if ( res.label == 'Material Issue' || res.label == 'Manufacture' ) {
            this.get_form(this.forms_route);
            let form_hidden_json = JSON.parse(localStorage['form_json']);
            let web_form_values = form_hidden_json.web_form_fields;
            let hidden_fields = web_form_values.filter((res) => { return ( res.fieldname == 'customer' || res.fieldname == 'set_from_warehouse' ) });
            let show_fields = web_form_values.filter((res) => { return res.fieldname == 'set_warehouse' });
            hidden_fields.map((res) => {
              res.hidden = 1;
            });
            show_fields.map((res) => {
              res.hidden = 0;
            });
            localStorage['form_json'] = JSON.stringify(form_hidden_json);
          } else if (res.label == 'Customer Provided') {
            this.get_form(this.forms_route);
            let form_hidden_json = JSON.parse(localStorage['form_json']);
            let web_form_values = form_hidden_json.web_form_fields;
            let hidden_fields = web_form_values.filter((res) => { return res.fieldname == 'set_from_warehouse' });
            let show_fields = web_form_values.filter((res) => { return ( res.fieldname == 'set_warehouse' || res.fieldname == 'customer' )});
            hidden_fields.map((res) => {
              res.hidden = 1;
            });
            show_fields.map((res) => {
              res.hidden = 0;
            });
            localStorage['form_json'] = JSON.stringify(form_hidden_json);
          }
          // this.doctype == 'Expense Claim' && (
        } else if (this.doctype != 'Salary Slip' && (res.fieldname == 'employee' || res.fieldname == 'expense_approver') && res.label != 'ALL' && this.db.selecting_drop_down) {
          // console.log('111')
          if(this.doctype != 'Timesheet'){
            this.get_claim_details_local(res.name);
            // this.get_claim_details(res);
          }
        } else if (this.doctype == 'Salary Slip' && res.fieldname == 'employee' && res.label != 'ALL') {
            this.getSalarySlipDetails(res);
        } else if (res.fieldname == 'grievance_against_party') {
          this.grievance_against_party = res.name;
        }
        if ( this.doctype && this.doctype == 'Customer' &&  res && res.fieldname && res.fieldname == 'represents_company' ) {
          this.info.map((res) => {
            if ( res && res.depends_on && res.fieldname && res.depends_on == 'represents_company' ) {
              res.hidden = res.hidden == 1 ? 0 : 1;
              // console.log(res.hidden);
            }
          });
        }

        if(this.doctype == 'Bug Sheet' && res.fieldname == 'status'){
          this.info.map((resP) => {
            if (resP && resP.fieldname && resP.fieldname == 'fixed_on') {
              if(res.name == 'Fixed'){
                resP.hidden = 0;
                setTimeout(() => {
                  this.form_ctrl_data['fixed_on'].setValue(this.db.current_event_date);
                }, 500)
              }else{
                resP.hidden = 1;
              }
            }
            if (resP && resP.fieldname && resP.fieldname == 'verified_on') {
              if(res.name == 'Verified'){
                resP.hidden = 0;
                setTimeout(() => {
                  this.form_ctrl_data['verified_on'].setValue(this.db.current_event_date);
                }, 500)
              }else{
                resP.hidden = 1;
              }
            }
          });
        }

        if(this.doctype == 'Quotation' && res.fieldname == 'currency'){
          this.db.website_settings.currency = res.name;
        }

        if(this.doctype == 'Bug Sheet'){
          if(res.fieldname == 'project'){
            this.form_ctrl_data['module'].setValue('');
            this.form_ctrl_data['screen'].setValue('');
          }
        }

        if((this.forms_route == 'daily-update' || this.forms_route == 'task-allocation') && res.fieldname == 'task'){
          this.info.map(resW => {
            if(resW && resW.fieldname == 'description'){
              resW.hidden = 0;
              res.read_only = 1;
            }
            this.getTaskDetails(res.name);
          })
        }

        if ( this.doctype == 'Quotation' && (res.fieldname == 'customer_address' || res.fieldname == 'company_address') ) {
          const addressParts = res.address.split(',');
          const billingAddress = addressParts[0].trim();
          const remainingAddress = addressParts.slice(1).join(',').trim();
          this.db.drop_down_value[res.fieldname] = billingAddress;
          this.form_ctrl_data.address_display && this.form_ctrl_data.address_display.value == '' ? this.form_ctrl_data.address_display.setValue(remainingAddress)  : this.form_ctrl_data.company_address_display.setValue(remainingAddress);
        }

        if(this.doctype == 'Quotation' && res.fieldname == 'tax_category' && res.status == 'success'){
          this.tax_template(res ,'',res)
        }
        if(res && res.fieldname && res.fieldname == 'customer' && this.doctype == 'Sales Order'){
          this.sales_Address = res.name;
        }

        if(res && res.fieldname && res.fieldname == 'employee' && this.doctype == "Leave Application" && this.db.hr_manager_role){
          this.get_leave_approver(res.name);
        }
      }
      this.db.selecting_drop_down = false;
      this.ref.detectChanges()
  }

  // End = > After selecting any one of the value from the dropdown, Here we worked on to set it to form controller.

  open_pop_up_create() {
    this.open_pop_up.emit();
  }

  fillOpportunityDetails(doctype,id){
    let data = {
      doctype: doctype,
      name: id
    }
    this.db.doc_detail(data).subscribe(res => {
      console.log(res)
      if (res && res.message && res.message.length != 0 && res.message[0] && res.message[0].status == 'Success') {
        let keyData: any = Object.keys(res.message[1])
        if (keyData && keyData.length != 0) {
          keyData.map(resKey => {
            this.form_ctrl_data[resKey] ? this.form_ctrl_data[resKey].setValue(res.message[1][resKey]) : null;
          })
        }
      } else if (res && res.status == 'Success') {
        let keyData: any = Object.keys(res.message)
        if (keyData && keyData.length != 0) {
          keyData.map(resKey => {
            this.form_ctrl_data[resKey] ? this.form_ctrl_data[resKey].setValue(res.message[resKey]) : null;
          })
        }

        if (this.doctype == 'Opportunity' && res.message && res.message.doctype == 'Lead') {
          this.form_ctrl_data['contact_display'].setValue(res.message['phone'])
          this.form_ctrl_data['contact_email'].setValue(res.message['email_id'])
          this.form_ctrl_data['contact_mobile'].setValue(res.message['mobile_no'])
          this.form_ctrl_data['contact_person'].setValue(res.message['lead_name'])
        } else if (this.doctype == 'Customer') {
          this.form_ctrl_data['customer_name'].setValue(res.message['lead_name'])
        }
      }
    })
  }

  getTaskDetails(id){
    let data = {
      doctype: 'Task',
      name: id
    }
    this.db.doc_detail(data).subscribe(res => {
      if (res.message && res.message[0] && res.message[0]['status'] && res.message[0]['status'] == 'Success') {
        this.form_ctrl_data['project'] ? this.form_ctrl_data['project'].setValue(res.message[1].project) : null;

        if(res.message[1] && res.message[1].description){
          var html = res.message[1].description;
          var range = document.createRange();
          range.selectNodeContents(document.body);
          range.collapse(false);
          var frag = range.createContextualFragment(html);
          // console.log(frag.textContent,'frag')
          let value = frag.textContent
          this.form_ctrl_data['description'] ? this.form_ctrl_data['description'].setValue(value) : null;
        }else{
          this.form_ctrl_data['description'] ? this.form_ctrl_data['description'].setValue('') : null;
        }

        this.form_ctrl_data['subject'] ? this.form_ctrl_data['subject'].setValue(res.message[1].subject) : null;
      }
    })
  }

  async open_attachment(){
    
      const modal = await this.modalCtrl.create({
        component: AttachmentsComponent,
        cssClass: this.db.ismobile ? 'web_site_form' : 'web_site_form_attach',
        componentProps: {
          order_id: this.sale_order_id ? this.sale_order_id : this.edit_form_values.name,
        },
        enterAnimation: this.db.enterAnimation,
        leaveAnimation: this.db.leaveAnimation,
      });
      await modal.present();
      const { data } = await modal.onWillDismiss();
  }

  selected_value(eve) {
    let selected_values = eve;
    this.info.map((res) => {
      if (res.fieldname == 'suggestions') {
        this.form_ctrl_data[res.fieldname].setValue(selected_values.label);
        this.db.drop_down_value[res.fieldname] = selected_values.label;
      } else if (res.fieldname == 'message') {
        this.form_ctrl_data[res.fieldname].setValue(selected_values.label);
        this.db.drop_down_value[res.fieldname] = selected_values.label;
      }
    });
  }

  clear_cart() {
    this.db.cart_items = [];
    this.ngcart.list = [];
    this.ngcart.changecart();
    // this.db.mycart_emit.next('getted');
  }

  get_form(data) {

     if(data && data == 'employee-quick'){
       data = 'Employee'
     }
    
      let info = {
        user: localStorage['customerRefId'],
        web_form: data,
      };
      
      if (info.web_form == 'activity-task') { 
        // this.db.get_task_form().subscribe((res) => {
        //   localStorage['task_json'] = JSON.stringify(res);
        //   this.web_form = JSON.parse(localStorage['task_json']);
        //   this.form_loader = false;
        //   this.db.loader = false;
        //   this.get_form_values();
        // });
      } else if (info.web_form == 'event-form') {
        // this.db.get_event_form().subscribe((res) => {
        //   localStorage['event_json'] = JSON.stringify(res);
        //   this.web_form = JSON.parse(localStorage['event_json']);
        //   this.form_loader = false;
        //   this.db.loader = false;
        //   this.get_form_values();
        // });
      } else if (info.web_form == 'event') {
        this.db.custom_doc_fields(info).subscribe((res) => {
          // console.log(res)
          if (res && res.message) {
            localStorage['Event_json'] = res.message.form_json;
            this.web_form = JSON.parse(localStorage['Event_json']);
            this.form_loader = false;
            this.get_form_values();
          }
        });
      } else {
        this.db.custom_doc_fields(info).subscribe((res) => {
          this.form_loader = false;
          if (res && res.message && res.message.form_json) {
            !this.db.enabled_hidden_fields && this.doctype == 'Material Request' ? (localStorage['form_json'] = res.message.form_json) : null;
            this.doctype != 'Material Request' ? (localStorage['form_json'] = res.message.form_json) : null;
            this.web_form = JSON.parse(localStorage['form_json']);
            // if(this.web_form && this.web_form.doc_type == 'Salary Slip' && !this.add_new_form){
            //   let indexValue = this.web_form.web_form_fields.findIndex((r,i)=>{ return (r.fieldtype == "Page Break" && r.label =="Payment Days")})
            //   if(indexValue >= 0){
            //     this.web_form.web_form_fields = this.web_form.web_form_fields.slice(0,indexValue)
            //   }
            // }
            this.get_form_values();
          } else if (res && res.status == 'Failed') {
            var d = JSON.parse(res._server_messages);
            var d1 = JSON.parse(d);
            this.db.alert(d1.message);
          }
        });
      }
      this.db.show_form_details = false;

      if(this.web_form && this.web_form.doctype){
        this.checkSubmitBtn(this.web_form.doctype)
      }
  }

  // Start = > Here, the form was split using a "Page Break" values

  async get_form_values() {
    this.enable_activities = false;
    this.retrict_duplicate = false;
    this.isModel ? (this.url = this.model_path) : (this.url = location.pathname); 
    this.isModel ? (this.current_path = this.type) : (this.current_path = this.route.snapshot['_routerState'].url.split('/')[1]);
      this.web_form.web_form_fields.map((res) => {
      if (res && res.fieldtype == 'Page Break') {
        res.array_list = [];
      }
      });

    // console.log('this.web_form',this.web_form);
    this.field_data = this.web_form.web_form_fields;
    this.doctype = this.web_form.doc_type
    this.db.form_doctype = this.doctype;
    this.db.parentDoctype = this.doctype;
    this.form_tile = this.web_form.name;
    this.json_data = this.field_data;
    this.wizard_form = this.web_form.wizard_form;

    let data = this.web_form.web_form_fields.filter((res: any) => {
      return res.fieldtype == 'Page Break';
    });

    if (this.doctype == 'Lead' || this.doctype == 'Opportunity') {
      if (this.next_value == 'next_previous') {
        let value = localStorage['tab_value'] ? localStorage['tab_value'] : 'lead';
        this.db.tab_buttons(this.tabs_array, value, 'value');

      } else {
        let value = this.doctype == 'Lead' || (this.doctype == 'Opportunity' &&  this.edit_form_values && this.edit_form_values.title != 'New Opportunity')  ? 'Summary'  : 'Open';
        delete localStorage['tab_value'];
        this.db.tab_buttons(this.tabs_array, value, 'value');
        this.edit_form_values && this.edit_form_values.title != 'New Opportunity' ? this.menu_name('Summary') : undefined;
      }
    }

    this.wizard_form = data.length == 1 ? 0 : undefined;
    // this.db.doc_type = this.doctype;
    // this.db.ad_name = this.titleCase(this.form_tile);
    this.get__initial_forms(this.navigation_count);
    this.db.customize_form_details = false;
    this.checkSaveButton();
  }

  timesheetSave = false;

  checkSaveButton(){
    if((this.doctype == 'Timesheet' || this.doctype == 'Task' || this.doctype == 'Issue' || this.doctype == 'Project' || this.doctype == 'Customer' || this.doctype == 'Expense Claim'|| this.doctype == 'Material Request' || this.doctype == 'Sales Invoice' || this.doctype == 'Item' || this.doctype == 'Project' || this.doctype == 'Task' || this.doctype == 'Issue' || this.doctype == 'Bug Sheet' || this.doctype == 'Event' || this.doctype == 'ToDo' || this.doctype == 'Lead' || this.doctype == 'Customer' || this.doctype == 'Opportunity' || this.doctype == 'Employee Grievance') && (this.add_new_form || this.form_is_edited || this.save_details_only)){
      this.db.save_button = true;
    }else{
      let data:any = {};
      if(this.doctype == 'Sales Order' || this.doctype == 'Purchase Receipt' || this.doctype == 'Purchase Order') {
        data.docstatus = 1;
  
        if ( this.db.selected_list && this.db.selected_list.submitted && this.db.selected_list.submitted == 1 ) {
          data.docstatus = 1;
        } else {
          data.docstatus = 0;
        }
      } else if(this.doctype == 'Sales Order' && this.edit_form_values && this.edit_form_values.status == 'Draft') {
        data.docstatus = 1;
      }else if(this.doctype == 'Sales Order' || this.doctype == 'Purchase Receipt' || this.doctype == 'Purchase Order') {
  
        if ( this.doctype == 'Sales Order' && this.edit_form_values && (this.edit_form_values.status == 'To Deliver and Bill' || this.edit_form_values.status == 'Completed' ||  this.edit_form_values.status == 'Closed' ||  this.edit_form_values.status == 'To Bill' ||  this.edit_form_values.status == 'To Deliver') ) {
          data.docstatus = 1;
        } else {
          data.docstatus = 0;
        }
  
      } else if (this.doctype == 'Timesheet') {
        if(data.time_logs && data.time_logs.length != 0){
          data.time_logs.map(sub_res => {
            sub_res.costing_rate = Number(sub_res.costing_rate)
            sub_res.costing_amount = Number(sub_res.costing_amount)
            sub_res.base_costing_amount = Number(sub_res.base_costing_amount)
          })
        }
      } else {
        data.docstatus = 1;
        if ( this.db.selected_list && this.db.selected_list.submitted && this.db.selected_list.submitted == 1 ) {
          data.docstatus = 1;
        } else {
          data.docstatus = 0;
        }
      }

      if(this.doctype == 'Expense Claim' && this.db.employee_role){
        data.docstatus = 0
      }

      this.db.save_button = data.docstatus == 0 ? true : false;
      this.db.save_button = this.timesheetSave ? true : this.db.save_button;

      // if(this.db.vendor_role && (this.doctype == "Supplier Invoice" || this.doctype == "Payment Entry")){
      //   this.db.save_button = false;
      //   data.docstatus == 0 ? data.docstatus = 1: null;
      // }

      if(this.db.employee_role && (this.doctype == 'Employee Advance' || this.doctype == 'Expense Claim' || this.doctype == 'Leave Application')){
        this.db.save_button = true;
      }
    }

    if(this.db.hr_manager_role){
      if(this.doctype == "Attendance"){
        this.db.save_button = false;
      }
    }
    

  }

  // End = > Here, the form was split using a "Page Break" values

  clear_image_data(type, value, field_name) {
    if (type == 'edit') {
      this.edit_data_details[field_name] = undefined;
      this.form_ctrl_data[field_name].setValue('');
      this.base64_url.splice(this.field_name.indexOf(field_name), 1);
      this.field_name.splice(this.field_name.indexOf(field_name), 1);
      this.file_name.splice(this.file_name.indexOf(field_name));
    } else if (type == 'fresh') {
      this.form_ctrl_data[field_name].setValue('');
      this.base64_url.splice(this.field_name.indexOf(field_name), 1);
      this.field_name.splice(this.field_name.indexOf(field_name), 1);
      this.file_name.splice(this.file_name.indexOf(field_name));
    }
  }

  // Title case the title

  titleCase(str) {
    return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
  }

  // Start = > The tabs event was handled here.
  async menu_name(eve) {
    // console.log(eve)
    if ( this.doctype == 'Lead' || this.doctype == 'Opportunity' || this.doctype == 'Event' || this.doctype == 'ToDo' ) {
      this.lead_tab_name = eve.name ? eve.name : eve;
      localStorage['tab_value'] = this.lead_tab_name;
      if (this.lead_tab_name == 'Info') {
        this.enable_leadcomment = false;
        this.enable_activities = false;
        this.lead_tabs.emit('Info'); 
        this.Detail_height = true;
      } else if (this.lead_tab_name == 'Notes') {
        this.lead_tabs.emit(this.lead_tab_name);
        this.enable_leadcomment = true;
        this.enable_activities = false;
      } else if (this.lead_tab_name == 'Tasks') {
        this.lead_tabs.emit(this.lead_tab_name);
        this.enable_activities = true;
        this.enable_leadcomment = false;
      } else if (this.lead_tab_name == 'Meetings') {
        this.enable_activities = true;
        this.enable_leadcomment = false;
        this.date_format();
        this.lead_tabs.emit(this.lead_tab_name);
      } else if ( this.lead_tab_name == 'Summary' ||  localStorage['tab_value'] == 'Summary' ) {
        this.lead_tabs.emit(this.lead_tab_name);
        this.enable_activities = true;
        this.enable_leadcomment = false;
      }
    } else if (this.doctype == 'Opportunity') {
      this.lead_tab_name = eve.name;
      if (this.lead_tab_name == 'Info') {
        this.enable_leadcomment = false;
        this.enable_activities = false;
        this.lead_tabs.emit('Info');
      } else if (this.lead_tab_name == 'Notes') {
        this.enable_leadcomment = true;
        this.enable_activities = false;
      } else if (this.lead_tab_name == 'Activities') {
        this.enable_activities = true;
        this.enable_leadcomment = false;
      }
    } else {
      let obj = eve;
      this.submitted = true;
      this.scroll_to_top.emit('');
      this.data = this.form_data.value;
      this.assign_image(this.data);
      this.load_child_table(this.data)
      if (this.enabled_read_only) {
        this.wizard_json[this.navigation_count].form_ctrl_data =this.form_data.value;
        this.store_old_datas(true);
        this.submitted = false;
        this.form_ctrl_data = {};
        this.check_navigation(obj.index + 1);
        this.db.tab_buttons(this.profile_menu, obj['name'], 'name');
        this.navigation_count = obj.index;
        this.get_forms(this.wizard_json, obj.index);
        this.store_header();
        this.filter_section_break();
        this.assign_final_data();
        this.form_data = this.formBuilder.group(this.form_ctrl_data);
      } else {
        if (this.navigation_count != obj.index) {
          this.hasChange = true;

          if(this.form_data.status == 'VALID' || this.navigation_count > obj.index ) {
            if(this.navigation_count == 0 || this.navigation_count > obj.index || this.free_navigation) {
              this.nextBtn = false;
              this.wizard_json[this.navigation_count].form_ctrl_data = this.form_data.value;
              this.store_old_datas(true);
              this.submitted = false;
              this.form_ctrl_data = {};
              this.check_navigation(obj.index + 1);
              this.db.tab_buttons(this.profile_menu, obj['name'], 'name');
              this.navigation_count = obj.index;
              this.get_forms(this.wizard_json, obj.index);
              this.store_header();
              this.filter_section_break();
              this.assign_final_data();
              this.form_data = this.formBuilder.group(this.form_ctrl_data);
              this.onCreateGroupFormValueChange();
              setTimeout(()=>{ this.nextBtn = true; },1000);
            } else {
              if(this.registerCss || this.next_without_saving || this.saveWithoutNext){
                this.next_form1()
              }else{
                this.save_details1('image_none');
              }
            }
          }
        }
      }
    }
  }

  // End = > The tabs event was handled here.


  onCreateGroupFormValueChange() {
    const initialValue = this.form_data.value;
    if (this.form_data.valueChanges) {
      this.form_data.valueChanges.subscribe((value) => {
        this.hasChange = Object.keys(initialValue).some(
          (key) => this.form_data.value[key] != initialValue[key]
        );
      });
    }
  }

  store_old_datas(type) {
    if (type) {
      this.store_old_data = { ...this.store_old_data, ...this.form_data.value };
    }
  }

  check_navigation(value) {
    if (!this.free_navigation) {
      this.free_navigation = this.wizard_json.length == value ? true : false;
    }
  }

  // Start = > Which used to load the values of the next tabs (forms)
  next() {
    // console.log('next_form');
    this.submitted = true;
    this.next_form_value = true;
    this.data = this.form_data.value;
    this.assign_image(this.data);
    this.load_child_table(this.data);
    this.data = { ...this.data, ...this.formValues };
    if (this.enabled_read_only) {
      this.load_next_form();
    } else {
      if (this.form_data.status == 'VALID') {
        if(this.navigation_count == 0){
          this.next_form();
        }else{
          this.next_form();
        }
      }
    }
  }
  // End = > Which used to load the values of the next tabs (forms)

  nextBtn = true;
  next_form() {
    // console.log('next_form');
    // console.log('this.next_without_saving', this.next_without_saving);
    if(this.registerCss || this.next_without_saving || this.saveWithoutNext){
      this.next_form1()
    }else{
      this.save_details1('image_none');
      this.wizard_json[this.navigation_count].form_ctrl_data =  this.form_data.value;
      if ( this.wizard_json && this.wizard_json[0].form_ctrl_data && (this.wizard_json[0].form_ctrl_data.doctype == 'Sales Order' || this.wizard_json[0].form_ctrl_data.doctype == 'Sales Invoice') ) {
        this.wizard_json[this.navigation_count].form_ctrl_data = this.form_data.value;
        this.sales_Address = this.wizard_json[0].form_ctrl_data.customer;
      } else if ( this.wizard_json && this.wizard_json[0].form_ctrl_data && this.wizard_json[0].form_ctrl_data.doctype == 'Customer' ) {
        this.wizard_json[this.navigation_count].form_ctrl_data =  this.form_data.value;
        this.sales_Address = this.wizard_json[0].form_ctrl_data.customer_name;
      }
    } 
  }

  // next_form() {
  //   this.save_details1('image_none');
  //   this.wizard_json[this.navigation_count].form_ctrl_data =  this.form_data.value;
  //   if ( this.wizard_json && this.wizard_json[0].form_ctrl_data && (this.wizard_json[0].form_ctrl_data.doctype == 'Sales Order' || this.wizard_json[0].form_ctrl_data.doctype == 'Sales Invoice') ) {
  //     this.wizard_json[this.navigation_count].form_ctrl_data = this.form_data.value;
  //     this.sales_Address = this.wizard_json[0].form_ctrl_data.customer;
  //   } else if ( this.wizard_json && this.wizard_json[0].form_ctrl_data && this.wizard_json[0].form_ctrl_data.doctype == 'Customer' ) {
  //     this.wizard_json[this.navigation_count].form_ctrl_data =  this.form_data.value;
  //     this.sales_Address = this.wizard_json[0].form_ctrl_data.customer_name;
  //   }
  // }

  // Start = > Which used to load the values of the previous tabs (forms).
  back() {
    this.nextBtn = false;
    this.scroll_to_top.emit('');
    this.wizard_json[this.navigation_count].form_ctrl_data = this.form_data.value;
    this.store_old_datas(true);
    delete this.form_data.controls;
    this.form_ctrl_data = {};
    this.submitted = false;
    this.navigation_count = this.navigation_count - 1;
    let value = this.profile_menu.find(
      (res) => res.index == this.navigation_count
    );
    this.db.tab_buttons(this.profile_menu, value.name, 'name');
    this.get_forms(this.wizard_json, this.navigation_count);
    this.store_header();
    this.filter_section_break();
    this.assign_final_data();
    this.form_data = this.formBuilder.group(this.form_ctrl_data);
    this.onCreateGroupFormValueChange();
    setTimeout(()=>{ this.nextBtn = true; },1000);
  }
  // End = > Which used to load the values of the previous tabs (forms).


  next_form1(){
    this.nextBtn = false
    this.scroll_to_top.emit('');
    this.wizard_json[this.navigation_count].form_ctrl_data = this.form_data.value;
    this.store_old_datas(true);
    this.form_ctrl_data = {};
    this.submitted = false;
    this.navigation_count = this.navigation_count + 1;
    this.check_navigation(this.navigation_count);
    let value = this.profile_menu.find(res=>res.index == this.navigation_count)
    this.db.tab_buttons(this.profile_menu,value.name,'name');
    this.get_forms(this.wizard_json,this.navigation_count)
    this.store_header();
    this.filter_section_break();
    this.assign_final_data();
    this.form_data = this.formBuilder.group(
      this.form_ctrl_data
    );

    setTimeout(()=>{ this.nextBtn = true; },1000);

  }


  get__initial_forms(index) {
    this.getIp();
    this.get_device_type();
    index == 0 ? this.store_info(index) : this.get_forms(this.wizard_json, index);
    this.store_header();
    this.filter_section_break();
    this.assign_final_data();
    this.form_data = this.formBuilder.group(this.form_ctrl_data);
    this.onCreateGroupFormValueChange();
  }

  store_info(index) {
    this.wizard_json = [];
    let count = -1;
    this.json_data.map((res, i) => {

      if (res.fieldtype == 'Page Break') {
        this.wizard_json.push(res);
        count++;
        let obj = this.profile_menu.length == 0 ? { name: res.label, index: this.profile_menu.length, isActive: true, } : { name: res.label, index: this.profile_menu.length };
        this.db.ismobile && !this.db.enabled_hidden_fields ? this.profile_menu.push(obj) : this.profile_menu;
        !this.db.ismobile && !this.edit_success && !this.db.customize_form_details && !this.db.enabled_hidden_fields ? this.profile_menu.push(obj) : this.profile_menu;
        count == 1 ? this.get_forms(this.wizard_json, index) : '';
        this.wizard_json[count].form_ctrl_data = {};
      } else {
        this.wizard_json[count]['array_list'].push(res);
      }

      if (this.wizard_form == 0 && this.json_data.length == i + 1) {
        this.wizard_json.push(res);
        this.get_forms(this.wizard_json, index);
      }

      if (res.fieldtype == 'Link' || res.fieldtype == 'Link_multi_select') {
        this.link_flelds_name.push(res.options);
      } else if (res.fieldtype == 'Select' && res.options) {
        res.options = res.options.includes('\n') ? res.options.split('\n') : [];
      }

    });
  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.info.map((res, i) => {
        if (res.fieldname && res.fieldname.includes('latitude')) {
          let latitude = this.edit_form_values && this.edit_form_values[res.fieldname] ? this.edit_form_values[res.fieldname] : '';
          this.db.location_info['latitude'] = latitude;
        } else if (res.fieldname.includes('longitude')) {
          let longitude = this.edit_form_values && this.edit_form_values[res.fieldname] ? this.edit_form_values[res.fieldname] : '';
          this.db.location_info['longitude'] = longitude;
        }
        if (this.info.length == i + 1) {
          // this.db.load_map.next('get');
        }
      });
    }, 3000);

    this.remove_alphabets();
  }

  loadSupplierQuotation(){
    let amount = 0;
    let qty = 0;
    let total = 0;

    this.edit_form_values['items'].map((res)=>{
      qty = res.qty + qty;
      // amount = res.rate + amount;
      amount = res.qty * res.rate
      total = total + amount
    })

    this.form_ctrl_data['total_qty'].setValue(qty)
    this.form_ctrl_data['total'].setValue(total)
  }

  // Start = > The form is loaded here.
  get_forms(datas, index) {
    this.info = [];
    this.info = datas[index].array_list;
    this.info_w_hidden_obj = [];
    this.info_w_hidden_obj = datas[index].array_list;
    let form_ctrl_data = datas[index].form_ctrl_data;
    let table_check = this.info.lastIndexOf( (res) => res.fieldtype == 'Check' && res.fieldname == 'allow_multiple_address' && res.default && Number(res.default) == 0 );
    if (table_check > 0) {
      let delete_table = this.info.lastIndexOf( (res) => res.fieldtype == 'Table' && res.options && res.options == 'Customer Address' );
      this.info.splice(delete_table, 1);
    }
    let map_array = this.info.filter((res) => { return res.fieldname == 'address_map'; });
    
    setTimeout(()=>{ this.form_loader = false },800);

    this.info.map((res:any, i) => {
      // res.placeholder = '';
      if (res.fieldname && res.fieldname.includes('latitude')) {
        let latitude = this.edit_form_values && this.edit_form_values[res.fieldname] ? this.edit_form_values[res.fieldname] : '';
        this.db.location_info['latitude'] = latitude;
      } else if (res.fieldname && res.fieldname.includes('longitude')) {
        let longitude = this.edit_form_values && this.edit_form_values[res.fieldname] ? this.edit_form_values[res.fieldname] : '';
        this.db.location_info['longitude'] = longitude;
      } else if(res.fieldname && res.fieldname.includes('employee') && this.db.employee_role){
        res.hidden = 1;
      }

      if (this.info.length == i + 1) {
        // this.db.load_map.next('get');
      }

      if(this.add_new_form && res.fieldname && (res.fieldname == 'opening_time' || res.fieldname == 'resolution_details')){
          res.hidden = 1; 
      }

      if(this.db.employee_role && this.doctype == 'Employee Advance' && res.fieldname && (res.fieldname == 'status' || res.fieldname == 'company')){
        res.hidden = 1;
      }

    });

    this.selected_values = [];
    this.link_w_fields_name = [];
    this.db.default_values = localStorage['default_values'] ? JSON.parse(localStorage['default_values']) : undefined;
    
    if(this.doctype == 'Employee Grievance'){
      if (this.edit_form && this.edit_form == 1) {
        let status = this.edit_form_values && this.edit_form_values['status'] ? this.edit_form_values['status'] : '';
        if(status == ''){
          status = this.add_new_form ? 'Open' : status;
        }
        this.info.map((res, i) => {
          if(status == 'Open' || status == 'Invalid'){
            if(res.fieldname == "cause_of_grievance" || res.fieldname == "resolved_by" || res.fieldname == "resolution_date" || res.fieldname == "employee_responsible" || res.fieldname == "resolution_detail"){
              res.hidden = 1
            }
          }else if(status == 'Investigated'){
            if(res.fieldname == "cause_of_grievance" || res.fieldname == "resolved_by" || res.fieldname == "resolution_date" || res.fieldname == "employee_responsible" || res.fieldname == "resolution_detail"){
              res.hidden = 1
              if(res.fieldname == "cause_of_grievance"){
                res.hidden = 0
                res.reqd = 1
              }
            }
          }else if(status == 'Resolved'){
            if(res.fieldname == "cause_of_grievance" || res.fieldname == "resolved_by" || res.fieldname == "resolution_date" || res.fieldname == "employee_responsible" || res.fieldname == "resolution_detail"){
                res.hidden = 0
                res.reqd = 1
            }
          }
        })
      }else{
        this.info.map((res, i) => {
          if(res.fieldname == "cause_of_grievance" || res.fieldname == "resolved_by" || res.fieldname == "resolution_date" || res.fieldname == "employee_responsible" || res.fieldname == "resolution_detail"){
            res.hidden = 1
          }
        })
      }
    }
    
    if (this.edit_form && this.edit_form == 1) {
      
      this.info.map((res, i) => {
        if(res.label && res.fieldtype != 'Section Break' && res.fieldtype != 'Column Break' && res.fieldtype != 'Barcode' && res.fieldtype != 'Button' && res.fieldtype != 'Color' && res.fieldtype != 'Duration' &&  res.fieldtype != 'Dynamic Link' &&  res.fieldtype != 'Fold' &&  res.fieldtype != 'Geolocation' &&  res.fieldtype != 'Heading' &&  res.fieldtype != 'Image' &&  res.fieldtype != 'Markdown Editor' &&  res.fieldtype != 'Percent' &&  res.fieldtype != 'Read Only' &&  res.fieldtype != 'Table MultiSelect'  ) {
          res.read_only = this.enabled_read_only ? 1 : res.read_only;

          if(!this.show_button){
            res.read_only = 1
          }

          if(this.doctype && this.doctype == 'Supplier Quotation'){
             if(res.fieldname && (res.fieldname == 'valid_till' || res.fieldname == 'quotation_number')){
               res.read_only = 0;
             }
          }

          if(this.db.hr_manager_role && this.doctype == 'Expense Claim' && res.fieldname && (res.fieldname == 'employee')){
            res.read_only = 1;
          }

          let value = this.edit_form_values && this.edit_form_values[res.fieldname] ? this.edit_form_values[res.fieldname] : '';
          res['value'] = value;
         
          // if(!res['value'] && (res && res.fieldname.includes('county'))){
          //   res['value'] = 
          // }
         
          if(res && res.fieldname.includes('hours')){
            value = Number(Number(res['value']).toFixed(2))
          }

         

          
          this.checkValues(res,value)
          if ( res.reqd == 1 &&  res.options != 'Email' &&  res.options != 'Phone' ) {
            if (res.max_length && res.max_length > 0) {
              this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false }, [ Validators.required, Validators.pattern('[0-9]{' + res.max_length + '}'),]);
            } else {
              let condition = res.fieldname == "status" && !(this.dailyUpdateDetail && this.dailyUpdateDetail.is_updated) && this.doctype == "Daily Update Log Item"
              if(condition){
                this.form_ctrl_data[res.fieldname] = new FormControl(
                  { value: value, disabled: res.read_only == 1 ? true : false },
                );
              }else{
                this.form_ctrl_data[res.fieldname] = new FormControl(
                  { value: value, disabled: res.read_only == 1 ? true : false },
                  Validators.required
                );

              }
              
            }
          } else if (res.reqd == 1 && res.options == 'Email') {
            this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false }, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), ] );
          } else if (res.options == 'Email') {
            this.form_ctrl_data[res.fieldname] = new FormControl( { value: value, disabled: res.read_only == 1 ? true : false }, Validators.email);
          } else if (res.fieldtype == 'Check') {
            if ( this.edit_form_values && this.edit_form_values.title == 'New Customer' ) {
              this.form_ctrl_data[res.fieldname] = new FormControl(false);
            } else {
              value = value == 1 ? value : 0;
              res.default = value
              this.form_ctrl_data[res.fieldname] = new FormControl( { value: value, disabled: res.read_only == 1 ? true : false });
            }
          } else if (res.fieldtype == 'Phone') {
            res.fieldtype = 'Int';
            this.form_ctrl_data[res.fieldname] = new FormControl( { value: value, disabled: res.read_only == 1 ? true : false }, [ Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'), ]);
          } else if ( res.fieldtype == 'Data' && res.options &&  res.options.toLowerCase() == 'map' ) {
            res.fieldtype = 'Geo Location';
            this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false, });
          } else if (res.fieldtype == 'Table') {
            let value = (this.edit_form_values && this.edit_form_values[res.fieldname]) ? this.edit_form_values[res.fieldname] : '';
            if (value) {
              this.form_ctrl_data[res.fieldname] = new FormControl(value);
              this.child_data[res.fieldname] = this.child_data[res.fieldname] ? this.child_data[res.fieldname] : [];
              this.test_child_data = this.child_data;
              // if(this.doctype == 'Quotation'){
              //   this.get_cart_item()
              // }
              let datas = JSON.stringify(this.test_child_data[res.fieldname]);
              this.form_ctrl_data[res.fieldname].setValue(datas);
            } else {
              this.form_ctrl_data[res.fieldname] = new FormControl('');
            }
          } else if (res.fieldtype == 'Select' && res.fieldtype == 'Link') {
            this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false, });
          } else {



            this.form_ctrl_data[res.fieldname] = new FormControl(value)
          }

          if((res.fieldname == 'posting_date' || res.fieldname == 'opening_date') && this.current_date && this.add_new_form){
            this.form_ctrl_data[res.fieldname].setValue(this.current_date)
          }

          if(this.doctype == 'HD Ticket' && this.edit_form_values){
            this.rating_value = this.edit_form_values.feedback_rating
          }

          if(this.doctype == 'Issue' && res.fieldname == 'company' && (this.edit_form_values && this.edit_form_values.company)){
            res.read_only = 1;
          }

          if(this.doctype == 'Bug Sheet' && res.fieldname == 'status'){
            res.read_only = 0;
          }

          if(res.fieldname == 'approval_status' && this.db.employee_role){
            res.read_only = 1;
          }

          if(this.convertedStatusTo && this.edit_form_values){
            if(this.forms_route == this.convertedStatusTo){
              this.form_ctrl_data['opportunity_from'] ? this.form_ctrl_data['opportunity_from'].setValue(this.edit_form_values.doctype) : null;
              this.db.drop_down_value['opportunity_from'] = this.edit_form_values.doctype;
              this.form_ctrl_data['party_name'] ? this.form_ctrl_data['party_name'].setValue(this.edit_form_values.name) : null;
              this.db.drop_down_value['party_name'] = this.edit_form_values.name;
              this.form_ctrl_data['transaction_date'] ? this.form_ctrl_data['transaction_date'].setValue(this.db.current_event_date) : null;
            }
          }

          if (res.fieldtype == 'Table') {
            let edit_f_value = this.edit_form_values && this.edit_form_values[res.fieldname] ? this.edit_form_values[res.fieldname] : undefined;
            if (edit_f_value) {
              this.child_data[res.fieldname] = edit_f_value;
            } 
              this.test_child_data = this.child_data;
              if((this.doctype == 'Quotation' || this.doctype == 'Opportunity') && !this.convertedStatusTo){
                // this.get_cart_item()
                for(let i=0;i<this.test_child_data[res.fieldname].length;i++){
                  this.test_child_data[res.fieldname][i]['count'] = this.test_child_data[res.fieldname][i]['qty']
                }
              }
              let datas = JSON.stringify(this.test_child_data[res.fieldname]);
              this.form_ctrl_data[res.fieldname].setValue(datas);
            // }
          } else if (res.fieldtype == 'Link') {
            this.link_w_fields_name.push({ doctype: res.options, fieldname: res.fieldname,  });
            let edit_f_value = this.edit_form_values && this.edit_form_values[res.fieldname]  ? this.edit_form_values[res.fieldname]  : undefined;
            if (edit_f_value) {
              this.db.all_link_opts[res.options + res.fieldname] = [ { label: edit_f_value, name: edit_f_value },  ];
            }  
          }

          if(res.fieldtype == "Rating"){
            this.rating_value = this.edit_form_values[res.fieldname];
          }

          if (res.fieldname == 'employee' && localStorage['employee_id'] && localStorage['employee_id'] != "undefined" && !(this.edit_form_values && this.edit_form_values.employee)) {
            value = localStorage['employee_name'];
            this.formValues[res.fieldname] = localStorage['employee_id'];
            this.db.drop_down_value[res.fieldname] = localStorage['employee_id'];
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
            if(this.doctype == 'Timesheet'){
              res.read_only = 1;
            }else{
              res.read_only = this.db.hr_manager_role ? 0 : 1;
            }
          }

          if(this.doctype == 'Employee' && res.fieldname == 'employee_name'){
            let val = localStorage['employee_name']
            this.form_ctrl_data[res.fieldname].setValue((val != this.edit_form_values.employee_name && !this.new_form) ? this.edit_form_values.employee_name : (val == this.edit_form_values.employee_name && !this.new_form) ? this.edit_form_values.employee_name : '')
          }

          if(this.doctype == 'Quotation' && res.fieldname == 'currency' && this.edit_form_values && this.edit_form_values.currency){
            this.db.website_settings.currency = this.edit_form_values.currency;
          }
        }

        if(res.fieldname == 'supplier_name' || res.fieldname == 'supplier'){
          let role = JSON.parse(localStorage['permission_details'])
          let supplier = role.find((val)=>{return val.role == 'Supplier'})
          // console.log(supplier,"supplier")
          this.db.drop_down_value[res.fieldname] = localStorage['CustomerName']
          supplier ? this.form_ctrl_data[res.fieldname].setValue(localStorage['CustomerName']) : null
        }

        if(res.fieldtype == 'Small Text' || res.fieldname == 'message_for_supplier' || res.fieldname == 'notes' ){
          const domParser = new DOMParser();
          const htmlElement = domParser.parseFromString(res.value, 'text/html');
          const plainText = htmlElement.body.textContent || res.value;
          this.form_ctrl_data[res.fieldname].setValue(plainText ? plainText : res.value)
        }

        if ((res.fieldtype == "Text" || res.fieldtype == "Text Editor") && this.edit_form_values && this.edit_form_values[res.fieldname]) {
          // console.log('this.form_ctrl_data',this.form_ctrl_data)
          // console.log('this.edit_form_values',this.edit_form_values)
          var htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
          let value = this.edit_form_values[res.fieldname].replace(htmlRegexG, '');
          if(res.fieldname == 'description' || res.fieldname == 'resolution_details'){
            this.form_ctrl_data[res.fieldname]  ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
          }
        }

        this.info.length == i + 1 && !this.enabled_read_only  ? this.get_link_values() : null;

        if(this.doctype == 'Supplier Invoice' && this.edit_form_values && this.edit_form_values.name && res.fieldname == 'purchase_order_ref' && this.Convert_route == 'purchase-order'){
          this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(this.edit_form_values.name) : null
          res.read_only = 1
        }

        if((localStorage['role'] == 'Employee' || localStorage['role'] == 'Tridots Employee') && this.hideCosting){
          if(res.fieldname == 'estimated_costing' || res.fieldname == 'company' || res.fieldname == 'cost_center' || res.fieldname == 'material_budget' || res.fieldname == 'labour_budget' || res.fieldname == 'equipment_budget' || res.label == 'Costing and Billing' || res.label == 'Budget'){
            res.hidden = 1
          }
        }

        if(this.doctype == 'Bug Sheet' && this.edit_form_values){
          if(res.fieldname == 'fixed_on'){
            if(this.edit_form_values.status == 'Fixed'){
              res.hidden = 0
            }else{
              res.hidden = 1
            }
          }
          if(res.fieldname == 'verified_on'){
            if(this.edit_form_values.status == 'Verified'){
              res.hidden = 0
            }else{
              res.hidden = 1
            }
          }
        }

        if(this.forms_route == 'daily-update' && this.edit_form_values && this.edit_form_values.description){
          if(res.fieldname == 'description'){
            res.hidden = 0
            res.read_only = 1;
          }
        }

        if(this.doctype == 'Bug Sheet'){
          if(res.fieldname == 'module'){
            this.db.drop_down_value[res.fieldname] = this.edit_form_values.module_name
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(this.edit_form_values.module) : null
          }
          if(res.fieldname == 'screen'){
            this.db.drop_down_value[res.fieldname] = this.edit_form_values.screen_name
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(this.edit_form_values.screen) : null
          }
        }

        // if(this.doctype == 'Test Case'){
        //   if(res.fieldname == 'project'){
        //     this.db.drop_down_value[res.fieldname] = this.edit_form_values.project_name
        //     this.form_ctrl_data[res.fieldname].setValue(this.edit_form_values.project)
        //   }else if(res.fieldname == 'module'){
        //     this.db.drop_down_value[res.fieldname] = this.edit_form_values.module_name
        //     this.form_ctrl_data[res.fieldname].setValue(this.edit_form_values.module)
        //   }else if(res.fieldname == 'screen'){
        //     this.db.drop_down_value[res.fieldname] = this.edit_form_values.screen_name
        //     this.form_ctrl_data[res.fieldname].setValue(this.edit_form_values.screen)
        //   }
        // }

        if(this.doctype == 'Quotation' && res.fieldname == 'items'){
          if(this.edit_form_values[res.fieldname] && this.edit_form_values[res.fieldname].length != 0){
            this.form_ctrl_data[res.fieldname].setValue(this.edit_form_values[res.fieldname]);
          }else{
            this.form_ctrl_data[res.fieldname].setValue("");
          }
        }

        if(this.doctype == 'Employee Letter Request' && this.edit_form_values){
          this.info.map(res => {
            if(res && res.fieldname == 'generated_letter'){
              if(this.edit_form_values){
                res.hidden = 0;
              }else{
                res.hidden = 1;
              }
            }else if(res.fieldname == "from_date" || res.fieldname == "to_date"){
              if(this.edit_form_values && this.edit_form_values.letter_type == 'Visa Letter'){
                res.hidden = 0;
              }else{
                res.hidden = 1;
              }
            }
          })
        }

      });
    } else {
      this.info.map((res, i) => {
        if (res.label && res.fieldtype != 'Section Break' && res.fieldtype != 'Column Break' && res.fieldtype != 'Barcode' && res.fieldtype != 'Button' && res.fieldtype != 'Color' && res.fieldtype != 'Duration' && res.fieldtype != 'Dynamic Link' && res.fieldtype != 'Fold' && res.fieldtype != 'Geolocation' && res.fieldtype != 'Heading' && res.fieldtype != 'Image' && res.fieldtype != 'Markdown Editor' && res.fieldtype != 'Percent' && res.fieldtype != 'Read Only' && res.fieldtype != 'Table MultiSelect') {
          let value:any = form_ctrl_data[res.fieldname] && form_ctrl_data[res.fieldname] != '' ? form_ctrl_data[res.fieldname] : '';
          res['value'] = value;
          if (!res['value'] && this.db.default_values) {
            if (res.options == 'Company') {
              value = this.db.default_values.default_company;
              res['value'] = value;
            } else if (res.options == 'Currency') {
              value = this.db.default_values.default_currency;
              res['value'] = value;
            }
          }

          if(res.fieldname == 'supplier_group'){
            value = res.default
          }

          if(this.doctype == 'Employee Grievance' && res.fieldname == 'status' && this.db.employee_role){
            res.read_only = 1;
          }else if(this.doctype == 'Employee Grievance' && res.fieldname == 'date'){
            value = this.current_date;
          }
          
          if(this.db.hr_manager_role && this.doctype == 'Expense Claim' && res.fieldname && (res.fieldname == 'employee')){
            res.read_only = 1;
          }

          if(this.db.project_role && this.doctype == "Bug Sheet" && res.fieldname && (res.fieldname == 'reported_by')){
            // res['value'] = localStorage['employee_id']
            // res.default = res['value']
            // res.read_only = 1;
          }
          
          if(!res['value'] && (res.fieldtype == 'Link' || res.fieldtype == 'Data' ||  res.fieldtype == 'Select') && ((this.doctype == 'Lead' || this.doctype == 'Salary Slip') && (res.fieldname == 'status' || res.fieldname == 'source' || res.fieldname == 'city' || res.fieldname == 'state' || res.fieldname == 'country'))){
            res['value'] = res.default;
            value = res.default
            this.form_ctrl_data[res.fieldname] = new FormControl(value);
            this.db.drop_down_value[res.fieldname] = value;
            this.form_ctrl_data[res.fieldname].setValue(value);
            if(res.fieldname == 'supplier'){
              let role = JSON.parse(localStorage['permission_details'])
              let supplier = role.find((val)=>{return val.role == 'Supplier'})
              // console.log(supplier,"supplier")
              this.db.drop_down_value[res.fieldname] = localStorage['CustomerName']
              supplier ? this.form_ctrl_data[res.fieldname].setValue(localStorage['CustomerName']) : null
            }
          }

          // && this.db.default_values
          if (!res['value'] && res.fieldtype == 'Select' && (res.fieldname == 'approval_status' || res.fieldname == 'status') && res.default) {
            res['value'] = res.default;
            value = res.default;
          }

          res.placeholder = res.label ? res.fieldtype == 'Select' || res.fieldtype == 'Link' ? 'Select ' + res.label : 'Enter the ' + res.label : '';
          res.placeholder = '';
          if (res.fieldtype == 'Link') { 
            this.link_w_fields_name.push({  doctype: res.options, fieldname: res.fieldname, });
          }
          
          if((res.fieldname == 'posting_date' || res.fieldname == 'opening_date') && this.current_date && this.add_new_form){
            value = this.current_date;
          }
          if(res.fieldname == 'posting_time' && this.current_time && this.add_new_form){
            value = this.current_time
          }

          if(this.doctype == 'Employee Grievance' && res.fieldname == 'raised_by'){
            this.db.drop_down_value[res.fieldname] = localStorage['employee_name'];
            // this.db.drop_down_value[res.fieldname] = localStorage['employee_id'];
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
            if(this.db.employee_role){
              res.read_only = 1;
            }
          }

          

          if (res.fieldname == 'employee' && localStorage['employee_id'] && localStorage['employee_id'] != "undefined") {
            value = localStorage['employee_name'];
            this.formValues[res.fieldname] = localStorage['employee_id'];
            this.db.drop_down_value[res.fieldname] = localStorage['employee_id'];
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
            if(this.doctype == 'Timesheet'){
              res.read_only = 1;
            }else{
              res.read_only = this.db.hr_manager_role ? 0 : 1;
            }
          }
          
          if ( (res.fieldname == 'half_day_date' && this.doctype == 'Compensatory Leave Request') ||  this.doctype == 'Leave Application' ) {
            this.half_day_hide = false;
          }

          if (res.fieldname == 'employee_name' && localStorage['employee_name'] && this.doctype != 'Employee' && localStorage['employee_name'] != "null") {
            value = localStorage['employee_name'];
            this.db.drop_down_value[res.fieldname] = value;
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
          }

          if (res.fieldname == 'employee_id' && localStorage['employee_id'] && this.doctype != 'Employee' && localStorage['employee_id'] != "null") {
            value = localStorage['employee_id'];
            this.db.drop_down_value[res.fieldname] = value;
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
          }

          if (res.fieldname == 'expense_approver' && localStorage['employee_id']) {
            this.get_claim_details_local(localStorage['employee_id']);
            res.read_only = this.doctype == 'Employee' ? 0 : 1;
          }

          if (this.doctype != 'Employee' && res.fieldname == 'leave_approver' && localStorage['employee_id']) {
            this.get_leave_approver(localStorage['employee_id']);
            res.read_only = 1;
          }

          if(res.fieldname == 'approval_status' && this.db.employee_role){
            res.read_only = 1;
          }

          if ( res.fieldname == 'leave_approver_name' &&  localStorage['employee_id']) {
            this.get_leave_approver(localStorage['employee_id']);
            res.read_only = 1;
          }

          if(res.fieldname == 'attachments' && this.new_form && this.doctype == 'Bug Sheet'){
            res.hidden = 1;
          }

          if(localStorage['selected_project_id'] && this.forms_route == 'bug-sheet' && res.fieldname == 'project'){
            value = localStorage['selected_project_id']
            this.db.drop_down_value[res.fieldname] = value;
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
            res.read_only = 1;
          }

          if(res.fieldname == 'company'){
            let val = JSON.parse(localStorage['default_values'])
            value = val.default_company ? val.default_company : ''
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(val.default_company ? val.default_company : '') : null
            res.read_only = 1;
          }

          if(res.fieldname == 'cost_center' && this.doctype == 'Expense Claim' && !this.edit_form_values){
            value = (this.db.company_detail && this.db.company_detail.cost_center) ? this.db.company_detail.cost_center : '';
            this.db.drop_down_value[res.fieldname] = value;
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
          }

          if(res.fieldname == 'advance_account' && this.doctype == 'Employee Advance'){
            value = (this.db.company_detail && this.db.company_detail.default_employee_advance_account) ? this.db.company_detail.default_employee_advance_account : '';
            this.db.drop_down_value[res.fieldname] = value;
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
          }

          if(this.parentTaskId && this.doctype == 'Task' && res.fieldname == 'parent_task'){
            value = this.parentTaskId
            this.db.drop_down_value[res.fieldname] = value;
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
            res.read_only = 1;
          }

          

          if(localStorage['selected_project_id'] && (this.doctype == 'Task' || this.doctype == 'Timehsheet') && res.fieldname == 'project' && (this.page == 'Task' || this.page == 'Timesheet')){
            value = localStorage['selected_project_id']
            this.db.drop_down_value[res.fieldname] = value;
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
            res.read_only = 1;
          }

          if ( res.reqd == 1 && res.options != 'Email' && res.options != 'Phone') {
            if (res.max_length && res.max_length > 0) {
              this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false }, [ Validators.required,  Validators.pattern('[0-9]{' + res.max_length + '}'),] );
            } else {
              this.form_ctrl_data[res.fieldname] = new FormControl( { value: value, disabled: res.read_only == 1 ? true : false }, Validators.required  );
            }
          } else if (res.reqd == 1 && res.options == 'Email') {
            this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false }, [ Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), ] );
          } else if (res.options == 'Email') {
            this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false }, Validators.email );
          } else if (res.fieldtype == 'Check') {
            this.form_ctrl_data[res.fieldname] = new FormControl(false);
          } else if (res.reqd == 1 && (res.fieldtype == 'Phone' || res.options == 'Phone')) {
            this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false },  [ Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),  ]   );
          } else if ( res.fieldtype == 'Data' && res.options && res.options.toLowerCase() == 'map' ) {
            res.fieldtype = 'Geo Location';
            this.form_ctrl_data[res.fieldname] = new FormControl({ value: value,  disabled: res.read_only == 1 ? true : false, });
          } else {
            if (res.fieldtype == 'Table' && res.fieldname == 'links') {
              // console.log('this.child_data',this.child_data)
              this.child_data[res.fieldname] = this.db.addressLinks;
              this.test_child_data = this.child_data;
              // if(this.doctype == 'Quotation'){
                // this.get_cart_item()
              // }
              value = JSON.stringify(this.test_child_data[res.fieldname]);
              // console.log(value)
            }
            this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false, });
          }

          if (res.fieldtype == 'Link') {
            this.link_w_fields_name.push({ doctype: res.options, fieldname: res.fieldname, });

            if (value) {
              this.db.all_link_opts[res.options + res.fieldname] = [ { label: value, name: value }, ];
            }

          }
        }

        if(res.fieldname == 'supplier_name' || res.fieldname == 'supplier'){
          let role = JSON.parse(localStorage['permission_details'])
          let supplier = role.find((val)=>{return val.role == 'Supplier'})
          // console.log(supplier,"supplier")
          this.db.drop_down_value[res.fieldname] = localStorage['CustomerName']
          supplier ? this.form_ctrl_data[res.fieldname].setValue(localStorage['CustomerName']) : null
        }


        this.info.length == i + 1 ? this.get_link_values() : null;
        if ( this.doctype && this.doctype == 'Customer' &&  res &&  res.depends_on ) {
          res.hidden = 1;
        }

        if(res.fieldname == 'links' && res.fieldtype == 'Table'){
          if(res && res.child_header){
          // console.log(res.child_header )
          }
        }

        if(res.fieldtype == 'Small Text'){
          const domParser = new DOMParser();
          const htmlElement = domParser.parseFromString(res.value, 'text/html');
          const plainText = htmlElement.body.textContent || res.value;
          this.form_ctrl_data[res.fieldname].setValue(plainText ? plainText : res.value)
        }
      });
    }

    if(this.doctype && this.doctype == 'Supplier Quotation' && this.edit_form_values && this.edit_form_values['items']){
      this.loadSupplierQuotation();
    }

    // if(this.doctype && this.doctype == 'Expense Claim'){
    //   this.advance_payments()
    // }

    this.remove_alphabets();
  }

  // End = > The form is loaded here.

  checkValues(res,value){
    if (res.fieldname == 'grand_total' && this.doctype == 'Expense Claim') {
              
      if (value && value > 0) {
        value = value;
      } else {
        value = 0;
      }
      
      value = Number(value);
      res['value'] = value;
    }else if(this.doctype == 'Timesheet' && res.fieldname == 'employee_name'){
      res.read_only = 1
    }
    if (!res['value'] && this.db.default_values) {
      if (res.options == 'Company') {
        value = this.db.default_values.default_company;
        res['value'] = value;
        this.edit_form_values ? this.edit_form_values[res.fieldname] = value : null;
      } else if (res.options == 'Currency') {
        value = this.db.default_values.default_currency;
        res['value'] = value;
        this.edit_form_values ? this.edit_form_values[res.fieldname] = value : null;
      }
    }

    if(this.edit_form_values){
      let sendRawData = JSON.stringify(this.edit_form_values)
      this.holdRawDataItem = JSON.parse(sendRawData);
      let data = Object.keys(this.holdRawDataItem)
        data.map(key => {
        if (Array.isArray(this.holdRawDataItem[key])) {
            let array_values = this.holdRawDataItem[key]

            for(let i=0;i < array_values.length;i++){
              Object.keys(array_values[i]).map(valu => {
                    if(valu && ((valu.includes('amount') || valu.includes('paid') || valu.includes('rate') ) && String(array_values[i][valu]).split(".").length < 2)){
                      array_values[i][valu] = ( '₹ ' + array_values[i][valu] + '.00')
                    }

                    if(valu && valu.includes('hours')){
                      array_values[i][valu] = Number(Number(array_values[i][valu]).toFixed(2))
                    }

                  })
            }
        }
        });
    }

    res.placeholder = res.label ? res.fieldtype == 'Select' || res.fieldtype == 'Link' ? 'Select ' + res.label : 'Enter the' + res.label : '';
    res.placeholder = ''
    if (this.enabled_read_only) {
      res.read_only == 1;
    }

    if (res.fieldname == 'posting_date' || res.fieldname == 'attendance_date' || res.fieldname == 'transaction_date'  && this.current_date && this.add_new_form) {
      value = this.current_date;
    }

    if ( (res.fieldname == 'half_day_date' && this.doctype == 'Compensatory Leave Request') || this.doctype == 'Leave Application'  ) {
      this.half_day_hide = false;
    }

    if(this.doctype == 'Expense Claim' && res.fieldname == 'approval_status' && this.db.employee_role){
      if(value == 'Draft'){
        res.read_only = 1;
      }
    }

   

    if (this.enable_readonly && this.doctype == 'Expense Claim' && (res.fieldname == 'employee' || res.fieldname == 'expense_approver' || res.fieldname == 'company') ) {
      this.db.selected_from_employee = localStorage['employee_id']
      if(this.db.employee_role){
        res.read_only = 1;
      }
      value = value;
      if (res.fieldname == 'employee') {
        value = {
          value: value,
          disabled: res.read_only == 1 ? true : false,
        };
      }
    }
    if (!res['value'] && (res.fieldtype == 'Select' || res.fieldtype == 'Link') && res.fieldname == 'approval_status' || res.fieldname == 'status' || res.fieldname == 'advance_account' || res.fieldname == 'material_request_type' && this.db.default_values) {
      if(this.edit_form_values && (!this.edit_form_values.status && !this.edit_form_values.approval_status && !this.edit_form_values.advance_account))
      res['value'] = res.default;
      value = res.default;
      if(this.doctype == 'Timesheet' || (this.doctype == 'Employee Advance' && res.fieldname != 'advance_account') || (this.db.employee_role && this.doctype != 'Task')){
        if((this.db.employee_role || !this.db.employee_role) && this.doctype != "Employee Grievance"){
          res.read_only = 1
        }
      }
    }
    if (this.doctype != 'Employee' &&  res.fieldname == 'leave_approver' && localStorage['employee_id'] ) {
      this.get_leave_approver(localStorage['employee_id']);
    }

    if(res.fieldname == 'project' && this.edit_form_values && this.edit_form_values.project && this.doctype == 'Sales Order'){
      // this.get_project_name(res.value)
    }

    if ((res.fieldtype == "Text" || res.fieldtype == "Text Editor") && this.edit_form_values && this.edit_form_values[res.fieldname]) {
      // console.log('this.form_ctrl_data',this.form_ctrl_data)
      // console.log('this.edit_form_values',this.edit_form_values)
      var htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
      value = this.edit_form_values[res.fieldname].replace(htmlRegexG, '');
      if(res.fieldname == 'description' || res.fieldname == 'resolution_details'){
        this.form_ctrl_data[res.fieldname]  ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
      }
    }

    if ( res.fieldname == 'leave_approver_name' &&  localStorage['employee_id'] ) {
      this.get_leave_approver(localStorage['employee_id']);
    }

    if (res.fieldname == 'project' && localStorage['selected_project_id'] && this.doctype == 'Expense Claim') {
      value = localStorage['selected_project_id'];
      this.form_ctrl_data[res.fieldname]  ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
    }

    if (res.fieldname == 'employee' && this.edit_form_values && this.edit_form_values['employee']) {
      value = this.edit_form_values['employee'];
      this.formValues[res.fieldname] = this.edit_form_values['employee'];
      this.db.drop_down_value[res.fieldname] = value;
      this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
      if(this.db.employee_role){
        res.read_only = 1;
      }
    }

    if (res.fieldname == 'expense_approver' && localStorage['employee_id']) {
      this.get_claim_details_local(localStorage['employee_id']);
      res.read_only = this.doctype == 'Employee' ? 0 : 1;
    }

    if(this.doctype == 'Employee Grievance' && res.fieldname == 'raised_by' && this.db.employee_role){
      res.hidden = 1;
    }

    if(this.doctype == 'Employee Grievance' && res.fieldname == 'raised_by'){
      this.db.drop_down_value[res.fieldname] = localStorage['employee_name'];
      // this.db.drop_down_value[res.fieldname] = localStorage['employee_id'];
      this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
      if(this.db.employee_role){
        res.read_only = 1;
      }
    }

    if(res.fieldname == 'customer' && this.doctype == 'Sales Order') {
      value = (this.edit_form_values && this.edit_form_values['customer_name']) ? this.edit_form_values['customer_name'] : '' ;
      this.db.drop_down_value[res.fieldname] = value;
      this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
    }

  }

  get_link_values() {

    if (this.link_w_fields_name && this.link_w_fields_name.length != 0) {
      this.link_w_fields_name.map((res) => {
        this.db.all_link_opts[res.doctype + res.fieldname + 'no_products'] =false;
        this.db.all_link_opts[res.doctype + res.fieldname + 'page_no'] = 0;
      });
    }

    if (this.navigation_count == 0) {
      if (this.link_w_fields_name && this.link_w_fields_name.length != 0) {
        setTimeout(() => {
          this.store_old_data = this.form_data.value;
          this.link_w_fields_name.map((res) => {
            this.db.form_values = this.store_old_data;
            if ( !this.db.all_link_opts[ res.doctype + res.fieldname + 'no_products' ] ) {
              // this.db.get_master_value(res.doctype, res.fieldname);
            }
          });
        }, 1000);
      }
    } else {
      if (this.link_w_fields_name && this.link_w_fields_name.length != 0) {
        this.link_w_fields_name.map((res) => {
          this.db.form_values = this.store_old_data;
    
          if (!this.db.all_link_opts[res.doctype + res.fieldname + 'no_products']) {
            // this.db.get_master_value(res.doctype, res.fieldname);
          }
        });
      }
    }
  }

  async get_load_ng_select() {
    let loader = await this.loadingCtrl.create({ message: '' });
    await loader.present();
    setTimeout(() => {
      this.selected_values.map((r, j) => {
        this.check_ng_select(r);
        this.selected_values.length == j + 1 ? loader.dismiss() : null;
      });
    }, 700);
  }

  current_gen_links(link_field_array) {
    link_field_array.map((refdoc) => {

      if ( refdoc == 'Classified Category' || refdoc == 'Job Category' || refdoc == 'Job Role' || refdoc == 'Expected Salary Type' ) {
        this.get_parent_options(refdoc);
      } else if (refdoc == 'sugesstion1' ||refdoc == 'Salary' || refdoc == 'working_time' || refdoc == 'year_amount' || refdoc == 'contract_type' || refdoc == 'Work_from_home_options' || refdoc == 'start_date' || refdoc == 'year' || refdoc == 'end_date' || refdoc == 'end_date_year' || refdoc == 'Gradution_Year' || refdoc == 'end_date_year' || refdoc == 'end_date_year') {
        this.get_parent_options_value(refdoc);
      } 
    });
  }

  get_parent_options_value(refdoc) {
    let link_opts: any = [];
    if (refdoc == 'Salary') {
      link_opts = ['Hourly', 'Annual', 'Daily'];
    } else if (refdoc == 'year_amount') {
      link_opts = ['35.000 to 37.49'];
    } else if (refdoc == 'working_time') {
      link_opts = ['Day Time', 'Night Time'];
    } else if (refdoc == 'Work_from_home_options') {
      link_opts = ['Yes', 'No'];
    } else if (refdoc == 'contract_type') {
      link_opts = ['Full Time', 'Part Time', 'Remote', 'Contract'];
    } else if (refdoc == 'start_date' || refdoc == 'end_date') {
      link_opts = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    } else if (refdoc == 'year' || refdoc == 'end_date_year' || refdoc == 'Gradution_Year') {
      var max = new Date().getFullYear();
      var min = max - 9;
      var years: any = [];
      for (var i = max; i >= min; i--) {
        years.push(i);
      }
      link_opts = years;
    } else if (refdoc == 'job_category') {
      link_opts = ['Health and LiveStyle'];
    } else if (refdoc == 'Job_sub_category') {
      link_opts = ['Information Management'];
    } else if (refdoc == 'Degree') {
      link_opts = ['PHD Doctorate', 'Bachelors', 'Masters'];
    } else if (refdoc == 'sugesstion1') {
      link_opts = ['Ui/Ux Designer', 'Product Designer'];
    } else if (refdoc == 'sugesstion2') {
      link_opts = ['Creative & Designing'];
    } else if (refdoc == 'Skills') {
      link_opts = ['Creative & Designing'];
    }

    this.db.all_link_opts[refdoc] = link_opts;
  }

  get_parent_options(refdoc) {
    if (this.k == 1) {
      this.ref_doc.push(refdoc);
      this.db.ref_doc_type = refdoc;
      this.db.get_link_field_options_parent(refdoc).subscribe((res) => {
        let res_data = res.data;
        let link_opts: any = [];

        if (refdoc == 'Classified Category') {
          res_data.map((res) => {
            link_opts.push({ options: res.category_name, ids: res.name });
          });
        } else if (refdoc == 'Job Category') {
          res_data.map((res) => {
            link_opts.push({ options: res.category_name, ids: res.name });
          });
        } else if (refdoc == 'Job Role') {
          res_data.map((res) => {
            link_opts.push(res.name);
          });
        } else if (refdoc == 'Expected Salary Type') {
          res_data.map((res) => {
            link_opts.push({ options: res.name });
          });
        }
        this.db.all_link_opts[refdoc] = link_opts;

        if (this.wizard_form != 1 && refdoc == 'Job Role') {
          this.info.map((res, index) => {
            if (res.options && res.options == refdoc) {
              if (
                this.db.all_link_opts[refdoc].length != 0 &&
                res.multiselect_option &&
                res.multiselect_option.length != 0
              ) {
              }
            }
          });
        }
      });
      this.k++;
    } else if (this.k == 2) {
      this.k = 1;
      this.ref_doc.push(refdoc);
      this.db.ref_doc_type = refdoc;
      this.db.get_link_field_options_child(refdoc).subscribe((res) => {
        let res_data = res.data;
        let link_opts: any = [];

        if (refdoc != 'Expected Salary Type') {
          res_data.map((each) => {
            if (each.parent_category || each.parent_role) {
              link_opts.push({
                option: each.category_name || each.desired_role,
                ids: each.name,
                parent_category: each.parent_category || each.parent_role,
              });
            }
          });
        } else {
          res_data.options.map((each) => {
            if (each.salary) {
              link_opts.push({ options: each.salary });
            }
          });
          this.final_child_category[refdoc] = link_opts;
        }

        this.child_category[refdoc] = link_opts;

      });
    }
  }

  filter_section_break() {
    this.section_break_name = [];
    this.section_break_data = {};
    this.each_sec_data = [];
    this.section_break_name = [];
    this.test_section_break_data = [];
    this.test_section_break_name = [];
    this.store_field_type = [];
    this.no_sec_col = [];
    this.current_gen_links(this.link_flelds_name);

    let deleteIndex:any;
    let deleteField:any;
    let deleteArray:any = []


    if(deleteArray.length != 0){
      deleteArray.map(r=>{
        this.info.splice(r,1)
      })
    }


    this.info.map((res, index) => {
      this.store_field_type.push(res.fieldtype);
      if (res.fieldtype == 'Section Break') {
        res.fieldname = 'Section' + index;
        let k = index;
        let count = 0;
        while (k < this.info.length) {
          if (k != index) {
            if ( this.info[k].fieldtype != 'Section Break' &&  this.info[k].fieldtype != 'Column Break' ) {
              this.each_sec_data.push(this.info[k]);

            } else if (this.info[k].fieldtype == 'Section Break') {
              break;
            }
          }
          if (this.info[k].fieldtype == 'Column Break') {
            count++;
          }
          k++;
        }
        this.section_break_data[res.fieldname] = this.each_sec_data;
        this.section_break_data[res.fieldname].count = count + 1;
        let p__flex = 100 / (count + 1) + '%';
        // let flex_out = '0 0 calc(' + p__flex + ' ' + '-' + ' ' + ((this.db.ismobile || this.modal) ? '10px' : (this.doctype == 'ToDo' && this.forms_route == 'activity-task') || (this.doctype == 'Event' && this.forms_route == 'event-form') ? '0px' : this.flex_margin) +')';
        // let flex_out = '0 0 calc(' + p__flex + ' ' + '-' + ' ' + ((this.db.ismobile || this.modal) && !this.next_without_saving ? (count + 1 == 3 ? '15px' : '10px') : (this.doctype == 'ToDo' && this.forms_route == 'activity-task') || (this.doctype == 'Event' && this.forms_route == 'event-form') ? '0px' : this.next_without_saving ? '20px' : (count + 1 == 3 ? '15px' :  this.flex_margin)) +')';
        let flex_out = '';
        if(this.db.ismobile){
          p__flex = (count + 1) > 2 ? '50%' : p__flex;
          flex_out = '0 0 calc(' + p__flex + ' ' + '-' + ' ' + ((this.db.ismobile || this.modal) && !this.next_without_saving ? (count + 1 == 3 ? '15px' : '10px') : (this.doctype == 'ToDo' && this.forms_route == 'activity-task') || (this.doctype == 'Event' && this.forms_route == 'event-form') ? '0px' : this.next_without_saving ? '20px' : (count + 1 == 3 ? '15px' :  this.flex_margin)) +')';
        }else{
          flex_out = '0 0 calc(' + p__flex + ' ' + '-' + ' ' + ((this.db.ismobile || this.modal) && !this.next_without_saving ? (count + 1 == 3 ? '15px' : '10px') : (this.doctype == 'ToDo' && this.forms_route == 'activity-task') || (this.doctype == 'Event' && this.forms_route == 'event-form') ? '0px' : this.next_without_saving ? '20px' : (count + 1 == 3 ? '15px' :  this.flex_margin)) +')';
        }
       
        this.section_break_data[res.fieldname].flex = flex_out.toString();

        if (res.label) {
          this.section_break_data[res.fieldname].label = res.label;
        } else {
          this.section_break_data[res.fieldname].label = '';
        }

        if (res.heading) {
          this.section_break_data[res.fieldname].heading = res.heading;
        }
        if (res.btn) {
          this.section_break_data[res.fieldname].btn = res.btn;
        }
        this.test_section_break_data.push(res.fieldname);
        this.test_section_break_name.push(res.fieldname);
        this.each_sec_data = [];

      }
    });

    if (!this.store_field_type.includes('Section Break')) {
      this.info.map((res) => {
        if (res.fieldtype != 'Column Break') {
          this.no_sec_col.push(res);
        }
      });
    }

    // this.getSectionData()

  }
  //End

  getSectionData(){
    if(this.section_break_data){

      let keyValues = Object.keys(this.section_break_data)
  
      if(keyValues && keyValues.length != 0){
        keyValues.map(r=>{
         
          let values:any = []
          values.push({count:this.section_break_data[r].count, flex:this.section_break_data[r].flex, label:this.section_break_data[r].label})
  
          this.section_break_data[r] = this.section_break_data[r].filter(res=> {return  res.hidden != 1})
        
          if(this.section_break_data[r].length != 0){
            this.section_break_data[r].count = values[0]['count']
            this.section_break_data[r].flex = values[0]['flex']
            this.section_break_data[r].count = values[0]['count']
          }
  
        })
      }
    }
  }

  check_assign_sec_break() {
    this.section_break_data_2 = undefined;
    this.count = 0;
    return new Promise<void>((resolve, reject) => {
      this.test_section_break_name.map((res, index) => {
        if ( this.section_break_data[res] && this.section_break_data[res].label ) {
          this.label_name = res;
        } else if ( this.section_break_data[res] && !this.section_break_data[res].label ) {
          this.section_break_data[res].map((name) => {
            this.section_break_data[this.label_name].push(name);
          });
          delete this.section_break_data[res];
          let index_value = this.test_section_break_data.indexOf(res);
          this.test_section_break_data.splice(index_value, 1);
        }
      });
      resolve();
    });
  }

  // Assign final data ref
  async assign_final_data() {
    this.section_break_name = this.test_section_break_data;
    this.section_break_data_2 = this.section_break_data;
  }

  getIp() {
    this.http.get<{ ip: string }>('https://jsonip.com').subscribe((data) => {
      this.ip_address = data.ip;
    });
  }

  get_device_type() {
    this.posted_from = this.db.check_device_type();
    if (this.posted_from == 'Mobile Web' || this.posted_from == 'Website') {
      let browser_name = this.getBrowser().split('/');
      if (browser_name && browser_name[0] != 'unknown') {
        this.browser_name = browser_name[0];
      }
    }
  }

  async discard_changes1(section_value, related) {
    const alert = await this.alertController.create({
      header: 'Discard Changes',
      message: 'Are you sure do you want to discard a changes..?',
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
            this.section_break_name.map((section) => {
              section_value[section].map((res, i) => {
                // console.log(res)
                if (res.related == related) {
                  res.is_show = !res.is_show;
                }
              });
            });
          },
        },
      ],
    });
    await alert.present();
  }

  // Start = > In Leave application the half day leave detail was handled here.
  datePicker(eve, each){
    if(this.doctype == 'Leave Application' && (each.fieldname == 'from_date' || each.fieldname == 'to_date')){

      let data = this.form_data.getRawValue();

      if(data && (data.from_date || data.to_date)){

        if(data && data.from_date){
          this.fromDate = data.from_date
        }

        if(data && data.to_date){
          this.toDate = data.to_date
        }

        if(data && data.from_date && data.to_date && data.half_day){
          this.half_day_hide = true;
        }

        // if(data && (this.fromDate == this.toDate)){
        //  this.half_day_hide = false;
        // }

      }
    }else if(this.doctype == 'Compensatory Leave Request' && (each.fieldname == 'work_from_date' || each.fieldname == 'work_end_date')){

      let data = this.form_data.getRawValue();

      if(data && (data.work_from_date || data.work_end_date)){

        if(data && data.work_from_date){
          this.fromDate = data.work_from_date
        }

        if(data && data.work_end_date){
          this.toDate = data.work_end_date
        }

        if(data && data.work_from_date && data.work_end_date && data.half_day){
          this.half_day_hide = true;
        }

        // if(data && (this.fromDate && this.toDate)){
        //   this.half_day_hide = true;
        // }

      }
    }

  }
  // End = > In Leave application the half day leave detail was handled here.

  // Start = > In Leave application the half day leave check box was handled here.
  check_box(event: any, each: any, section: any) {

    if((this.doctype == 'Leave Application' || this.doctype == 'Compensatory Leave Request') && each.fieldname == 'half_day'){

      let data = this.form_data.getRawValue();

      // Leave Application
      if(this.doctype == 'Leave Application' && data && data.from_date && data.to_date){

        if(data && data.from_date){
          this.fromDate = data.from_date
        }

        if(data && data.to_date){
          this.toDate = data.to_date
        }
        this.check_box1(event, each, section);
      }

      // Compensatory Leave Request
      if(this.doctype == 'Compensatory Leave Request' && data && data.work_from_date && data.work_end_date){

        if(data && data.work_from_date){
          this.fromDate = data.work_from_date
        }

        if(data && data.work_end_date){
          this.toDate = data.work_end_date
        }
        this.check_box1(event, each, section);
        }

        if(data && (this.fromDate == this.toDate)){
        this.half_day_hide = false;
        }

    }else{
      this.check_box1(event, each, section);
    }

  }
  // End = > In Leave application the half day leave check box was handled here.

  check_box1(event: any, each: any, section: any) {
    if (
      this.doctype == 'Compensatory Leave Request' ||
      (this.doctype == 'Leave Application' && each.fieldname == 'half_day')
    ) {
      this.half_day_hide = this.half_day_hide ? false : true;
    }
    if (event.detail.checked) {
      each.value = '1';
    } else {
      each.value = '0';
    }

    this.info_w_hidden_obj.map((res: any) => {
      if ( res.depends_on && each.fieldname && res.depends_on == each.fieldname ) {
        res.hidden = res.hidden == 1 ? 0 : 1;
        if (res.reqd == 1) {
          // this.form_ctrl_data.addControl(res.fieldname, new FormControl('', Validators.required));
        } else {
          // this.form_ctrl_data.addControl(res.fieldname, new FormControl(''));
        }
      }
    });

    this.section_break_data[section].map((res: any) => {
      if ( res.depends_on && each.fieldname && res.depends_on == each.fieldname ) {
        res.hidden = res.hidden == 1 ? 0 : 1;
        // res.enable = res.enable ? 0 : 1;
      }
    });
  }

  getBrowser = () => {
    const userAgent = navigator.userAgent;
    let browser = 'unkown';
    // Detect browser name
    browser = /ucbrowser/i.test(userAgent) ? 'UCBrowser' : browser;
    browser = /edg/i.test(userAgent) ? 'Edge' : browser;
    browser = /googlebot/i.test(userAgent) ? 'GoogleBot' : browser;
    browser = /chromium/i.test(userAgent) ? 'Chromium' : browser;
    browser =/firefox|fxios/i.test(userAgent) && !/seamonkey/i.test(userAgent) ? 'Firefox': browser;
    browser = /; msie|trident/i.test(userAgent) && !/ucbrowser/i.test(userAgent) ? 'IE'  : browser;
    browser =/chrome|crios/i.test(userAgent) && !/opr|opera|chromium|edg|ucbrowser|googlebot/i.test(userAgent) ? 'Chrome' : browser;
    browser =/safari/i.test(userAgent) && !/chromium|edg|ucbrowser|chrome|crios|opr|opera|fxios|firefox/i.test(userAgent) ? 'Safari' : browser;
    browser = /opr|opera/i.test(userAgent) ? 'Opera' : browser;

    // detect browser version
    switch (browser) {
      case 'UCBrowser':
        return `${browser}/${this.browserVersion(userAgent,/(ucbrowser)\/([\d\.]+)/i)}`;
      case 'Edge':
        return `${browser}/${this.browserVersion(userAgent,/(edge|edga|edgios|edg)\/([\d\.]+)/i )}`;
      case 'GoogleBot':
        return `${browser}/${this.browserVersion(userAgent, /(googlebot)\/([\d\.]+)/i)}`;
      case 'Chromium':
        return `${browser}/${this.browserVersion(userAgent,/(chromium)\/([\d\.]+)/i)}`;
      case 'Firefox':
        return `${browser}/${this.browserVersion(userAgent,/(firefox|fxios)\/([\d\.]+)/i)}`;
      case 'Chrome':
        return `${browser}/${this.browserVersion(userAgent,/(chrome|crios)\/([\d\.]+)/i)}`;
      case 'Safari':
        return `${browser}/${this.browserVersion(userAgent, /(safari)\/([\d\.]+)/i )}`;
      case 'Opera':
        return `${browser}/${this.browserVersion(userAgent, /(opera|opr)\/([\d\.]+)/i)}`;
      case 'IE':
        const version = this.browserVersion(userAgent, /(trident)\/([\d\.]+)/i);
        return version
          ? `${browser}/${parseFloat(version) + 4.0}`
          : `${browser}/7.0`;
      default:
        return `unknown/0.0.0.0`;
    }
  };

  browserVersion(userAgent, regex) {
    return userAgent.match(regex) ? userAgent.match(regex)[2] : null;
  }

  async discard_changes() {
  const alert = await this.alertController.create({
    header: 'Discard Changes',
    message: 'Are you sure do you want to discard a changes..?',
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
          // window.location.reload();
          this.router.navigateByUrl('/');
          this.form_data.reset();
        },
      },
    ],
   });
   await alert.present();
  }

  changeListener($event, each): void {
    this.image_count.push(each.fieldname);
    this.image_field_check = 'false';
    this.readThis($event.target, each);
  }

  async readThis(inputValue: any, each): Promise<void> {
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
                      each.file_url = file_url;
                      let value = this.images_array.find(
                        (res) => res['fieldname'] == each.fieldname
                      );
                      if (value) {
                        this.images_array.map((res) => {
                          if (res['fieldname'] == each.fieldname) {
                            res['image_url'] = file_url;
                          }
                        });
                      } else {
                        let obj: any = {
                          fieldname: each.fieldname,
                          image_url: file_url,
                        };
                        this.images_array.push(obj);
                        loader.dismiss();
                      }
                    }

                    let index_v = this.image_count.indexOf(each.fieldname);
                    this.image_count.splice(index_v, 1);
                    if (this.image_count.length == 0) {
                      this.image_field_check = 'true';
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
          //10Mb in bytes
          loader.dismiss();
          this.db.filSizeAlert();
          this.base64_url.splice(this.field_name.indexOf(this.field_name[each.fieldname]),1);
          this.field_name.splice(this.field_name.indexOf(this.field_name[each.fieldname]),1);
          if (this.edit_data_details && this.edit_data_details[each.fieldname]) {
            this.edit_data_details[each.fieldname] = '';
          }
          let ind_v = this.image_count.indexOf(each.fieldname);
          this.image_count.splice(ind_v, 1);
          if (this.image_count.length == 0) {
            this.image_field_check = 'true';
          }

          this.form_data.controls[each.fieldname].reset();
        } else if (file_size == 0) {
          loader.dismiss();
        }
      };
      myReader.readAsDataURL(file);
    }
  }

  // Mutiple file attachment
  readMultipleFile(inputValue: any, fieldname) {
    this.img_file_name = [];
    if (inputValue.files.length > 0) {
      for (let i = 0; i <= inputValue.files.length - 1; i++) {
        var file: File = inputValue.files[i];
        var file_size = inputValue.files[i].size;
        this.convertion(file_size, file, fieldname);
      }
    }
  }

  convertion(file_size, file, fieldname) {
    this.categoryfile = file.name;
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {

      this.categoryimagedata = myReader.result;

      if (this.field_name.includes(fieldname)) {
        this.field_name.map((d, index) => {
          if (d == fieldname) {
            this.base64_url.splice(index, 1, this.categoryimagedata);
            this.field_name.splice(index, 1, fieldname);
          }
        });
      } else if (!this.field_name.includes(fieldname)) {
        this.field_name.push(fieldname);
        this.base64_url.push(this.categoryimagedata);
      }

      let img_data = {
        file_name: this.categoryfile,
        content: this.categoryimagedata,
        decode: 'True',
      };

      if (file_size <= 10000000) {

        this.db.upload_image(img_data).subscribe((res) => {
          let checks_rep = res ? true : false;

          let unique_name = res.data.name;

          if (checks_rep == true) {
            this.db.upload_image_url(unique_name).subscribe((url) => {
              let file_url = url.data.file_url;

              if (url) {
                if (this.field_name.includes(fieldname)) {
                  this.field_name.map((d, index) => {
                    if (d == fieldname) {
                      this.img_file_name.push(file_url);
                      this.file_name.splice(
                        index,
                        1,
                        this.uniq(this.img_file_name)
                      );
                    }
                  });
                } else if (!this.field_name.includes(fieldname)) {
                  this.file_name.push(file_url);
                }
              }

              let index_v = this.image_count.indexOf(fieldname);
              this.image_count.splice(index_v, 1);
              if (this.image_count.length == 0) {
                this.image_field_check = 'true';
              }
            });
          }
        });
      } else if (file_size > 10000000) {
        this.db.filSizeAlert();
        this.base64_url.splice(
          this.field_name.indexOf(this.field_name[fieldname]),
          1
        );
        this.field_name.splice(
          this.field_name.indexOf(this.field_name[fieldname]),
          1
        );
        let ind_v = this.image_count.indexOf(fieldname);
        this.image_count.splice(ind_v, 1);
        if (this.image_count.length == 0) {
          this.image_field_check = 'true';
        }

        this.form_data.controls[fieldname].reset();
      } else if (file_size == 0) {
      }
    };
    myReader.readAsDataURL(file);
  }

  uniq(array) {
    return array.sort().filter(function (item, pos, ary) {
      return !pos || item != ary[pos - 1];
    });
  }

  // Convert base 64 into binary image data
  base64_binary(dataURI) {
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }

    return array;
  }

  store_header(){
    this.info.map((res, index) => {
      res.child_header = [];
      res.child_fields = [];
      if (res.fieldtype == 'Table') {
        let child_table_name = res.options;
        let doc_name: string = '';
        let table_array = child_table_name.split(' ');
        table_array.map((res) => {
          doc_name = doc_name.concat(res + ' ');
        });

        doc_name = doc_name.substring(0, doc_name.length - 1);

        if (res.options.includes('JSON')) {
          let data = '/assets/childTableJson/' + res.options + '.json';
          this.http.get(data).subscribe((respon: any) => {
            let header_data = respon.docs[0].fields;
            if (header_data) {
              header_data.map((header) => {
                if (header.in_list_view) {
                  res.child_header.push(header);
                  this.child_header_label.push(header);
                }
              });
              let p__flex = 100 / this.child_header_label.length + '%';
              let flex_out ='0 0 calc(' + p__flex +' ' + ' ' + this.header_flex_margin + ')';
              this.child_header_label = [];
              res.child_header.map((flex_res) => {
                flex_res.flex = flex_out;
              });
            }
          });
        } else {
          this.db.get_doc_data(doc_name).subscribe((respon) => {
            let header_data = respon.docs[0].fields;

            if(doc_name == 'Timesheet Detail' && header_data && header_data.length != 0){
              header_data = header_data.filter((res:any)=>{ return res.fieldname != "is_billable" })
            }

            if (header_data) {
              header_data.map((header) => {
                if (header.in_list_view) {
                  res.child_header.push(header);
                  this.child_header_label.push(header);
                }
              });
              let p__flex = 100 / this.child_header_label.length + '%';
              let flex_out = '0 0 calc(' + p__flex + ' ' + '-' + ' ' + this.header_flex_margin + ')';
              this.child_header_label = [];
              res.child_header.map((flex_res) => {
                flex_res.flex = flex_out;
              });
            }
          });
        }
      }
    });
  }

  // Child tables popup stating function
  open_child_modal(child_table_name, child_field_name) {
    if (child_field_name == 'items') {
      if (this.doctype == 'Sales Order') {
        let data = this.form_data.value;
        // this.db.customer_details['customer'] = data['customer'];
        if (!data['customer']) {
          this.db.alert('Customer. It is needed to fetch Item Details');
        } else if (!data['company']) {
          this.db.alert('Company. It is needed to fetch Item Details');
        } else {
          this.open_child_modal1(child_table_name, child_field_name);
        }
      } else {
        this.open_child_modal1(child_table_name, child_field_name);
      }
    } else {
      this.open_child_modal1(child_table_name, child_field_name);
    }
  }

  open_child_modal1(child_table_name, child_field_name) {
    let doc_name: string = '';
    let table_array = child_table_name.split(' ');

    table_array.map((res) => {
      doc_name = doc_name.concat(res + ' ');
    });

    doc_name = doc_name.substring(0, doc_name.length - 1);
    let modal_class;
    if (this.db.ismobile) {
      modal_class = 'mbl-webformchildPopup';
    } else if (!this.db.ismobile) {
      modal_class = 'webformchildPopup';
    }

    let check_array = this.arrayFields.find((res) => res == child_field_name);

    if (check_array) {
      this.pop_up_child( this.store_child_fields[child_field_name],child_table_name,child_field_name, modal_class);
    } else {
      this.arrayFields.push(child_field_name);

      if (doc_name.includes('JSON')) {
        let data = '/assets/childTableJson/' + doc_name + '.json';

        this.http.get(data).subscribe((res: any) => {
          if (res) {
            this.pop_up_child(res,child_table_name,child_field_name, modal_class);
          }
          this.store_child_fields[child_field_name] = res;
        });
      } else {
        this.db.get_doc_data(doc_name).subscribe((res) => {
          if (res) {
            this.pop_up_child(res, child_table_name, child_field_name, modal_class);
          }
          this.store_child_fields[child_field_name] = res;
        });
      }
    }
  }

  get_form_values_() {
    if (this.navigation_count == 0) {
      if (this.link_w_fields_name && this.link_w_fields_name.length != 0) {
        setTimeout(() => {
          this.store_old_data = this.form_data.value;
          this.link_w_fields_name.map((res) => {
            this.db.form_values = this.store_old_data;
    
            if (!this.db.all_link_opts[res.doctype + res.fieldname + 'no_products']) {
              // this.db.get_master_value(res.doctype, res.fieldname);
            }
          });
        }, 1000);
      }
    } else {
      if (this.link_w_fields_name && this.link_w_fields_name.length != 0) {
        this.link_w_fields_name.map((res) => {
          this.db.form_values = this.store_old_data;
        
          if (!this.db.all_link_opts[res.doctype + res.fieldname + 'no_products']) {
            // this.db.get_master_value(res.doctype, res.fieldname);
          }
        });
      }
    }
  }

  async pop_up_child(alldata, child_table_name, child_field_name, modal_class) {
    this.form_is_edited = true;

    this.get_form_values_();

    let popup_data = JSON.stringify(alldata);
    alldata = JSON.parse(popup_data);

    let cssStyle = 'childTablecss';
    
    // if(this.doctype == 'Supplier Quotation'){
    //   cssStyle = 'width_web_site_form'
    // }else{
    //   cssStyle = 'web_site_form'
    // }


    const modal = await this.modalCtrl.create({
      component: WebformChildPage,
      cssClass: this.db.ismobile ? modal_class : cssStyle,
      componentProps: {
        all_data: alldata,
        child_table_name: child_table_name,
        child_table_field_name: child_field_name,
      },
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    // this.get_form(this.forms_route);
    if (data) {
      // console.log(this.form_ctrl_data,'this.form_ctrl_data before')
      this.each_child_data = data.form_data;
      // console.log(data,'data WebformChildPage popup dismiss')
      if (this.child_data[data.child_table_field_name]) {
        this.child_data[data.child_table_field_name].push(this.each_child_data);
        this.test_child_data = this.child_data;
        let datas = JSON.stringify(
          this.test_child_data[data.child_table_field_name]
        );
        this.form_ctrl_data[data.child_table_field_name].setValue(datas);
      } else if (!this.child_data[data.child_table_field_name]) {
        this.all_child_data = [];
        this.all_child_data.push(this.each_child_data);
        this.child_data[data.child_table_field_name] = this.all_child_data;
        this.test_child_data = this.child_data;
        let datas = JSON.stringify(
          this.test_child_data[data.child_table_field_name]
        );
        this.form_ctrl_data[data.child_table_field_name].setValue(datas);
      }

      this.get_update_child(data);

      if (this.doctype == 'Timesheet' && data.vault_data) {

        let total_working_hours = 0;
        let total_costing_amount = 0;
        this.child_data.time_logs.map(res_child => {
          total_working_hours += res_child.hours;
          total_costing_amount += res_child.costing_amount
        })

        this.form_ctrl_data['total_hours'].setValue(total_working_hours);
        this.form_ctrl_data['total_costing_amount'].setValue(total_costing_amount);
      }else if(this.doctype && this.doctype == 'Supplier Quotation' && data.child_table_field_name == 'items' && this.test_child_data && this.test_child_data.items){
        let amount = 0;
        let qty = 0;
        let total = 0;

        // console.log('this.test_child_data.items',this.test_child_data.items);

        this.test_child_data.items.map((res:any)=>{
          qty = res.qty + qty;
          // amount = res.rate + amount;
          amount = res.qty * res.rate
          total = total + amount
        })

        this.form_ctrl_data['total_qty'].setValue(qty)
        this.form_ctrl_data['total'].setValue(total)
      }else if(this.doctype && this.doctype == 'Supplier Invoice' && data.child_table_field_name == 'items' && this.test_child_data && this.test_child_data.items){
        let amount = 0;
        let qty = 0;
        let total:any = 0;

        this.test_child_data.items.map((res:any)=>{
          qty = res.qty + qty;
          amount = res.qty * res.rate
          total = total + amount
        })

        total = total.toFixed(2)

        this.form_ctrl_data['total_qty'].setValue(qty)
        this.form_ctrl_data['total'].setValue(total)
      }
      // console.log(this.form_ctrl_data,'this.form_ctrl_data after')

    }
  }

  // Edit Form popup
  edit_child_modal( all_values,  child_table_name,   child_field_name,   index_value ) {
    // console.log(all_values , "All values");
    // console.log(child_table_name , "child_table_name");
    // console.log(child_field_name , "child_field_name");

    let doc_name: string = '';
    let table_array = child_table_name.split(' ');
    table_array.map((res) => {
      doc_name = doc_name.concat(res + ' ');
    });
    doc_name = doc_name.substring(0, doc_name.length - 1);
    let modal_class;
    if (this.db.ismobile) {
      modal_class = 'mbl-editwebformchildPopup';
    } else if (!this.db.ismobile) {
      modal_class = 'editwebformchildPopup';
    }
    
    // New by John
    // !this.db.ismobile && this.db.employee_role
    if(this.doctype == 'Timesheet' && this.page != 'Timesheet'){
      // 
      this.createTimesheet(all_values[index_value],this.doctype,this.edit_form_values,child_field_name,index_value)
    }else{
      let check_array = this.arrayFields.find((res) => res == child_field_name);
      if (check_array) {
        this.edit_pop_up_child( all_values, this.store_child_fields[child_field_name], child_table_name, child_field_name,  index_value,  modal_class);
      } else {
        this.arrayFields.push(child_field_name);
        if (doc_name.includes('JSON')) {
          let data = '/assets/childTableJson/' + doc_name + '.json';
          this.http.get(data).subscribe((res: any) => {
            if (res) {
              this.store_child_fields[child_field_name] = res;
              this.edit_pop_up_child( all_values, this.store_child_fields[child_field_name], child_table_name, child_field_name, index_value, modal_class  );
            }
          });
        } else {
          this.db.get_doc_data(doc_name).subscribe((res) => {
            if (res) {
              this.store_child_fields[child_field_name] = res;
              this.edit_pop_up_child( all_values, res, child_table_name, child_field_name, index_value, modal_class );
            }
          });
        }

      }

    }
  }

  calculateDuration1(endDate,startDate) {
    const diffMilliseconds = startDate.getTime() - endDate.getTime();

    const hours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMilliseconds % (1000 * 60)) / 1000);

    let time_duration  = hours + (minutes / 60) + (seconds / 3600);
     
    return time_duration
  }

  async createTimesheet(currentObj,doctype,timeSheetDetail,child_field_name,index){
    // this.formEdited = true;
    let todayDate = new Date();
    let year = todayDate.getFullYear();
    let month = String(todayDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    let day = String(todayDate.getDate()).padStart(2, '0');

    this.todayDate = `${year}-${month}-${day}`;

    let detail = {}
    detail['status'] = timeSheetDetail.status
    detail['start_date'] = timeSheetDetail.start_date
    this.currentDate = timeSheetDetail.start_date
    
    if(this.todayDate == this.currentDate){
      this.openTimeSheet()
    }else{
      // const modal = await this.modalCtrl.create({
      //   component: TimesheetPopupComponent,
      //   cssClass: 'timesheet_popup2',
      //   componentProps: {
      //     currentObj:currentObj,
      //     doctype:doctype,
      //     timeSheetDetail:detail,
      //     currentDate: this.currentDate,
      //     todayDate: this.todayDate == this.currentDate
      //   },
      // });
      // await modal.present();
      // const { data } = await modal.onWillDismiss();
      // // console.log(data,'data')
      // if (data) {
      //   // let obj = data.value
      //   this.db.save_button = true;
      //   if(data.value && data.value.from_time && data.value.to_time){
      //     let startDate = new Date(data.value.from_time);
      //     let endDate = new Date(data.value.to_time);
      //     data.value['hours'] = this.calculateDuration1(startDate,endDate)
      //   }
        
      //   this.edit_form_values[child_field_name][index] = data.value
      //   this.get_form(this.forms_route);
      //   this.db.wiz_form = false
      // }

    }
  }

  async openTimeSheet(){
    // this.db.wiz_form = true
    // const modal = await this.modalCtrl.create({
    //   component: UpdateTimesheetComponent,
    //   cssClass: 'web_site_form',
    //   componentProps: {
    //     page: true,
    //     doctype: "Timesheet",
    //     newTimesheet: (this.edit_form_values && this.edit_form_values.name) ? false : true,
    //     timeSheetDetail:(this.edit_form_values && this.edit_form_values.name) ? this.edit_form_values : undefined, 
    //     all_values:(this.edit_form_values && this.edit_form_values.time_logs) ? this.edit_form_values.time_logs : [] 
    //   },
    //   enterAnimation: this.db.enterAnimation,
    //   leaveAnimation: this.db.leaveAnimation,
    // });
    // await modal.present();
    // const val = await modal.onWillDismiss();
    // if (val && val.data && val.data.message && val.data.message.status == 'Success') {
    //   this.db.save_button = true;
    //   this.timesheetSave = true;
    //   this.edit_form_values = val.data.message.data;
    //   this.get_form(this.forms_route);
    //   // this.get_form_values();
    //   this.db.wiz_form = false
    // }
  }

  async edit_pop_up_child( all_values, alldata, child_table_name, child_field_name, index_value, modal_class ) {
    
    let cssStyle = 'childTablecss';
    
    // if(this.doctype == 'Supplier Quotation'){
    //   cssStyle = 'width_web_site_form'
    // }else{
    //   cssStyle = 'web_site_form'
    // }
  
    this.form_is_edited = true;
    const modal = await this.modalCtrl.create({
      component: EditWebformchildPage,
      cssClass: this.db.ismobile ? modal_class : cssStyle,
      componentProps: {
        all_data: alldata,
        child_table_name: child_table_name,
        child_table_field_name: child_field_name,
        all_values: all_values,
        index_value: index_value,
        enabled_read_only: (this.edit_form_values && this.edit_form_values.status && this.edit_form_values.status == 'Draft') ? false : this.enabled_read_only ,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    // this.get_form(this.forms_route);
    if (data) {
      // console.log(data);
      this.child_data[data.child_table_field_name][index_value] = data.form_data;
      if (this.doctype == 'Timesheet' && data.vault_data) {

        let total_working_hours = 0;
        let total_costing_amount = 0;
        this.child_data.time_logs.map(res_child => {
          total_working_hours += res_child.hours;
          total_costing_amount += res_child.costing_amount
        })

        this.form_ctrl_data['total_hours'].setValue(total_working_hours);
        this.form_ctrl_data['total_costing_amount'].setValue(total_costing_amount);

      } else if(this.doctype == 'Quotation' && data.child_table_field_name == 'items'){
        let totalAmount = 0;
        this.test_child_data.items.forEach(item => {
          totalAmount += parseFloat(item.amount); 
        });
                
        this.form_ctrl_data['total'].setValue(totalAmount);
        this.form_ctrl_data['grand_total'].setValue(totalAmount)
      }else if(this.doctype && this.doctype == 'Supplier Quotation' && data.child_table_field_name == 'items' && this.test_child_data && this.test_child_data.items){
        let amount = 0;
        let qty = 0;
        let total = 0;

        // console.log('this.test_child_data.items',this.test_child_data.items);

        this.test_child_data.items.map((res:any)=>{
          qty = res.qty + qty;
          // amount = res.rate + amount;
          amount = res.qty * res.rate
          total = total + amount
        })

        this.form_ctrl_data['total_qty'].setValue(qty)
        this.form_ctrl_data['total'].setValue(total)
      }else if(this.doctype && this.doctype == 'Supplier Invoice' && data.child_table_field_name == 'items' && this.test_child_data && this.test_child_data.items){
        let amount = 0;
        let qty = 0;
        let total:any = 0;

        this.test_child_data.items.map((res:any)=>{
          qty = res.qty + qty;
          amount = res.qty * res.rate
          total = total + amount
        })

        total = total.toFixed(2)

        this.form_ctrl_data['total_qty'].setValue(qty)
        this.form_ctrl_data['total'].setValue(total)
      }

      this.get_update_child(data);
      // this.ref.detectChanges();

    }
  }

  get_update_child(data) {
    if (data.child_table_field_name == 'expenses' && data.form_data) {
      let key = Object.keys(data.form_data);
      if (key && key.length != 0) {
        this.get_update_total_values( this.child_data[data.child_table_field_name], data.child_table_field_name );
      }
    } else if (data.child_table_field_name == 'taxes' && data.form_data) {
      let key = Object.keys(data.form_data);
      if (key && key.length != 0) {
        this.get_update_total_values_taxes( this.child_data[data.child_table_field_name], data.child_table_field_name );
      }
    }
  }

  // Here the total_sanctioned_amount, grand_total values are updated
  get_update_total_values(child_array, child_table_field_name) {
    let amount = 0;
    let total_amount = 0;
    let tax_amount = 0;

    if (child_table_field_name == 'expenses') {
      if (child_array && child_array.length != 0) {
        child_array.map((res) => {
          res['sanctioned_amount'] = res['sanctioned_amount'] ? Number(res['sanctioned_amount']) : 0;
          amount = Number(amount) + res['sanctioned_amount'];
          res['amount'] = res['amount'] ? Number(res['amount']) : 0;
          total_amount = Number(total_amount) + res['amount'];
        });

        if (this.form_ctrl_data['total_sanctioned_amount']) {
          this.form_ctrl_data['total_sanctioned_amount'].setValue(amount);
          if ( this.child_data['taxes'] && this.child_data['taxes'].length != 0 ) {
            this.child_data['taxes'].map((res) => {
              res.tax_amount = amount * (res.rate / 100);
              res.total = res.tax_amount + amount;
              res.tax_amount = res.tax_amount.toFixed(2);
              res.total = res.total.toFixed(2);
              tax_amount = tax_amount + Number(res.tax_amount);
            });
          }
        }

        if (this.form_ctrl_data['total_claimed_amount']) {
          this.form_ctrl_data['total_claimed_amount'].setValue(total_amount);
        }

        if (this.form_ctrl_data['grand_total']) {
          this.form_ctrl_data['grand_total'].setValue(amount + tax_amount);
        }

        this.advance_payments();
      } else {

        if (this.form_ctrl_data['total_claimed_amount']) {
          this.form_ctrl_data['total_claimed_amount'].setValue(total_amount);
        }
        
        if (this.form_ctrl_data['total_sanctioned_amount']) {
          this.form_ctrl_data['total_sanctioned_amount'].setValue(total_amount);
        }

        if (this.form_ctrl_data['grand_total']) {
          this.form_ctrl_data['grand_total'].setValue(total_amount);
        }

        this.advance_payments();
      }
    }
  }
  // End = >

  get_update_total_values_taxes(child_array, child_table_field_name) {
    let amount = 0;
    let total_amount = 0;
    let tax_amount = 0;
    if ( this.form_ctrl_data['total_sanctioned_amount'] && this.form_ctrl_data['total_sanctioned_amount'].value ) {
      amount = this.form_ctrl_data['total_sanctioned_amount'].value;
    }
    if (child_table_field_name == 'taxes') {
      if (child_array && child_array.length != 0) { 
        child_array.map((res) => {
          tax_amount = tax_amount + Number(res.tax_amount);
        });
      }
      if (this.form_ctrl_data['grand_total']) {
        this.form_ctrl_data['grand_total'].setValue(amount + tax_amount);
      }
      this.advance_payments();
    }
  }

  advance_payments() {
    let grand_total = 0;

    // if (this.form_ctrl_data['grand_total'] && this.form_ctrl_data['grand_total'].value  ) {
    //   grand_total = this.form_ctrl_data['grand_total'].value;
    // }

    if (this.form_ctrl_data['total_claimed_amount'] && this.form_ctrl_data['total_claimed_amount'].value  ) {
      grand_total = this.form_ctrl_data['total_claimed_amount'].value;
    }

    if (this.child_data['advances'] && this.child_data['advances'].length != 0) {
      // let advance_payments = this.child_data['advances'][0];
      // if (grand_total > advance_payments.unclaimed_amount) {
      //   advance_payments.allocated_amount = advance_payments.unclaimed_amount;
      //   grand_total = grand_total - advance_payments.unclaimed_amount;
      // } else {
      //   advance_payments.allocated_amount = grand_total;
      // }
      let allocated_amount = true
      let amountValue = 0
      this.child_data['advances'].map((res:any,i)=>{
        res.allocated_amount_ = 0;
        if(allocated_amount){

          res.selected = grand_total == 0 ? false : true;

          if (grand_total >= res.unclaimed_amount) {
            res.allocated_amount = res.unclaimed_amount;
            grand_total = grand_total - res.unclaimed_amount;
          } else {
            allocated_amount = false;
            res.allocated_amount = grand_total;
            grand_total = 0;
            return 1;
            // grand_total = grand_total - res.unclaimed_amount;
          }
          // amountValue = res.allocated_amount
        }
        if(!allocated_amount){
          res.selected = false; 
          res.allocated_amount = grand_total;
        }
      })
    }
    
    this.form_ctrl_data['grand_total'].setValue(grand_total);
  }

  // Select and unselect the list of child tables
  select_unselect(data, alldata, index_value) {
    if (data.select) {
      if (data.select == 1) {
        data.select = 0;
      } else if (data.select == 0) {
        data.select = 1;
        data.index_value = index_value;
      }
    } else if (!data.select) {
      data.select = 1;
      data.index_value = index_value;
    }

    this.overall_select_unselect(alldata, index_value);
  }

  overall_select_unselect(alldata, index_value) {
    let over_all_values: any = [];
    alldata.map((s) => {
      if (s.select) {
        over_all_values.push(s.select);
      } else if (!s.select) {
        s.select = 0;
        over_all_values.push(s.select);
      }
    });

    if (over_all_values.includes(1)) {
      alldata.select = 1;
    } else if (!over_all_values.includes(1)) {
      alldata.select = 0;
    }

    this.all_select_unselect(over_all_values, alldata);
  }

  // Assign a valuse for select all and unselect all
  all_select_unselect(values, alldata) {
    if (!values.includes(0)) {
      alldata.select_all = 1;
    } else if (values.includes(0)) {
      alldata.select_all = 0;
    }
  }

  selectAndUnselect(alldata, each) {
    if (
      this.test_child_data[each.fieldname] &&
      (!this.test_child_data[each.fieldname].select_all ||
        this.test_child_data[each.fieldname].select_all != 1) &&
      this.test_child_data[each.fieldname].length > 0
    ) {
      this.select_all(alldata);
    } else if (
      this.test_child_data[each.fieldname] &&
      this.test_child_data[each.fieldname].select_all &&
      this.test_child_data[each.fieldname].select_all == 1
    ) {
      this.unselect_all(alldata);
    }
  }

  // Select all and unselect all
  select_all(alldata) {
    alldata.map((s) => {
      s.select = 1;
    });
    alldata.select_all = 1;
    alldata.select = 1;
  }

  unselect_all(alldata) {
    alldata.map((s) => {
      s.select = 0;
    });
    alldata.select_all = 0;
    alldata.select = 0;
  }

  delete_records1(alldata, fieldname, obj) {
    alldata.select_all = 0;
    alldata.select = 0;
    obj.select = 1;
    if (alldata.select_all == 0) {
      alldata.map((del) => {
        if (del.select == 1) {
          // this.test_child_data[fieldname].splice(del.index_value, 1);
          this.child_data[fieldname].splice(del.index_value, 1);
        }
      });
    } else if (alldata.select_all == 1) {
      this.child_data[fieldname] = [];
      // this.get_update_total_values(this.child_data[fieldname],fieldname)
    }
  }

  ionFocus(event, k){
    event.stopPropagation();

    // const inputField = document.getElementById('myInput' + k) as HTMLInputElement;
    let inputField:any = document.getElementById('myInput' + k);
   
    // if (inputField) {
    //   inputField.setFocus();
    //   inputField.setSelectionRange(0, this.inputValue.length);
    // }

    // setTimeout(() => {
    //   // inputField.setFocus();
    //   inputField.select();
    // });
  }

  advance(eve,data){
    data.selected = true;
    // let data = (eve && eve.target && eve.target.value) ? eve.target.value : 0;
    let array = this.child_data['advances'].filter((res:any,i)=>{ return res.selected });
    if(array.length > 0){
     let Total = 0; 
     array.map((res)=>{Total = Total + Number(res.allocated_amount)})

     let total_claimed_amount = this.form_data.get('total_claimed_amount').value;

     Total = total_claimed_amount - Total
     this.form_ctrl_data['grand_total'].setValue(Total);
    }
  }

  handleBlur(event, data){
    event.stopPropagation();
    data.allocated_amount = data.allocated_amount ? data.allocated_amount : 0;
    data.allocated_amount = Number(data.allocated_amount).toFixed(2);
  }

  async delete_expense_records(event, alldata, fieldname, data){
    event.stopPropagation();

    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Are you sure do you want to Delete ?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {},
        },
        {
          text: 'Ok',
          handler: () => {
            data.select = 1;
            alldata.select_all = 0;
            this.delete_records(event,alldata, fieldname);
          },
        },
      ],
    });
    await alert.present();
  }

  // delete records
  delete_records(event,alldata, fieldname) {
    event.stopPropagation();
    alldata.select = 0;
    if (alldata.select_all == 0){
      let data = alldata.filter((r) => r.select == 1);
      let store = alldata.filter((r) => r.select != 1);
      let edit_f_value = this.edit_form_values && this.edit_form_values[fieldname] ? this.edit_form_values[fieldname] : undefined;
      this.child_data[fieldname] = store;
      if (data && data.length != 0) {
        data.map((del) => {
          let index = this.db.cart_items.findIndex( (r) => r.item_code == del.item_code );
          this.db.cart_items.splice(index, 1);
          this.ngcart.list = this.db.cart_items;
          // console.log(this.ngcart.list);
          let totalAmount = this.ngcart.list.reduce( (acc: number, item: any) => acc + item.rate,  0 );
          this.Total_amount = totalAmount;
          this.info.map((res) => {
            if (res.fieldtype == 'Currency' && res.fieldname == 'total') {
              this.form_ctrl_data[res.fieldname].setValue(this.Total_amount);
            }
          });
          this.ngcart.changecart();
          // this.db.mycart_emit.next('getted');
          if (edit_f_value && edit_f_value.length != 0) {
            let index = edit_f_value.findIndex( (r) => r.item_code == del.item_code );
            this.edit_form_values[fieldname].splice(index, 1);
            if (fieldname == 'expenses') {
              this.get_update_total_values( this.child_data[fieldname], fieldname );
            } else if (fieldname == 'taxes') {
              this.get_update_total_values_taxes( this.child_data[fieldname],  fieldname );
            }
          }
        });
      }

    } else if (alldata.select_all == 1) {
      this.child_data[fieldname] = [];
      this.clear_cart();
      this.edit_form_values[fieldname] = [];
    }

    if (fieldname == 'expenses') {
      this.get_update_total_values(this.child_data[fieldname], fieldname);
    } else if (fieldname == 'taxes') {
      this.get_update_total_values_taxes(this.child_data[fieldname], fieldname );
    }

  }

  // Delete all event records

  delete_all_event(alldata, field_data){
    alldata.length = 0;
    console.log(field_data,'field_data')
    this.form_ctrl_data[field_data].setValue(alldata)
    // if(this.info && this.info.length != 0){
    //   this.info.map(res => {
    //     if(res.fieldname == field_data){
    //       if(res.reqd){
    //         this.form_data.setControl(res.fieldname, this.formBuilder.control('', [Validators.required]));
    //       }
    //     }
    //   })
    // }
  }

  delete_event_row(alldata,data,i){
    alldata.splice(i, 1)
  }

  nav_by_breadcrumb() {
    this.router.navigateByUrl('/' + this.current_path);
  }

  cancel_details() {
    this.form_data.reset();
    this.child_data = {};
    this.test_child_data = {};
    this.submitted = false;
    this.image_field_check == 'true';
    this.isModel
      ? this.db.close_modal()
      : this.router.navigateByUrl('/' + this.doctype.toLowerCase() + 's');
  }

  public resolved(captchaResponse: string): void {
    this.captcha = true;
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    this.captcha = false;
  }

  set_email_id() {
    Object.keys(this.form_ctrl_data).map((key) => {
      if (key == 'email') {
        this.form_ctrl_data[key].setValue(localStorage['user_email_id']);
      }
    });
  }

  onSelectFile(event, item, options) {
    let fileSize = event.target.files[0].size; // you will get the uploaded file size

    let a = fileSize / 1048;

    if (a <= 2000) {
      if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        var file: File = event.target.files[0];
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();
          reader.onload = (event: any) => {
            // console.log(event);
            //  console.log(file.name);
            let prescription_file = file.name;
            let imagedata = event.target.result;
            item.image_upload = event.target.result;

            let data = {
              filename: prescription_file,
              content: imagedata,
            };

            this.form_data[item.fieldname] = data;
          };

          reader.readAsDataURL(event.target.files[i]);
        }
      }
    } else {
      this.db.alert('Maximum allowed file size is 2MB');
    }
  }

  onMulti_SelectFile(event, item, options) {
    // console.log(event)
    for (let i = 0; i < event.target.files.length; i++) {
      // console.log( event.target.files[i]);
      let fileSize = event.target.files[i].size; // you will get the uploaded file size
      let a = fileSize / 1048;

      if (a <= 2000) {
        if (event.target.files[i]) {
          var filesAmount = event.target.files.length;
          var file: File = event.target.files[i];
          // for (let i = 0; i < filesAmount ; i++) {
          var reader = new FileReader();
          reader.onload = (event: any) => {
            // console.log(event);
            // console.log(event.target.result);
            let prescription_file = file.name;
            let imagedata = event.target.result;
            item.image_upload = event.target.result;

            let data = {
              filename: prescription_file,
              content: imagedata,
            };

            //  console.log(data)

            if (item.multi_upload) {
              let datas: any = [];
              if (
                this.form_data[item.fieldname] &&
                this.form_data[item.fieldname].length != 0
              ) {
                //  console.log(this.form_data[item.fieldname])
                this.form_data[item.fieldname].map((res) => {
                  datas.push(res);
                });
              } else {
                datas.push(data);
              }
              //  datas.push(data);
              this.form_data[item.fieldname] = datas;
            } else {
              this.form_data[item.fieldname] = data;
            }
          };
          reader.readAsDataURL(event.target.files[i]);
          //  }
        }
      } else {
        this.db.alert('Maximum allowed file size is 2MB');
      }
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    // console.log('Back button pressed');
    $('ion-select-popover').hide();
    $('popover-content').hide();
  }

  assign_image(data) {
    if (this.images_array.length != 0) {
      this.images_array.map((res) => {
        data[res.fieldname] = res['image_url'];
      });
    }
  }

  load_child_table(data) {
    let value = Object.keys(data);
    value.map((r) => {
      if (this.test_child_data && this.test_child_data[r]) {
        data[r] = this.test_child_data[r];
      }
    });
  }

  load_next_form() {
    this.wizard_json[this.navigation_count].form_ctrl_data =  this.form_data.value;
    this.store_old_datas(true);
    this.form_ctrl_data = {};
    this.submitted = false;
    this.navigation_count = this.navigation_count + 1;
    this.check_navigation(this.navigation_count);
    let value = this.profile_menu.find((res) => res.index == this.navigation_count);
    this.db.tab_buttons(this.profile_menu, value.name, 'name');
    this.get_forms(this.wizard_json, this.navigation_count);
    this.store_header();
    this.filter_section_break();
    this.assign_final_data();
    this.form_data = this.formBuilder.group(this.form_ctrl_data);
    this.onCreateGroupFormValueChange();
  }


  save_details1(type) {
    // console.log('this.forms_route',this.forms_route)
    if((this.forms_route != 'daily-update' && this.forms_route != 'task-allocation')){

      var data: any = {};
      data = this.form_data.getRawValue();

      if (type == '') {
          // data = this.form_data.value;
        this.assign_image(data);
        this.load_child_table(data);
        this.submitted = true;
        data = { ...data, ...this.formValues };
      } else if (type == 'save') {
        if(this.db.hr_manager_role && this.doctype == 'Timesheet'){
          this.form_ctrl_data['employee'].setValue((this.db.drop_down_value['employee'] && this.db.drop_down_value['employee'] != '') ? this.db.drop_down_value['employee'] : localStorage['employee_id'])
          this.form_ctrl_data['employee_name'].setValue((this.db.drop_down_value['employee_name'] && this.db.drop_down_value['employee_name'] != '') ? this.db.drop_down_value['employee_name'] : localStorage['employee_name'])
          this.formValues['employee'] = this.db.drop_down_value['employee'] != localStorage['employee_id'] ? this.db.drop_down_value['employee'] : localStorage['employee_id']
        }
        
        // data = this.form_data.value;
        this.assign_image(data);
        this.load_child_table(data);
        this.submitted = true;
        // if(this.doctype == 'ToDo' && this.edit_form_values){
        //   data.reference_name = this.db.store_old_id;
        // }else if(this.doctype == 'Event' && this.edit_form_values){
        //   data.event_participants.map(res=>{
        //     if(res && res.reference_docname){
        //       res.reference_docname = this.db.store_old_id;
        //     }
        //   })
        // }

        data = { ...data, ...this.formValues };
      } else {
        data = { ...this.data, ...this.formValues };
      }
      
      if (data && data.taxes_and_charges) {
        let obj = {
          tax_template: data.taxes_and_charges,
        };
        this.db.tax_details(obj).subscribe(
          (res) => {
            if (res && res.message) {
              data.taxes = res.message;
              this.save_details2(type, data);
            } else {
              this.save_details2(type, data);
            }
          },
          (error) => {
            this.save_details2(type, data);
          }
        );
      } else {
        if (type == '') {

          if (this.form_data.status == 'VALID') {
            // data = this.form_data.value;
            data = { ...data, ...this.formValues };
            if((this.doctype == 'Quotation' || this.store_customer_name) && this.forms_route != 'lost-quotation'){
              data.party_name = this.store_customer_name ? this.store_customer_name : data.party_name ? data.party_name : undefined;
            }
            if(this.forms_route == 'lost-quotation'){
              // this.lost_quotation(data)
            }else{
              this.sure_submit(type, data);
            }
          }
        } else {
          this.save_details2(type, data);

        }
      }

    }else if(this.forms_route != 'daily-update' && this.forms_route != 'task-allocation'){
      var data: any = {};
      data = this.form_data.getRawValue();
      this.submitted = true;
      data = { ...data, ...this.formValues };
      // this.createEmployeeTask(data)
    }else{
      var data: any = {};
      data = this.form_data.getRawValue();
      this.submitted = true;
      data = { ...data, ...this.formValues };

      let sendDataDailyUpdate = {
        status: 'Success',
        dailyData: data
      }

      if (this.forms_route == 'daily-update') {
        if (this.form_data.status == 'VALID') {
          let fromDate = new Date(data.from_time).getDate()
          let toDate = new Date(data.to_time).getDate()
          // let fromDate = this.getEqualDate(data.from_time)
          // let toDate = this.getEqualDate(data.to_time)
          // console.log(toDate, 'toDate')
          // console.log(fromDate, 'fromDate')
          if (data.from_time != "" && data.to_time != "" && data.from_time != undefined && data.to_time != undefined && fromDate != toDate) {
            this.db.sendErrorMessage('From Date and To Date must be same!')
          } else {
            this.modalCtrl.dismiss(sendDataDailyUpdate)
          }
        }
      } else {
        if (this.form_data.status == 'VALID') {
          this.modalCtrl.dismiss(sendDataDailyUpdate)
        }
      }
      
    }

    
  }

  convertCurrencyToNumber(currency) {
    const cleanValue = currency.replace(/[₹,]/g, '');
    return parseFloat(cleanValue);
  }

  getEqualDate(getDate){
    let splitDate = getDate.split(' ')
    return  splitDate[0];
  }

  lost_quotation(data){
    //   data ={
    //   name: this.sale_order_id,
    //   lost_reasons_list:[{lost_reason:data.order_lost_reason}],
    //   competitors:[]
    // }
    // this.db.lost_quotation_reason(data).subscribe(res => {
    //   if(res && res.message && res.message.status == 'Success'){
    //     this.modalCtrl.dismiss(res.message.status)
    //   }
    // })
  }

  async sure_submit(type, data) {
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
            this.save_details2(type, data);
          },
        },
      ],
    });
    await alert.present();
  }

  generateName() {
    const baseName = 'new-opportunity';
    this.newName = `${baseName}-${this.opportunityNumber++}`;
  }

  save_details2(type, data) {

    data = {...this.store_old_data,...data};
    this.buttonLoader = true

    if (this.doctype == 'Messages') {
      const strippedData = data.template_message.replace(/<[^>]*>/g, '');
      data.template_message = strippedData;
    } else if (this.doctype == 'Mail Template') {
      const strippedData = data.mail_template.replace(/<[^>]*>/g, '');
      data.mail_template = strippedData;
    } else if (this.doctype == 'Content File') {
      const strippedData = data.template_message.replace(/<[^>]*>/g, '');
      data.template_message = strippedData;
    } else if (this.doctype == 'Content Link') {
      const strippedData = data.template_message.replace(/<[^>]*>/g, '');
      data.template_message = strippedData;
    }

    if (this.sale_order_id) {
      data.name = this.sale_order_id;
    }
    if (this.doctype == 'Employee Checkin') {
      data.device_id = this.db.current_address;
    }

    data.doctype = this.doctype;
    data.docstatus = this.db.save_button ? 0 : 1;
    if ((this.doctype == 'Sales Order' || this.doctype == 'Purchase Receipt' || this.doctype == 'Purchase Order') &&  type == 'submit' ) {
      data.docstatus = 1;

      if ( this.db.selected_list && this.db.selected_list.submitted && this.db.selected_list.submitted == 1 ) {
        data.docstatus = 1;
      } else {
        data.docstatus = 0;
      }
    } else if(this.doctype == 'Sales Order' && this.edit_form_values && this.edit_form_values.status == 'Draft' && type == '') {
      data.docstatus = 1;
      type = 'submit';
    }else if ( (this.doctype == 'Sales Order' || this.doctype == 'Purchase Receipt' || this.doctype == 'Purchase Order') && type != 'submit' ) {

      if ( this.doctype == 'Sales Order' && this.edit_form_values && (this.edit_form_values.status == 'To Deliver and Bill' || this.edit_form_values.status == 'Completed' ||  this.edit_form_values.status == 'Closed' ||  this.edit_form_values.status == 'To Bill' ||  this.edit_form_values.status == 'To Deliver') ) {
        data.docstatus = 1;
      } else {
        data.docstatus = 0;
      }

    } else if (this.doctype == 'Quotation') {
      if (type == 'save') {
        data.docstatus = 0;
      } else {
        data.status = 'Open';
        data.docstatus = 1;
      }
    } else if (this.doctype == 'Timesheet') {
      if(data.time_logs && data.time_logs.length != 0){
        data.time_logs.map(sub_res => {
          sub_res.costing_rate = Number(sub_res.costing_rate)
          sub_res.costing_amount = Number(sub_res.costing_amount)
          sub_res.base_costing_amount = Number(sub_res.base_costing_amount)
        })
      }

      this.form_data.valueChanges.subscribe(x => {
        this.form_is_edited = true
      });

      if(this.form_is_edited || this.db.save_button){
        data.docstatus = 0
      }else{
        data.docstatus = 1
      }
      
    } else if (this.doctype == 'Employee Grievance') {
      if(data.status == 'Open' || data.status == 'Invalid'){
        data.docstatus = 0;
      }
    } else {
      data.docstatus = 1;
      if ( this.db.selected_list && this.db.selected_list.submitted && this.db.selected_list.submitted == 1 ) {
        data.docstatus = 1;
      } else {
        data.docstatus = 0;
      }
    }

    if(this.form_is_edited || this.db.save_button){
      data.docstatus = 0
    }

    if((this.doctype == 'Expense Claim' || this.doctype == 'Employee Advance') && this.db.employee_role){
      data.docstatus = 0
    }
    
    if(this.doctype == 'HD Ticket' && this.edit_form_values){
      data.name = this.edit_form_values.name
    }

   

    if ( this.doctype == 'Purchase Receipt' && this.reference_id &&  data.items && data.items.length != 0) {
      data.items.map((r, i) => {
        let value = this.items_values[i] ? this.items_values[i] : undefined;
        
        if (value) {
          (r.purchase_order = this.reference_id),
            (r.purchase_order_item = value['name']);
        }

      });
    }

    if ( this.doctype == 'Purchase Order' && this.enable_reference && this.edit_form_values && data.items && data.items.length != 0) {
      data.items.map((r, i) => {
        let value = this.items_values[i] ? this.items_values[i] : undefined;
        if (value) {
          r.material_request = this.reference_id;
          r.material_request_item = value['name'];
        }
      });
    }

    if (this.doctype == 'Opportunity' && this.edit_form_values &&  (this.Convert_route == 'Lead' || this.edit_new_form)) {
      delete data.name;
    } else if (this.doctype == 'Customer' && this.edit_form_values) {
      data.name = this.edit_form_values.name;
      data.status = 'Enabled';
    } else if (this.doctype == 'Quotation' && this.edit_form_values && (this.Convert_route == 'Lead' || this.Convert_route == 'Opportunity' || this.edit_new_form)) {
      delete data.name;
    } else if ( this.doctype == 'Sales Invoice' && this.edit_form_values && (this.Convert_route == 'sales-order-creation') ) {
      delete data.name;
    }else if ( this.doctype == 'Supplier Invoice' && this.edit_form_values && (this.Convert_route == 'purchase-order') ) {
      delete data.name;
      this.edit_form_values.name = undefined;
    }else if ( this.doctype == 'Supplier Quotation' && this.edit_form_values && (this.Convert_route == 'request-for-quotation') ) {
      delete data.name;
      this.edit_form_values.name = undefined;
    }

    if (this.doctype == 'Customer' && this.navigation_count > 0) {
      data.customer_name = this.sales_Address;
    }
   

    if(this.doctype == 'Leave Application'){
      data.status = 'Open';
    }

    if(this.doctype == 'Sales Invoice' && this.edit_form_values && this.existing_invoice){
      data.name = this.edit_form_values.name
    }

    if(this.edit_form_values && this.edit_form_values.name && (!this.add_new_form || (this.edit_form && this.edit_form == 1))){
      data.name = this.edit_form_values.name
    }

    let array:any = [];
    let key = Object.keys(this.form_data.controls);

    key.map((r:any)=>{
      let res = this.form_data.controls[r]
      if(res.status == 'INVALID'){
        array.push(r);
      }
    })

    if(this.parentTaskCreate && this.doctype == 'Task'){
      data['is_group'] = 1;
    }



    if( this.doctype == 'Payment Entry'){
      data.party = this.edit_form_values.party
      if(array.length != 0 && array[0] == 'party_balance' && this.form_data.controls['party_balance'].value){
        this.form_data.controls['party_balance'].status = 'VALID';
        this.form_data.status = 'VALID' 
      }
      if(this.edit_form_values && this.edit_form_values.references && this.edit_form_values.references.length != 0){
        data.references = this.edit_form_values.references ? this.edit_form_values.references : this.referencesValue;
      }
    }

    if(this.doctype == 'Expense Claim'){
      if(this.edit_form_values && this.edit_form_values.expenses && this.edit_form_values.expenses.length != 0){
        data.expenses = this.edit_form_values.expenses ? this.edit_form_values.expenses : this.referencesValue;
      }
    }

    if(this.convertedStatusTo){
      delete data.name;
    }

    if (this.form_data.status == 'INVALID' && this.doctype == 'Expense Claim' &&  data.grand_total < 0){
        this.form_data.status = 'VALID'
    }

    if (this.form_data.status == 'VALID') {
      this.hasChange = false;
      if ( this.doctype != 'Employee Checkin' ||  (this.edit_form_values ? this.edit_form_values.status != 'Cancelled' : undefined) ) {

        if (data.doctype == 'ToDo') {
          this.db.loader = true;
          this.db.update_id ? delete data.name : null;
          data.name = this.edit_form_values ? this.edit_form_values.name : null;
          data.reference_type = this.task_doctype ? this.task_doctype : data.reference_type;
          data.reference_name = data.reference_name ? data.reference_name : this.sale_order_id;
        } else if (data.doctype == 'Event') {
          this.db.loader = true;
          this.db.update_id ? delete data.name : null;
          data.name = this.edit_form_values ? this.edit_form_values.name : null;
          data.docstatus = 0;
          data.reference_type = this.event_doctype;
          data.reference_name = this.sale_order_id;
          if ( this.test_child_data && this.test_child_data.event_participants && this.test_child_data.event_participants.length != 0 ) {
            this.test_child_data;
          } else {
            data.event_participants = [
              {
                reference_doctype: this.event_doctype,
                reference_docname: this.sale_order_id,
                email: '',
              },
            ];
          }
        }

        if(this.doctype == 'HD Ticket'){
          data.feedback_rating = this.rating_value
          data.feedback = this.selected_option_value
        }

        if ( this.doctype == 'Timesheet' && data.time_logs &&  data.time_logs.length != 0 ) {
          data.time_logs.map((res) => {
            res.billing_hours = Number(res.billing_hours);
            res.billing_rate = Number(res.billing_rate);
          });
        }
        if(this.doctype =='Lead'){
          data.mobile_no = data.mobile_no.toString()
        }

        if(this.doctype == 'Employee'){
          data.name = this.edit_form_values ? this.edit_form_values.name : null;
        }

        if(this.forms_route == 'timesheet' && localStorage['selected_project_id']){
          data.project = localStorage['selected_project_id']
        }

        // if(this.db.vendor_role && (this.doctype == "Supplier Invoice" || this.doctype == "Payment Entry")){
        //   this.db.save_button = false;
        //   data.docstatus == 0 ? data.docstatus = 1: null;
        // }

        if(this.db.hr_manager_role){
          if(this.doctype == "Attendance"){
            data.docstatus = 1
          }
        }

        if(this.doctype && this.Convert_route && this.doctype == "Supplier Quotation" && this.Convert_route == 'request-for-quotation'){
          data.docstatus = 1
        }

        if(this.doctype == "Supplier Registration"){
          if(data.phone){
            data.phone =  data.phone.toString();
          }
          if(data.alternate_mobile_number){
            data.alternate_mobile_number =  data.alternate_mobile_number.toString();
          }
        }

        if(this.add_new_form){
          delete data.name
        }

        if(this.doctype == 'Task' && !data.project){
          delete data.project
        }

        if(data.doctype == 'Customer'){
          if(Number(data.mobile_no)){
            data.mobile_no = data.mobile_no.toString()
          }
        }

        // if(data.doctype == 'Expense Claim'){
        //   if(data.advances && data.advances.length != 0){
        //     data.advances = data.advances.filter((res)=>{ return res.allocated_amount > 0})
        //   }
        // }

        if(data.doctype == 'Employee Grievance' && data['raised_by']){
          data['raised_by'] = localStorage['employee_id'];
        }

        if(data.doctype == 'Task' && !data.project && this.db.drop_down_value && this.db.drop_down_value['project']){
           data.project = this.db.drop_down_value['project'];
        }

        this.db.inset_docs({ data: data}).subscribe((res) => {

          
          this.buttonLoader = false;

          if (res && res.message && res.message.status == 'Success') {

            

            this.add_new_form = false;
            this.submitted = false;
            this.formValues = {};
            if(this.edit_form_values && this.edit_form &&  this.edit_form == 1 ) {
              type != 'image_none' ? this.updateDetails.emit(res.message) : null;
              let submitted_values = res.message.data;
              let key_values = Object.keys(data);
              let edit_form_key_values = Object.keys(data);
              if ( key_values && key_values.length != 0 &&  edit_form_key_values && edit_form_key_values.length != 0 ) {
                key_values.map((r) => {
                  let check = edit_form_key_values.find((obj) => obj == r);
                  if (check) {
                    this.edit_form_values[r] = submitted_values[r];
                  }
                });
              }
              this.edit_form_values['name'] = submitted_values['name'];
            } else {
              this.edit_form_values = res.message.data;
            }

            if(this.doctype == "Lead" || this.doctype == "Opportunity"){
              this.returnSubmitValues.emit(res.message.data)
            }

            this.sale_order_id = this.edit_form_values.name;

            if ( this.doctype == 'Sales Order' || this.doctype == 'Purchase Order' || this.doctype == 'Sales Invoice') {
              this.sales_order(type, res);
            } else if (this.doctype == 'Purchase Receipt') {
              this.purchase_receipt(type, res);
            } else {
             
              setTimeout(() => { this.edit_form_values && this.edit_form && this.edit_form == 1  ? null : this.form_data.reset() }, 500);

              if(this.db.ismobile){
                // this.db.load_data_list = true;
                this.db.loadTemplateList = true;
                this.db.load_template_datas_list.next('Success');
                // this.db.load_template_datas_list1.next('Success');
              }

              if(this.doctype == 'Quotation'){
                this.db.alert((res.message.message == 'Update Successfully') ? 'Updated Successfully' : res.message.message);
                this.location.back()
              }

              

              // if(this.wizard_json.length - 1 == this.navigation_count){
              if(type == '' || type == 'save' || type == 'submit' || this.wizard_json.length - 1 == this.navigation_count){

                if(this.db.ismobile && (this.doctype == "Event" ||  this.doctype=="Customer")){
                  this.db.alert_animate.next(res.message.message);
                }else{
                  if(this.createNew){
                    this.location.back()
                  }
                  let alert = this.doctype == 'Supplier Registration' ? 'Supplier created successfully. Admin is waiting for approval' : res.message.message
                  this.db.alert((res.message.message == 'Update Successfully') ? 'Updated Successfully' : res.message.message);
                }

                if(!this.modal){
                  type == 'submit' ? this.db.drop_down_value = {} : null;
                  if(this.doctype == 'Messages' || this.doctype == 'Mail Template' || this.doctype == 'Content Link'){
                    this.router.navigateByUrl('/messages');
                    this.closeDetailView()
                    // && this.db.event_list_form
                  }else  if(this.doctype == 'ToDo'){
                    this.router.navigateByUrl('/list/tasks');
                    this.closeDetailView()
                    // && this.db.event_list_form
                  }else if (this.doctype == 'Event') {
                      this.router.navigateByUrl('/list/meeting');
                      this.closeDetailView()
                  }else if (this.doctype == 'Address') {
                      this.location.back()
                      // console.log(this.db.store_quotation_value,'this.db.store_quotation_value')
                      this.closeDetailView()
                  }else if (this.doctype == 'Supplier Registration') {
                    setTimeout(()=>{
                      this.router.navigateByUrl('/register');
                      this.closeDetailView();
                    },1000)
                  }else if (this.doctype == 'Leave Application' && this.db.employee_role && this.db.ismobile) {
                    this.router.navigateByUrl('/leave-application-detail/' + localStorage['employee_id']);
                    this.closeDetailView()
                  }else if(this.db.ismobile && (this.doctype =='Lead' || this.doctype == 'Opportunity') && !this.noRouteBack){
                    // this.location.back()
                    this.navigation();
                  }
                  else{
                      if(this.add_new_form || (this.doctype !='Lead' && this.doctype !='Opportunity')){
                        this.navigation();
                    }
                  }

                }else{
                  if(this.doctype == 'HD Ticket'){
                    let sent_data = {
                      status: "Success",
                      final_data: data
                    }
                    this.modalCtrl.dismiss(sent_data)
                  }else if(this.doctype == 'ToDo' || this.doctype == 'Event' || this.doctype == 'Lead' || this.doctype == 'Opportunity' || this.doctype == 'Customer'){
                    this.modalCtrl.dismiss(res.message)
                    if(this.doctype == 'Event' && !this.db.enable_detail && !this.db.full_width){
                      // this.db.eventApiUpdate = true;
                      // this.db.updateEventData.next('Success')
                    }else{
                      this.db.load_template_datas.next('Success')
                    }
                    if(!this.db.ismobile){
                      this.db.sendSuccessMessage('Updated Successfully')
                    }
                  }else if(this.doctype == 'Task' || this.doctype == 'Project'){
                    // this.db.updateTaskList = true;
                    // this.db.sendTaskSubmit.next('Success')
                    this.modalCtrl.dismiss(res.message)
                  }else{
                    if(this.doctype == 'Issue'){
                      this.db.load_template_datas.next('Success')
                    }else if(this.doctype == 'Bug Sheet'){
                      this.db.load_template_datas.next('Success')
                    }
                    this.modalCtrl.dismiss('Success')
                  }
                }
              }else{
                this.load_next_form();
              }
            }
            setTimeout(()=>{
              this.buttonLoader = false;
            },800)

          } else {
            if (res._server_messages) {
              var d = JSON.parse(res._server_messages);
              var d1 = JSON.parse(d);
              this.db.sendErrorMessage(this.stripHtmlTags(d1.message));
            } else {
              let alert = (res && res.message && res.message.message) ? res.message.message : 'Something went wrong try again later'
              this.db.sendErrorMessage(alert);
              // this.db.alert_animate.next(alert);
            }

            setTimeout(()=>{
              this.buttonLoader = false;
            },800)
            
          }
        },error=>{ 
          this.buttonLoader = false;
          this.db.alert('Something went wrong try again later');
        });
      } else {
        if ( this.doctype == 'Sales Order' &&this.edit_form_values.status != 'Cancelled') {
          data.shift = 'Day Shift';
          this.db.employee_checkin({ data: data }).subscribe((res) => {
            if (res && res.data && res.data.status == 'Success') {
              this.db.alert(res.data.message);
              this.navigation();
              this.form_data.reset();
            } else {
              this.db.alert(res.data.message);
            }
            setTimeout(()=>{
              this.buttonLoader = false;
            },800)
          });
        }
      }
      
    } else if (this.form_data.status == 'VALID' && !this.hasChange) {
      this.db.alert('No changes found');
      setTimeout(()=>{
        this.buttonLoader = false;
      },800)
    } else {
      this.scrollToTop.emit();
      setTimeout(()=>{
        this.buttonLoader = false;
      },800)
    }

    
  }

  stripHtmlTags(htmlString: string): string {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  }

  sales_order(type, res) {
    if (type == '') {
      this.hasChange = true;
      this.open_drop_down_options('Preview', this.sale_order_id);
    } else if (this.doctype == 'Sales Order' && type == 'submit') {
      this.db.sendSuccessMessage(res.message.message);
      this.navigation();
      this.modalCtrl.dismiss('Success');
      this.form_data.reset();
    } else if (this.doctype == 'Purchase Order' && type == 'submit') {
      this.db.sendSuccessMessage(res.message.message);
      this.navigation();
    } else if ((this.doctype == 'Purchase Order' || this.doctype == 'Sales Order') && type == 'save'){
      this.db.sendSuccessMessage(res.message.message);
      this.navigation();
      this.modalCtrl.dismiss('Success')
      this.form_data.reset();
    } else {
      if(this.doctype == 'Sales Invoice'){
        this.existing_invoice = true;
      }
      this.hasChange = true;
      this.load_next_form();
    }
  }

  closeDetailView(){
   if(!this.db.ismobile && this.db.enable_material){
      this.callListApi = false;
      this.close_detail();
    }
  }


  navigation() {
    let route = this.db.permission_details.find((r) => r.page == this.doctype);
    if (route) {
      setTimeout(() => {
        this.router.navigateByUrl(route.route);
        this.closeDetailView();
      }, 500);
    }
  }

  purchase_receipt(type, res) {
    if (type == '') {
      this.hasChange = true;
      this.open_purchase_preview('Preview', this.sale_order_id);
    } else if (this.doctype == 'Purchase Receipt' && type == 'submit') {
      this.db.sendSuccessMessage(res.message.message);
      this.navigation();
      this.form_data.reset();
    } else if(this.doctype == 'Purchase Receipt' && type == 'save'){
      this.db.sendSuccessMessage(res.message.message);
      this.navigation();
      this.form_data.reset();
    } else {
      this.hasChange = true;
      this.load_next_form();
    }
  }


  remove_alphabets() {
    setTimeout(() => {
      var inputBox = document.getElementById('inputBox');
      if (inputBox) {
        var invalidChars = ['-', '+', 'e'];

        inputBox.addEventListener('keydown', function (e) {
          if (invalidChars.includes(e.key)) {
            e.preventDefault();
          }
        });
      }
    }, 1000);
  }

  get_map_values() {
    if (
      this.db.location_info &&
      Object.keys(this.db.location_info).length != 0
    ) {
      Object.keys(this.db.location_info).map((res) => {
        if (this.form_ctrl_data[res]) {
          this.form_ctrl_data[res].setValue(this.db.location_info[res]);
        } else {
          let value = res;
          if (res == 'zipcode') {
            value = res.slice(0, 3);
          } else if (res == 'address') {
            value = 'business_address';
          }
          let find = Object.keys(this.form_ctrl_data).find((r) =>
            r.toLocaleLowerCase().includes(value.toLocaleLowerCase())
          );
          find = find == 'business_address_map' ? 'business_address' : find;
          find ? this.form_ctrl_data[find].setValue(this.db.location_info[res]) : null;
        }
      });
    }
  }

  check_ng_select(res) {
    if (res && $('#' + res + 'ng-select')) {
      $('#' + res + 'ng-select')
        .addClass('ng-touched')
        .removeClass('ng-untouched');
    }
  }

  get_doc_fields(eve, obj) {
    if (this.doctype == 'Custom Field') {
      this.db.get_doc_fields({ doc_type: eve.label }).subscribe((res) => {
        let value = this.info.find((res) => res.fieldname == 'insert_after');
        if (value) {
          this.db.all_link_opts[value.options + 'insert_after'] = res.message;
        }
      });
    }
  }

  check_fields(data) {
    let value: any = [];
    data.message.map((res) => {
      value.push({ name: res.fieldname, label: res.label });
    });
    return value;
  }

  ng_select_change(eve, obj) {
    if (obj.fieldname == 'opportunity_from' && this.doctype == 'Opportunity') {
      this.source_data = eve;
      this.link_w_fields_name.map((res) => {
        if (res.fieldname == 'party_name') {
          if (res.doctype_1 && res.doctype_1 != eve) {
            this.db.all_link_opts[res.doctype] = [];
          }
          res.doctype_1 = eve;
          this.db.all_link_opts[res.doctype + 'real'] = res.doctype_1;
        }
      });
    } else if (obj.fieldname == 'quotation_to' && this.doctype == 'Quotation') {
      this.source_data = eve;
      this.link_w_fields_name.map((res) => {
        if (res.fieldname == 'party_name') {
          if (res.doctype_1 && res.doctype_1 != eve) {
            console.log(this.db.all_link_opts,'this.db.all_link_opts')
            this.db.all_link_opts[res.doctype] = [];
          }
          res.doctype_1 = eve;
          this.db.all_link_opts[res.doctype + 'real'] = res.doctype_1;
        }
      });
    }

    this.store_old_datas(true);

    if (this.link_w_fields_name && this.link_w_fields_name.length != 0) {
      this.link_w_fields_name.map((res) => {
        this.db.all_link_opts[res.doctype + res.fieldname + 'no_products'] = false;
        this.db.all_link_opts[res.doctype + res.fieldname + 'page_no'] = 0;
      });
    }

    this.get_link_values();

    if ( obj.fieldname == 'customer_address' || obj.fieldname == 'supplier_address') {
      this.get_address_display(eve.name, 'address_display');
    } else if (obj.fieldname == 'dt' && obj.options == 'DocType') {
      this.form_ctrl_data['insert_after'].setValue('');
      this.get_doc_fields(eve, obj);
    } else if (obj.fieldname == 'shipping_address_name') {
      this.get_address_display(eve.name, 'shipping_address');
    } else if (obj.fieldname == 'shipping_address') {
      this.get_address_display(eve.name, 'shipping_address_display');
    } else if (obj.fieldname == 'billing_address') {
      this.get_address_display(eve.name, 'billing_address_display');
      this.validate_link(eve.name, 'company_gstin');
    } else if ( obj.fieldname == 'payment_terms_template' || obj.fieldname == 'tc_name' ) {
      let data = {
        value: eve.name,
        field_name: obj.fieldname,
      };
      let set_field;
      if (obj.fieldname == 'taxes_and_charges') {
        set_field = 'taxes';
      } else if (obj.fieldname == 'payment_terms_template') {
        set_field = 'payment_schedule';
      } else if (obj.fieldname == 'tc_name') {
        set_field = 'terms';
      }

      this.tax_template(data, set_field, obj);
    } else if (this.doctype == 'Expense Claim' && (obj.fieldname == 'employee' || obj.fieldname == 'expense_approver') && obj.label != 'ALL' ) {
      this.get_claim_details(eve);
    }
  }

  get_claim_details_local(value) {
    if(this.doctype && this.doctype == 'Expense Claim'){

      if(this.edit_form_values  && this.edit_form_values.employee){
        value = this.edit_form_values.employee 
      }

      let data = {
        employee_id: value,
      };
      this.db.employee_claim_details(data).subscribe(
        (res) => {
          if (res && res.status && res.status == 'Success') {
              // let order_detail = res.results[0];
              let order_detail = res.results;
              // this.expense_approver_name = order_detail.value;
              this.expense_approver_name = order_detail;

              this.form_ctrl_data['expense_approver'].setValue(this.expense_approver_name);
  
  
              let order_detail1 = res.message;

              if(this.edit_form_values  && this.edit_form_values.advances){
                this.edit_form_values.advances.map(res=>{
                  res.selected = res.allocated_amount > 0 ? true : false;
                })
                //  this.advance_payments();
              } else{
                if(order_detail1){
                  let key = Object.keys(order_detail1);
                  // order_detail1['advances'] = [];
                  if (key && key.length != 0) {
                    key.map((r) => {
                      if (order_detail1[r] && this.form_ctrl_data[r]) {
                        if(r == 'advances'){
                          this.child_data[r] = order_detail1[r] ? order_detail1[r] : [];
                          this.test_child_data = this.child_data;
                          let datas = JSON.stringify(this.test_child_data[r]);
                          this.form_ctrl_data[r].setValue(datas);
                          this.advance_payments()
                        }else{
                          this.form_ctrl_data[r].setValue(order_detail1[r]);
                        }
                      }
                    });
                  }
                }
              }

    
  
          } else {
            if (res && res._server_messages) {
              var d = JSON.parse(res._server_messages);
              var d1 = JSON.parse(d);
              var tempElement = document.createElement('div');
              tempElement.innerHTML = d1.message;
              var textContent = tempElement.textContent || tempElement.innerText;
              this.db.alert_animate.next(textContent);
            } else {
              this.db.alert('Something went wrong try again later');
            }
            this.test_child_data.advances = [];
          }
        },
        (error) => {
          this.db.alert('Something went wrong try again later');
        }
      );
    }

  }

  get_claim_details(value) {
    if(this.doctype && this.doctype == 'Expense Claim'){

    let data = {
      employee_id: value.name,
    };
    this.db.employee_claim_details(data).subscribe((res:any) => {
        if (res && res.status && res.status == 'Success') {

          if(res.results && res.results[0]){
            // let order_detail = res.results[0];
            let order_detail = res.results;
            // let value = order_detail.value
            let value = order_detail
            // this.form_ctrl_data['expense_approver'].setValue(value);
            // this.form_data.get('expense_approver').setValue(value);
            this.form_data.get('expense_approver').enable();
            this.form_data.get('expense_approver').setValue(value);
            this.info.map((r:any)=>{
              if(r.fieldname == 'expense_approver'){
                 r.inputValue = value;
              }
             })
            this.ref.detectChanges();
            // res.message['expense_approver'] = value
            // this.setValue['expense_approver'] = value;
            // this.ngZone.run(() => { this.setValue['expense_approver'] = value; });
          }

          this.setFormValues(res);

          // let order_detail = res.message;
          // let key = Object.keys(order_detail);
         

          // if (key && key.length != 0) {
          //   key.map((r) => {
          //     if ((order_detail[r] && this.form_ctrl_data[r])) {
          //       // if(this.form_ctrl_data[r].status == 'DISABLED'){
          //       //   this.form_ctrl_data[r].enable();
          //       //   this.form_ctrl_data[r].setValue(order_detail[r]);
          //       //   // this.ngZone.run(() => { this.form_ctrl_data[r].setValue(order_detail[r]);this.ref.detectChanges(); });
          //       //   this.form_ctrl_data[r].disable()
          //       // }else{
          //       //   this.form_ctrl_data[r].setValue(order_detail[r]);
          //       // }
          //       this.ref.detectChanges();
          //       this.ngZone.run(() => { this.form_ctrl_data[r].setValue(order_detail[r])});
          //       this.ref.detectChanges();
          //     }
          //   });
          //   this.ref.detectChanges();
          // }
 
          // if(this.db.hr_manager_role && this.doctype == 'Timesheet'){
          //   this.db.drop_down_value['employee'] = res.message.name
          //   this.db.drop_down_value['employee_name'] = res.message.employee_name
          //   this.formValues['employee'] = this.db.drop_down_value['employee']
          //   setTimeout(()=>{
          //     this.form_ctrl_data['employee_name'].patchValue((this.db.drop_down_value['employee_name'] && this.db.drop_down_value['employee_name'] != '') ? this.db.drop_down_value['employee_name'] : localStorage['employee_name'])
          //     this.ref.detectChanges();
          //   },700)
          // }

        } else {
          if (res && res._server_messages) {
            var d = JSON.parse(res._server_messages);
            var d1 = JSON.parse(d[0]);
            this.db.alert(d1.message);
          } else {
            this.db.alert('Something went wrong try again later');
          }
        }
      },
      (error) => {
        this.db.alert('Something went wrong try again later');
      }
    );
   }
  }


  setFormValues(res){
    let order_detail = res.message;
    let key = Object.keys(order_detail);
   

    if (key && key.length != 0) {
      key.map((r) => {
        if ((order_detail[r] && this.form_ctrl_data[r])) {
          this.form_data.get(r).setValue(order_detail[r]);
          // this.form_ctrl_data[r].setValue(order_detail[r]);
          // this.ngZone.run(() => { this.form_ctrl_data[r].setValue(order_detail[r])});
        }
      });
      this.ref.detectChanges();
    }

    if(this.db.hr_manager_role && this.doctype == 'Timesheet'){
      this.db.drop_down_value['employee'] = res.message.name
      this.db.drop_down_value['employee_name'] = res.message.employee_name
      this.formValues['employee'] = this.db.drop_down_value['employee']
      setTimeout(()=>{
        this.form_ctrl_data['employee_name'].patchValue((this.db.drop_down_value['employee_name'] && this.db.drop_down_value['employee_name'] != '') ? this.db.drop_down_value['employee_name'] : localStorage['employee_name'])
        // this.ref.detectChanges();
      },700)
    }

     if(this.doctype == 'Salary Slip'){
      let earnings = order_detail['earnings'] ? order_detail['earnings'] : '';
      if (earnings) {
        // this.form_ctrl_data['earnings'] = new FormControl(earnings);
        this.child_data['earnings'] = earnings;
        this.test_child_data = this.child_data;
      }

      let deductions = order_detail['deductions'] ? order_detail['deductions'] : '';
      if (deductions) {
        this.form_ctrl_data['deductions'] = new FormControl(deductions);
        this.child_data['deductions'] = deductions;
        this.test_child_data = this.child_data;
      }

    }

  }

  salary_count = ''
  getSalarySlipDetails(value){

    let datas = this.form_data.getRawValue();

    let data = { 
      data:datas,
      employee_id:value.name
    }
    
    if(this.salary_count == '' || this.salary_count != value.name){
      this.salary_count = value.name;
      setTimeout(()=>{
        this.db.salary_structure_details(data).subscribe((res:any) => {
          if (res && res.message && res.message.status && res.message.status == 'Success') {
            this.setFormValues(res.message);
          }else{
            this.db.sendErrorMessage(res.message.message);
          }
        },error=>{ this.db.alert('Something went wrong try again later') })
      },600)
    }
  }

  validate_link(name, value) {
    let data = {
      doctype: 'Address',
      docname: name,
      fields: ['gstin'],
    };
    this.db.validate_link(data).subscribe((res) => {
      if (res && res.message) {
        let gst_in = res.message.gstin ? res.message.gstin : '';
        this.form_ctrl_data[value].setValue(gst_in);
      }
    });
  }

  get_address_display(name, value) {
    let data = {
      address_dict: name,
    };
    this.db.get_address_display(data).subscribe((res) => {
      if (res.message) {
        this.form_ctrl_data[value].setValue(res.message);
      }
    });
  }

  tax_template(data, value, obj) {
    
    if (data.field_name == 'tc_name') {
      data.value = this.terms_value;
    }
      
    let datas = {
      field_name: obj.fieldname,
      value: data.name,
      company: this.form_ctrl_data && this.form_ctrl_data.company ? this.form_ctrl_data.company.value : null
    };
    this.db.tax_template(datas).subscribe((res) => {
      if (res.status == 'Success') {
        if (obj.fieldname == 'payment_terms_template') {
          this.child_data[value] = res.message;
          this.test_child_data = this.child_data;
          let datas = JSON.stringify(this.test_child_data[value]);
          this.form_ctrl_data[value].setValue(datas);
        } else if (res.message && res.message[0] && res.message[0][value]) {
          this.form_ctrl_data[value].setValue(res.message[0][value]);
        }
      }else if(res && res.message && res.message.status == 'Success'){
        let data = res.message.message
        data = (data.rate / 100) * this.form_ctrl_data.total.value;
        data = Number(data.toFixed(2));
        data = data + this.form_ctrl_data.total.value;
        // if(data && this.doctype != "Quotation"){
          this.form_ctrl_data.grand_total.setValue(data)
        // }
      }
    });
  }

  async open_drop_down_options(type, order_id) {
    let doctype = this.doctype;
    const modal = await this.modalCtrl.create({
      component: SalesOrderDetailsPage,
      cssClass: !this.db.ismobile ? 'sales_order_popup' : '',
      componentProps: {
        type: type,
        order_id: order_id,
        doctype: doctype,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data == 'success') {
      if (!this.db.ismobile) {
        this.db.alert('Updated Succesfully');
        // this.db.load_data_list = true;
        this.db.load_template_datas_list.next('Success');
        this.form_data.reset();
        this.db.drop_down_value = {};
        this.db.enabled_hidden_fields = false;
        this.modalCtrl.dismiss();
      }else{
        this.db.sendSuccessMessage('Updated Successfully');
        this.navigation();
        this.modalCtrl.dismiss('Success')
        this.form_data.reset();
      }
      this.save_details1('submit');
    }
  }

  async open_purchase_preview(type, order_id) {
    // const modal = await this.modalCtrl.create({
    //   component: ReceiptDetailsPage,
    //   cssClass: !this.db.ismobile ? 'sales_order_popup' : '',
    //   componentProps: {
    //     type: type,
    //     order_id: order_id,
    //   },
    // });
    // await modal.present();

    // const { data } = await modal.onWillDismiss();
    // if (data && data == 'success') {
    //   if (!this.db.ismobile) {
    //     this.db.alert('Updated Succesfully');
    //     this.db.load_data_list = true;
    //     this.db.load_template_datas_list.next('Success');
    //     this.form_data.reset();
    //     this.db.drop_down_value = {};
    //     this.modalCtrl.dismiss();
    //   }
    //   this.save_details1('submit');
    // }
  }

  load_items(obj) {
    if (obj.fieldname == 'items') {
      if (this.doctype == 'Sales Order') {
        let data = this.form_data.value;
        // this.db.customer_details['customer'] = data['customer'];
        if (!data['customer']) {
          this.db.alert('Customer. It is needed to fetch Item Details');
        } else if (!data['company']) {
          this.db.alert('Company. It is needed to fetch Item Details');
        } else {
          this.load_items_popup(obj);
        }
      } else if (this.doctype == 'Opportunity' || this.doctype == 'Quotation') {
        this.open_child_modal(obj.options, obj.fieldname);
      } else {
        this.load_items_popup(obj);
      }
    } else {
      this.load_items_popup(obj);
    }
  }

  async load_items_popup(obj) {
    // let edit_f_value = this.edit_form_values && this.edit_form_values[obj.fieldname]  ? this.edit_form_values[obj.fieldname] : undefined;
    // if (edit_f_value) {
    //   this.db.isNgCart == true;
    //   edit_f_value.map((res) => {
    //     res.count = res.quantity ? res.quantity : res.qty;
    //     res.quantity = res.quantity ? res.quantity : res.qty;
    //     res.cart_count = 1;
    //     this.ngcart.addItem(res);
    //   });
    //   this.db.cart_items = this.ngcart.TableCartItems('');
    //   this.db.cart_count = this.ngcart.getTableCartLength('');
    //   this.db.sub_total = this.ngcart.getTableCartTotal('');
    //   if (this.db.cart_items && this.db.cart_items.length == 0) {
    //   } else {
    //     edit_f_value.map((res: any) => {
    //       let check = this.db.cart_items.find(
    //         (r: any) => r.item_code == res.item_code
    //       );
    //       if (!check) {
    //         this.db.cart_items.push(res);
    //       }
    //     });
    //   }
    // }
    // const modal = await this.modalCtrl.create({
    //   component: ProductListPage,
    //   cssClass: !this.db.ismobile ? 'jobpplicant-popup' : '',
    //   // cssClass: !this.db.ismobile ? 'web_site_form' : '',
    //   componentProps: {
    //     type: 'form',
    //   },
    // });
    // await modal.present();
    // const { data } = await modal.onWillDismiss();
    // if (data && data == 'success') {
    //   if (this.db.cart_items && this.db.cart_items.length != 0) {
    //     let selected_items: any = [];
    //     this.db.cart_items.map((res: any) => {
    //       selected_items.push({
    //         item_name: res.item_name,
    //         item_code: res.item_code,
    //         qty: res.quantity,
    //         count: res.quantity,
    //         rate: res.rate,
    //         amount: res.quantity * res.rate,
    //         description: res.description,
    //         uom: res.uom ? res.uom : res.stock_uom,
    //         conversion_factor: 1,
    //       });
    //     });
    //     this.child_data[obj.fieldname] = selected_items;
    //     this.test_child_data = this.child_data;
    //     let datas = JSON.stringify(this.test_child_data[obj.fieldname]);
    //     this.form_ctrl_data[obj.fieldname].setValue(datas);
    //     let totalAmount = selected_items.reduce((acc: number, item: any) => acc + item.amount,  0 );
    //     this.Total_amount = totalAmount;
    //     this.info.map((res) => {
    //       if (res.fieldtype == 'Currency' && res.fieldname == 'total') {
    //         this.form_ctrl_data[res.fieldname].setValue(this.Total_amount);
    //         this.form_ctrl_data["grand_total"].setValue(this.Total_amount);
    //       }
    //     });
    //   }
    // }
  }


  checkcart(id: any) {
    // var cnt = 0;
    // if (this.db.isNgCart == true){
    //   this.db.cart_items.find((res) => {
    //     if (res['item_code'] == id) {
    //       cnt += res['quantity'];
    //     }
    //   });
    // }else{
    //   this.db.cart_items.find((res) => {
    //     if (res['product'] == id && res['is_free_item'] != 1) {
    //       cnt += res['quantity'];
    //     }
    //   });
    //  return cnt;
    // }
  }

  float_value(eve, each) {
    // console.log(eve,'eve')
    let data = this.form_data.value;
    let value = '';
    value = data['apply_discount_on'] ? data['apply_discount_on'] : '';

    let apply_discount_on = this.info.find((res) => {
      return res.fieldname == 'apply_discount_on';
    });

    if ( apply_discount_on &&(this.doctype == 'Purchase Receipt' ||this.doctype == 'Purchase Order') && each.fieldname == 'additional_discount_percentage') {
      if (eve && eve.target && eve.target.value) {
        apply_discount_on.reqd = 1;
        this.form_data.setControl('apply_discount_on', this.formBuilder.control(value, [Validators.required]));
      } else {
        apply_discount_on.reqd = 0;
        this.form_data.setControl('apply_discount_on',this.formBuilder.control(value));
      }
    }

    if(this.doctype == 'Supplier Registration' && each.fieldname == 'alternate_mobile_number'){
      if (eve && eve.target && eve.target.value) {
        let validator= [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]
        this.form_data.get(each.fieldname).setValidators(validator);
        this.form_data.get(each.fieldname).updateValueAndValidity();
      }else{
        this.form_data.get(each.fieldname).clearValidators();
        this.form_data.get(each.fieldname).updateValueAndValidity();
      }
    }

  }


  open_drop_down_option(type, fieldname, fieldname_value) {

    this.db.formStoreValues = this.form_data.getRawValue();

    


    if ( this.form_ctrl_data && this.form_ctrl_data.company && this.form_ctrl_data.company.value && this.doctype == 'Quotation' ) {
      this.store_company_name = this.form_ctrl_data.company.value;
    }
    this.db.select_options = '';
    if ( fieldname != 'default_account' && fieldname != 'reference_docname' && type == 'Doctype' && this.doctype == 'Opportunity' ) {
      type = this.opportunity_Value ? this.opportunity_Value : localStorage['opportunity_from'];
      let data = this.form_data.value;
      let selected_value = data[fieldname] ? data[fieldname] : '';
      this.db.open_drop_down_options(type, fieldname, fieldname_value, selected_value);
    } else if ( fieldname != 'default_account' && fieldname != 'reference_docname' && type == 'DocType' && this.doctype == 'ToDo') {
      let data = this.form_data.value;
      let selected_value = data[fieldname] ? data[fieldname] : '';
      this.db.select_options = type;
      this.db.event_list_form = true;
      this.db.open_drop_down_options( type, fieldname, fieldname_value, selected_value);
    }else if ( fieldname != 'default_account' && fieldname != 'reference_docname' && type == 'reference_type' ) {
      type = this.source_data;
      let data = this.form_data.value;
      let selected_value = data[fieldname] ? data[fieldname] : '';
      this.db.open_drop_down_options( type, fieldname,  fieldname_value, selected_value );
    }else if ( fieldname != 'default_account' && fieldname != 'reference_docname' && type == 'Doctype' ) {
      type = this.source_data;
      let data = this.form_data.value;
      let selected_value = data[fieldname] ? data[fieldname] : '';
      this.db.open_drop_down_options( type, fieldname,  fieldname_value, selected_value );
    } else if ( fieldname != 'default_account' && fieldname != 'reference_docname' && type == 'quotation_to') {
      localStorage['quotation_to'] = this.quotation_value;
      type = this.quotation_value ? this.quotation_value : localStorage['quotation_to'];
      let data = this.form_data.value; 
      let selected_value = data[fieldname] ? data[fieldname] : '';
      this.db.open_drop_down_options( type, fieldname, fieldname_value, selected_value );
    } else if (fieldname != 'default_account' && fieldname != 'reference_docname' && type == 'Address') {
      let selected_value = this.sales_Address ? this.sales_Address : this.edit_form_values ? this.edit_form_values.name : fieldname == 'customer_address' ? this.store_customer_name : fieldname == 'company_address' ? this.store_company_name : null;
     
      this.db.open_drop_down_options( type, fieldname, fieldname_value, selected_value );
    } else if (fieldname == 'grievance_against') {
      type = this.grievance_against_party;
      this.db.open_drop_down_options(type, fieldname, fieldname_value, '');
    } else if (fieldname == 'party_type') {
      type = 'Party Type';
      this.db.open_drop_down_options(type, fieldname, fieldname_value, '');
    } else if (type == 'party type' && fieldname == 'party') {
      type = this.source_data
      this.db.open_drop_down_options(type, fieldname, fieldname_value, '');
    }else if ( fieldname != 'default_account' && fieldname != 'reference_docname') {
      let data = this.form_data.value;
      let selected_value = data[fieldname] ? data[fieldname] : '';
      this.db.select_options = type;
      this.db.open_drop_down_options( type, fieldname, fieldname_value, selected_value);
    }
  }

  select_value(event: any) {
    const inputElement = event.target.querySelector(
      'input'
    ) as HTMLInputElement;
    inputElement.blur();
  }

  save_comment() {
    if (this.inputValue) {
      this.Send_message = true;
      this.db.loader = true;
      let data = {
        doctype: 'CRM Note',
        note: this.inputValue,
        added_by: localStorage['customerRefId'],
        added_on: this.changedDate,
        parent: this.sale_order_id,
        parenttype: this.doctype,
        parentfield: 'notes',
        name: this.comment_id ? this.comment_id : null,
      };
      this.db.inset_docs({ data: data }).subscribe(async (res) => {
        if (res && res.message) {
          this.Send_message = false;
          this.db.loader = false;
          delete this.comment_id ? this.comment_id : null;
          this.enable_comment = true;
          this.inputValue = '';
          await Keyboard.hide();
        }
      });
    } else {
      this.db.sendErrorMessage('Please Enter Your Comment');
    }
  }

  async delete_event(item) {
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Are you sure do you want to Delete..?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {},
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
        let value = {
          name: this.sale_order_id,
          doctype: this.doctype,
        };
        this.db.doc_detail(value).subscribe((res) => {
          if(res && res.message){
            this.edit_form_values = res.message;
            if (this.edit_form_values && this.edit_form_values.events) {
              this.edit_form_values.events.sort((a, b) => {
                const dateA = new Date(a.starts_on);
                const dateB = new Date(b.starts_on);
                return dateB.getTime() - dateA.getTime();
              });
            }
          }
        });
        this.db.sendSuccessMessage(res.message);
        loader.dismiss()
      }
    });
  }

  async edit_event(item: any) {
    // this.db.store_old_id = this.sale_order_id;
    const modal = await this.modalCtrl.create({
      component: EditFormsPage,
      cssClass: this.db.ismobile ? 'crm-edit-event' : 'web_site_form',
      componentProps: {
        name: item.name,
        page_route: 'event',
        page_name: 'Event',
        page_route_name: 'event',
        title: 'Edit Event',
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.enable_activities = true;
    if(data && data.status && data.status == 'Success'){
      this.db.loader = false;
      let doc = {
        name: this.sale_order_id,
        doctype: this.doctype,
      };
      this.db.doc_detail(doc).subscribe((d) => {
        this.edit_form_values = d.message;
        if (this.edit_form_values && this.edit_form_values.events) {
          this.edit_form_values.events.sort((a, b) => {
            const dateA = new Date(a.starts_on);
            const dateB = new Date(b.starts_on);
            return dateB.getTime() - dateA.getTime();
          });
        }
      });
    }
  }

  async lead() {
    // const modal = await this.modalCtrl.create({
    //   component: ActionComponent,
    //   cssClass: 'job-detail-popup',
    //   componentProps: {
    //     data: this.doctype,
    //     val: 'assigned',
    //     selected: this.edit_form_values.status,
    //   },
    // });
    // await modal.present();
    // const { data } = await modal.onWillDismiss();
    // if (data) {
    //   this.lead_data = data.name;
    //   this.change_status.emit(this.lead_data);
    // }
  }


  changeListener1($event: any) {
    this.image_field_check = 'false';
    this.base64($event.target);
  }

  async base64(inputValue: any): Promise<void> {
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
          // decode: "True",
        };

        let array_image: any = [];
        array_image.push(img_data);
        if (file_size <= 10000000) {
          //10Mb in BYtes

          let img_data = {
            file_name: this.categoryfile,
            content: this.categoryimagedata,
          };
          this.multiple_array.splice(0, 0, img_data);
        } else if (file_size > 10000000) {
          //10Mb in bytes
          this.db.filSizeAlert();
        } else if (file_size == 0) {

        }
        this.upload_file(img_data);
      };
      myReader.readAsDataURL(file);
    }
  }

  async upload_file(img_data) {
    let loader;
    loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    await loader.present();
    let data = {
      file_name: img_data.file_name,
      content: img_data.content,
      is_private: 0,
      doctype: 'File',
      attached_to_doctype: localStorage['docType'],
      attached_to_name: this.sale_order_id,
      decode: true,
    };
    this.db.inset_docs({ data: data }).subscribe((res) => {
      loader.dismiss();
      if (res && res.message && res.message.status == 'Success') {
        this.get_image_list();
        this.db.sendSuccessMessage('Image Uploaded Successfully')
        this.modalCtrl.dismiss();
      } else {
        this.db.alert('Something went wrong try again later');
      }
    });
  }

  openFileInput() {
    this.file_upload.nativeElement.click();
  }

  test_navigate() {
    let item = '/forms/quotation';
    this.router.navigateByUrl(item);
  }


  filter_status(event: any) {
    this.detail = event.detail.value;
  }

  get_image_list() {
    let data = {
      doctype: 'File',
      fields: ['file_url', 'name'],
      filters: {
        attached_to_doctype: localStorage['docType'] ? localStorage['docType'] : this.doctype,
        attached_to_name: this.reference_id ? this.reference_id : this.sale_order_id,
        // attached_to_name: this.sale_order_id ? this.sale_order_id : this.image_id,
      },
    };
    this.db.get_list(data).subscribe((res) => {
      if (res && res.message) {
        // this.db.selectedImages = res.message;
        this.multiple_array = res.message
      }
    });
  }

  page_title: any;
  page_route: any;

  async open_route(data) {
    const modal = await this.modalCtrl.create({
      component: WebsiteFormsComponent,
      cssClass: !this.db.ismobile ? 'web_site_form' : '',
      componentProps: {
        page_title: data,
        page_route: data,
      },
    });
    await modal.present();
  }

  backbtn() {
   this.modalCtrl.dismiss();
  }

  addRow(each) {
    
    if (each.options == 'Items') {
      this.load_items(each);
    } else if ( this.doctype == 'Opportunity' ||  each.options == 'Opportunity Item' || each.options == 'Sales Order Item JSON' ||  each.options == 'Sales Invoice Item' || each.options == 'Opportunity Item JSON' ) {
      this.load_items_popup(each);
    } else if(this.doctype == 'Timesheet' && this.page != 'Timesheet'){
      //!this.db.ismobile &&  && this.db.employee_role
      this.openTimeSheet()
    } else {
      this.open_child_modal(each.options, each.fieldname);
    }
  }

  change_header(data) {
    if (data) {
      if (data.includes('-')) {
        data = data.replace('-', ' ');
      }
    }
    return data;
  }

  get_leave_approver(id) {
    let data = {
      doctype: 'Leave Applicaion',
      employee_id: id,
    };
    this.db.get_leave_approver(data).subscribe((res) => {
      if (res && res.status && res.status == 'Success') {
        let leave_approver = res.message;
        this.leave_approver = leave_approver.leave_approver;
        this.leave_approver_name = leave_approver.leave_approver_name;
        this.form_ctrl_data ? this.form_ctrl_data['leave_approver'].setValue(this.leave_approver) : null;
        this.form_ctrl_data ? this.form_ctrl_data['leave_approver_name'].setValue(this.leave_approver_name): null;
      } else {
        this.db.alert('Failed');
      }
    });
  }

  close_detail() {
    if(this.modal){
      this.modalCtrl.dismiss();
    }else {
    this.db.enable_detail = false;
    this.db.enable_material = false;
    let currentUrl = this.router.url;
    let urls = currentUrl.split('/');
    if(urls && urls.length == 4){
      currentUrl = urls[1] + '/' + urls[2]; 
    }
    // window.history.pushState('', '', currentUrl + '/' + data.name);
    this.location.replaceState(currentUrl);
    this.db.detail_route_bread = "";

    if(this.callListApi){
      this.db.clearFilterAccess = true;
      this.db.clearSearchFilterInList.next('Success')
    }

    if(this.doctype == 'Bug Sheet'){
      this.db.profile_side_menu = false;
    }
   }
  }

  get_datetime(eve) {}

  toggleTimer() {
    if (this.isTimerRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.startTime = moment(this.selectedStartTime);
    this.elapsedTime = moment.duration(0);

    this.timerInterval = setInterval(() => {
      this.elapsedTime = moment.duration(moment().diff(this.startTime));
    }, 1000);

    this.isTimerRunning = true;
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.stopTime = moment();
    this.isTimerRunning = false;
  }

  send_details() {
    let data = this.form_data.value;
    if (data.whatsapp_no) {
      let message = encodeURIComponent(data.message); // Encode your message
      let url = `https://api.whatsapp.com/send?phone=${data.whatsapp_no}&text=${message}`;
      window.open(url, '_system');
    } else {
      this.db.alert_animate.next('Please Enter Your Number');
    }
  }

  // @HostListener('document:keyup', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (event.ctrlKey && event.key == 's') {
  //     event.stopPropagation();
  //     // Submit the form
  //     this.save_details1('');
  //   }
  // }


  editFormDetail(){
    if(this.web_form && this.web_form.route){
      this.web_form.name = this.web_form.doc_type
      this.modalCtrl.dismiss();
      
      if(this.db.ismobile){
        // this.router.navigateByUrl('/forms/' + this.web_form.route);
        this.open_routes(this.web_form)
      }else{
        this.open_routes(this.web_form)
      }
    }
  }

  async open_routes(data: any) {
    if(data.name){
        this.openWebFormPopup(data);
    }
  }

  async openWebFormPopup(data){
    
    setTimeout(()=>{
      this.db.SubjectEvent = false;
    },1000)

    this.db.duplicate_drop_down_value = this.db.drop_down_value
    this.db.drop_down_value = {};

    const modal = await this.modalCtrl.create({
      component: WebsiteFormsComponent,
      // web_site_form
      cssClass: (data.name == 'Lead' || data.name == 'Opportunity' || data.name == 'Quotation' || data.name == 'Customer') ? 'Crm_site_form': 'childTablecss',
      componentProps: {
        page_title: data.doc_type,
        page_route: data.route,
        edit_form_values: undefined,
        edit_form: undefined,
        enable_reference: false,
        enabled_read_only: false,
        modal:true,
        enable_height : (data.name == 'Lead' || data.doctype == 'Opportunity' || data.doctype == 'Quotation' || (data.doctype == 'Customer' || data.name == 'Customer')) ? true : false
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();

    this.db.SubjectEvent = true;

    this.db.drop_down_value = this.db.duplicate_drop_down_value
    this.db.duplicate_drop_down_value = {};

    // console.log(val)
    if ((val && val.data == 'Success' || (val && val.data && val.data.status && val.data.status == 'Success'))) {

      if(val && val['doc_type'] && val['doc_type'] == 'Task'){
        let object = { data:'loadTask'}
        this.db.loadTask.next(object)
      }else if(val && val['data'] && val['data']['data'] && val['data']['data']['doctype'] == 'Task'){
        let object = { data:'loadTask'}
        this.db.loadTask.next(object)
      }
      //  this.get_tempate_and_datas(this.doc_type);
    }
  }

  date_format(){
    if (this.edit_form_values && this.edit_form_values.events) {
      this.edit_form_values.events.sort((a, b) => {
        const dateA = new Date(a.starts_on);
        const dateB = new Date(b.starts_on);
        return dateB.getTime() - dateA.getTime();
      });
    }
  }

  get_project_name(data){
    // let datas = {
    //   name : data
    // }
    // this.db.get_project_name(datas).subscribe(res => {
    //   if(res && res.status == "success"){
    //     this.project_name = res.message
    //     this.form_ctrl_data['project'].setValue(this.project_name)
    //   }
    // })
  }

  get_rating(rating,each){
    // console.log(each,"each")
    this.rating_value = rating;
    this.form_ctrl_data['feedback_rating'] ? this.form_ctrl_data['feedback_rating'].setValue(this.rating_value) : this.form_ctrl_data[each.fieldname].setValue(this.rating_value)
    
    if(this.rating_value){
      this.info.map((res:any, i) => {
        if(res.fieldname == 'feedback'){
          res.reqd = 1;
          this.form_data.setControl(res.fieldname,this.formBuilder.control('', [Validators.required]));
        }
      })
    }

    let data = {
      "doctype": "HD Ticket Feedback Option",
      "fields": ["name","label"],
      "filters": {"rating": this.rating_value},
      "start": 0,
      "limit": 99999,
      "limit_start": 0,
      "limit_page_length": 99999,
      "debug": 0
    }
    this.db.get_rating_list(data).subscribe(res => {
      // console.log("Rating List: ",res.message)
      if(res && res.message && res.message.lenth != 0){
        this.rating_feedback_option =  res.message
      }else{
        this.rating_feedback_option = [];
      }
    })
  }

  rating_select_option(data,index){
    this.rating_feedback_option.map((res,i) => {
      if (i == index) {
        res['isSelect'] = true;
      } else {
        res['isSelect'] = false;
      }
    })
    this.selected_option_value = data.label
    this.form_ctrl_data['feedback'].setValue(this.selected_option_value)
    this.form_data.setControl('feedback',this.formBuilder.control('', null));
  }


  // CRM by john
  //addtocart
  add_cart(data:any) {
    // data.count = this.db.plusCount(data.count);
    data.temp_disabled = true
    data.disable_add_to_cart_button = 1

    data.count = data.count + 1;
    data.cart_count = data.count;

    setTimeout(()=>{
      data.temp_disabled = false
      data.disable_add_to_cart_button = 0
      this.addtocart(data);
    },800)

  }

  async clearCartItem(item){
    // console.log(item,'clearCartItem item')
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Are you sure do you want to Delete..?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {},
        },
        {
          text: 'Ok',
          handler: () => {
            this.ngcart.emptyCart()
            setTimeout(() => {
              this.get_cart_item()
            }, 400);
          },
        },
      ],
    });
    await alert.present();
    
  }

  //Remove Cart
  async removetocart(data:any) {
    // data.count = data.count - 1;

    data.temp_disabled = true
    data.disable_add_to_cart_button = 1
    if((data.count - 1) == 0){
      data.count = undefined;
      // this.get_recommeded() 
      let datas = JSON.stringify(this.test_child_data['items'])
      setTimeout(()=>{
        data.temp_disabled = false
        data.disable_add_to_cart_button = 0
        this.ngcart.removetocart_item(data)
      },800)
      this.get_cart_item()
      this.test_child_data['items'] = JSON.parse(datas)
      for(let i = 0; i < this.test_child_data['items'].length ; i++){
        // this.test_child_data['items'][i]['count'] = this.db.cart_items[i]['quantity']
        if(this.test_child_data['items'][i]['item_name'] == data.item_name){
          this.test_child_data['items'].splice(i,1)
        }
      }
      
    }else{
      data.count = data.count - 1;
      data.cart_count = data.count;
      setTimeout(()=>{
        data.temp_disabled = false
        data.disable_add_to_cart_button = 0
        this.addtocart(data)
      },800)
      
    }


   
  }

  addtowish(value:any){
    if(value.wish_count != 0){
      // this.db.removewish(value)
    } else if(value.wish_count == 0){
      if(value.product_attributes.length == 0) {
        // this.db.addtowish(value);
      } else {
         this.router.navigateByUrl('/pr/'+value.route);
      }
    }
  }

  async addtocart(value:any) {
    // if (this.db.isNgCart == true) {
    //   if (value.ids == undefined) {
    //     value.ids = '';
    //     value.selected_attribute = ''
    //   }
    //   // if (value.product_attributes.length == 0) {
    //     value.quantity = value.cart_count
    //     // value.qty = value.cart_count
    //     value.id = value.name;
    //     value.title = value.item;
    //     if (value.discount_price) {
    //       value.minprice = value.discount_price;
    //       value.prices = value.discount_price;
    //     }
    //     else {
    //       value.minprice = value.price;
    //       value.prices = value.price;
    //     }
    //     // this.ngcart.addItem(value, value.cart_count, value, '', '', '', '')
    //     this.ngcart.addItem(value)
    //     this.db.cart_items = this.ngcart.TableCartItems('')
    //     // console.log(this.db.cart_items)
    //     // this.db.sub.next('cart emitted');
    //     // this.get_recommeded();

        
    //     let totalAmount = 0;
    //     for(let i = 0; i < this.test_child_data['items'].length ; i++){
    //       // this.test_child_data['items'][i]['count'] = this.db.cart_items[i]['quantity']
    //       totalAmount += (this.test_child_data['items'][i]['rate'] * this.test_child_data['items'][i]['count'])
    //     }
  
    //       if(this.doctype == 'Quotation'){  
    //       this.form_ctrl_data['total'].setValue(totalAmount);
    //       this.form_ctrl_data['grand_total'].setValue(totalAmount)
    //     }

    //     // setTimeout(()=>{
    //       // this.get_cart_item()
    //     // },800)
    //   // } 
    // }
    
  }

  get_cart_item() {
    // if (this.db.isNgCart == true) {
    //   this.db.cart_items = this.ngcart.TableCartItems('')
    //   this.test_child_data['items'] = this.db.cart_items
      
    //   // console.log(this.db.cart_items,'this.db.cart_items')

    //   // let totalAmount = 0;
    //   // for(let i = 0; i < this.test_child_data['items'].length ; i++){
    //   //   this.test_child_data['items'][i]['count'] = this.db.cart_items[i]['quantity']
    //   //   totalAmount += (this.test_child_data['items'][i]['rate'] * this.test_child_data['items'][i]['count'])
    //   // }

    //   //   if(this.doctype == 'Quotation'){  
    //   //   console.log(this.form_ctrl_data,'this.form_ctrl_data before')

    //   //   this.form_ctrl_data['total'].setValue(totalAmount);
    //   //   this.form_ctrl_data['grand_total'].setValue(totalAmount)
    //   //   console.log(this.form_ctrl_data,'this.form_ctrl_data after')
    //   // }
    //   // console.log(this.db.cart_items);
    //   // this.db.sub.next('cart emitted');
    //   // this.get_recommeded();

      
    // }
    
  }

  async assign_user(){
    const modal = await this.modalCtrl.create({
      component: UserListPage,
      cssClass: this.db.ismobile ? 'user_list' : 'web_site_form',
      componentProps : {
        order_id : this.edit_form_values.name,
        user_list : this.edit_form_values && this.edit_form_values.share_with && this.edit_form_values.share_with.length != 0 ? this.edit_form_values.share_with : [],
        doctype:'Bug Sheet',
        share_with: true
      }
    });
    await modal.present();
    // let data: any = await modal.onWillDismiss();
    // if(data){
    //   this.get_assigned_to()
    // }
  }

  createEmployeeTask(data){
    // data.doctype = this.doctype;
    // this.db.create_employee_task({data: data, user_id: this.db.createEmployeeTask}).subscribe(res => {
    //   if(res && res.message && res.message.status && res.message.status == 'Success'){
    //     this.db.updateTaskList = true;
    //     this.db.sendTaskSubmit.next('Success')
    //     this.db.sendSuccessMessage(res.message.message)
    //     this.modalCtrl.dismiss('Success')
    //   }else{
    //     if (res._server_messages) {
    //       var d = JSON.parse(res._server_messages);
    //       var d1 = JSON.parse(d);
    //       this.db.sendErrorMessage(this.stripHtmlTags(d1.message));
    //     } else {
    //       let alert = (res && res.message && res.message.message) ? res.message.message : 'Something went wrong try again later'
    //       this.db.sendErrorMessage(alert);
    //     }
    //   }
    //   this.db.createEmployeeTask = undefined;
    // })
  }

  get_hidden(item:any,section:any){
    // console.log(section)  (section_break_data && section_break_data[section] && section_break_data[section].length == 0) && 
    let value = true;
    let count = 0;
    if(item && item[section] && item[section].length > 0){
        for (let i = 0; i <  item[section].length; i++) {
        // console.log(item[section][i])
        // console.log(item[section][i].hidden == 1 || ((item[section][i].fieldname == 'completed_by' || item[section][i].fieldname == 'completed_on') && !this.completed_by_on))
        if(item[section][i].hidden == 0){
          value = false;
          break;
        }
        else{
          value = item[section][i].hidden == 1 || ((item[section][i].fieldname == 'completed_by' || item[section][i].fieldname == 'completed_on') && !this.completed_by_on)
          if(value)
            count += 1 
        }
      }
    }
    else
      value = false;
    if(count == item[section].length){
      value = true;
    }
    return value;
  }

  changeListenerBugSheet($event, each) {
    this.image_field_check = 'false';
    this.base64_($event.target);
  }

  async base64_(inputValue: any): Promise<void> {
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
          // decode: "True",
        };

        let array_image: any = [];
        array_image.push(img_data);
        if (file_size <= 10000000) {
          //10Mb in BYtes

          let img_data = {
            file_name: this.categoryfile,
            content: this.categoryimagedata,
          };
          this.multiple_array.splice(0, 0, img_data);
        } else if (file_size > 10000000) {
          //10Mb in bytes
          this.db.filSizeAlert();
        } else if (file_size == 0) {

        }
        this.upload_file(img_data);
      };
      myReader.readAsDataURL(file);
    }
  }

  async remove_img(imgs,i){
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Are you sure do you want to Delete..?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => { }
        },
        {
          text: 'Ok',
          handler: () => {
            this.delete(imgs,i)
          }
        }
      ]
    })
    await alert.present();
    
  }

  delete(imgs,index){
    let data = {
      doctype: "File",
      filters: {name: imgs.name}
      }
      this.db.delete_docs(data).subscribe(res => {
        // console.log(res)
        if(res && res.status == "Success"){
          this.db.alert(res.message)
          this.multiple_array.splice(index, 1)
          // this.get_image_list();
          // this.modalCtrl.dismiss()
        }
      })
  }

  selectAdvances(event, data, array, index){
    event.stopPropagation();

   if(data.allocated_amount >= 0){

    //  if(data.allocated_amount_){
    //   data.selected = data.selected ? false : true;
    //  }else{
    //   data.selected = false;
    //  }

    data.selected = data.selected ? false : true;

     if(data.allocated_amount > 0){
       data.allocated_amount_ = data.allocated_amount
       data.allocated_amount = 0
     }else{
       data.allocated_amount = data.allocated_amount_
     }
   }else{
    data.selected = data.selected ? false : true;
   }

   let grand_total = this.form_data.get('grand_total').value;
   let total_claimed_amount = this.form_data.get('total_claimed_amount').value;
   
   let Total = 0;

   if(grand_total == 0){
    Total = Number(data.allocated_amount_ ? data.allocated_amount_ : 0)
   }else{
    if(data.selected){
      Total = Number(grand_total) - Number(data.allocated_amount_ ? data.allocated_amount_ : 0)
     }else{
      Total = Number(grand_total) + Number(data.allocated_amount_ ? data.allocated_amount_ : 0)
     }

    // if(Total >= total_claimed_amount){
    //   Total = grand_total
    // }

   }
     
   

   this.form_ctrl_data['grand_total'].setValue(Total);
  }

  roundof_val(data){
    let date = new Date(data)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }


  datePickerChange(eve){
    if(eve.each){
      // console.log(eve,"eve form")
      this.form_ctrl_data[eve.each.fieldname].setValue(eve.value)
      // this.form_data.value[eve.each.fieldname] = eve.value
      this.form_data.patchValue({
        [eve.each.fieldname]: eve.value
      });

      this.datePicker(eve, eve.each)
      
    }
  }

  downloadLetter(eve,each){
    eve.stopPropagation();
    console.log(each,'each')
    // this.db.downloadAndOpenPdf(this.db.baseUrl + each.file_url,'Sample')
    // const apiKey = localStorage.getItem('api_key');
    // this.httpHeaders = new HttpHeaders({
    //   Authorization: `Bearer ${apiKey}`, // Add your API key as a bearer token
    //   'Content-Type': 'application/json', // Content type
    //   'Access-Control-Allow-Origin': '*', // Allow all domains (this needs server support)
    //   'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allowed methods
    //   'Access-Control-Allow-Headers': 'Authorization, Content-Type', // Allowed headers
    //   'Access-Control-Allow-Credentials': 'true', // Allow credentials if needed
    // });

    // this.httpOptions = { headers: this.httpHeaders };

    const fileUrl = 'https://dev-chola.tridotstech.com/files/sample.pdf';

    // Make the HTTP GET request with 'responseType' as 'blob'
    this.http.get(fileUrl, { headers: this.httpHeaders, responseType: 'blob' }).subscribe({
      next: (blob) => {
        this.triggerDownload(blob, 'sample.pdf');
      },
      error: (err) => {
        console.error('File download error:', err);
      },
    });
  }

  triggerDownload(blob: Blob, fileName: string) {
    const downloadLink = document.createElement('a');
    const url = window.URL.createObjectURL(blob);

    downloadLink.href = url;
    downloadLink.download = fileName; // Set the file name
    document.body.appendChild(downloadLink); // Append to body for Firefox support
    downloadLink.click();
    document.body.removeChild(downloadLink); // Remove after click
    window.URL.revokeObjectURL(url); // Clean up
  }

}
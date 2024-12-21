import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, ViewChild, Type, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Geolocation, GeolocationOptions, Geoposition } from '@awesome-cordova-plugins/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
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
import { TagsComponent } from '../../CRM/tags/tags.component';
import { UserListPage } from 'src/app/pages/user-list/user-list.page';
import { FormsPage } from 'src/app/pages/forms/forms.page';
// import { ActionComponent } from '../../CRM/action/action.component';
// import { CrmCommentComponent } from '../../CRM/crm-comment/crm-comment.component';
import { WebsiteFormsComponent } from 'src/app/components/forms/website-forms/website-forms.component';
import { AttachmentsComponent } from 'src/app/components/customer-details/attachments/attachments.component';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { ShowImageComponent } from '../../show-image/show-image.component';

@Component({
  selector: 'app-wizard-forms',
  templateUrl: './wizard-forms.component.html',
  styleUrls: ['./wizard-forms.component.scss'],
})
export class WizardFormsComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() web_form;
  @Input() new_form;
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
  @Input() enable_create_option;
  @Input() registerCss;
  @Input() action_meet;
  @Output() lead_tabs = new EventEmitter<any>();
  @Output() scrollToTop = new EventEmitter();
  @Output() goto_rating = new EventEmitter();
  @ViewChild('formDirective') private formDirective!: NgForm;
  @ViewChild('customInput', { static: false }) customInput!: ElementRef;
  @ViewChild(IonContent) content!: IonContent;
  @ViewChild('addresstext') addresstext!: ElementRef;
  @Output() onClose = new EventEmitter();
  @Output() open_pop_up = new EventEmitter();
  @Output() change_status = new EventEmitter<any>();
  @ViewChild('file_upload', { static: false }) file_upload!: ElementRef<HTMLInputElement>;
  @Output() scroll_to_top = new EventEmitter();
  @Output() updateDetails = new EventEmitter();

  // @Input() enable_leadcomment = false;
  // @Input() enable_activities = false;

  @Input() enable_leadcomment;
  @Input() enable_activities;
  @Input() popup_centre;
  @Input() modal;

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
  alert_animate = false;
  next_form_value = false;
  sub1: any;
  editorConfig = {
    toolbar: [
      // ['bold', 'italic', 'underline'],  // Include only bold, italic, and underline
    ],
  };
  assign_to = false;
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

  constructor( public location: Location, private http: HttpClient, public ref: ChangeDetectorRef, public db: DbService, public ngcart: CartService, private formBuilder: FormBuilder, public alertController: AlertController, public modalCtrl: ModalController,  public router: Router,  public route: ActivatedRoute, private loadingCtrl: LoadingController, private geolocation: Geolocation, private platform: Platform, private datePipe: DatePipe) {}

  ngOnInit() {
    // console.log(this.db.form_values)
    // console.log(this.db.store_address_customer_id)
    // console.log(this.new_form)
    // console.log(this.enabled_read_only)
    // console.log(this.edit_form_values)
    // console.log(this.edit_values)
    // console.log(this.forms_route)
    // console.log(this.forms_route)
    // console.log(this.sale_order_id)
    // console.log(this.web_forms)
    // console.log(this.forms_route)
    // console.log(this.enable_height)
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
    

    this.route.paramMap.subscribe((res) => {
      if (res && res['params']) {
        this.Convert_route = res['params'].route_1 ? res['params'].route_1 : res['params'].id;
      } 
    });
    // console.log(this.edit_form_values)
    if ( !this.edit_new_form && this.edit_form_values && this.edit_form_values.title !='New Opportunity' && (this.forms_route == 'Lead' || this.forms_route == 'Opportunity' || this.forms_route == 'lead' || this.forms_route == 'opportunity') ) {
      if (this.edit_form_values && this.edit_form_values.status) {
        this.tabs_array = [
          { name: 'Summary', route: 'Summary', value: 'Summary' },
          { name: 'Info', route: 'lead', value: 'lead' },
          { name: 'Notes', route: 'comment', value: 'comment' },
          { name: 'Tasks', route: 'activities', value: 'activities' },
          { name: 'Meetings', route: 'activities', value: 'activities' },
        ];
      }
    }
    this.db.all_link_opts = {};
    // this.db.customer_details = {};
    this.clear_cart();
    if (this.forms_route) {
      this.form_loader = true;
      // console.log(this.loader_f)
      // console.log(this.enable_activities)
      // if(this.loader_f){
      // this.doctype = this.load_doc;
      // this.enable_activities = true;
      // this.edit_form_values= true;
        // this.menu_name('Summary');
      // }
      if (this.forms_route == 'Lead' && !this.loader_f) {
        this.forms_route = 'lead';
        this.get_image_list();
        this.get_comment_list();
        this.get_assigned_list();
      } 
      this.get_form(this.forms_route);
    } else {
      this.get_form_values();
    }

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 100,
      allowSearchFilter: true,
    };

    // this.destroy = this.db.map_fields_get.subscribe(res => {
    //   if (res && res == 'get_values') {
    //     this.get_map_values();
    //   }
    // })

    this.db.custom_form_update.subscribe((res) => {
      if (res && res == 'custom_field') {
        if (this.db.customize_form_details) {
          this.web_form = JSON.parse(localStorage['form_json']);
          this.get_form_values();
        }
      }
    });

    // next_previous
    this.sub = this.db.next_previous.subscribe((res) => {
      this.edit_form_values._user_tags = [];
      this.next_value = res;
      if (res && res == 'next_previous') {
        let next_pre = JSON.parse(localStorage['Next_Detail']);
        this.web_form = JSON.parse(localStorage['form_json']);
        if ( next_pre && next_pre.next_type && next_pre.next_type == 'next_detail' ) {
          if (this.profile_menu && this.profile_menu.length != 0) {
            let obj = this.profile_menu[0];
            this.db.tab_buttons(this.profile_menu, obj['name'], 'name');
          }
          this.navigation_count = 0;
          this.profile_menu = [];
          delete next_pre.next_type;
          this.enable_reference = next_pre.enable_reference;
          this.reference_id = next_pre.sale_order_id;
          this.sale_order_id = next_pre.order_id;
          this.enabled_read_only = next_pre.enabled_read_only;
          delete next_pre.enable_reference;
          delete next_pre.sale_order_id;
          delete next_pre.order_id;
          delete next_pre.enabled_read_only;
          this.edit_form_values = next_pre;
          if (this.doctype == 'Lead' || this.doctype == 'Opportunity') {
            this.menu_name('Summary');
            this.get_comment_list();
            this.get_assigned_list();
            this.get_image_list();
          }
          this.get_form_values();
        }
      }
    });

      // this.db.go_to_lead_detail.subscribe(res => {
        // if(this.db.lead_detail && res){
        //   localStorage['tab_value'] = res;
        //   this.lead_tab_name = res;
        //   if(res == 'Summary' || res == 'Tasks' || res == 'Meetings'){
        //     this.enable_activities = true;
        //     this.enable_leadcomment = false;
        //   } else if(res == 'Info'){
        //       this.enable_leadcomment = false;
        //       this.enable_activities = false;
        //   }else if(res == 'Notes'){
        //     this.enable_leadcomment = true;
        //     this.enable_activities = false;
        //   } 
        // } else {
        //   this.lead_tab_name = res;
        // }
      // })
    // this.sub = this.db.select_drop_down.subscribe((res: any) => {
    //   console.log('1234',res)
    //   // this.ng_select_change(eve, obj)
    // })

    this.sub = this.db.select_drop_down.subscribe((res: any) => {
      this.db.drop_down_value[res.fieldname] = res.label
      this.db.drop_down_value[res.fieldname + 'name'] = res.name

      if (res.fieldname == 'suggestions') {
        this.selected_value(res);
      } else if (res) {
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
        }else if(res.fieldname == 'raised_by' && this.doctype == 'Employee Grievance'){
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
        }
        this.form_ctrl_data && this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(res.name) : '';
        if ( (res.fieldname == 'project' && this.doctype == 'Sales Order') || res.fieldname == 'cost_center' || res.fieldname == 'project' || res.fieldname == 'payable_account' || res.fieldname == 'advance_account' || res.fieldname == 'parent_project' || res.fieldname == 'salary_structure' || res.fieldname == 'employee' || res.fieldname == 'leave_allocation' || res.fieldname == 'issue' || res.fieldname == 'department' || res.fieldname == 'project' || res.fieldname == 'parent_task' || res.fieldname == 'customer' || res.fieldname == 'customer_address') {
          // this.db.drop_down_value[res.fieldname] = res.name;
          // this.form_ctrl_data[res.fieldname].setValue(res.name);
          this.form_ctrl_data[res.fieldname].setValue(res.label ? res.label : res.address);
          this.formValues[res.fieldname] = res.name ? res.name : res.address;
        } else {
          this.form_ctrl_data[res.fieldname].setValue(res.label);
          this.formValues[res.fieldname] = res.name ? res.name : res.label ? res.label : res.address;
          // console.log(res.fieldname)
          // console.log(res.label)
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
          this.doctype != 'Material Request' && this.form_ctrl_data ? this.form_ctrl_data[res.fieldname].setValue(res.label) : null;
        }

        if (res.fieldname == 'tc_name' && (this.doctype == 'Material Request' || this.doctype == 'Sales Order')) {
          let set_field = 'terms';
          this.terms_value = res.name;
          this.tax_template(res, set_field, res);
        } else if ( res.fieldname == 'material_request_type' && this.doctype == 'Material Request' && this.db.enabled_hidden_fields ) {
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
        } else if ( (res.fieldname == 'employee' || res.fieldname == 'expense_approver') && res.label != 'ALL' && this.db.selecting_drop_down) {
          this.get_claim_details(res);
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
      }
      this.db.selecting_drop_down = false;
    });

    if ( this.edit_form_values && this.edit_form_values._user_tags && this.edit_form_values._user_tags.length != 0 ) {
      this.tag_filter(this.edit_form_values);
    } else if ( this.edit_form_values && !this.db.ismobile && this.db.verify_key ) {
      this.tag_filter(this.edit_form_values);
    }
    // console.log(this.edit_form_values)
    // console.log(this.forms_route)
    // console.log(this.edit_values)
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

    if(this.edit_form_values && this.edit_form_values.notes){
      this.lead_comments = this.edit_form_values.notes;
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
    // console.log(this.forms_route)
    if(this.edit_form_values && (this.edit_form_values.customer || this.edit_form_values.customer_name) ){
      this.sales_Address = this.edit_form_values.customer ? this.edit_form_values.customer : this.edit_form_values.customer_name
    }
  //  this.lost_reason = this.db.lost_quotation.subscribe(res =>{
  //     if(res && res == 'Set as Lost'){
  //       this.add_reason()
  //     }
  //   })
  // console.log(this.edit_form_values)
  // console.log(this.forms_route)

  }

  // ngOnDestroy() {
  //   this.sub.unsubscribe();
  // }

//  async add_reason(){
//     const modal = await this.modalCtrl.create({
//       component: FormsPage,
//       cssClass: this.db.ismobile ? 'crm-add-event' : 'web_site_form',
//       componentProps: {
//         page_title: 'Set as Lost',
//       },
//     });
//     await modal.present();
//     let { data } = await modal.onWillDismiss();
//     console.log(data)
//   }

get_contact_person(data){
  this.db.get_contact_person(data).subscribe(res => {
    if(res && res.message){
      let data = res.message
     this.form_ctrl_data.contact_person.setValue(data.name);
    }
  })
}

  tag_filter(data) {
    // data.array = [];
    // let val = data._user_tags.filter((res) => { return res.value == 1; });
    // data.array = val;
    // console.log(this.edit_form_values)
    this.edit_form_values._user_tags = data._user_tags.filter((res) => {
      return res.value == 1;
    });
    // this.db.next_tag = false;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  open_pop_up_create() {
    this.open_pop_up.emit();
  }

  async open_attachment() {
    // console.log(this.sale_order_id)
    // this.menuCtrl.open();
    const modal = await this.modalCtrl.create({
      component: AttachmentsComponent,
      cssClass: 'web_site_form',
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

  // async add_comment() {
  //   const modal = await this.modalCtrl.create({
  //     component: CrmCommentComponent,
  //     cssClass: 'crm-add-comment',
  //     componentProps: {
  //       name: this.sale_order_id
  //     }
  //   });
  //   console.log(this.sale_order_id)
  //   await modal.present();
  // }

  clear_cart() {
    this.db.cart_items = [];
    this.ngcart.list = [];
    this.ngcart.changecart();
    // this.db.mycart_emit.next('getted');
  }

  // ngOnDestroy() {
  //   this.destroy.unsubscribe();
  // }

  get_form(data) {
    // this.db.loader = true;
    // console.log(data)
    // console.log(data)
    // this.db.web_form_dynamic(data).subscribe(res => {
    //   // console.log(res);
    //   if (res && res.data) {
    //     this.web_form = res.data;
    //     this.get_form_values();
    //   }
    // })
 
    // if (data == 'suplier') {
    //   data = 'supplier';
    // } else if (data == 'sales-order') {
    //   data = 'sales-order-creation';
    // } else if (data == 'advance') {
    //   data = 'employee-advance';
    // } else if (data == 'Purchase Order') {
    //   data = 'purchase-order';
    // } else if (data == 'employee-employee-advance') {
    //   data = 'employee-advance';
    // } else if (data == 'Employee Advance') {
    //   data = 'employee-advance';
    // } else if (data == 'Salary Slip') {
    //   data = 'salary-slip';
    // } else if (data == 'Leave Application') {
    //   data = 'leave-application';
    // } else if (data == 'attendance') {
    //   data = 'add-attendance';
    // } else if (data == 'Sales Invoice') {
    //   data = 'sales-invoice';
    // } else if (data == 'Stock Entry') {
    //   data = 'stock-entry';
    // } else if (data == 'Sales Order') {
    //   data = 'sales-order-creation';
    // } else if (data == 'Expense Claim') {
    //   data = 'expense-claim';
    // } else if (data == 'Holiday List') {
    //   data = 'holiday-list';
    // } else if (data == 'Attendance') {
    //   data = 'add-attendance';
    // } else if (data == 'Compensatory Leave Request') {
    //   data = 'compensatory-leave-request';
    // } else if (data == 'Employee Grievance') {
    //   data = 'employee-grievance';
    // }

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
        // this.db.loader = false;
        // console.log(JSON.parse(res.message.form_json))
        if (res && res.message && res.message.form_json) {
          !this.db.enabled_hidden_fields && this.doctype == 'Material Request' ? (localStorage['form_json'] = res.message.form_json) : null;
          this.doctype != 'Material Request' ? (localStorage['form_json'] = res.message.form_json) : null;
          // localStorage['form_json'] = res.message.form_json;
          this.web_form = JSON.parse(localStorage['form_json']);
          // console.log(this.web_form)
          if(this.web_form && this.web_form.doc_type == 'Salary Slip' && !this.add_new_form){
            let indexValue = this.web_form.web_form_fields.findIndex((r,i)=>{ return (r.fieldtype == "Page Break" && r.label =="Payment Days")})
            if(indexValue >= 0){
              this.web_form.web_form_fields = this.web_form.web_form_fields.slice(0,indexValue)
            }
          } 
          // console.log('log',this.web_form)
          this.get_form_values();
        } else if (res && res.status == 'Failed') {
          var d = JSON.parse(res._server_messages);
          var d1 = JSON.parse(d);
          this.db.alert(d1.message);
        }
      });
    }
    this.db.show_form_details = false;
  }

  sub_fields: any = [];
  async get_form_values() {
    this.enable_activities = false;
    this.retrict_duplicate = false;
    this.isModel ? (this.url = this.model_path) : (this.url = location.pathname); 
    this.isModel ? (this.current_path = this.type) : (this.current_path = this.route.snapshot['_routerState'].url.split('/')[1]);
    // this.isModel ? this.current_path = this.type : this.current_path = this.route.snapshot['_urlSegment'].segments[0].path
    this.web_form.web_form_fields.map((res) => {
      if (res && res.fieldtype == 'Page Break') {
        res.array_list = [];
      }
      // if (res && res.fieldtype == 'Select') {
      //   console.log(res.options)
      //   localStorage['Select_Options'] = JSON.stringify(res.options);
      // }
      if(res.fieldname == 'links' && res.fieldtype == 'Table'){
        console.log(res)
        if(res && res['child_header']){

          console.log(res['child_header'] )
        }

        if(res && res.child_header){

          console.log(res.child_header )
        }
        // res.child_header.forEach((item) => {
        //   if (item.fieldtype == 'Link' && item.fieldname == 'link_doctype') {
        //      item.fieldname.setValue(this.db.form_values.quotation_to)
        //   }
        //   else if (item.fieldtype == 'Dynamic Link' && item.fieldname == 'link_name') {
        //     res.party_name = item.value;
        //   }
        // });
      }
    });

    // await this.web_form.web_form_fields.filter((res:any) => {
    //   if (res.depends_on != null && res.depends_on != "") {
    //     res['enable'] = 0;
    //     this.sub_fields.push(res)
    //   }else{
    //     res['enable'] = 1;
    //   }
    // })
 
    this.field_data = this.web_form.web_form_fields;
    this.doctype = this.web_form.doc_type;
    this.db.form_doctype = this.doctype;
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
    // this.db.ad_name = this.titleCase(this.doctype);
    this.get__initial_forms(this.navigation_count);
    // console.log(this.wizard_form);
    this.db.customize_form_details = false;
  }

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

  ngAfterContentChecked() {
    // this.ref.detectChanges();
  }

  get_comment_list() {
    let data = {
      doctype: 'CRM Note',
      fields: ['added_by', 'added_on', 'note', 'name'],
      filters: {
        parent: this.sale_order_id,
      },
    };
    this.db.get_list(data).subscribe((res) => {
      // console.log(res)
      this.lead_comments = res.message;
      this.lead_comments.forEach(notes => {
        if (notes.note) {
          notes.note = notes.note.replace(/(<([^>]+)>)/gi, '');
        }
      })
    });
  }

  // Title case the title
  titleCase(str) {
    // console.log(str)
    return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
  }

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
      // let loader = await this.loadingCtrl.create({ message: '' });
      // await loader.present();
      let obj = eve;
      this.submitted = true;
      this.scroll_to_top.emit('');
      this.data = this.form_data.value;
      this.assign_image(this.data);
      this.load_child_table(this.data);
      // console.log(this.navigation_count);
      // eve.navigate = true;
      // this.next_form();
      // this.load_next_form();
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
          // loader.dismiss();
          if ( this.form_data.status == 'VALID' || this.navigation_count > obj.index ) {
            // this.save_details('image_none');
            if (this.navigation_count > obj.index || this.free_navigation) {
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
            } else {
              this.save_details1('image_none');
              // loader.dismiss();
              // this.navigation_count = eve.navigate ? obj.index : this.navigation_count;
              // this.hasChange ? this.save_details1('image_none') : null;
            }
          }
        }
      }
    }

    // if (this.form_data.status == "VALID" && (this.navigation_count == (obj.index - 1)) || (this.navigation_count > obj.index) || this.free_navigation) {
    //   // this.save_details1('image_none');
    //   // this.save_details('image_none');
    //   this.wizard_json[this.navigation_count].form_ctrl_data = this.form_data.value;
    //   this.store_old_datas(false);
    //   this.submitted = false;
    //   this.form_ctrl_data = {};
    //   this.check_navigation(obj.index + 1);
    //   this.db.tab_buttons(this.profile_menu, obj['name'], 'name');
    //   this.navigation_count = obj.index;
    //   this.get_forms(this.wizard_json, obj.index);
    //   this.store_header();
    //   this.filter_section_break();
    //   this.assign_final_data();
    //   this.form_data = this.formBuilder.group(
    //     this.form_ctrl_data
    //   );
    // }
  }

  hasChange = true;
  onCreateGroupFormValueChange() {
    const initialValue = this.form_data.value;
    if (this.form_data.valueChanges) {
      this.form_data.valueChanges.subscribe((value) => {
        this.hasChange = Object.keys(initialValue).some(
          (key) => this.form_data.value[key] != initialValue[key]
        );
        // console.log(this.hasChange);
      });
    }
  }

  store_old_datas(type) {
    if (type) {
      this.store_old_data = { ...this.store_old_data, ...this.form_data.value };
    }
  }

  free_navigation = false;

  check_navigation(value) {
    if (!this.free_navigation) {
      this.free_navigation = this.wizard_json.length == value ? true : false;
    }
  }

  next() {
    this.submitted = true;
    // this.next_form();
    this.next_form_value = true;
    this.data = this.form_data.value;
    this.assign_image(this.data);
    this.load_child_table(this.data);
    this.data = { ...this.data, ...this.formValues };
    if (this.enabled_read_only) {
      this.load_next_form();
    } else {
      // this.db.scroll_top.next('scroll');
      if (this.form_data.status == 'VALID') {
        // this.save_details('image_none');
        if(this.navigation_count == 0){
          this.next_form();
        }else{
          this.next_form();
        }
      }
    }
  }

  next_form() {
    if(this.registerCss){
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

  back() {
    // this.db.scroll_top.next('scroll');
    // this.db.profile_completion = this.db.profile_completion - 25;
    // this.db.profile_bar.next('load')
    this.scroll_to_top.emit('');
    delete this.form_data.controls;
    this.form_ctrl_data = {};
    this.submitted = false;
    // this.db.progress_bar.next(this.navigation_count) // progress_bar
    this.navigation_count = this.navigation_count - 1;
    let value = this.profile_menu.find(
      (res) => res.index == this.navigation_count
    );
    this.db.tab_buttons(this.profile_menu, value.name, 'name');
    this.get_forms(this.wizard_json, this.navigation_count);
    this.store_header();
    this.filter_section_break();
    this.assign_final_data();
    // this.form_data.reset();
    this.form_data = this.formBuilder.group(this.form_ctrl_data);

    this.onCreateGroupFormValueChange();

    // this.get_child_parent();
  }
  
  next_form1(){
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
  }


  back1(){
    // this.db.scroll_top.next('scroll');
    // this.db.profile_completion = this.db.profile_completion - 25;
    // this.db.profile_bar.next('load')
    delete this.form_data.controls;
    this.form_ctrl_data = {};
    this.submitted = false;
    // this.db.progress_bar.next(this.navigation_count) // progress_bar
    this.navigation_count = this.navigation_count - 1;
    let value = this.profile_menu.find(res=>res.index == this.navigation_count)
    this.db.tab_buttons(this.profile_menu,value.name,'name');
    this.get_forms(this.wizard_json,this.navigation_count);
    this.store_header();
    this.filter_section_break();
    this.assign_final_data();
    // this.form_data.reset();
    this.form_data = this.formBuilder.group(
      this.form_ctrl_data
    );

  }

  get__initial_forms(index) {
    this.getIp();
    this.get_device_type();

    index == 0 ? this.store_info(index) : this.get_forms(this.wizard_json, index);
    this.store_header();
    this.filter_section_break();
    this.assign_final_data();

    this.form_data = this.formBuilder.group(this.form_ctrl_data);
    // console.log(this.form_ctrl_data)
    this.onCreateGroupFormValueChange();

    // this.get_child_parent();
  }

  store_info(index) {
    // console.log(this.db.enabled_hidden_fields)
    this.wizard_json = [];
    let count = -1;
    // console.log(this.json_data)
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
      // getting link field options  || res.fieldtype == "Multi_add"
      if (res.fieldtype == 'Link' || res.fieldtype == 'Link_multi_select') {
        this.link_flelds_name.push(res.options);
        // this.link_flelds_name_w_fields.push({'fieldname':res.fieldname,'doctype':res.options})
      } else if (res.fieldtype == 'Select' && res.options) {
        res.options = res.options.includes('\n') ? res.options.split('\n') : [];
      }
    });

    // console.log(this.wizard_json)
  }

  ngAfterViewInit() {
    // console.log('loaderrrrrrrrrrrrrr');
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

    if (this.addresstext) {
      // this.db.getPlaceAutocomplete(this.addresstext.nativeElement, 'get_map_fields')
    }
    this.remove_alphabets();
  }

  // ngAfterViewInit() {

  // }

  selected_values: any = [];
  info_w_hidden_obj: any;

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
    // this.info = this.info.filter((res) => { return !res.hidden; });
    let map_array = this.info.filter((res) => { return res.fieldname == 'address_map'; });
    // if(map_array && map_array.length != 0){
    //   map_array.map(res=>{ res.fieldtype = 'Geo Location' })
    // }
    this.info.map((res:any, i) => {
      // console.log(res)
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
      if(res.fieldname == 'links' && res.fieldtype == 'Table'){
        console.log(res)
        if(res && res.child_header){
          console.log(res.child_header )
          console.log(res['child_header'] )
         }
        // res.child_header.forEach((item) => {
        //   if (item.fieldtype == 'Link' && item.fieldname == 'link_doctype') {
        //      item.fieldname.setValue(this.db.form_values.quotation_to)
        //   }
        //   else if (item.fieldtype == 'Dynamic Link' && item.fieldname == 'link_name') {
        //     res.party_name = item.value;
        //   }
        // });
      }
    });

    // this.info.filter((res:any) => {
    //   if (res.depends_on != null && res.depends_on != "") {
    //     res['enable'] = 0;
    //     this.sub_fields.push(res)
    //   }else{
    //     res['enable'] = 1;
    //   }
    // })

    this.selected_values = [];
    this.link_w_fields_name = [];
    this.db.default_values = localStorage['default_values'] ? JSON.parse(localStorage['default_values']) : undefined;
   
    // if(this.wizard_form == 1){
    // console.log(this.edit_form_values)
    // this.info.map((res,i) => {
    //   if(res.fieldname == "employee" && res.fieldtype == "Link"){
    //     res['employee'].setValue(localStorage['employee_name'])
    //   }employee_name
    // })

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
        // &&  res.fieldtype != 'Rating'
        if ( res.label && res.fieldtype != 'Section Break' && res.fieldtype != 'Column Break' && res.fieldtype != 'Barcode' && res.fieldtype != 'Button' && res.fieldtype != 'Color' && res.fieldtype != 'Duration' &&  res.fieldtype != 'Dynamic Link' &&  res.fieldtype != 'Fold' &&  res.fieldtype != 'Geolocation' &&  res.fieldtype != 'Heading' &&  res.fieldtype != 'Image' &&  res.fieldtype != 'Markdown Editor' &&  res.fieldtype != 'Percent' &&  res.fieldtype != 'Read Only' &&  res.fieldtype != 'Table MultiSelect'  ) {
          res.read_only = this.enabled_read_only ? 1 : res.read_only;
          let value = this.edit_form_values && this.edit_form_values[res.fieldname] ? this.edit_form_values[res.fieldname] : '';
          res['value'] = value;
          if (res.fieldname == 'grand_total' && this.doctype == 'Expense Claim') {
            
            if (value && value > 0) {
              value = value;
            } else {
              value = 0;
            }
            
            value = Number(value);
            res['value'] = value;
            // console.log(value);
          }else if(this.doctype == 'Timesheet' && res.fieldname == 'employee_name' && this.db.employee_role){
            res.read_only = 1
          }
          if (!res['value'] && this.db.default_values) {
            if (res.options == 'Company') {
              value = this.db.default_values.default_company;
              res['value'] = value;
              this.edit_form_values[res.fieldname] = value;
            } else if (res.options == 'Currency') {
              value = this.db.default_values.default_currency;
              res['value'] = value;
              this.edit_form_values[res.fieldname] = value;
            }
          }

          if(this.edit_form_values){
            let data = Object.keys(this.edit_form_values)
            // console.log('data',data)
            data.map(key => {
              if (Array.isArray(this.edit_form_values[key])) {
                  let array_values = this.edit_form_values[key]
                  // console.log(array_values,'array_values')

                  for(let i=0;i < array_values.length;i++){
                    Object.keys(array_values[i]).map(valu => {
                          if(valu && ((valu.includes('amount') || valu.includes('paid') || valu.includes('rate')) && String(array_values[i][valu]).split(".").length < 2)){
                            // if(valu && (valu.includes('amount') && typeof array_values[i][valu] == 'number')){
                            // console.log(valu,'valu')
                            // console.log('before',array_values[i][valu])
                            array_values[i][valu] = (array_values[i][valu] + '.00')
                            // console.log('after',array_values[i][valu])
                          }
                        })
                  }

                  // array_values.map(res_num => {
                  //   Object.keys(res_num).map(valu => {
                  //     if(valu && valu.includes('amount')){
                  //       console.log(valu,'valu')
                  //       console.log('before',res_num[valu])
                  //       res_num[valu] = res_num[valu] + '.00'
                  //       console.log('after',res_num[valu])
                  //     }
                  //   })
                  // })
              }
          });
          }

          // console.log(value);
          res.placeholder = res.label ? res.fieldtype == 'Select' || res.fieldtype == 'Link' ? 'Select ' + res.label : 'Enter The ' + res.label : '';
          if (this.enabled_read_only) {
            res.read_only == 1;
            // value = {
            //   value: value,
            //   disabled: res.read_only == 1 ? true : false,
            // };
          }
          if (res.fieldname == 'posting_date' || res.fieldname == 'attendance_date' || res.fieldname == 'transaction_date'  && this.current_date && this.add_new_form) {
            // this.form_ctrl_data['posting_date'].setValue(this.current_date)
            value = this.current_date;
          }
          if ( (res.fieldname == 'half_day_date' && this.doctype == 'Compensatory Leave Request') || this.doctype == 'Leave Application'  ) {
            // res.hidden = 1
            this.half_day_hide = false;
          }

          // if(this.doctype == 'Employee Grievance' && this.db.hr_manager_role && res.fieldname == 'employee_name'){
          //   res.read_only = 0;
          // }

          if(this.doctype == 'Expense Claim' && res.fieldname == 'approval_status' && this.db.employee_role){
            if(value == 'Draft'){
              res.read_only = 1;
            }
          }

          if (this.enable_readonly && this.doctype == 'Expense Claim' && (res.fieldname == 'employee' || res.fieldname == 'expense_approver' || res.fieldname == 'company') ) {
            this.db.selected_from_employee = localStorage['employee_id']
            // console.log(this.db.selected_from_employee)
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
              res.read_only = 1
            }
          }
          if ( res.fieldname == 'leave_approver' && localStorage['employee_id'] ) {
            this.get_leave_approver(localStorage['employee_id']);
            // res.read_only = 1;
          }

          if ((res.fieldtype == "Text" || res.fieldtype == "Text Editor") && this.edit_form_values && this.edit_form_values[res.fieldname]) {
            var htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
            value = this.edit_form_values[res.fieldname].replace(htmlRegexG, '');
          }

          if ( res.fieldname == 'leave_approver_name' &&  localStorage['employee_id'] ) {
            this.get_leave_approver(localStorage['employee_id']);
            // res.read_only = 1;
          }

          if (res.fieldname == 'project' && localStorage['selected_project_id'] && this.doctype == 'Expense Claim') {
            // let project_value = document.querySelector('#project').value
            // project_value.val =
            value = localStorage['selected_project_id'];
            // this.db.drop_down_value[res.fieldname] = value
            this.form_ctrl_data[res.fieldname]  ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
            // res.read_only = 1;
          }

          if (res.fieldname == 'employee' && this.edit_form_values && this.edit_form_values['employee']) {
            // console.log('this.edit_form_values',this.edit_form_values);
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
            res.read_only = 1;
          }

          if(this.doctype == 'Employee Grievance' && res.fieldname == 'raised_by' && this.db.employee_role){
            res.hidden = 1;
          }

          if(this.doctype == 'Employee Grievance' && res.fieldname == 'raised_by'){
            this.db.drop_down_value[res.fieldname] = localStorage['employee_id'];
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
            if(this.db.employee_role){
              res.read_only = 1;
            }
          }

          if (res.fieldname == 'customer' && this.doctype == 'Sales Order') {
            value = (this.edit_form_values && this.edit_form_values['customer_name']) ? this.edit_form_values['customer_name'] : '' ;
            this.db.drop_down_value[res.fieldname] = value;
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
            // res.read_only = 1;
          }

          if ( res.reqd == 1 &&  res.options != 'Email' &&  res.options != 'Phone' ) {
            if (res.max_length && res.max_length > 0) {
              this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false }, [ Validators.required, Validators.pattern('[0-9]{' + res.max_length + '}'),]);
            } else {
              this.form_ctrl_data[res.fieldname] = new FormControl(
                { value: value, disabled: res.read_only == 1 ? true : false },
                Validators.required
              );
            }
          } else if (res.reqd == 1 && res.options == 'Email') {
            // this.form_ctrl_data[res.fieldname] = new FormControl(value, [Validators.required, Validators.email])
            this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false }, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), ] );
            // console.log(res)
          } else if (res.options == 'Email') {
            this.form_ctrl_data[res.fieldname] = new FormControl( { value: value, disabled: res.read_only == 1 ? true : false }, Validators.email);
            // console.log(res)
          } else if (res.fieldtype == 'Check') {
            if ( this.edit_form_values && this.edit_form_values.title == 'New Customer' ) {
              this.form_ctrl_data[res.fieldname] = new FormControl(false);
            } else {
              value = value == 1 ? value : 0;
              res.default = value
              this.form_ctrl_data[res.fieldname] = new FormControl( { value: value, disabled: res.read_only == 1 ? true : false });
            }
          } else if (res.fieldtype == 'Phone') {
            // console.log(res)
            res.fieldtype = 'Int';
            this.form_ctrl_data[res.fieldname] = new FormControl( { value: value, disabled: res.read_only == 1 ? true : false }, [ Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'), ]);
          } else if ( res.fieldtype == 'Data' && res.options &&  res.options.toLowerCase() == 'map' ) {
            res.fieldtype = 'Geo Location';
            this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false, });
          } else if (res.fieldtype == 'Table') {
            let value = this.edit_form_values[res.fieldname] ? this.edit_form_values[res.fieldname] : '';
            // this.get_value1(value,res.fieldname);
            // this.test_child_data[res.fieldname] = value;
            if (value) {
              this.form_ctrl_data[res.fieldname] = new FormControl(value);
              this.child_data[res.fieldname] = this.child_data[res.fieldname] ? this.child_data[res.fieldname] : [];
              // this.child_data[res.fieldname].push(value);
              this.test_child_data = this.child_data;
              let datas = JSON.stringify(this.test_child_data[res.fieldname]);
              // console.log(datas)
              this.form_ctrl_data[res.fieldname].setValue(datas);
            } else {
              this.form_ctrl_data[res.fieldname] = new FormControl('');
            }
          } else if (res.fieldtype == 'Select' && res.fieldtype == 'Link') {
            // this.db.all_link_opts[res.options] = [{'label':value,'name':value}]
            // { value: value, disabled: res.read_only == 1 ? true : false }
            this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false, });
          } else {
            this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false,});
          }

          if(this.doctype == 'HD Ticket' && this.edit_form_values){
            this.rating_value = this.edit_form_values.feedback_rating
          }

          if (res.fieldtype == 'Table') {
            let edit_f_value = this.edit_form_values && this.edit_form_values[res.fieldname] ? this.edit_form_values[res.fieldname] : undefined;
            // && this.test_child_data[res.fieldname] && this.test_child_data[res.fieldname].length != 0
            if (edit_f_value) {
              this.child_data[res.fieldname] = edit_f_value;
              this.test_child_data = this.child_data;
              let datas = JSON.stringify(this.test_child_data[res.fieldname]);
              this.form_ctrl_data[res.fieldname].setValue(datas);
            }
          } else if (res.fieldtype == 'Link') {
            this.link_w_fields_name.push({ doctype: res.options, fieldname: res.fieldname,  });
            let edit_f_value = this.edit_form_values && this.edit_form_values[res.fieldname]  ? this.edit_form_values[res.fieldname]  : undefined;
            if (edit_f_value) {
              this.db.all_link_opts[res.options + res.fieldname] = [ { label: edit_f_value, name: edit_f_value },  ];
            }
          }
        }

        this.info.length == i + 1 && !this.enabled_read_only  ? this.get_link_values() : null;
      });
    } else {
      this.info.map((res, i) => {
        // && res.fieldtype != 'Rating'
        if (res.label && res.fieldtype != 'Section Break' && res.fieldtype != 'Column Break' && res.fieldtype != 'Barcode' && res.fieldtype != 'Button' && res.fieldtype != 'Color' && res.fieldtype != 'Duration' && res.fieldtype != 'Dynamic Link' && res.fieldtype != 'Fold' && res.fieldtype != 'Geolocation' && res.fieldtype != 'Heading' && res.fieldtype != 'Image' && res.fieldtype != 'Markdown Editor' && res.fieldtype != 'Percent' && res.fieldtype != 'Read Only' && res.fieldtype != 'Table MultiSelect') {
          let value:any = form_ctrl_data[res.fieldname] && form_ctrl_data[res.fieldname] != '' ? form_ctrl_data[res.fieldname] : '';
          res['value'] = value;
          if (!res['value'] && this.db.default_values) {
            if (res.options == 'Company') {
              value = this.db.default_values.default_company;
              res['value'] = value;
              // this.edit_form_values[res.fieldname] = value
            } else if (res.options == 'Currency') {
              value = this.db.default_values.default_currency;
              res['value'] = value;
              // this.edit_form_values[res.fieldname] = value
            }
          }
          if(res.fieldname == 'supplier_group'){
            value = res.default
            // this.form_ctrl_data[res.fieldname].setValue(value) 
          }
         
          if(!res['value'] && (res.fieldtype == 'Link' || res.fieldtype == 'Data' ||  res.fieldtype == 'Select') && (this.doctype == 'Lead' && (res.fieldname == 'status' || res.fieldname == 'source' || res.fieldname == 'city' || res.fieldname == 'state' || res.fieldname == 'country'))){
            res['value'] = res.default;
            value = res.default
            this.form_ctrl_data[res.fieldname] = new FormControl(value);
            this.db.drop_down_value[res.fieldname] = value;
            this.form_ctrl_data[res.fieldname].setValue(value);
          }
          if (!res['value'] && res.fieldtype == 'Select' && (res.fieldname == 'approval_status' || res.fieldname == 'status') && this.db.default_values) {
            res['value'] = res.default;
            value = res.default;
          }

          res.placeholder = res.label ? res.fieldtype == 'Select' || res.fieldtype == 'Link' ? 'Select ' + res.label : 'Enter The ' + res.label : '';

          if (res.fieldtype == 'Link') { 
            this.link_w_fields_name.push({  doctype: res.options, fieldname: res.fieldname, });
          }
          
          if((res.fieldname == 'posting_date' || res.fieldname == 'opening_date') && this.current_date && this.add_new_form){
            value = this.current_date;
          }
          if(res.fieldname == 'posting_time' && this.current_time && this.add_new_form){
            value = this.current_time
          }
          // console.log(res.fieldname)
          if(this.doctype == 'Employee Grievance' && res.fieldname == 'raised_by'){
            this.db.drop_down_value[res.fieldname] = localStorage['employee_name'];
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
            if(this.db.employee_role){
              res.read_only = 1;
            }
          }

          if (res.fieldname == 'employee' && localStorage['employee_id']) {
            value = localStorage['employee_name'];
            this.formValues[res.fieldname] = localStorage['employee_id'];
            // value = localStorage['employee_id'];
            this.db.drop_down_value[res.fieldname] = value;
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
            res.read_only = 1;
          }
          
          if ( (res.fieldname == 'half_day_date' && this.doctype == 'Compensatory Leave Request') ||  this.doctype == 'Leave Application' ) {
            // res.hidden = 1
            this.half_day_hide = false;
          }

          if (res.fieldname == 'employee_name' && localStorage['employee_name']) {
            value = localStorage['employee_name'];
            this.db.drop_down_value[res.fieldname] = value;
            this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
            // res.read_only = 1;
          }
          if ( res.fieldname == 'expense_approver' && localStorage['employee_id'] ) {
            this.get_claim_details_local(localStorage['employee_id']);
            res.read_only = 1;
          }

          if ( res.fieldname == 'leave_approver' && localStorage['employee_id']) {
            this.get_leave_approver(localStorage['employee_id']);
            res.read_only = 1;
          }

          if ( res.fieldname == 'leave_approver_name' &&  localStorage['employee_id']) {
            this.get_leave_approver(localStorage['employee_id']);
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
            // this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false }, [Validators.required, Validators.email])
            // console.log(res)
          } else if (res.options == 'Email') {
            this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false }, Validators.email );
            // console.log(res)
          } else if (res.fieldtype == 'Check') {
            this.form_ctrl_data[res.fieldname] = new FormControl(false);
          } else if (res.fieldtype == 'Phone') {
            // res.fieldtype = 'Int';
            this.form_ctrl_data[res.fieldname] = new FormControl({ value: value, disabled: res.read_only == 1 ? true : false },  [ Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),  ]   );
          } else if ( res.fieldtype == 'Data' && res.options && res.options.toLowerCase() == 'map' ) {
            res.fieldtype = 'Geo Location';
            this.form_ctrl_data[res.fieldname] = new FormControl({ value: value,  disabled: res.read_only == 1 ? true : false, });
          } else {
            if (res.fieldtype == 'Table' && res.fieldname == 'links') {
              console.log('this.child_data',this.child_data)
              this.child_data[res.fieldname] = this.db.addressLinks;
              this.test_child_data = this.child_data;
              value = JSON.stringify(this.test_child_data[res.fieldname]);
              console.log(value)
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

        this.info.length == i + 1 ? this.get_link_values() : null;
        if ( this.doctype && this.doctype == 'Customer' &&  res &&  res.depends_on ) {
          res.hidden = 1;
        }

        if(res.fieldname == 'links' && res.fieldtype == 'Table'){
         if(res && res.child_header){
          console.log(res.child_header )
         }
          // res.child_header.forEach((item) => {
          //   if (item.fieldtype == 'Link' && item.fieldname == 'link_doctype') {
          //      item.fieldname.setValue(this.db.form_values.quotation_to)
          //   }
          //   else if (item.fieldtype == 'Dynamic Link' && item.fieldname == 'link_name') {
          //     res.party_name = item.value;
          //   }
          // });
        }
      });
    }
    // console.log('form_ctrl_data',this.form_ctrl_data);

    this.remove_alphabets();

    //  }
    // console.log(this.doctype)
  }

  get_link_values() {
    // console.log('123456');

    if (this.link_w_fields_name && this.link_w_fields_name.length != 0) {
      this.link_w_fields_name.map((res) => {
        this.db.all_link_opts[res.doctype + res.fieldname + 'no_products'] =
          false;
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
              this.db.get_master_value(res.doctype, res.fieldname);
            }
          });
        }, 1000);
      }
    } else {
      if (this.link_w_fields_name && this.link_w_fields_name.length != 0) {
        this.link_w_fields_name.map((res) => {
          this.db.form_values = this.store_old_data;
    
          if (
            !this.db.all_link_opts[res.doctype + res.fieldname + 'no_products']
          ) {
            this.db.get_master_value(res.doctype, res.fieldname);
          }
          // this.db.get_master_value(res.doctype,res.fieldname);
        });
      }
    }
  }

  test_sub;
  get_value1(event: any, field: any) {
    this.test_sub = event;
    // if (field == 'marital_status' && (event == "UnMarried" || event == "Divorced" || event == "Widow(er)" || event == "")) {
    //   if (this.form_data.controls['address_same'].value) {
    //     this.form_data.controls['address_same'].setValue('');
    //     this.form_ctrl_data.controls['address_same'].setValue('');
    //   }
    // }
    // console.log(event)
    // console.log(field)
    this.sub_fields.map((r: any) => {
      if (r.mandatory_depends_on == field) {
        if (r.depends_on == event) {
          r.reqd = r.read_only_depends_on == 'yes' ? 1 : 0;
          // r.read_only_depends_on == "yes" ? this.add_field(r) : null;
          //  r.read_only_depends_on == "yes" && this.add_field(r);
          r.enable = true;
          //  console.log(r);
        } else if (r.depends_on == 'UnMarried || Divorced || Widow(er)') {
          if (
            event == 'UnMarried' ||
            event == 'Divorced' ||
            event == 'Widow(er)'
          ) {
            r.enable = true;
            r.reqd = r.read_only_depends_on == 'yes' ? 1 : 0;
            // r.read_only_depends_on == "yes" ? this.add_field(r) : null;
          } else {
            // r.read_only_depends_on == "yes" ? this.remove_field(r) : null;
            r.enable = false;
            r.reqd = 0;
          }
        } else {
          // r.read_only_depends_on == "yes" ? this.remove_field(r) : null;
          r.enable = false;
          r.reqd = 0;
        }
      }
    });
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

  get_table_fields(index) {
    // this.db.get_doc_data('Customer Address').subscribe(res => {
    //   let data = res.docs[0].fields;
    //   let count = 0;
    //   data.map(res => {
    //     if (res.fieldtype != "Section Break" && res.fieldtype != "Column Break" && res.fieldtype != "Barcode" && res.fieldtype != "Button" && res.fieldtype != "Color" && res.fieldtype != "Duration" && res.fieldtype != "Dynamic Link" && res.fieldtype != "Fold" && res.fieldtype != "Geolocation" && res.fieldtype != "Heading" && res.fieldtype != "Image" && res.fieldtype != "Markdown Editor" && res.fieldtype != "Percent" && res.fieldtype != "Read Only" && res.fieldtype != "Rating" && res.fieldtype != "Table MultiSelect") {
    //       this.info.splice((index + 1 + count), 0, res);
    //       count++
    //     }
    //   })
    // })
  }

  call_uppy() {
    // console.log('nhiii')
    // this.db.uppy_upload.next('load');
    return true;
  }

  ref_doc: any = [];
  // all_link_opts = {};
  salary_parent;

  current_gen_links(link_field_array) {
    // console.log("____________________________________________Modal Calling")
    link_field_array.map((refdoc) => {
      // let table_master = this.db.mater_tables.find(res=> res == refdoc);

      if (
        refdoc == 'Classified Category' ||
        refdoc == 'Job Category' ||
        refdoc == 'Job Role' ||
        refdoc == 'Expected Salary Type'
      ) {
        this.get_parent_options(refdoc);
      } else if (
        refdoc == 'sugesstion1' ||
        refdoc == 'Salary' ||
        refdoc == 'working_time' ||
        refdoc == 'year_amount' ||
        refdoc == 'contract_type' ||
        refdoc == 'Work_from_home_options' ||
        refdoc == 'start_date' ||
        refdoc == 'year' ||
        refdoc == 'end_date' ||
        refdoc == 'end_date_year' ||
        refdoc == 'Gradution_Year' ||
        refdoc == 'end_date_year' ||
        refdoc == 'end_date_year'
      ) {
        this.get_parent_options_value(refdoc);
      } else {
        // if(table_master);
        // this.db.form_values = this.store_old_data;
        // let value = this.link_w_fields_name.find(r=>r.doctype == refdoc)
        // this.db.get_master_value(refdoc,);
      }
      // else {
      //   this.ref_doc.push(refdoc);
      //   this.db.ref_doc_type = refdoc;

      //   this.db.get_link_field_options().subscribe(res => {
      //     let res_data = res.data
      //     let link_opts: any = [];

      //     res_data.map(res => {
      //       link_opts.push(res.name)
      //     })
      //     this.db.all_link_opts[refdoc] = link_opts;

      //   })
      // }
    });
  }
  // End

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
      link_opts = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
    } else if (
      refdoc == 'year' ||
      refdoc == 'end_date_year' ||
      refdoc == 'Gradution_Year'
    ) {
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

  k = 1;
  child_category = {};

  get_parent_options(refdoc) {
    if (this.k == 1) {
      // console.log(refdoc,this.ref_doc);
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
        // console.log(this.child_category);
        // console.log(this.all_link_opts);
      });
    }
  }

  parent_id;

  // load_child_options(ref_doc) {
  //   // console.log("ref doc", ref_doc)
  //   // console.log("parent id",this.parent_id)
  //   this.sub_category = true;
  //   this.final_child_category = {};
  //   let values = []
  //   if (this.child_category && this.child_category[ref_doc]) {
  //     this.child_category[ref_doc].map(res => {
  //       if (res.parent_category == this.parent_id)
  //         values.push({ "options": res.option, "ids": res.ids })
  //     })
  //   }
  //   this.final_child_category[ref_doc] = values;
  //   // console.log(this.final_child_category[ref_doc])
  //   if (ref_doc == "Classified Category") {
  //     if (this.parent_id) {
  //       $("#subcategory").show();
  //     }
  //     else {
  //       $("#subcategory").hide();
  //     }
  //   }
  //   else if (ref_doc == "Job Category") {
  //     this.form_data.controls['sub_category'].reset()
  //     if (this.parent_id) {
  //       $("#sub_category").show();
  //     }
  //     else {
  //       $("#sub_category").hide();
  //     }
  //   }
  //   this.reset_hide_subcategory(ref_doc, values);
  // }

  hide_sub_category_fields_html(edit_values) {
    // console.log("this.form_ctrl_data",this.form_ctrl_data)
    // console.log("this.edit_data_details",this.edit_data_details)
    // console.log("this.final_child_category", this.final_child_category)
    // console.log("this.child_category",this.child_category)
    // console.log("Classified Category",this.child_category['Classified Category'])
    // console.log("Job Category",this.child_category['Job Category'])

    $(() => {
      if (edit_values && edit_values['sub_category']) {
        // console.log('this.edit_data_details["sub_category"]',edit_values["sub_category"])
        $('#sub_category').show();
        this.sub_category = true;
      } else if (edit_values && edit_values['subcategory']) {
        // console.log('this.edit_data_details["subcategory"]',edit_values["subcategory"])
        $('#subcategory').show();
        this.sub_category = true;
      } else {
        // console.log("main page loaded")
        $('#sub_category').hide();
        $('#subcategory').hide();
        this.sub_category = false;
      }

      $('textarea.native-textarea.sc-ion-textarea-md')
        .parent()
        .css('height', '100%');
      $('textarea.native-textarea.sc-ion-textarea-md').css('height', '100%');
    });
  }

  reset_hide_subcategory(ref_doc, values) {
    if (ref_doc == 'Classified Category') {
      $('#subcategorychild').val('');
    } else if (ref_doc == 'Job Category') {
      $('#sub_categorychild').val('');
    }
    if (values.length == 0) {
      $('#sub_category').hide();
      $('#subcategory').hide();
    }
  }

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

  // Setting margin value for each flex div
  // The css and the below value must be same for apply e:g flex:0 0 calac(%-flex_margin)
  flex_margin: any = '30px';
  // flex_margin:any = " 0 15px";
  // end var

  // Store field name && check it has lable or not
  // store_field_name;
  // count = 0;
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
    // this.info.map((res, index) => {
    //   console.log(res)
    //   if( res.fieldtype == 'Section Break'){
    //     if(deleteIndex && deleteField){
    //       delete this.info[deleteIndex]
    //     }
    //     deleteIndex = undefined;
    //     deleteField = undefined;
    //   }

    //   if(res.fieldtype == 'Column Break'){
    //     deleteIndex = index
    //     deleteArray.push(index)
    //   }
      
    //   if(res.fieldname && res.fieldname.includes('employee') && this.db.employee_role){
    //     res.hidden = 1;
    //     deleteField = true
    //   }

    // });

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
        let flex_out =
          '0 0 calc(' + p__flex + ' ' + '-' + ' ' + (this.db.ismobile ? '10px' : (this.doctype == 'ToDo' && this.forms_route == 'activity-task') || (this.doctype == 'Event' && this.forms_route == 'event-form') ? '0px' : this.flex_margin) +')';
        this.section_break_data[res.fieldname].flex = flex_out.toString();
        // this.section_break_data[res.fieldname].label = res.label
        // if (res.label || !res.label) {
        //   if (!res.label) {
        //     this.section_break_data[res.fieldname].label = undefined;
        //   }
        //   else {
        //     this.section_break_data[res.fieldname].label = res.label
        //   }
        // }
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
        // console.log(this.section_break_data)
        // this.section_break_data[this.store_field_name] = this.each_sec_data;
        // this.section_break_data[this.store_field_name].count = this.count + 1;
        // let p__flex = ((100 / (this.count + 1)) + '%');
        // let flex_out = "0 0 calc(" + p__flex + " " + "-" + " " + this.flex_margin + ")";
        // // console.log("percent", p__flex)
        // this.section_break_data[this.store_field_name].flex = flex_out.toString();
        // if (res.label) {
        //   this.section_break_data[this.store_field_name].label = res.label
        // }
        // if (!this.section_break_name.includes(this.store_field_name)) {
        //   this.section_break_name.push(this.store_field_name);
        // }
      }
    });
    if (!this.store_field_type.includes('Section Break')) {
      this.info.map((res) => {
        if (res.fieldtype != 'Column Break') {
          this.no_sec_col.push(res);
        }
      });
    }
  }
  //End

  // Check and assign a section brake fields into another section break if section comes without label
  label_name;
  section_break_data_2: any = undefined;
  count = 0;

  check_assign_sec_break() {
    this.section_break_data_2 = undefined;
    this.count = 0;
    // console.log(this.test_section_break_name);
    // console.log(this.section_break_data);
    return new Promise<void>((resolve, reject) => {
      this.test_section_break_name.map((res, index) => {
        if ( this.section_break_data[res] && this.section_break_data[res].label ) {
          this.label_name = res;
        } else if ( this.section_break_data[res] && !this.section_break_data[res].label ) {
          // console.log("error", res)
          // console.log("each field", this.section_break_data[res])
          // console.log("each label_name", this.section_break_data[this.label_name])
          this.section_break_data[res].map((name) => {
            // console.log("__________________________________________________________________sec data",name)
            this.section_break_data[this.label_name].push(name);
          });
          // // console.log("delete sections", this.section_break_data[res]);
          delete this.section_break_data[res];
          let index_value = this.test_section_break_data.indexOf(res);
          this.test_section_break_data.splice(index_value, 1);
        }
      });
      resolve();
    });
    // this.section_break_name = this.test_section_break_data
    // this.section_break_data_2 = this.section_break_data;
    // console.log("All section data-2", this.section_break_data)
    //   console.log('sec name', this.section_break_name)
  }

  // Assign final data ref
  async assign_final_data() {
    // await this.check_assign_sec_break();
    this.section_break_name = this.test_section_break_data;
    this.section_break_data_2 = this.section_break_data;
    // console.log(this.section_break_data['section']);
    // console.log("section name", this.section_break_name)
    // console.log("All section data-2", this.section_break_data)
  }

  // user IP address
  ip_address: any;
  posted_from;
  browser_name;
  getIp() {
    this.http.get<{ ip: string }>('https://jsonip.com').subscribe((data) => {
      this.ip_address = data.ip;
    });
  }

  get_device_type() {
    // console.log("_____________Device",this.db.check_device_type())
    this.posted_from = this.db.check_device_type();
    // this.posted_from='Website'
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

       if(data && (this.fromDate == this.toDate)){
        this.half_day_hide = false;
       }

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

       if(data && (this.fromDate == this.toDate)){
        this.half_day_hide = false;
       }

     }
    }

  }

  fromDate:any;
  toDate:any;

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

    //  else{
    //   each.default = '0';
    //   each.default = 0;
    //   this.db.sendErrorMessage('Please select from and to date');
    //  }
 
    }else{
      this.check_box1(event, each, section);
    }
 
  }

  check_box1(event: any, each: any, section: any) {
    // let value = this.form_data.value[each.fieldname] ? (this.form_data.value[each.fieldname]) : '';
    // // console.log(value)
    // if (typeof (value) == 'boolean') {
    //   let date_end = this.info.find(res => res.fieldname == "date_end");
    //   let end_date_year = this.info.find(res => res.fieldname == "end_date_year");
    //   date_end.is_show = false;
    //   end_date_year.is_show = false;
    // } else if (typeof (value) == 'string') {
    //   let date_end = this.info.find(res => res.fieldname == "date_end");
    //   let end_date_year = this.info.find(res => res.fieldname == "end_date_year");
    //   date_end.is_show = true;
    //   end_date_year.is_show = true;
    // }

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
        // this.form_ctrl_data.controls[res.fieldname].setValidators(Validators.required);
        res.hidden = res.hidden == 1 ? 0 : 1;
        // console.log(res.hidden)
        if (res.reqd == 1) {
          // this.form_ctrl_data.addControl(res.fieldname, new FormControl('', Validators.required));
        } else {
          // this.form_ctrl_data.addControl(res.fieldname, new FormControl(''));
        }
      }
    });

    this.section_break_data[section].map((res: any) => {
      // console.log(res)
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
    browser =
      /firefox|fxios/i.test(userAgent) && !/seamonkey/i.test(userAgent)
        ? 'Firefox'
        : browser;
    browser =
      /; msie|trident/i.test(userAgent) && !/ucbrowser/i.test(userAgent)
        ? 'IE'
        : browser;
    browser =
      /chrome|crios/i.test(userAgent) &&
      !/opr|opera|chromium|edg|ucbrowser|googlebot/i.test(userAgent)
        ? 'Chrome'
        : browser;
    browser =
      /safari/i.test(userAgent) &&
      !/chromium|edg|ucbrowser|chrome|crios|opr|opera|fxios|firefox/i.test(
        userAgent
      )
        ? 'Safari'
        : browser;
    browser = /opr|opera/i.test(userAgent) ? 'Opera' : browser;

    // detect browser version
    switch (browser) {
      case 'UCBrowser':
        return `${browser}/${this.browserVersion(
          userAgent,
          /(ucbrowser)\/([\d\.]+)/i
        )}`;
      case 'Edge':
        return `${browser}/${this.browserVersion(
          userAgent,
          /(edge|edga|edgios|edg)\/([\d\.]+)/i
        )}`;
      case 'GoogleBot':
        return `${browser}/${this.browserVersion(
          userAgent,
          /(googlebot)\/([\d\.]+)/i
        )}`;
      case 'Chromium':
        return `${browser}/${this.browserVersion(
          userAgent,
          /(chromium)\/([\d\.]+)/i
        )}`;
      case 'Firefox':
        return `${browser}/${this.browserVersion(
          userAgent,
          /(firefox|fxios)\/([\d\.]+)/i
        )}`;
      case 'Chrome':
        return `${browser}/${this.browserVersion(
          userAgent,
          /(chrome|crios)\/([\d\.]+)/i
        )}`;
      case 'Safari':
        return `${browser}/${this.browserVersion(
          userAgent,
          /(safari)\/([\d\.]+)/i
        )}`;
      case 'Opera':
        return `${browser}/${this.browserVersion(
          userAgent,
          /(opera|opr)\/([\d\.]+)/i
        )}`;
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

  // edit submitted data
  async save_edit_details() {}

  //Image attach and Path finder
  image_count: any = [];
  changeListener($event, each): void {
    this.image_count.push(each.fieldname);
    this.image_field_check = 'false';
    this.readThis($event.target, each);
  }

  images_array: any = [];

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
          this.base64_url.splice(
            this.field_name.indexOf(this.field_name[each.fieldname]),
            1
          );
          this.field_name.splice(
            this.field_name.indexOf(this.field_name[each.fieldname]),
            1
          );
          if (
            this.edit_data_details &&
            this.edit_data_details[each.fieldname]
          ) {
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

  readMultipleFile(inputValue: any, fieldname) {
    this.img_file_name = [];
    if (inputValue.files.length > 0) {
      for (let i = 0; i <= inputValue.files.length - 1; i++) {
        // console.log(inputValue.files[i])
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
      // console.log(myReader.result)
      this.categoryimagedata = myReader.result;
      // this.form_data.value[fieldname] = this.categoryimagedata

      // PUsh image base 64

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
        // file: this.categoryimagedata,
        // is_private: 0,
        // folder: "Home",
        // file_name:this.categoryfile
      };

      if (file_size <= 10000000) {
        //10Mb in BYtes

        this.db.upload_image(img_data).subscribe((res) => {
          let checks_rep = res ? true : false;

          let unique_name = res.data.name;

          if (checks_rep == true) {
            this.db.upload_image_url(unique_name).subscribe((url) => {
              // console.log(url.data.file_url, "-----")
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

  // Child table function to get json data of child table
  all_child_data: any = [];
  c_field_name;
  child_data: any = {};
  each_child_data;
  child_table_field_name: any = [];
  child_header_label: any = [];
  header_flex_margin: string = '0px';
  test_child_data: any = {};

  store_header() {
    this.info.map((res, index) => {
      res.child_header = [];
      res.child_fields = [];
      if (res.fieldtype == 'Table') {
        let child_table_name = res.options;
        let doc_name: string = '';
        let table_array = child_table_name.split(' ');
        table_array.map((res) => {
          // doc_name = doc_name.concat(res + '+')
          doc_name = doc_name.concat(res + ' ');
        });

        doc_name = doc_name.substring(0, doc_name.length - 1);
        // let data = {
        //     doctype:"Material Request Item",
        //     input_fields:["item_code","schedule_date","qty"]
        // }
        if (res.options.includes('JSON')) {
          let data = '/assets/childTableJson/' + res.options + '.json';
          // console.log('doc_name', doc_name);
          this.http.get(data).subscribe((respon: any) => {
            // this.studentData = res;
            // console.log(respon)
            let header_data = respon.docs[0].fields;
            if (header_data) {
              header_data.map((header) => {
                if (header.in_list_view) {
                  res.child_header.push(header);
                  this.child_header_label.push(header);
                }
              });
              let p__flex = 100 / this.child_header_label.length + '%';
              let flex_out =
                '0 0 calc(' +
                p__flex +
                ' ' +
                '-' +
                ' ' +
                this.header_flex_margin +
                ')';
              this.child_header_label = [];
              res.child_header.map((flex_res) => {
                flex_res.flex = flex_out;
              });
            }
          });
        } else {
          this.db.get_doc_data(doc_name).subscribe((respon) => {
            // let header_data = respon.message.meta_data.fields
            // console.log(respon);
            let header_data = respon.docs[0].fields;
            if (header_data) {
              header_data.map((header) => {
                if (header.in_list_view) {
                  res.child_header.push(header);
                  this.child_header_label.push(header);
                }
              });
              let p__flex = 100 / this.child_header_label.length + '%';
              let flex_out =
                '0 0 calc(' +
                p__flex +
                ' ' +
                '-' +
                ' ' +
                this.header_flex_margin +
                ')';
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

  open_child_modal(child_table_name, child_field_name) {
    // console.log(child_field_name)
    if (child_field_name == 'items') {
      if (this.doctype == 'Sales Order') {
        //  let customer = this.info.find(res=>res.fieldname == 'customer');
        //  let company = this.info.find(res=>res.fieldname == 'company');
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

  // Modal pop-up
  store_child_fields: any = {};
  arrayFields: any = [];

  open_child_modal1(child_table_name, child_field_name) {
    // console.log(child_field_name)
    let doc_name: string = '';
    let table_array = child_table_name.split(' ');

    table_array.map((res) => {
      // doc_name = doc_name.concat(res + '+')
      doc_name = doc_name.concat(res + ' ');
    });

    doc_name = doc_name.substring(0, doc_name.length - 1);
    let modal_class;
    if (this.db.ismobile) {
      modal_class = 'mbl-webformchildPopup';
    } else if (!this.db.ismobile) {
      modal_class = 'webformchildPopup';
    }

    // this.db.get_doc_data(doc_name).subscribe(res => {
    //   if (res) {
    //     this.pop_up_child(res, child_table_name, child_field_name, modal_class);
    //   }
    // })

    // console.log('doc_name', doc_name);

    let check_array = this.arrayFields.find((res) => res == child_field_name);

    if (check_array) {
      this.pop_up_child(
        this.store_child_fields[child_field_name],
        child_table_name,
        child_field_name,
        modal_class
      );
    } else {
      this.arrayFields.push(child_field_name);
      //   let data = {
      //     doctype:"Material Request Item",
      //     input_fields:["item_code","schedule_date","qty"]
      // }

      if (doc_name.includes('JSON')) {
        let data = '/assets/childTableJson/' + doc_name + '.json';
        // console.log('doc_name', doc_name);

        this.http.get(data).subscribe((res: any) => {
          if (res) {
            this.pop_up_child(
              res,
              child_table_name,
              child_field_name,
              modal_class
            );
          }
          this.store_child_fields[child_field_name] = res;
        });
      } else {
        this.db.get_doc_data(doc_name).subscribe((res) => {
          if (res) {
            this.pop_up_child(
              res,
              child_table_name,
              child_field_name,
              modal_class
            );
          }
          this.store_child_fields[child_field_name] = res;
        });
      }
    }

    // if (!this.arrayFields.includes(child_field_name)) {
    //   this.arrayFields.push(child_field_name);
    //   this.db.get_doc_data(doc_name).subscribe(res => {
    //     if (res) {
    //       this.pop_up_child(res, child_table_name, child_field_name, modal_class);
    //     }
    //     this.store_child_fields[child_field_name] = res;

    //   })
    // } else if (this.arrayFields.includes(child_field_name)) {
    //   this.pop_up_child(this.store_child_fields[child_field_name], child_table_name, child_field_name, modal_class);
    // }
  }

  get_form_values_() {
    if (this.navigation_count == 0) {
      if (this.link_w_fields_name && this.link_w_fields_name.length != 0) {
        setTimeout(() => {
          this.store_old_data = this.form_data.value;
          this.link_w_fields_name.map((res) => {
            this.db.form_values = this.store_old_data;
    
            if (
              !this.db.all_link_opts[
                res.doctype + res.fieldname + 'no_products'
              ]
            ) {
              this.db.get_master_value(res.doctype, res.fieldname);
            }
          });
        }, 1000);
      }
    } else {
      if (this.link_w_fields_name && this.link_w_fields_name.length != 0) {
        this.link_w_fields_name.map((res) => {
          this.db.form_values = this.store_old_data;
        
          if (
            !this.db.all_link_opts[res.doctype + res.fieldname + 'no_products']
          ) {
            this.db.get_master_value(res.doctype, res.fieldname);
          }
          // this.db.get_master_value(res.doctype,res.fieldname);
        });
      }
    }
  }


  async pop_up_child(alldata, child_table_name, child_field_name, modal_class) {
    this.form_is_edited = true;
    // console.log('form_ctrl_data',this.form_ctrl_data)

    this.get_form_values_();

    let popup_data = JSON.stringify(alldata);
    alldata = JSON.parse(popup_data);

    // console.log(alldata)
    const modal = await this.modalCtrl.create({
      component: WebformChildPage,
      cssClass: this.db.ismobile ? modal_class : 'web_site_form',
      componentProps: {
        all_data: alldata,
        child_table_name: child_table_name,
        child_table_field_name: child_field_name,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    // console.log(data)
    if (data) {
      this.each_child_data = data.form_data;
      if (this.child_data[data.child_table_field_name]) {
        this.child_data[data.child_table_field_name].push(this.each_child_data);
        this.test_child_data = this.child_data;
        let datas = JSON.stringify(
          this.test_child_data[data.child_table_field_name]
        );
        this.form_ctrl_data[data.child_table_field_name].setValue(datas);
        // this.load_child_table(data);
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
      }
    }

    // console.log('form_ctrl_data',this.form_ctrl_data);

    // this.store_header();
    // console.log(this.test_child_data);
  }

  // Edit Form popup
  edit_child_modal( all_values,  child_table_name,   child_field_name,   index_value ) {
    // console.log(child_table_name, 'sdfsdf')
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
    let check_array = this.arrayFields.find((res) => res == child_field_name);
    if (check_array) {
      this.edit_pop_up_child( all_values, this.store_child_fields[child_field_name], child_table_name, child_field_name,  index_value,  modal_class);
    } else {
      this.arrayFields.push(child_field_name);
      // console.log('doc_name', doc_name);
      if (doc_name.includes('JSON')) {
        let data = '/assets/childTableJson/' + doc_name + '.json';
        // console.log('doc_name', doc_name);
        this.http.get(data).subscribe((res: any) => {
          if (res) {
            // let edit_f_value = (this.edit_form_values && this.edit_form_values[child_field_name]) ? this.edit_form_values[child_field_name] : undefined;

            // if(edit_f_value && edit_f_value.length != 0){
            //   let value = edit_f_value.find(r=>r.item_code == all_values.item_code);
            //   if(value){
            //     res['item_code'] = value.item_name
            //   }
            // }

            this.store_child_fields[child_field_name] = res;
            this.edit_pop_up_child( all_values, this.store_child_fields[child_field_name], child_table_name, child_field_name, index_value, modal_class  );
          }
        });
      } else {
        this.db.get_doc_data(doc_name).subscribe((res) => {
          if (res) {
            this.store_child_fields[child_field_name] = res;
            // this.store_child_fields[child_field_name]
            this.edit_pop_up_child( all_values, res, child_table_name, child_field_name, index_value, modal_class );
          }
        });
      }

      // this.db.get_doc_data(doc_name).subscribe(res => {
      //   if (res) {
      //     this.edit_pop_up_child(all_values, this.store_child_fields[child_field_name], child_table_name, child_field_name, index_value, modal_class);
      //   }
      //   this.store_child_fields[child_field_name] = res;
      // })
    }
  }

  async edit_pop_up_child( all_values, alldata, child_table_name, child_field_name, index_value, modal_class ) {
    this.form_is_edited = true;
    // console.log(this.enable_readonly)
    // console.log(this.enabled_read_only)
    // console.log(this.edit_form_values)
    const modal = await this.modalCtrl.create({
      component: EditWebformchildPage,
      cssClass: this.db.ismobile ? modal_class : 'web_site_form',
      componentProps: {
        all_data: alldata,
        child_table_name: child_table_name,
        child_table_field_name: child_field_name,
        all_values: all_values,
        index_value: index_value,
        enabled_read_only: this.enabled_read_only,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
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
        this.get_update_total_values_taxes(this.child_data[data.child_table_field_name], data.child_table_field_name );
      }
    }
  }

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

  get_update_total_values_taxes(child_array, child_table_field_name) {
    // console.log(child_array);
    // console.log(child_table_field_name);
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
    if ( this.form_ctrl_data['grand_total'] && this.form_ctrl_data['grand_total'].value  ) {
      grand_total = this.form_ctrl_data['grand_total'].value;
    }
    if ( this.child_data['advances'] && this.child_data['advances'].length != 0) {
      let advance_payments = this.child_data['advances'][0];
      if (grand_total > advance_payments.unclaimed_amount) {
        advance_payments.allocated_amount = advance_payments.unclaimed_amount;
        grand_total = grand_total - advance_payments.unclaimed_amount;
        // is_paid
      } else {
        advance_payments.allocated_amount = grand_total;
      }
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

  // delete records
  delete_records(alldata, fieldname) {
    alldata.select = 0;
    if (alldata.select_all == 0) {
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
      // alldata.map(del => {
      //   if (del.select == 1) {
      //     // this.test_child_data[fieldname].splice(del.index_value, 1);
      //     let index =  this.db.cart_items.findIndex(r=>r.item_code == del.item_code)
      //     this.child_data[fieldname].splice(del.index_value, 1);
      //     this.db.cart_items.splice(index,1);
      //     this.ngcart.list = this.db.cart_items;
      //     this.ngcart.changecart();
      //   }
      // })
    } else if (alldata.select_all == 1) {
      this.child_data[fieldname] = [];
      this.clear_cart();
      this.edit_form_values[fieldname] = [];
      // this.get_update_total_values(this.child_data[fieldname],fieldname);

      if (fieldname == 'expenses') {
        this.get_update_total_values(this.child_data[fieldname], fieldname);
      } else if (fieldname == 'taxes') {
        this.get_update_total_values_taxes(
          this.child_data[fieldname],
          fieldname
        );
      }

      // this.db.cat_products = [];
      // this.db.mycart_emit.next('getted');
    }
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

  // @HostListener('window:resize', ['$event'])
  // private func() {
  //   this.db.check_mobile();
  // }

  public resolved(captchaResponse: string): void {
    this.captcha = true;
    // console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    // console.log(`reCAPTCHA error encountered; details:`, errorDetails);
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
    let value = this.profile_menu.find(
      (res) => res.index == this.navigation_count
    );
    this.db.tab_buttons(this.profile_menu, value.name, 'name');
    // this.db.tab_buttons(this.profile_menu, value.name, 'name');

    // this.db.progress_bar.next(this.navigation_count +  1) // progress_bar
    this.get_forms(this.wizard_json, this.navigation_count);
    this.store_header();
    this.filter_section_break();
    // this.check_assign_sec_break();
    this.assign_final_data();
    // this.form_data.reset();
    // this.formGroups.reset();
    this.form_data = this.formBuilder.group(this.form_ctrl_data);
    this.onCreateGroupFormValueChange();
  }

  save_details1(type) {
    // console.log(this.form_ctrl_data);
    var data: any = {};
    if (type == '') {
      data = this.form_data.value;
      // console.log(data)
      this.assign_image(data);
      this.load_child_table(data);
      this.submitted = true;
      data = { ...data, ...this.formValues };
    } else if (type == 'save') {
      data = this.form_data.value;
      this.assign_image(data);
      this.load_child_table(data);
      this.submitted = true;
      // if(this.doctype == 'ToDo' && this.edit_form_values){
      //   // data.reference_name = this.db.store_old_id;
      // }else if(this.doctype == 'Event' && this.edit_form_values){
      //   data.event_participants.map(res=>{
      //     if(res && res.reference_docname){
      //       // res.reference_docname = this.db.store_old_id;
      //     }
      //   })
      // }
      data = { ...data, ...this.formValues };
    } else {
      data = { ...this.data, ...this.formValues };
      // data = this.data;
      // console.log(data)
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
          data = this.form_data.value;
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
  }

  lost_quotation(data){
    //  data ={
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
    // Replace this with your custom logic to generate a new name.
    const baseName = 'new-opportunity';
    this.newName = `${baseName}-${this.opportunityNumber++}`;
    // this.opportunityNumber++;
  }

  save_details2(type, data) {
    // console.log(data)
    // console.log(this.form_data)
    // console.log(this.test_child_data)
    // console.log(this.edit_form_values)
    // console.log(this.doctype)
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
    // else if (localStorage['docType'] == 'Expense Claim' && this.edit_form_values && this.edit_form_values.employee) {
    //   data.employee = this.edit_form_values ? this.edit_form_values.employee : null;
    // }
    // else if(this.doctype == 'Timesheet' && localStorage['employee_name']){
    //   data.employee = localStorage['employee_name']
    //   data.employee_name = localStorage['employee_name']
    // }

    // var data: any = {};

    // if (type == '') {
    //   data = this.form_data.value;
    //   this.assign_image(data);
    //   this.load_child_table(data);
    //   this.submitted = true;
    // } else {
    //   data = this.data
    // }
    // console.log(data)
    if (this.sale_order_id) {
      data.name = this.sale_order_id;
    }
    if (this.doctype == 'Employee Checkin') {
      data.device_id = this.db.current_address;
    }
    // console.log(data);
    // data.docstatus = 1;
    data.doctype = this.doctype;
    // console.log(this.doctype);
    // console.log(this.edit_form_values.status);
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
      //status based next form loaded in CRM Workflow
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
      // console.log(this.form_data.valueChanges,'this.form_data.valueChanges')
      this.form_data.valueChanges.subscribe(x => {
        // console.log(x, 'Value Changed')
        this.form_is_edited = true
    });
      if(this.form_is_edited){
        data.docstatus = 0
      }else{
        data.docstatus = 1
      }
    } else {
      data.docstatus = 1;
      if ( this.db.selected_list && this.db.selected_list.submitted && this.db.selected_list.submitted == 1 ) {
        data.docstatus = 1;
      } else {
        data.docstatus = 0;
      }
    }

    if(this.doctype == 'HD Ticket' && this.edit_form_values){
      data.name = this.edit_form_values.name
    }

    

    if ( this.doctype == 'Purchase Receipt' && this.reference_id &&  data.items && data.items.length != 0) {
      // data.items.map(r=>{
      //   r.purchase_order = this.reference_id
      // })

      data.items.map((r, i) => {
        let value = this.items_values[i] ? this.items_values[i] : undefined;
        if (value) {
          (r.purchase_order = this.reference_id),
            (r.purchase_order_item = value['name']);
          // r.material_request = this.reference_id;
          // r.material_request_item =
        }
        // r.material_request = this.edit_form_values['name'];
        // r.material_request_item = r['name'];
      });
    }

    if ( this.doctype == 'Purchase Order' && this.enable_reference && this.edit_form_values && data.items && data.items.length != 0) {
      data.items.map((r, i) => {
        let value = this.items_values[i] ? this.items_values[i] : undefined;
        if (value) {
          r.material_request = this.reference_id;
          r.material_request_item = value['name'];
        }
        // r.material_request = this.edit_form_values['name'];
        // r.material_request_item = r['name'];
      });
    }

    if ( this.doctype == 'Opportunity' && this.edit_form_values &&  (this.Convert_route == 'Lead' || this.edit_new_form)) {
      delete data.name;
    } else if (this.doctype == 'Customer' && this.edit_form_values) {
      // delete data.name;
      data.name = this.edit_form_values.name;
      data.status = 'Enabled';
    } else if (this.doctype == 'Quotation' && this.edit_form_values && (this.Convert_route == 'Lead' || this.Convert_route == 'Opportunity' || this.edit_new_form)) {
      delete data.name;
    } else if ( this.doctype == 'Sales Invoice' && this.edit_form_values && this.Convert_route == 'sales-order-creation' ) {
      delete data.name;
    }
    if (this.doctype == 'Customer' && this.navigation_count > 0) {
      data.customer_name = this.sales_Address;
    }
   



    if(this.doctype == 'Leave Application'){
      data.status = 'Open';
    }
    // console.log(this.edit_form_values)
    if(this.doctype == 'Sales Invoice' && this.edit_form_values && this.existing_invoice){
      data.name = this.edit_form_values.name
    }
    // console.log(this.doctype)
    // console.log(this.edit_form_values)
    // && this.hasChange

    // if(this.formValues && Object.keys(this.formValues).length != 0){
    //   Object.keys(this.formValues).map(r=>{
    //     Object.keys(data).map(res=>{
    //       if(res == r){
    //         data[r] =  this.formValues[res]
    //       }
    //     })
    //   })
    // }

    if (this.form_data.status == 'VALID') {
      this.hasChange = false;
      if ( this.doctype != 'Employee Checkin' ||  (this.edit_form_values ? this.edit_form_values.status != 'Cancelled' : undefined) ) {
        // console.log(data);
        if (data.doctype == 'ToDo') {
          this.db.loader = true;
          this.db.update_id ? delete data.name : null;
          data.name = this.edit_form_values ? this.edit_form_values.name : null;
          data.reference_type = this.task_doctype ? this.task_doctype : data.reference_type;
          data.reference_name = data.reference_name ? data.reference_name : this.sale_order_id;
        } else if (data.doctype == 'Event') {
          this.db.loader = true;
          // console.log(this.sale_order_id)
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
          // console.log(this.test_child_data)
        }

        if(this.doctype == 'HD Ticket'){
          data.feedback_rating = this.rating_value
          data.feedback = this.selected_option_value
        }
        
        // console.log(data)
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
          // console.log(data.name)
        this.db.inset_docs({ data: data }).subscribe((res) => {
          // this.db.submit_document(data).subscribe(res => {

          // console.log(res);
          if (res && res.message && res.message.status == 'Success') {
            this.formValues = {};
            if ( this.edit_form_values && this.edit_form &&  this.edit_form == 1 ) {
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
            this.sale_order_id = this.edit_form_values.name;
            if ( this.doctype == 'Sales Order' || this.doctype == 'Purchase Order' || this.doctype == 'Sales Invoice') {
              this.sales_order(type, res);
            } else if (this.doctype == 'Purchase Receipt') {
              this.purchase_receipt(type, res);
            } else {
              // console.log(this.doctype)
              // this.load_next_form();
              if (this.doctype == 'Sales Invoice') {
                this.navigation();
                this.modalCtrl.dismiss('Success');
                setTimeout(() => {
                  // this.form_data.reset()
                  this.edit_form_values && this.edit_form && this.edit_form == 1  ? null : this.form_data.reset();
                }, 500);
                // this.router.navigateByUrl('/invoice-detail/'+ this.sale_order_id);
              } else if (this.doctype == 'Expense Claim') {
                this.db.alert(res.message.message);
                if (this.db.ismobile) {
                  this.navigation();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                  }, 500);
                  // this.router.navigateByUrl('/claim-details/' + this.sale_order_id);
                } else {
                  // this.db.load_data_list = true;
                  this.db.load_template_datas_list.next('Success');
                  this.db.drop_down_value = {};
                  this.modalCtrl.dismiss();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form && this.edit_form == 1  ? null : this.form_data.reset();
                  }, 500);
                }
              } else if (this.doctype == 'Employee Advance') {
                this.db.alert(res.message.message);
                if (this.db.ismobile) {
                  this.navigation();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values &&  this.edit_form && this.edit_form == 1  ? null : this.form_data.reset();
                  }, 500);
                  // this.router.navigateByUrl('/claim-details/' + this.sale_order_id);
                } else {
                  // this.db.load_data_list = true;
                  this.db.load_template_datas_list.next('Success');
                  this.db.drop_down_value = {};
                  this.modalCtrl.dismiss();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                  }, 500);
                }
              } else if (this.doctype == 'Task') {
                this.db.alert(res.message.message);
                if (this.db.ismobile) {
                  // this.db.selected_project_name = '';
                  this.db.load_template_datas_list.next('Success');
                  this.navigation();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form && this.edit_form == 1  ? null : this.form_data.reset();
                  }, 500);
                  // this.router.navigateByUrl('/claim-details/' + this.sale_order_id);
                } else {
                  // this.db.load_data_list = true;
                  this.db.load_template_datas_list.next('Success');
                  this.db.drop_down_value = {};
                  this.modalCtrl.dismiss();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form && this.edit_form == 1  ? null : this.form_data.reset();
                  }, 500);
                }
              } else if (this.doctype == 'Employee Grievance') {
                this.db.alert(res.message.message);
                if (this.db.ismobile) {
                  this.navigation();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form && this.edit_form == 1  ? null : this.form_data.reset();
                  }, 500);
                  // this.router.navigateByUrl('/claim-details/' + this.sale_order_id);
                } else {
                  // this.db.load_data_list = true;
                  this.db.load_template_datas_list.next('Success');
                  this.db.drop_down_value = {};
                  this.modalCtrl.dismiss();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                  }, 500);
                }
              } else if (this.doctype == 'Report') {
                this.db.alert(res.message.message);
                if (this.db.ismobile) {
                  this.navigation();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form && this.edit_form == 1  ? null : this.form_data.reset();
                  }, 500);
                  // this.router.navigateByUrl('/claim-details/' + this.sale_order_id);
                } else {
                  // this.db.load_data_list = true;
                  this.db.load_template_datas_list.next('Success');
                  this.db.drop_down_value = {};
                  this.modalCtrl.dismiss();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                  }, 500);
                }
              } else if (this.doctype == 'Timesheet') {
                this.db.alert(res.message.message);
                if (this.db.ismobile) {
                  this.navigation();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form &&  this.edit_form == 1  ? null : this.form_data.reset();
                  }, 500);
                  // this.router.navigateByUrl('/claim-details/' + this.sale_order_id);
                } else {
                  // this.db.load_data_list = true;
                  this.db.load_template_datas_list.next('Success');
                  this.db.drop_down_value = {};
                  this.modalCtrl.dismiss();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values &&  this.edit_form &&  this.edit_form == 1  ? null : this.form_data.reset();
                  }, 500);
                }
              } else if (this.doctype == 'Holiday List') {
                this.db.alert(res.message.message);
                if (this.db.ismobile) {
                  this.navigation();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values &&  this.edit_form && this.edit_form == 1  ? null : this.form_data.reset();
                  }, 500);
                  // this.router.navigateByUrl('/claim-details/' + this.sale_order_id);
                } else {
                  // this.db.load_data_list = true;
                  this.db.load_template_datas_list.next('Success');
                  this.db.drop_down_value = {};
                  this.modalCtrl.dismiss();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values &&  this.edit_form &&  this.edit_form == 1  ? null : this.form_data.reset();
                  }, 500);
                }
              } else if (this.doctype == 'Supplier') {
                this.db.alert(res.message.message);
                if (this.db.ismobile) {
                  this.navigation();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values &&  this.edit_form &&  this.edit_form == 1  ? null : this.form_data.reset();
                     }, 500);
                  // this.router.navigateByUrl('/claim-details/' + this.sale_order_id);
                } else {
                  // this.db.load_data_list = true;
                  this.db.load_template_datas_list.next('Success');
                  this.db.drop_down_value = {};
                  this.modalCtrl.dismiss();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form && this.edit_form == 1  ? null : this.form_data.reset();
                  }, 500);
                }
              } else if (this.doctype == 'Project') {
                this.db.alert(res.message.message);
                if (this.db.ismobile) {
                  this.navigation();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values &&  this.edit_form && this.edit_form == 1  ? null : this.form_data.reset();
                  }, 500);
                  // this.router.navigateByUrl('/claim-details/' + this.sale_order_id);
                } else {
                  // this.db.load_data_list = true;
                  this.db.load_template_datas_list.next('Success');
                  this.db.drop_down_value = {};
                  this.modalCtrl.dismiss();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                  }, 500);
                }
              } else if (this.doctype == 'Material Request') {
                this.db.alert(res.message.message);
                if (this.db.ismobile) {
                  this.navigation();
                  this.modalCtrl.dismiss('Success');
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form && this.edit_form == 1  ? null : this.form_data.reset();
                  }, 500);
                  // this.router.navigateByUrl('/claim-details/' + this.sale_order_id);
                } else {
                  // this.db.load_data_list = true;
                  this.db.load_template_datas_list.next('Success');
                  this.db.drop_down_value = {};
                  this.db.enabled_hidden_fields = false;
                  this.modalCtrl.dismiss();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values &&  this.edit_form &&  this.edit_form == 1  ? null : this.form_data.reset();
                  }, 500);
                }
                // this.router.navigateByUrl('/material-request');
              } else if (this.doctype == 'Leave Application') {
                this.db.alert(res.message.message);
                if (this.db.ismobile) {
                  this.navigation();
                  this.modalCtrl.dismiss('Success');
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form && this.edit_form == 1 ? null: this.form_data.reset();
                  }, 500);
                  // this.router.navigateByUrl('/claim-details/' + this.sale_order_id);
                } else {
                  // this.db.load_data_list = true;
                  this.db.load_template_datas_list.next('Success');
                  this.db.drop_down_value = {};
                  this.db.enabled_hidden_fields = false;
                  this.modalCtrl.dismiss();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form &&  this.edit_form == 1 ? null : this.form_data.reset();
                  }, 500);
                }
                // this.router.navigateByUrl('/material-request');
              } else if (this.doctype == 'Salary Slip') {
                this.db.alert(res.message.message);
                if (this.db.ismobile) {
                  this.navigation();
                  this.modalCtrl.dismiss('Success');
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values &&  this.edit_form &&  this.edit_form == 1 ? null: this.form_data.reset();
                  }, 500);
                  // this.router.navigateByUrl('/claim-details/' + this.sale_order_id);
                } else {
                  // this.db.load_data_list = true;
                  this.db.load_template_datas_list.next('Success');
                  this.db.drop_down_value = {};
                  this.db.enabled_hidden_fields = false;
                  this.modalCtrl.dismiss();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form && this.edit_form == 1  ? null : this.form_data.reset();
                  }, 500);
                }
                // this.router.navigateByUrl('/material-request');
              } else if (this.doctype == 'HD Ticket') {
                this.db.alert(res.message.message);
                if (this.db.ismobile) {
                  this.navigation();
                  this.modalCtrl.dismiss('Success');
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values &&  this.edit_form &&  this.edit_form == 1 ? null: this.form_data.reset();
                  }, 500);
                  // this.router.navigateByUrl('/claim-details/' + this.sale_order_id);
                } else {
                  // this.db.load_data_list = true;
                  this.db.load_template_datas_list.next('Success');
                  this.db.drop_down_value = {};
                  this.db.enabled_hidden_fields = false;
                  let sent_data = {
                    status: "Success",
                    final_data: data
                  }
                  this.modalCtrl.dismiss(sent_data)
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values && this.edit_form && this.edit_form == 1  ? null : this.form_data.reset();
                  }, 500);
                }
                // this.router.navigateByUrl('/material-request');
              } else if (this.doctype == 'Messages') {
                this.db.sendSuccessMessage(res.message.message);
                this.navigation();
                this.router.navigateByUrl('/messages');
                setTimeout(() => {
                  this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                }, 500);
              } else if (this.doctype == 'Mail Template') {
                this.db.sendSuccessMessage(res.message.message);
                this.navigation();
                this.router.navigateByUrl('/messages');
                setTimeout(() => {
                  this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                }, 500);
              } else if (this.doctype == 'Content File') {
                this.db.alert(res.message.message);
                this.navigation();
                this.modalCtrl.dismiss('Success File');
                setTimeout(() => {
                  // this.form_data.reset()
                  this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                }, 500);
              } else if (this.doctype == 'Content Link') {
                this.db.sendSuccessMessage(res.message.message);
                this.navigation();
                this.router.navigateByUrl('/messages');
                setTimeout(() => {
                  this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                }, 500);
              } else if (this.doctype == 'ToDo') {
                this.db.sendSuccessMessage(res.message.message);
                this.db.loader = false;
                if(this.db.event_list_form){
                  this.router.navigateByUrl('/list/tasks');
                }
                this.modalCtrl.dismiss(res.message);
                this.navigation();
                setTimeout(() => {
                  this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                }, 500);
              } else if (this.doctype == 'Event') {
                this.db.sendSuccessMessage(res.message.message);
                if(this.db.event_list_form){
                  this.router.navigateByUrl('/list/meeting');
                }
                this.navigation();
                this.modalCtrl.dismiss(res.message);
                setTimeout(() => {
                  this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                }, 500);
              }            
              else if (this.doctype == 'Lead') {
                this.db.sendSuccessMessage(res.message.message);
                // console.log(this.db.success_alert)
                this.navigation();
                this.modalCtrl.dismiss('Success');
                // this.db.enable_detail = false;
                // this.db.enable_material = false;
                setTimeout(() => {
                  //  // this.form_data.reset()
                  this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                }, 500);

                // this.router.navigateByUrl('/list/lead');
              } else if (this.doctype == 'Opportunity') {
                this.db.sendSuccessMessage(res.message.message);
                this.navigation();
                // this.modalCtrl.dismiss('Success');
                setTimeout(() => {
                  // this.form_data.reset()
                  this.edit_form_values && this.edit_form && this.edit_form == 1  ? null : this.form_data.reset();
                }, 500);
                // this.router.navigateByUrl('/list/opportunity');
              } else if (this.doctype == 'Issue') {
                this.db.alert(res.message.message);
                this.navigation();
                this.modalCtrl.dismiss('Success');
                setTimeout(() => {
                  // this.form_data.reset()
                  this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                }, 500);
                // this.router.navigateByUrl('/list/opportunity');
              } else if (this.doctype == 'Attendance') {
                this.db.alert(res.message.message);
                if (this.db.ismobile) {
                  this.navigation();
                  this.modalCtrl.dismiss('Success');
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values &&
                    this.edit_form &&
                    this.edit_form == 1 ? null : this.form_data.reset();
                  }, 500);
                  // this.router.navigateByUrl('/claim-details/' + this.sale_order_id);
                } else {
                  // this.db.load_data_list = true;
                  this.db.load_template_datas_list.next('Success');
                  this.db.drop_down_value = {};
                  this.db.enabled_hidden_fields = false;
                  this.modalCtrl.dismiss();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values &&
                    this.edit_form &&
                    this.edit_form == 1 ? null : this.form_data.reset();
                  }, 500);
                }
              } else if (this.doctype == 'Compensatory Leave Request') {
                this.db.alert(res.message.message);
                if (this.db.ismobile) {
                  this.navigation();
                  this.modalCtrl.dismiss('Success');
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values &&
                    this.edit_form &&
                    this.edit_form == 1 ? null : this.form_data.reset();
                  }, 500);
                  // this.router.navigateByUrl('/claim-details/' + this.sale_order_id);
                } else {
                  // this.db.load_data_list = true;
                  this.db.load_template_datas_list.next('Success');
                  this.db.drop_down_value = {};
                  this.db.enabled_hidden_fields = false;
                  this.modalCtrl.dismiss();
                  setTimeout(() => {
                    // this.form_data.reset()
                    this.edit_form_values &&
                    this.edit_form &&
                    this.edit_form == 1 ? null : this.form_data.reset();
                  }, 500);
                }
              } else if (this.doctype == 'Quotation') {
                this.db.alert(res.message.message);
                this.navigation();
                setTimeout(() => {
                  // this.form_data.reset()
                  this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                }, 500);
                this.modalCtrl.dismiss('Success');
                // this.router.navigateByUrl('/list/opportunity');
              } else if (this.doctype == 'Customer') {
                this.db.alert(res.message.message);
                this.navigation();
                setTimeout(() => {
                  //  // this.form_data.reset()
                  this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                }, 500);
                this.modalCtrl.dismiss('Success');
                // this.router.navigateByUrl('/list/opportunity');
              } else if (this.doctype == 'Custom Field') {
                this.db.alert(res.message.message);
                this.router.navigateByUrl('/');
                setTimeout(() => {
                  // this.form_data.reset()
                  this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                }, 500);
              } else if (this.doctype == 'ToDo') {
                this.db.sendSuccessMessage(res.message.message);
                this.db.loader = false;
                this.navigation();
                this.modalCtrl.dismiss(res.message);
                setTimeout(() => {
                  // this.form_data.reset()
                  this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                }, 500);
              } else if (this.doctype == 'Event') {
                this.db.sendSuccessMessage(res.message.message);
                this.navigation();
                this.modalCtrl.dismiss(res.message);
                this.db.loader = false;
                setTimeout(() => {
                  // this.form_data.reset()
                  this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                }, 500);
              }else if (this.doctype == 'Employee') {
                // this.db.sendSuccessMessage(res.message.message);
                this.navigation();
                this.modalCtrl.dismiss(res.message);
                this.db.loader = false;

                setTimeout(() => {
                  this.edit_form_values && this.edit_form && this.edit_form == 1? null : this.form_data.reset();
                }, 500);

              } else if (this.doctype == 'Address') {
                this.db.alert(res.message.message);
                if(this.db.ismobile){
                  this.router.navigateByUrl('/forms/Quotation');
                }else{
                  // let data ={data:'Success'}
                  this.modalCtrl.dismiss(res.message);
                }
              } else {
                this.db.alert(res.message.message);
                this.navigation();
                setTimeout(() => {
                  // this.form_data.reset()
                  this.edit_form_values && this.edit_form && this.edit_form == 1 ? null : this.form_data.reset();
                }, 500);
              }
            }
          } else {
            if (res._server_messages) {
              var d = JSON.parse(res._server_messages);
              var d1 = JSON.parse(d);
              // this.db.alert_animate.next(this.stripHtmlTags(d1.message));
              this.db.sendErrorMessage(this.stripHtmlTags(d1.message));
            } else {
              this.db.sendErrorMessage(res.message);
              this.db.alert_animate.next(res.message);
            }
          }
        });
      } else {
        if (
          this.doctype == 'Sales Order' &&
          this.edit_form_values.status != 'Cancelled'
        ) {
          data.shift = 'Day Shift';
          this.db.employee_checkin({ data: data }).subscribe((res) => {
            if (res && res.data && res.data.status == 'Success') {
              this.db.alert(res.data.message);
              this.navigation();
              this.form_data.reset();
              // this.router.navigateByUrl('/attendance-list');
            } else {
              this.db.alert(res.data.message);
            }
          });
        }
      }
    } else if (this.form_data.status == 'VALID' && !this.hasChange) {
      this.db.alert('No changes found');
    } else {
      this.scrollToTop.emit();
      // this.content.scrollToTop(500);
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

  navigation() {
    let route = this.db.permission_details.find((r) => r.page == this.doctype);
    if (route) {
      this.router.navigateByUrl(route.route);
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

  // save_details1(type) {
  //   // debugger
  //   // let items
  //   // // if(this.db.material_receipt){
  //   //   this.db.child_items.subscribe(res =>{
  //   //     console.log(res)
  //   //     items = res
  //   //   })
  //   // // }

  //   var data: any = {};

  //   if (type == '') {
  //     data = this.form_data.value;
  //     this.assign_image(data);
  //     this.load_child_table(data);
  //     this.submitted = true;
  //   } else {
  //     data = this.data
  //   }

  //   data.docstatus = 1,
  //     // data.doctype = "Material Request",
  //     data.doctype = this.forms_route == 'purchase-receipt' ? "Purchase Receipt" : 'Material Request',
  //     data.doctype = this.doctype;

  //   if (this.sale_order_id) {
  //     data.name = this.sale_order_id;
  //   }
  //   if(this.current_address){
  //     data.device_id = this.current_address;
  //   }
  //   // data.items = data.items ? data.items : JSON.parse(localStorage['child_Items']);
  //   // data["doctype"] = 'Customer Registration';
  //   // data = { ...data, ...this.store_old_data };
  //   // data.name = localStorage['customerRefId']
  //   // data.address_map ? delete data.address_map : null;
  //   // console.log(data);
  //   if (this.form_data.status == "VALID") {

  //     // this.db.insert_update_customer(data).subscribe(res => {
  //     this.db.inset_docs({ data: data }).subscribe(res => {
  //       if (res && res.message.status == 'Success') {
  //         this.edit_form_values = res.message.data;
  //         this.sale_order_id = this.edit_form_values.name;
  //         console.log(res,this.forms_route);
  //         this.forms_route == 'payment-entry' ? this.router.navigateByUrl('/order-list') : null;
  //         this.scroll_to_top.emit('');
  //         // if (type == '') {
  //           // this.db.alert(res.message.message);
  //           // // this.forms_route == 'purchase-receipt' ? this.router.navigateByUrl('/purchase-receipt') : this.router.navigateByUrl('/material-request');
  //           // !(this.page == "Add Attendance") ? this.router.navigateByUrl('/' + this.forms_route) : '';
  //           // // this.attendance_field ? this.router.navigateByUrl('/forms/attendance-details'+ name);
  //           // this.page == "Add Attendance" ? this.router.navigateByUrl('/attendance-details/' + this.edit_form_values.name) : '';
  //           // console.log(this.edit_form_values.name)
  //         // } else {
  //           // this.load_next_form();

  //         // }
  //       } else {
  //         var d = JSON.parse(res._server_messages);
  //         var d1 = JSON.parse(d);
  //         this.db.alert(d1.message);
  //       }

  //     })
  //   }

  // }

  // getCurrentLocation() {
  //     this.geolocation.getCurrentPosition().then((resp) => {
  //       const latitude = resp.coords.latitude;
  //       const longitude = resp.coords.longitude;
  //       console.log('Latitude: ', latitude);
  //       console.log('Longitude: ', longitude);
  //     }).catch((error) => {
  //       console.log('Error getting location', error);
  //     });

  // }

  save_details(type) {
    var data: any = {};

    if (type == '') {
      data = this.form_data.value;
      this.assign_image(data);
      this.load_child_table(data);
      this.submitted = true;
    } else {
      data = this.data;
    }

    data['doctype'] = 'Customer Registration';
    data = { ...data, ...this.store_old_data };
    if (this.form_data.status == 'VALID') {
      // this.db.insert_update_customer(data).subscribe(res => {
      //   if (res.status == 'Success') {
      //     type == '' ? this.router.navigateByUrl('/thankyou') : null;
      //   } else{
      //     this.db.alert(res.message);
      //   }
      // })
    }
  }

  focusof() {
    // this.customInput?.nativeElement?.focus();
  }

  remove_alphabets() {
    setTimeout(() => {
      var inputBox = document.getElementById('inputBox');
      // console.log(inputBox)
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

  map_focus() {
    // this.db.getPlaceAutocomplete(this.addresstext.nativeElement, 'get_map_fields')
  }

  get_map_values() {
    if (
      this.db.location_info &&
      Object.keys(this.db.location_info).length != 0
    ) {
      Object.keys(this.db.location_info).map((res) => {
        if (this.form_ctrl_data[res]) {
          // if(res.includes('latitude') || res.includes('longitude')){
          //   this.db.location_info[res] = this.db.location_info[res].toString();
          // }

          this.form_ctrl_data[res].setValue(this.db.location_info[res]);
          // this.check_ng_select(res);
        } else {
          //  console.log(Object.keys(this.db.location_info))
          let value = res;
          if (res == 'zipcode') {
            value = res.slice(0, 3);
          } else if (res == 'address') {
            //  value = 'business_address_asper_kyc_document';
            value = 'business_address';
          }
          let find = Object.keys(this.form_ctrl_data).find((r) =>
            r.toLocaleLowerCase().includes(value.toLocaleLowerCase())
          );
          find = find == 'business_address_map' ? 'business_address' : find;
          find ? this.form_ctrl_data[find].setValue(this.db.location_info[res]) : null;

          // this.check_ng_select(find);
        }
      });
    }
    //
  }

  check_ng_select(res) {
    if (res && $('#' + res + 'ng-select')) {
      // console.log($('#' + res + 'ng-select'));
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
          // value.options = res.message;
        }
        // this.db.all_link_opts[each.options + 'insert_after']
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
    // console.log(eve);
    // console.log(obj)
    if (obj.fieldname == 'opportunity_from' && this.doctype == 'Opportunity') {
      this.source_data = eve;
      // console.log(this.source_data)
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
      // console.log(this.source_data)
      this.link_w_fields_name.map((res) => {
        if (res.fieldname == 'party_name') {
          if (res.doctype_1 && res.doctype_1 != eve) {
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
      // this.get_address_display(eve.name,'shipping_address')
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

    // else if(obj.fieldname == 'taxes_and_charges'){
    //    let data = this.form_data.value;

    //   let obj = {
    //     "tax_template": data.taxes_and_charges
    //   }

    //   this.db.tax_details(obj).subscribe(res=>{
    //       if(res && res.message){
    //         data.taxes = res.message;
    //         // this.form_ctrl_data[value].setValue(res.message);
    //       }
    //   })

    // }
  }

  get_claim_details_local(value) {
    // console.log(value);
    let data = {
      employee_id: value,
    };
    this.db.employee_claim_details(data).subscribe(
      (res) => {
        if (res && res.status && res.status == 'Success') {
          // let order_detail = res.message;
          // this.expense_approver_name = order_detail.expense_approver;
            let order_detail = res.results[0];
            this.expense_approver_name = order_detail.value;
            // this.db.expense_approver_name_subject.next('Success')
            this.form_ctrl_data['expense_approver'].setValue(
              this.expense_approver_name
            );

            

        } else {
          if (res && res._server_messages) {
            var d = JSON.parse(res._server_messages);
            var d1 = JSON.parse(d);
            var tempElement = document.createElement('div');
            tempElement.innerHTML = d1.message;
            // Extract text content without HTML tags
            var textContent = tempElement.textContent || tempElement.innerText;
            // Update the alert_animate with the sanitized text
            this.db.alert_animate.next(textContent);
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

  get_claim_details(value) {
    // console.log(value);
    let data = {
      employee_id: value.name,
    };
    this.db.employee_claim_details(data).subscribe(
      (res) => {
        // console.log(res);
        if (res && res.status && res.status == 'Success') {
          let order_detail = res.message;
          let key = Object.keys(order_detail);
          if (key && key.length != 0) {
            key.map((r) => {
              if (order_detail[r] && this.form_ctrl_data[r]) {
                this.form_ctrl_data[r].setValue(order_detail[r]);
              }
            });
          }
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
        if(data){
          this.form_ctrl_data.grand_total.setValue(data)
        }
      }
    });
  }

  async open_drop_down_options(type, order_id) {
    let doctype = this.doctype;

    // if(!this.enabled_read_only && (this.edit_form && this.edit_form == 1)){
    //   doctype = (this.db.selected_list && this.db.selected_list.next_doc) ? this.db.selected_list.next_doc : doctype;
    // }

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
    // console.log(data); 
    if (data && data == 'success') {
      // console.log(data);
      if (!this.db.ismobile) {
        this.db.alert('Updated Succesfully');
        // this.db.load_data_list = true;
        this.db.load_template_datas_list.next('Success');
        this.form_data.reset();
        this.db.drop_down_value = {};
        this.db.enabled_hidden_fields = false;
        this.modalCtrl.dismiss();
        // this.router.navigateByUrl('/material-request');
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
    // // console.log(data);
    // if (data && data == 'success') {
    //   // console.log(data);
    //   if (!this.db.ismobile) {
    //     this.db.alert('Updated Succesfully');
    //     this.db.load_data_list = true;
    //     this.db.load_template_datas_list.next('Success');
    //     this.form_data.reset();
    //     this.db.drop_down_value = {};
    //     this.modalCtrl.dismiss();
    //     // this.router.navigateByUrl('/material-request');
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
    //   cssClass: !this.db.ismobile ? 'web_site_form' : '',
    //   componentProps: {
    //     type: 'form',
    //   },
    // });
    // await modal.present();
    // const { data } = await modal.onWillDismiss();
    // // console.log(data)
    // if (data && data == 'success') {
    //   // console.log(this.db.cart_items);
    //   if (this.db.cart_items && this.db.cart_items.length != 0) {
    //     let selected_items: any = [];
    //     this.db.cart_items.map((res: any) => {
    //       selected_items.push({
    //         item_name: res.item_name,
    //         item_code: res.item_code,
    //         qty: res.quantity,
    //         rate: res.rate,
    //         amount: res.quantity * res.rate,
    //         description: res.description,
    //         uom: res.uom ? res.uom : res.stock_uom,
    //         conversion_factor: 1,
    //       });
    //     });
    //     // console.log(selected_items)
    //     this.child_data[obj.fieldname] = selected_items;
    //     this.test_child_data = this.child_data;
    //     let datas = JSON.stringify(this.test_child_data[obj.fieldname]);
    //     this.form_ctrl_data[obj.fieldname].setValue(datas);
    //     let totalAmount = selected_items.reduce((acc: number, item: any) => acc + item.amount,  0 );
    //     this.Total_amount = totalAmount;
    //     // console.log(this.info)
    //     this.info.map((res) => {
    //       if (res.fieldtype == 'Currency' && res.fieldname == 'total') {
    //         this.form_ctrl_data[res.fieldname].setValue(this.Total_amount);
    //         this.form_ctrl_data["grand_total"].setValue(this.Total_amount);
    //       }
    //     });
    //     // this.child_data[obj.fieldname] = this.child_data[obj.fieldname] ? this.child_data[obj.fieldname] : []
    //     // this.child_data[obj.fieldname] = [...this.child_data[obj.fieldname],...selected_items];
    //     // this.test_child_data = this.child_data;
    //     // let datas = JSON.stringify(this.test_child_data[obj.fieldname]);
    //     // this.form_ctrl_data[obj.fieldname].setValue(datas);

    //     // this.db.cart_items = [];
    //     // this.ngcart.list = [];
    //     // this.ngcart.changecart();
    //     // this.db.mycart_emit.next('getted');
    //   }
    // }
  }


  checkcart(id: any) {
    // var cnt = 0;
    // if (this.db.isNgCart == true)
    //   this.db.cart_items.find((res) => {
    //     if (res['item_code'] == id) {
    //       cnt += res['quantity'];
    //     }
    //   });
    // else
    //   this.db.cart_items.find((res) => {
    //     if (res['product'] == id && res['is_free_item'] != 1) {
    //       cnt += res['quantity'];
    //     }
    //   });
    // return cnt;
  }

  float_value(eve, each) {
    let data = this.form_data.value;
    let value = '';
    value = data['apply_discount_on'] ? data['apply_discount_on'] : '';
    let apply_discount_on = this.info.find((res) => {
      return res.fieldname == 'apply_discount_on';
    });
    if (
      apply_discount_on &&
      (this.doctype == 'Purchase Receipt' ||
        this.doctype == 'Purchase Order') &&
      each.fieldname == 'additional_discount_percentage'
    ) {
      if (eve && eve.target && eve.target.value) {
        apply_discount_on.reqd = 1;
        this.form_data.setControl(
          'apply_discount_on',
          this.formBuilder.control(value, [Validators.required])
        );
      } else {
        apply_discount_on.reqd = 0;
        this.form_data.setControl(
          'apply_discount_on',
          this.formBuilder.control(value)
        );
      }
    }
  }
 

  // open_drop_down_option(type, fieldname, fieldname_value) {
  //   if(this.form_ctrl_data && this.form_ctrl_data.company && this.form_ctrl_data.company.value && this.doctype == 'Quotation'){
  //     this.store_company_name = this.form_ctrl_data.company.value
  //   }
  //   this.db.select_options = '';
  //   if (fieldname != 'default_account' && fieldname != 'reference_docname' && type == 'Doctype' && this.doctype =='Opportunity') {
  //     type = this.opportunity_Value ? this.opportunity_Value : localStorage['opportunity_from'];
  //     let data = this.form_data.value;
  //     let selected_value = data[fieldname] ? data[fieldname] : '';
  //     this.db.open_drop_down_options(type,fieldname,fieldname_value,selected_value);
  //   }else if (fieldname != 'default_account' && fieldname != 'reference_docname' && type == 'Doctype') {
  //     type = this.source_data
  //     let data = this.form_data.value;
  //     let selected_value = data[fieldname] ? data[fieldname] : '';
  //     this.db.open_drop_down_options(type,fieldname,fieldname_value,selected_value);
  //   } else if (fieldname != 'default_account' && fieldname != 'reference_docname' && type == 'DocType') {
  //     type = this.Payment_type
  //     let data = this.form_data.value;
  //     let selected_value = data[fieldname] ? data[fieldname] : '';
  //     this.db.open_drop_down_options(type,fieldname,fieldname_value,selected_value);
  //   } else if (fieldname != 'default_account' && fieldname != 'reference_docname' && type == 'quotation_to') {
  //     localStorage['quotation_to'] = this.quotation_value
  //     type = this.quotation_value ? this.quotation_value : localStorage['quotation_to'];
  //     let data = this.form_data.value;
  //     let selected_value = data[fieldname] ? data[fieldname] : '';
  //     this.db.open_drop_down_options(type,fieldname,fieldname_value,selected_value);
  //   } else if (fieldname != 'default_account' && fieldname != 'reference_docname' && type == 'Address') {
  //     let selected_value = this.sales_Address  ? this.sales_Address : this.edit_form_values ? this.edit_form_values.name : fieldname == 'customer_address' ? this.store_customer_name : fieldname == 'company_address' ? this.store_company_name : null;
  //     this.db.open_drop_down_options(type,fieldname,fieldname_value,selected_value);
  //   } else if(fieldname == "grievance_against"){
  //     type = this.grievance_against_party;
  //     this.db.open_drop_down_options(type,fieldname,fieldname_value,'');
  //   } else if (fieldname != 'default_account' && fieldname != 'reference_docname') {
  //     type = type == 'party type' ? ['Customer','Employee','Shareholder','Supplier'] : type;
  //     let data = this.form_data.value;
  //     let selected_value = data[fieldname] ? data[fieldname] : '';
  //     this.db.select_options = type;
  //     this.db.open_drop_down_options(type,fieldname,fieldname_value,selected_value);
  //   }
  // }

  open_drop_down_option(type, fieldname, fieldname_value) {
    if ( this.form_ctrl_data && this.form_ctrl_data.company && this.form_ctrl_data.company.value && this.doctype == 'Quotation' ) {
      this.store_company_name = this.form_ctrl_data.company.value;
    }
    this.db.select_options = '';
    if ( fieldname != 'default_account' && fieldname != 'reference_docname' && type == 'Doctype' && this.doctype == 'Opportunity' ) {
      type = this.opportunity_Value ? this.opportunity_Value : localStorage['opportunity_from'];
      let data = this.form_data.value;
      let selected_value = data[fieldname] ? data[fieldname] : '';
      this.db.open_drop_down_options( type, fieldname, fieldname_value, selected_value);
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
      // console.log(this.db.select_options)
      this.db.open_drop_down_options( type, fieldname, fieldname_value, selected_value);
    }
  }

  select_value(event: any) {
    const inputElement = event.target.querySelector(
      'input'
    ) as HTMLInputElement;
    inputElement.blur();
  }

  // async edit_comment(datas) {
  //   this.inputValue = datas.note;
  //   this.comment_id = datas.name;
  //   await Keyboard.show();
  // }

  async edit_comment(datas) {
    // const modal = await this.modalCtrl.create({
    // component:  CrmCommentComponent ,
    // cssClass: this.db.ismobile ? 'crm-add-comment': 'web_site_form',
    // componentProps: {
    //   name: this.sale_order_id,
    //   title: 'Add a Note',
    //   content: datas.note,
    //   comment_id: datas.name
    // }
    // });
    // await modal.present();
    // let { data } = await modal.onWillDismiss();
    // if (data && data.message && data.message.status == "Success") {
    //   let loader;
    //   loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    //   await loader.present();
    //   this.get_comment_list();
    //   loader.dismiss()
    //   this.db.sendSuccessMessage(data.message.message);
    // }
  }

  async delete_comment(item) {
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
            this.delete_c(item);
          },
        },
      ],
    });
    await alert.present();
  }

  async delete_c(item) {
    let loader;
      loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
      await loader.present();
    let data = {
      doctype: 'CRM Note',
      filters: { name: item.name },
    };
    this.db.delete_docs(data).subscribe((res) => {
      if (res && res.status == 'Success') {
        this.get_comment_list();
        loader.dismiss()
        this.db.sendSuccessMessage(res.message);
      }
    });
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
          this.get_comment_list();
          this.enable_comment = true;
          this.inputValue = '';
          await Keyboard.hide();
        }
      });
    } else {
      this.db.sendErrorMessage('Please Enter Your Comment');
    }
  }

  async delete_task(item) {
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
        // this.db.alert(res.message);
        // this.modalCtrl.dismiss();
        let value = {
          name: this.sale_order_id,
          doctype: this.doctype,
        };
        this.db.doc_detail(value).subscribe((res) => {
          this.edit_form_values = res.message;
        });
        this.db.sendSuccessMessage(res.message);
        loader.dismiss()
      }
    });
  }

  async edit_task(item: any) {
    this.db.detailHeaderName = this.edit_form_values.title.charAt(0).toUpperCase() + this.edit_form_values.title.slice(1)
    item.reference_type = this.doctype;
    item.reference_name = this.db.detailHeaderName;
    // this.db.store_old_id = this.sale_order_id;
    const modal = await this.modalCtrl.create({
      component: EditFormsPage,
      cssClass: this.db.ismobile ? 'crm-edit-task' : 'web_site_form',
      componentProps: {
        name: this.sale_order_id,
        order_detail: item,
        page_route: 'todo',
        page_name: 'todo',
        page_route_name: 'todo',
        title: 'Edit Task',
        task_doctype: this.doctype,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.enable_activities = true;
    if(data && data == 'Success'){
      this.db.loader = false;
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
            this.tag_filter(this.edit_form_values)
          }
        });
        this.db.sendSuccessMessage(res.message);
        loader.dismiss()
      }
    });
  }

  async edit_event(item: any) {
    // console.log(item)
    // console.log(this.sale_order_id)
    // console.log(this.doctype)
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
    // console.log(data)
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
        this.tag_filter(this.edit_form_values);
      });
    }
  }

  async Tag_btn() {
    const modal = await this.modalCtrl.create({
      component: TagsComponent,
      // backdropDismiss: false,
      cssClass: this.db.ismobile ? 'crm-add-tags' : 'web_site_form',
      componentProps: {
        name: this.sale_order_id,
        doctype: this.doctype,
      },
    });
    await modal.present();
    let data: any = await modal.onWillDismiss();
    if (data && data.data && !data.data.message && data.data.length != 0) {
      this.loaded_tags(data.data);
    } else if (data && data.data && data.data.message) {
      let val = data.data.message.data;
      this.save_comments(val.name);
    } else {
      let doc = {
        name: this.sale_order_id,
        doctype: this.doctype,
      };
      this.db.doc_detail(doc).subscribe((d) => {
        this.edit_form_values = d.message;
        this.tag_filter(this.edit_form_values);
      });
    }
  }

  loaded_tags(value) {
    let data = {
      tag_list: value,
      doctype: this.doctype,
      docname: this.sale_order_id,
    };
    this.db.update_tags(data).subscribe((res) => {
      let doc = {
        name: this.sale_order_id,
        doctype: this.doctype,
      };
      this.db.Get_tags(doc).subscribe((res) => {});

      this.db.doc_detail(doc).subscribe((d) => {
        this.edit_form_values = d.message;
        this.tag_filter(this.edit_form_values);
      });
    });
  }

  save_comments(value) {
    // let data = {
    //   tag: value,
    //   dt: this.doctype,
    //   dn: this.sale_order_id,
    // };
    let data = {
      tag_list: [
        {
          tag: value,
          value: 1,
        },
      ],
      doctype: this.doctype,
      docname: this.sale_order_id,
    };

    this.db.update_tags(data).subscribe((res) => {
      // console.log(res)
      let doc = {
        name: this.sale_order_id,
        doctype: this.doctype,
      };
      this.db.doc_detail(doc).subscribe((d) => {
        this.edit_form_values = d.message;
        this.tag_filter(this.edit_form_values);
      });
    });
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
    // // console.log(data);
    // if (data) {
    //   this.lead_data = data.name;
    //   this.change_status.emit(this.lead_data);
    //   // console.log(this.lead_data);
    // }
  }

  async assigned() {
    const modal = await this.modalCtrl.create({
      component: UserListPage,
      cssClass: 'job-detail-popup',
      componentProps: {
        order_id: this.sale_order_id ? this.sale_order_id : this.edit_form_values.name,
        user_list: this.db.selected_mail && this.db.selected_mail.length != 0 ? this.db.selected_mail : null,
        description: this.edit_form_values.title,
        doctype: this.doctype,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data == 'Success') {
      this.assign_to = true;
      this.get_assigned_list();
    }
  }

 async get_assigned_list() {
   let loader;
    if (this.assign_to) {
      loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
      await loader.present();
    }
    let data = {
      doctype: 'ToDo',
      fields: ['allocated_to'],
      filters: {
        reference_type: this.doctype,
        reference_name: this.sale_order_id,
        status: 'Open',
      },
    };
    this.db.get_list(data).subscribe((res) => {
      // console.log(res)
      if (res && res.message && res.message.length != 0) {
        this.db.selected_mail = res.message;
        if (this.assign_to) {
          let value = {
            name: this.sale_order_id,
            doctype: this.doctype,
          };
          this.db.doc_detail(value).subscribe((res) => {
            if(res && res.message && res.status && res.status == 'Success'){
              this.edit_form_values = res.message;
              loader.dismiss()
              this.db.sendSuccessMessage('Assign to Added Successfully');
              this.tag_filter(this.edit_form_values);
            }
          });
          this.assign_to = false;
        }
      } else{
        this.db.selected_mail = res.message;
      }
    });
  }

 async remove_email(email) {
    let loader;
    loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    await loader.present();
    let data = {
      assign_to: email,
      doctype: this.doctype,
      name: this.sale_order_id,
      action: 'remove',
      descriptions: this.edit_form_values.title,
    };
    this.db.assigned_to(data).subscribe((res) => {
      if (res && res.status == 'Failed') {
        var d = JSON.parse(res._server_messages);
        var d1 = JSON.parse(d);
        loader.dismiss();
        this.db.sendErrorMessage(d1.message);
      } else {
        loader.dismiss();
        this.db.sendSuccessMessage('Deleted successfully')
        this.get_assigned_list();
      }
    });
  }

  openWhatsApp() {
    if (
      this.edit_form_values.mobile_no ||
      this.edit_form_values.contact_mobile
    ) {
      let url;
      this.edit_form_values.mobile_no
        ? (url = `https://api.whatsapp.com/send?phone=${this.edit_form_values.mobile_no}`)
        : (url = `https://api.whatsapp.com/send?phone=${this.edit_form_values.contact_mobile}`);
      window.open(url, '_system');
    } else {
      this.db.sendErrorMessage(
        "This customer doesn't have a Whatsapp number.so, can't connect"
      );
    }
  }

  call() {
    if ( this.edit_form_values.mobile_no || this.edit_form_values.contact_mobile ) {
      let number = this.edit_form_values.mobile_no || this.edit_form_values.contact_mobile;
      let telLink = 'tel:' + number;
      let element = document.createElement('a');
      element.setAttribute('href', telLink);
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      this.db.sendErrorMessage("This customer doesn't have a phone number.so, can't connect");
    }
  }

  async add_comment() {
    // console.log(this.doctype)
    // const modal = await this.modalCtrl.create({
    //   component: CrmCommentComponent,
    //   cssClass: this.db.ismobile ? 'crm-add-comment' : 'web_site_form',
    //   componentProps: {
    //     name: this.sale_order_id,
    //     title: 'Add a Note',
    //     doctype: this.doctype,
    //   },
    // });
    // await modal.present();
    // let { data } = await modal.onWillDismiss();
 
    // if (data && data.message && data.message.status == 'Success') {
    //   let loader;
    //   loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    //   await loader.present();
    //   this.lead_comments.splice(0, 0, data.message.data);
    //   this.enable_comment = true;
    //   let value = {
    //     name: this.sale_order_id,
    //     doctype: this.doctype,
    //   };
    //   this.db.doc_detail(value).subscribe((res) => {
    //     if(res && res.message && res.status && res.status == 'Success'){
    //       this.edit_form_values = res.message;
    //       loader.dismiss()
    //       this.db.sendSuccessMessage('Notes Added Successfully');
    //       this.tag_filter(this.edit_form_values);
    //     }
    //   });
    //   // this.get_comment_list();
    // }
  }

  changeListener1($event: any) {
    this.image_field_check = 'false';
    this.base64($event.target);
  }

  async base64(inputValue: any): Promise<void> {
    // console.log(inputValue);
    // let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    // await loader.present();

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
        // this.post_image = array_image
        // console.log(this.post_image);
        // this.image_datas = img_data

        // console.log(this.image_datas);

        if (file_size <= 10000000) {
          //10Mb in BYtes

          let img_data = {
            file_name: this.categoryfile,
            content: this.categoryimagedata,
          };
          this.multiple_array.splice(0, 0, img_data);
          // console.log(this.multiple_array)
        } else if (file_size > 10000000) {
          //10Mb in bytes
          // loader.dismiss()
          this.db.filSizeAlert();
        } else if (file_size == 0) {
          // loader.dismiss()
        }
        // console.log(img_data);
        this.upload_file(img_data);
      };
      myReader.readAsDataURL(file);
    }
  }

  async upload_file(img_data) {
    // console.log(img_data);
    let loader;
    loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    await loader.present();
    let data = {
      file_name: img_data.file_name,
      content: img_data.content,
      is_private: 0,
      // folder: "Home/Attachments",
      doctype: 'File',
      attached_to_doctype: localStorage['docType'],
      attached_to_name: this.sale_order_id,
      decode: true,
    };
    this.db.inset_docs({ data: data }).subscribe((res) => {
      // console.log(res)
      loader.dismiss();
      if (res && res.message && res.message.status == 'Success') {
        this.get_image_list();
        // this.db.alert('Upload Successfully');
        this.db.sendSuccessMessage('Image Uploaded Successfully')
        this.modalCtrl.dismiss();
      } else {
        this.db.alert('Something went wrong try again later');
      }
    });
    // this.multiple_array = []
    // this.get_image_list()
  }

  openFileInput() {
    // console.log(this.fileInput);
    this.file_upload.nativeElement.click();
  }

  async add_task() {
    const modal = await this.modalCtrl.create({
      component: FormsPage,
      cssClass: this.db.ismobile ? 'crm-add-comment' : 'web_site_form',
      componentProps: {
        name: this.sale_order_id,
        page_title: 'New Task',
        task_doctype: this.doctype,
      },
    });
    await modal.present();
    let val: any = await modal.onWillDismiss();
    this.enable_activities = true;
    if (val && val.data && val.data.status && val.data.status == 'Success') {
      let loader;
      loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
      await loader.present();
      this.db.loader = false;
      let value = {
        name: val.data.data.reference_name,
        doctype: val.data.data.reference_type,
      };
      this.db.doc_detail(value).subscribe((res) => {
        if(res && res.message){
          this.edit_form_values = res.message;
          this.tag_filter(this.edit_form_values)
        }
      });
      loader.dismiss();
    }
  }

  test_navigate() {
    let item = '/forms/quotation';
    this.router.navigateByUrl(item);
  }

  async add_event() {
    this.db.loader = true;
    const modal = await this.modalCtrl.create({
      component: FormsPage,
      cssClass: this.db.ismobile ? 'crm-add-event' : 'web_site_form',
      componentProps: {
        name: this.sale_order_id,
        page_title: 'New Event',
        event_doctype: this.doctype
      },
    });
    await modal.present();
    let { data } = await modal.onWillDismiss();
    this.enable_activities = true;
    this.db.loader = false;
    if (data && data.status && data.status == 'Success') {
      if (this.edit_form_values) {
        let value = {
          name: this.sale_order_id,
          doctype: this.doctype,
        };
        this.db.doc_detail(value).subscribe((res) => {
          this.edit_form_values = res.message;
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
  }

  filter_status(event: any) {
    // console.log(event)
    this.detail = event.detail.value;
    // console.log(this.detail)
  }

  get_image_list() {
    let data = {
      doctype: 'File',
      fields: ['file_url', 'name'],
      filters: {
        attached_to_doctype: localStorage['docType'] ? localStorage['docType'] : this.doctype,
        attached_to_name: this.sale_order_id ? this.sale_order_id : this.image_id,
      },
    };
    this.db.get_list(data).subscribe((res) => {
      // console.log(res)
      if (res && res.message) {
        // this.db.selectedImages = res.message;
        // console.log(this.db.selectedImages)
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
    // console.log(each);
    if (each.options == 'Items') {
      this.load_items(each);
    } else if ( this.doctype == 'Opportunity' ||  each.options == 'Opportunity Item' || each.options == 'Sales Order Item JSON' ||  each.options == 'Sales Invoice Item' || each.options == 'Opportunity Item JSON' ) {
      // this.load_items(each)
      this.load_items_popup(each);
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
        // console.log(leave_approver);
        this.leave_approver = leave_approver.leave_approver;
        this.leave_approver_name = leave_approver.leave_approver_name;
        // this.db.expense_approver_name_subject.next('Success')
        this.form_ctrl_data
          ? this.form_ctrl_data['leave_approver'].setValue(this.leave_approver)
          : null;
        this.form_ctrl_data
          ? this.form_ctrl_data['leave_approver_name'].setValue(
              this.leave_approver_name
            )
          : null;
      } else {
        this.db.alert('Failed');
      }
    });
  }

  close_detail() {
    this.db.enable_detail = false;
    this.db.enable_material = false;
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
    // console.log('hi')
    let data = this.form_data.value;
    // console.log(data)
    if (data.whatsapp_no) {
      let message = encodeURIComponent(data.message); // Encode your message
      let url = `https://api.whatsapp.com/send?phone=${data.whatsapp_no}&text=${message}`;
      window.open(url, '_system');
    } else {
      this.db.alert_animate.next('Please Enter Your Number');
    }
  }
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // console.log(event)
    // Check if the Ctrl key is pressed and the key is 's'
    if (event.ctrlKey && event.key == 's') {
      // Prevent the default behavior (e.g., saving the page)
      event.preventDefault();

      // Submit the form
      this.save_details1('');
    }
  }

  formatDate(dateString, format) {
    const formattedDate = this.datePipe.transform(dateString, format);
    return formattedDate || '';
  }

  extractTime(dateTimeString) {
    if (!dateTimeString) {
      return '';
    }
    const dateTime = new Date(dateTimeString);
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  async get_image(image){
    const modal = await this.modalCtrl.create({
      component: ShowImageComponent,
      cssClass: this.db.ismobile ? 'show-image' : 'web_site_form',
      componentProps: {
        image: image,
      }
    });
    await modal.present();
  }

  async remove_img(imgs){
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
              this.delete(imgs)
          }
        }
      ]
    })
    await alert.present();
    
  }

  delete(imgs){
    let data = {
      doctype: "File",
      filters: {name: imgs.name}
      }
      this.db.delete_docs(data).subscribe(res => {
        // console.log(res)
        if(res && res.status == "Success"){
          this.db.sendSuccessMessage(res.message)
          this.get_image_list();
          // this.modalCtrl.dismiss()
        }
      })
      this.multiple_array = []
  }

  header_accordion(){
    this.toolbar = !this.toolbar;
  }

  event_accordion(){
    this.event_toolbar = !this.event_toolbar;
  }

  tasks_accordion(){
    this.tasks_toolbar = !this.tasks_toolbar;
  }

  file_accordion(){
    this.file_toolbar = !this.file_toolbar;
  }

  // detail_image($event: any, each: any){
  //   this.lead_base64($event.target, each);
  // }

  // async lead_base64(inputValue: any, each): Promise<void> {

  //   // let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
  //   // await loader.present();

  //   if (inputValue.files && inputValue.files.length > 0) {
  //     var file: File = inputValue.files[0];
  //     var file_size = inputValue.files[0].size
  //     this.categoryfile = file.name
  //     var myReader: FileReader = new FileReader();

  //     myReader.onloadend = (e) => {

  //       this.categoryimagedata = myReader.result;
  //       // Push file name

  //       let img_data = {
  //         file_name: this.categoryfile,
  //         content: this.categoryimagedata,
  //         // decode: "True",
  //       }

  //       let array_image:any = []
  //       array_image.push(img_data)
  //       this.post_image = array_image
  //       // console.log(this.post_image);
  //       this.image_datas = img_data
        
  //       // console.log(this.image_datas);

  //       if (file_size <= 10000000) {  //10Mb in BYtes

  //         let img_data = {
  //           file_name: this.categoryfile,
  //           content: this.categoryimagedata,
  //         }
  //         this.multiple_array.splice(0, 0, img_data);
  //         // console.log(this.multiple_array)
         
  //       } else if (file_size > 10000000) { //10Mb in bytes
  //         // loader.dismiss()
  //         this.db.filSizeAlert();
  //       } else if (file_size == 0) {
  //         // loader.dismiss()
  //       }
  //       this.upload_file(img_data);
  //     }
  //     myReader.readAsDataURL(file);
  //   }
    
  // }

  detail_image($event: any){
    this.lead_base64($event.target.files);
}

async lead_base64(files: FileList) {
  // console.log(files)
  for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      const file_size = file.size;
      if (file_size <= 10000000) {  //10Mb in Bytes
          const categoryfile = file.name;
          const categoryimagedata = await this.readFileAsDataURL(file);
          const img_data = {
              file_name: categoryfile,
              content: categoryimagedata,
          };
          this.multiple_array.splice(0, 0, img_data);
          this.upload_file(img_data);
      } else {
          this.db.filSizeAlert();
      }
  }
}

async readFileAsDataURL(file: File){
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
  });
}


editFormDetail(){
  // console.log(this.web_form)
  if(this.web_form && this.web_form.route){
    // this.router.navigateByUrl('/forms/' + this.web_form.route);
    this.web_form.name = this.web_form.doc_type
    this.modalCtrl.dismiss();
    
    if(this.db.ismobile){
      this.router.navigateByUrl('/forms/' + this.web_form.route);
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
   const modal = await this.modalCtrl.create({
     component: WebsiteFormsComponent,
     cssClass: (data.name == 'Lead' || data.name == 'Opportunity' || data.name == 'Quotation' || data.name == 'Customer') ? 'Crm_site_form': 'web_site_form',
     componentProps: {
       page_title: data.doc_type,
       page_route: data.route,
       edit_form_values: undefined,
       edit_form: undefined,
       enable_reference: false,
       enabled_read_only: false,
       enable_height : (data.name == 'Lead' || data.doctype == 'Opportunity' || data.doctype == 'Quotation' || (data.doctype == 'Customer' || data.name == 'Customer')) ? true : false
     },
     enterAnimation: this.db.enterAnimation,
     leaveAnimation: this.db.leaveAnimation,
   });
   await modal.present();
   const val = await modal.onWillDismiss();
   if (val && val.data == 'Success') {
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


get_rating(rating){
  // console.log(rating)
  this.rating_value = rating;
  this.form_ctrl_data['feedback_rating'].setValue(this.rating_value)
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
    console.log("Rating List: ",res.message)
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
}


import {
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

// import { SignaturePad } from 'angular2-signaturepad';
import { DbService } from 'src/app/services/db.service';

import {
  AlertController,
  ModalController,
  LoadingController
} from '@ionic/angular';
import * as moment from 'moment';


@Component({
  selector: 'app-webform-child',
  templateUrl: './webform-child.page.html',
  styleUrls: ['./webform-child.page.scss'],
})
export class WebformChildPage implements OnInit {

  @Input() all_data;
  @Input() child_table_field_name;
  @Input() component_type;
  submitted = false;

  // signature pad

  // signatureImg: string;
  signatureImg: any;
  // @ViewChild(SignaturePad) signaturePad: SignaturePad;

  // signaturePadOptions: Object = {
  //   'minWidth': 2,
  //   'canvasWidth': 700,
  //   'canvasHeight': 300
  // };

  //singnature variables

  signature_fieldname = [];
  signature_base64_url = [];

  // image attach variables

  categoryfile: any;
  categoryimagedata: any;

  field_name: any = [];
  base64_url: any = [];
  item;
  file_name: any = [];

  //End 

  info: any = [];
  form_data: any = FormGroup;
  form_ctrl_data: any = {};
  // section_break_data;
  json_data;
  doctype;
  form_tile;
  link_flelds_name: any = [];
  image_field_check = "no uploads";
  // prem
  service_type_list = ['Business Services', 'Individual Services']
  project_name: any;
  task_description: any;
  selectedFromTime: any;
  selectedToTime: any;
  fromTime: any;
  toTime: any;
  elapsedTime: any;
  isTimerRunning = false;
  timerInterval: any;
  time_duration: any;
  start_time_: any;
  end_time_: any;
  reference_name:any;
  drop_down_value: any = {};
  
  constructor(public db: DbService, private formBuilder: FormBuilder, public alertController: AlertController, public modalctrl: ModalController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  
    // this.splitForms();
    // this.db.side_menu = true;
    // console.log("pop up data", this.all_data)
    // this.drop_down_value = s{};
    // this.drop_down_value = {};

    if(this.all_data && this.all_data.docs[0] && this.all_data.docs[0].name && this.all_data.docs[0].name == 'Supplier Quotation Item'){
    // if(this.all_data && this.all_data[0] && this.all_data[0].doctype && this.all_data[0].doctype == 'Supplier Quotation Item'){  
      let count = this.all_data.docs[0].fields.findIndex((res)=>{ return res.label == 'Item Weight Details'})
      if(count >= 0){
        this.all_data.docs[0].fields = this.all_data.docs[0].fields.slice(0,count);
        // console.log(this.all_data.docs[0].fields)
      }
    }

    let field_data = this.all_data.docs[0].fields;
    this.info = this.all_data.docs[0].fields
    this.doctype = this.all_data.docs[0].name;
    
    // let field_data = this.all_data.message.meta_data.fields;
    // this.doctype = this.all_data.message.meta_data.name;
    this.json_data = field_data

    // Store doctype for api resource method to db

    // this.db.doc_type = this.doctype;
    // this.db.ad_name = this.titleCase(this.form_tile);

    this.store_info()
    // this.filter_section_break();
    this.splitForms()
    this.assign_final_data()

    this.form_data = this.formBuilder.group(
      this.form_ctrl_data
    );

    this.sub = this.db.select_drop_down.subscribe((res: any) => {
      if (res && res.status && res.status == 'success') {
        
        delete res.status;
        let value = res.fieldname_value
        if (this.form_ctrl_data && this.form_ctrl_data[res.fieldname] && (res.fieldname == 'item_code' || res.fieldname == 'item_name')) {
          this.form_ctrl_data[res.fieldname].setValue(res['name']);
          this.form_ctrl_data[res.fieldname_value].setValue(res['label']);
          // this.drop_down_value[res.fieldname] = res.label;

          if(res.fieldname == 'item_code'){
            // this.get_item_details(res);
          }
          // this.selected_value(res);
        }else if(this.form_ctrl_data && this.form_ctrl_data[res.fieldname]){
        this.form_ctrl_data[res.fieldname].setValue(res['name']);
        this.drop_down_value[res.fieldname] = res.name ? res.name : res.label;
          if(res.fieldname == 'expense_type'){
             let data ={
                "expense_type":res['name'],
                "company":(this.db.form_values && this.db.form_values['company']) ? this.db.form_values['company'] : ''
             }
            this.db.get_default_account(data).subscribe(res=>{
               if(res.status == "Success"){
                this.form_ctrl_data['default_account'].setValue(res['message'][0]['default_account']);
                this.drop_down_value['default_account'] = res['message'][0]['default_account'];
               }
            })
          } else if (res.fieldname == "reference_doctype") {
            this.form_ctrl_data['reference_doctype'].setValue(res['value'])
            this.drop_down_value[res.fieldname] = res['value'];
            this.reference_name = this.drop_down_value[res.fieldname]
          }else if(res.fieldname == "activity_type" && this.doctype == 'Timesheet Detail'){
            this.get_billable_details(res.name)
          }else if(res.fieldname == "task" && this.doctype == 'Task Depends On'){
            this.getTaskName(res.name)
          }

          if(res.fieldname == "reference_docname"){
            // console.log(this.drop_down_value['reference_doctype'])
            if(this.drop_down_value['reference_doctype'] && res.name){
              this.getEmailId(this.drop_down_value['reference_doctype'], res.name)
            }
          }

        }
      }
    })

  }

  getEmailId(doctype,id){
    let data = {
      doctype: doctype,
      name: id
    }
    this.db.doc_detail(data).subscribe(res => {
      console.log(res, 'Email Id')
      if(res.message && res.message.length != undefined){
        let keyObject = Object.keys(res.message[1])
        keyObject.map(resKey => {
          if(resKey.includes('mail')){
            console.log(res.message[1][resKey])
            this.form_ctrl_data['email'].setValue(res.message[1][resKey])
          }
        })
      }else if(res && res.status == 'Success'){
        let keyObject = Object.keys(res.message)
        keyObject.map(resKey => {
          if(resKey.includes('mail')){
            console.log(res.message[resKey])
            this.form_ctrl_data['email'].setValue(res.message[resKey])
          }
        })
      }
    })
  }

  getTaskName(id){
    let data = {
      doctype: 'Task',
      name: id
    }
    this.db.doc_detail(data).subscribe(res => {
      if (res.message && res.message[0] && res.message[0]['status'] && res.message[0]['status'] == 'Success') {
        this.info.map(resMap => {
          if(resMap.fieldname == 'subject'){
            resMap.hidden = 0;
            resMap.read_only = 1;
            this.form_ctrl_data['subject'].setValue(res.message[1]['subject']);
          }
        })
      }
    })
  }

  get_item_details(res){
    //  let data = {
    //     "item_code":res['name'],
    //     "customer":this.db.customer_details['customer'],
    //     "doctype":"Sales Order"
    //  }
    //  this.db.get_item_detail(data).subscribe((r:any)=>{
    //     if(r && r.status == 'Success' && r.message){
    //       this.form_ctrl_data['item_code'].setValue(r.message.item_code)
    //       this.form_ctrl_data['item_name'].setValue(r.message.item_name)

    //       let keys = Object.keys(r.message);

    //       if(keys && keys.length != 0){
    //         keys.map((key:any)=>{
              
    //           if(this.form_ctrl_data[key]){
    //             if(key == 'rate' || key == 'base_rate'){
    //               r.message[key] = res.rate;
    //             }
    //             this.form_ctrl_data[key].setValue(r.message[key]);
    //           }
    //         }) 
    //       }

    //     if(this.form_ctrl_data['rate'] && res.rate){
    //       // this.form_ctrl_data['rate'].setValue(res.rate);
    //       // this.form_ctrl_data['base_rate'] ? this.form_ctrl_data['base_rate'].setValue(res.rate) : null;
    //       this.form_ctrl_data['base_amount'] ? this.form_ctrl_data['base_amount'].setValue(res.rate) : null;
    //       this.form_ctrl_data['amount'] ? this.form_ctrl_data['amount'].setValue(res.rate) : null;

    //     }else if(this.form_ctrl_data['rate'] && r.message.valuation_rate){
    //       this.form_ctrl_data['rate'].setValue(r.message.valuation_rate);
    //     }
    //       this.selected_value(res.message);
    //     }
    //  })
  }




  selected_value(eve){
    let selected_values = eve;
    let qty =  this.info.find(res => res.fieldname == "qty");
    qty.value = 1;
    // this.item_name = selected_values.item_name;
    // this.item_name = selected_values.item_code;
    this.info.map(res => {
      this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(selected_values[res.fieldname]) : null;
      //  if(res.fieldname == "rate"){
      //   res.value = selected_values.rate;
      //   res.value = Number(res.value).toFixed(2);
      //  }else if(res.fieldname == "amount"){
      //   res.value = selected_values.rate * (qty.value ? qty.value : 1);
      //   res.value = Number(res.value).toFixed(2);
      //  }else if(res.fieldname == "qty"){
      //   res.value = res.value ? res.value : 1;
      //   // res.value = Number(res.value).toFixed(2);
      //  }

    })
  }

  sub: any;

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // Title case the title 

  // titleCase(str) {
  //   return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
  // }

  // store form control details
  all_select_values = {};

  store_info() {

    // For Storing filtered data

    this.json_data.map(res => {

      // if (res.fieldtype != "Barcode" && res.fieldtype != "Button" && res.fieldtype != "Color" && res.fieldtype != "Duration"  && res.fieldtype != "Fold" && res.fieldtype != "Geolocation" && res.fieldtype != "Heading" && res.fieldtype != "Image" && res.fieldtype != "Markdown Editor" && res.fieldtype != "Percent" && res.fieldtype != "Read Only" && res.fieldtype != "Rating" && res.fieldtype != "Table" && res.fieldtype != "Table MultiSelect" && res.fieldtype != "Section Break") {
      //   // if (res.fieldtype != "Barcode" && res.fieldtype != "Button" && res.fieldtype != "Color" && res.fieldtype != "Duration" && res.fieldtype != "Dynamic Link" && res.fieldtype != "Fold" && res.fieldtype != "Geolocation" && res.fieldtype != "Heading" && res.fieldtype != "Image" && res.fieldtype != "Markdown Editor" && res.fieldtype != "Percent" && res.fieldtype != "Read Only" && res.fieldtype != "Rating" && res.fieldtype != "Table MultiSelect") {
      //   res.show ? res.show = false : null;
      //   this.info.push(res);
      // }

      if (res.fieldtype == "Link" || res.fieldtype == "Dynamic Link") {
        this.link_flelds_name.push(res.options);
      }
      // getting link field options

      if (res.fieldtype == "Link") {

        // this.current_gen_links(res.options);

        this.link_flelds_name.push(res.options);
      }
      if (res.fieldtype == "Select") {
        this.all_select_values[res.fieldname] = res.options.split('\n')
      }

    })

    // console.log("filtered data", this.info)

    // For web form controls

    // this.info.data.web_form_fields.map(res => {

    this.info.map(res => {
 
      res.value ? delete res.value : null;

      if (res.label && res.fieldtype != "Section Break" && res.fieldtype != "Column Break" && res.fieldtype != "Barcode" && res.fieldtype != "Button" && res.fieldtype != "Color" && res.fieldtype != "Duration" && res.fieldtype != "Fold" && res.fieldtype != "Geolocation" && res.fieldtype != "Heading" && res.fieldtype != "Image" && res.fieldtype != "Markdown Editor" && res.fieldtype != "Percent" && res.fieldtype != "Read Only" && res.fieldtype != "Rating" && res.fieldtype != "Table" && res.fieldtype != "Table MultiSelect") {
        // if (res.label && res.fieldtype != "Section Break" && res.fieldtype != "Column Break" && res.fieldtype != "Barcode" && res.fieldtype != "Button" && res.fieldtype != "Color" && res.fieldtype != "Duration" && res.fieldtype != "Dynamic Link" && res.fieldtype != "Fold" && res.fieldtype != "Geolocation" && res.fieldtype != "Heading" && res.fieldtype != "Image" && res.fieldtype != "Markdown Editor" && res.fieldtype != "Percent" && res.fieldtype != "Read Only" && res.fieldtype != "Rating" && res.fieldtype != "Table MultiSelect") {
         
        if(res.read_only == 1){
          res.hidden = 1;
        }

        if(res.fieldname == 'conversion_factor'){
          res.value = 1;
        }else if(res.fieldname == 'stock_uom'){
          res.value = 'Nos';
        }

        res.value = res.value ? res.value : '';

        if (res.reqd == 1 && res.options != 'Email' && res.fieldtype != 'Attach') {
          this.form_ctrl_data[res.fieldname] = new FormControl((res.value), Validators.required)
        } else if (res.reqd == 1 && res.options == 'Email') {
          this.form_ctrl_data[res.fieldname] = new FormControl((res.value), [Validators.required, Validators.email])
        } else if (res.options == 'Email') {
          this.form_ctrl_data[res.fieldname] = new FormControl((res.value), Validators.email)
        } else if (res.fieldtype == 'Check') {
          this.form_ctrl_data[res.fieldname] = new FormControl(false)
        } else if (res.reqd == 1 && res.fieldtype == 'Attach') {
          res.file_url = undefined;
          this.form_ctrl_data[res.fieldname] = new FormControl((res.value), Validators.required)
        } else if (res.fieldtype == "Dynamic Link") {
          this.form_ctrl_data[res.fieldname] = new FormControl(res.value)
        }else {
          this.form_ctrl_data[res.fieldname] = new FormControl(res.value)
        }
      }

      if(localStorage['selected_project_id'] && this.doctype == "Timesheet Detail" && res.fieldname == 'project'){
        let value = localStorage['selected_project_id']
        this.drop_down_value[res.fieldname] = value
        this.form_ctrl_data[res.fieldname].setValue(value)
      }

      if(localStorage['selected_project_name'] && this.doctype == "Timesheet Detail" && res.fieldname == 'project_name'){
        let value = localStorage['selected_project_name']
        this.form_ctrl_data[res.fieldname].setValue(value)
      }

      if(res.fieldname == 'cost_center' && this.doctype == 'Expense Claim Detail'){
        let value = (this.db.company_detail && this.db.company_detail.cost_center) ? this.db.company_detail.cost_center : '';
        this.drop_down_value[res.fieldname] = value;
        this.form_ctrl_data[res.fieldname] ? this.form_ctrl_data[res.fieldname].setValue(value) : null;
        console.log(this.drop_down_value,'this.drop_down_value')
      }
      

      // console.log('store data')
      if(this.doctype == "Expense Claim Detail"){
        if(res.fieldname == "lead" || res.fieldname == "branch" || res.fieldname == "appointment" || res.fieldname == "about_us_settings" || res.fieldname == "address" || res.fieldname == "divisions" || res.fieldname == "access_log"){
          res.hidden = 1
        }
      }else if(this.doctype == "Timesheet Detail"){
        // || res.fieldname == "completed" 
        if(res.fieldname == "expected_hours" || res.fieldname == "checklist_html" || res.fieldname == "checklist_json" || res.fieldname == "billing_hours" || res.fieldname == "billing_rate" || res.fieldname == "costing_rate" || res.fieldname == "base_costing_amount" || res.fieldname == "costing_amount"){
          res.hidden = 1
        }
      }else if(this.doctype == "Salary Detail"){
        if(res.fieldname == "condition" || res.fieldname == "amount_based_on_formula" || res.fieldname == "formula" || res.fieldname == "default_amount" || res.fieldname == "additional_amount" || res.fieldname == "tax_on_flexible_benefit" || res.fieldname == "tax_on_additional_salary" || res.fieldname == 'statistical_component' || res.fieldname == 'do_not_include_in_total'){
          res.hidden = 1
        }
      }
    })
    // console.log(this.info)
    // console.log('loop form group data', this.form_ctrl_data)
  }

  check_box(event: any, each: any) {
    // console.log(event)
    // console.log(each)
    if(each.fieldname == 'is_billable'){

      this.info.map(res => {
        if(this.doctype == "Timesheet Detail"){
          // || res.fieldname == "completed" 
          if(res.fieldname == "billing_hours" || res.fieldname == "billing_rate" || res.fieldname == "costing_rate" || res.fieldname == "base_costing_amount" || res.fieldname == "costing_amount"){
            if(event.detail.checked == true){
              res.hidden = 0
            }else{
              res.hidden = 1
            }
          }
        }
      })

    }
  }


  // Get link field options


  ref_doc: any = [];

  all_link_opts = {};
  current_gen_links(link_field_array) {

    // console.log("Doc name", refdoc);

    // each.editValue = 0;

    // if (!this.ref_doc.includes(refdoc)) {

    link_field_array.map(refdoc => {

      this.ref_doc.push(refdoc);

      this.db.ref_doc_type = refdoc;

      // console.log("ref doc type", refdoc)
      // console.log("Doctype", this.db.doc_type)

      // console.log(this.link_opts.length);
      // console.log(this.link_opts);

      this.db.get_link_field_options().subscribe(res => {

        // console.log("link field ", res.data)

        let res_data = res.data

        let link_opts: any = [];

        res_data.map(res => {

          link_opts.push(res.name)

        })

        // console.log("link options", refdoc, "=====", link_opts)

        this.all_link_opts[refdoc] = link_opts;
      })

    })


  }

  // End


  // Filter the section for section break and if a form having without section breake last if conditon will work

  section_break_data: any = {};
  each_sec_data: any = [];
  section_break_name: any = [];
  test_section_break_data: any = [];
  test_section_break_name: any = [];

  // if api have column break or not column break and not have section breake the value will be sstore here
  no_sec_col: any = [];
  //end

  // Setting margin value for each flex div
  // The css and the below value must be same for apply e:g flex:0 0 calac(%-flex_margin)
  flex_margin: any = "0px";
  // end var
  store_field_type: any = [];
  // Store field name && check it has lable or not

  // store_field_name;
  // count = 0;
  change_data(event, fieldname) {
    let value = event.target.value
    if (fieldname == 'client_loc') {
      this.info.map(res => {
        if (res.depends_on) {
          if (value == 'Yes') { res.show = true } else { res.show = false }
        }
      })
    }
  }

  splitForms(){
    // console.log(this.info);

    if(this.info && this.info[0] && this.info[0].fieldtype && this.info[0].fieldtype != 'Section Break'){
      let obj = [{
        "doctype": "DocField",
        "name": "80a588123a",
        "creation": "2013-05-22 12:43:10",
        "modified": "2023-02-07 14:44:02.428394",
        "modified_by": "Administrator",
        "owner": "Administrator",
        "docstatus": 0,
        "parent": "Supplier Quotation Item",
        "parentfield": "fields",
        "parenttype": "DocType",
        "idx": 8,
        "fieldname": "section_break_5",
        "label": " ",
        "fieldtype": "Section Break",
        "search_index": 0,
        "show_dashboard": 0,
        "hidden": 0,
        "set_only_once": 0,
        "allow_in_quick_entry": 0,
        "print_hide": 0,
        "report_hide": 0,
        "reqd": 0,
        "bold": 0,
        "in_global_search": 0,
        "collapsible": 1,
        "unique": 0,
        "no_copy": 0,
        "allow_on_submit": 0,
        "show_preview_popup": 0,
        "permlevel": 0,
        "ignore_user_permissions": 0,
        "columns": 0,
        "in_list_view": 0,
        "fetch_if_empty": 0,
        "in_filter": 0,
        "remember_last_selected_value": 0,
        "ignore_xss_filter": 0,
        "print_hide_if_no_value": 0,
        "allow_bulk_edit": 0,
        "in_standard_filter": 0,
        "in_preview": 0,
        "read_only": 0,
        "length": 0,
        "translatable": 0,
        "hide_border": 0,
        "hide_days": 0,
        "hide_seconds": 0,
        "non_negative": 0,
        "is_virtual": 0,
        "sort_options": 0,
        "fields": [],
        "permissions": [],
        "actions": [],
        "links": [],
        "states": [],
        "search_fields": null,
        "is_custom_field": null,
        "linked_document_type": null
      }]
      this.info = [...obj,...this.info];
    }

    this.info.map((res, index) => {
      this.store_field_type.push(res.fieldtype);

      if (res.fieldtype == "Percent") {
        res.fieldtype = "Int"
      }

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
        // let flex_out =  '0 0 calc(' + p__flex + ' ' + '-' + ' ' + ((this.db.ismobile || this.modal) ? '10px' : (this.doctype == 'ToDo' && this.forms_route == 'activity-task') || (this.doctype == 'Event' && this.forms_route == 'event-form') ? '0px' : this.flex_margin) +')';
        // let flex_out = '0 0 calc(' + p__flex + ' ' + '-' + ' ' + ((this.db.ismobile) ? '10px' : this.flex_margin) +')';
        let flex_out = '0 0 calc(' + p__flex + ' ' + '-' + ' ' + ((this.db.ismobile) ? '10px' : '7px') +')';

        // console.log(flex_out)  
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
    
    // console.log(this.store_field_type);
    // console.log(this.section_break_data);

  }

  filter_section_break() {

    // function call for Getting link field options

    // this.current_gen_links(this.link_flelds_name);

    this.info.map((res, index) => {

      this.store_field_type.push(res.fieldtype);

      if (res.fieldtype == "Section Break") {

        let k = index;
        let count = 0;

        while (k < this.info.length) {

          if (k != index) {

            if (this.info[k].fieldtype != "Section Break" && this.info[k].fieldtype != "Column Break") {
              this.each_sec_data.push(this.info[k]);
            } else if (this.info[k].fieldtype == "Section Break") {
              break
            }
          }

          if (this.info[k].fieldtype == "Column Break") {
            count++
          }
          k++
        }

        this.section_break_data[res.fieldname] = this.each_sec_data;
        this.section_break_data[res.fieldname].count = count + 1;
        let p__flex = ((100 / (count + 1)) + '%');
        let flex_out = "0 0 calc(" + p__flex + " " + "-" + " " + this.flex_margin + ")";
        this.section_break_data[res.fieldname].flex = flex_out.toString();
        res.flex = flex_out.toString();

        // this.section_break_data[res.fieldname].label = res.label
        if (res.label || !res.label) {
          if (!res.label) {
            this.section_break_data[res.fieldname].label = undefined;
          }
          else {
            this.section_break_data[res.fieldname].label = res.label
          }
        }
        this.test_section_break_data.push(res.fieldname);
        this.test_section_break_name.push(res.fieldname);
        this.each_sec_data = [];
      }
    });
    // console.log("type", this.store_field_type)
    if (!this.store_field_type.includes("Section Break")) {
      this.info.map(res => {
        // console.log("wsec", res);
        // console.log(this.section_break_name);
        if (res.fieldtype != "Column Break") {
          this.no_sec_col.push(res);
        }

      })
    }

    // console.log(this.info.data.web_form_fields);
    console.log(this.info);
  }

  // End

  // Check and assign a section brake fields into another section break if section comes without label

  label_name;
  section_break_data_2 = undefined;
  count = 0;
  check_assign_sec_break() {

    return new Promise<void>((resolve, reject) => {

      this.test_section_break_name.map((res, index) => {

        if (this.section_break_data[res] && this.section_break_data[res].label) {
          this.label_name = res;
        }
        else if (this.section_break_data[res] && !this.section_break_data[res].label) {
          this.section_break_data[res].map(name => {
            this.section_break_data[this.label_name].push(name);
          })
          delete this.section_break_data[res];
          let index_value = this.test_section_break_data.indexOf(res)
          this.test_section_break_data.splice(index_value, 1);
        }
      })
      resolve();
    })
    // this.section_break_name = this.test_section_break_data
    // this.section_break_data_2 = this.section_break_data;
    // console.log("All section data-2", this.section_break_data)
    //   console.log('sec name', this.section_break_name)
  }

  // Assign final data ref


  async assign_final_data() {

    // console.log('sec data', this.section_break_data);

    await this.check_assign_sec_break();

    this.section_break_name = this.test_section_break_data
    this.section_break_data_2 = this.section_break_data;

    // console.log("section name", this.section_break_name)
    // console.log("All section data-2", this.section_break_data)

  }





  // Save submitted data

  save_details1() {

    let array:any = [];
    let key = Object.keys(this.form_data.controls);
    
    key.map((res:any)=>{
      if(this.form_data.controls[res].status == 'INVALID'){
        array.push(res)
      }
    })

    if(this.form_ctrl_data['stock_uom']){
      this.form_ctrl_data['stock_uom'].setValue('Nos');    
    }

    this.submitted = true;

    // setTimeout(() => {     //Delay the api call for attach and getting image api call response for get the URL of image and attach to image field 

    if (this.image_field_check == "no uploads" || this.image_field_check == "true") {

      // Store empty variables
      this.info.map(res => {
        if (res.fieldtype == 'Check') {
          if (this.form_data.value[res.fieldname]) {
            this.form_data.value[res.fieldname] = 1
          }
          else if (!this.form_data.value[res.fieldname]) {
            this.form_data.value[res.fieldname] = 0
          }
        }

      });

      this.images_array.map(res => {
        this.info.map(info => {
          if (res.fieldname == info.fieldname) {
            this.form_data.value[res.fieldname] = res.image_url;
          }
        })
      })

      // console.log(this.form_data)

      if (this.form_data.status == "VALID") {
        // alert("Valid")
        let data = {};
        this.info.map(res => {

          // console.log(this.form_data.value['title'])

          if (res.fieldtype != "Column Break" && res.fieldtype != "Section Break") {
            data[res.fieldname] = this.form_data.value[res.fieldname]
          }

        })

        // console.log("final sent data", data)

        if(data && data['from_time'] && data['from_time'].includes('T')){
          data['from_time'] = data['from_time'].replace('T', ' ')
        }

        if(data && data['to_time'] && data['to_time'].includes('T')){
          data['to_time'] = data['to_time'].replace('T', ' ')
        }

        let input_data = {
          responsedata: data
        }

        let vault_data = {
          // file: this.base64_binary(this.categoryimagedata),
          doctype: 'User',
          docname: localStorage['email'],
          file_name: this.categoryfile,
          is_private: 1,
          content: this.categoryimagedata,
          document_name: this.form_data.value['document_type'],
          user_id: localStorage['email'],
          file_type: this.file_type,
          total_hours: this.time_duration
        }
        //  console.log(vault_data);
        this.modalctrl.dismiss({
          form_data: data,
          child_table_field_name: this.child_table_field_name,
          vault_data: vault_data
        });

        this.submitted = false;
        this.image_field_check == "true"
      } else {
        // this.db.alert('Please enter required data')
      }
    }

    else if (this.image_field_check == "false") {
      // this.db.imageAlert();
    }
    // }, 1500);
  }


  //Image attach and Path finder 
  image_count: any = [];

  changeListener($event, each): void {

    this.image_count.push(each.fieldname);
    this.image_field_check = "false";
    // let data = this.form_data.get(fieldname)
    // this.readThis($event.target, fieldname);
    if (this.component_type && this.component_type == 'document-vault') {
      this.readThis1($event.target, each);
    } else {
      this.readThis($event.target, each);
    }

  }

  images_array: any = []

  async readThis(inputValue: any, each): Promise<void> {
    let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    await loader.present();

    if (inputValue.files.length > 0) {
      var file: File = inputValue.files[0];
      var file_size = inputValue.files[0].size
      this.categoryfile = file.name
      var myReader: FileReader = new FileReader();

      myReader.onloadend = (e) => {

        this.categoryimagedata = myReader.result;
        // Push file name

        let img_data = {
          file_name: this.categoryfile,
          content: this.categoryimagedata,
          decode: "True",
        }

        if (file_size <= 10000000) {  //10Mb in BYtes

          this.db.upload_image(img_data).subscribe(res => {


            let checks_rep = res ? true : false;

            let unique_name = res.data.name;

            if (checks_rep == true) {

              this.db.upload_image_url(unique_name).subscribe(url => {

                let file_url = url.data.file_url

                if (url) {
                  loader.dismiss()
                  each.file_url = file_url;
                  let value = this.images_array.find(res => res['fieldname'] == each.fieldname);
                  if (value) {
                    this.images_array.map(res => {
                      if (res['fieldname'] == each.fieldname) {
                        res['image_url'] = file_url
                      }
                    })
                  } else {
                    let obj: any = { 'fieldname': each.fieldname, 'image_url': file_url };
                    this.images_array.push(obj);
                  }
                }

                let index_v = this.image_count.indexOf(each.fieldname);
                this.image_count.splice(index_v, 1);
                if (this.image_count.length == 0) {
                  this.image_field_check = "true";
                }

              }, error => { loader.dismiss() })
            }
          }, error => { loader.dismiss() })
        } else if (file_size > 10000000) { //10Mb in bytes
          loader.dismiss()
          this.db.filSizeAlert();
          this.base64_url.splice(this.field_name.indexOf(this.field_name[each.fieldname]), 1);
          this.field_name.splice(this.field_name.indexOf(this.field_name[each.fieldname]), 1);
          // if(this.edit_data_details && this.edit_data_details[each.fieldname]){
          //   this.edit_data_details[each.fieldname]="";
          // }
          let ind_v = this.image_count.indexOf(each.fieldname);
          this.image_count.splice(ind_v, 1);
          if (this.image_count.length == 0) {
            this.image_field_check = "true";
          }

          this.form_data.controls[each.fieldname].reset();

        } else if (file_size == 0) {
          loader.dismiss()
        }

      }
      myReader.readAsDataURL(file);
    }
  }

  file_type;

  readThis1(inputValue: any, each): void {
    // console.log(this.form_ctrl_data);
    var file: File = inputValue.files[0];
    var file_size = inputValue.files[0].size;
    this.file_type = file.name.split('.').pop();

    this.categoryfile = file.name
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {

      this.categoryimagedata = myReader.result;

      if (file_size <= 10000000) {  //10Mb in BYtes

      } else {
        this.db.filSizeAlert();
        this.form_data.controls[each.fieldname].reset();
      }
    }
    myReader.readAsDataURL(file);
  }

  save_details() {
    this.save_details1();
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

  // ion_change(eve, item) {
  //   console.log(eve)
  //   if (item.fieldname == 'quantity' || item.fieldname == 'qty') {
  //     let quantity = eve.target.value;
  //     let rate = this.info.find(res => res.fieldname == "rate");
  //     this.info.map(res => {
  //       if (res.fieldname == "amount") {
  //         res.value = rate.value * (quantity ? quantity : 1);
  //         res.value = Number(res.value).toFixed(2);
  //       }

  //     })
  //   }

  // }

  open_drop_down_options(type, fieldname, fieldname_value) {
    this.db.select_options = '';
    console.log(fieldname,"fieldname")
    if(fieldname != 'default_account' &&  fieldname != 'reference_docname'){
      console.log(type,'type')
      let data = this.form_data.value;
      let selected_value = data[fieldname] ? data[fieldname] : '';  
      this.db.open_drop_down_options(type, fieldname, fieldname_value, selected_value)
    }
    this.drop_down_value.reference_docname = ''

    if (fieldname == 'reference_docname') {
      let reference_data = {
        doctype: this.reference_name,
        page_length: 20,
        page_no: 1,
        search_text: ''
      }
      this.db.open_drop_down_options(type, fieldname, fieldname_value, reference_data)
    }
  }

  ion_change(eve,obj){  
    // console.log(this.doctype);
    if(this.doctype == 'Expense Taxes and Charges'){
      if(obj.fieldname == 'rate'){
        obj.value = eve.target.value;
        obj.value = Number(obj.value);
        let sanctioned_amount = (this.db.form_values && this.db.form_values['total_sanctioned_amount']) ? this.db.form_values['total_sanctioned_amount'] : 0
        let amount =  this.info.find(res => res.fieldname == "tax_amount");
        let total =  this.info.find(res => res.fieldname == "total");
        obj.value = obj.value ? obj.value : 1
        amount.value  = sanctioned_amount * (obj.value / 100)
        total.value = amount.value + sanctioned_amount;    
        amount.value = amount.value.toFixed(2);
        total.value = total.value.toFixed(2);
      }else if(obj.fieldname == 'tax_amount'){
        obj.value = eve.target.value;
        obj.value = Number(obj.value);
        let sanctioned_amount = (this.db.form_values && this.db.form_values['total_sanctioned_amount']) ? this.db.form_values['total_sanctioned_amount'] : 0
        let rate =  this.info.find(res => res.fieldname == "rate");
        let total =  this.info.find(res => res.fieldname == "total");
        rate.value = rate.value ? rate.value : 1
        obj.value  = sanctioned_amount * (rate.value / 100)
        total.value = obj.value + sanctioned_amount;  
        obj.value = obj.value.toFixed(2);
        total.value = total.value.toFixed(2);  
      }
    }else{
      if(obj.fieldname == 'qty'){
        let quantity = eve.target.value;
        obj.value = Number(quantity);
        let rate =  this.info.find(res => res.fieldname == "rate");
        if(rate){
          this.info.map(res => {
           if(res.fieldname == "amount"){
             res.value = rate.value * (quantity ? quantity : 1);
             res.value = Number(res.value).toFixed(2);
            }
          })
        }
      }else if(obj.fieldname == 'rate'){
        let rate = eve.target.value;
        obj.value = Number(rate);
        // let rate =  this.info.find(res => res.fieldname == "rate");
        let qty =  this.info.find(res => res.fieldname == "qty");
        if(qty){
          this.info.map(res => {
           if(res.fieldname == "amount"){
             res.value = qty.value * (rate ? rate : 1);
             res.value = Number(res.value).toFixed(2);
            }
          })
        }
      }else if(obj.fieldname == 'amount' || obj.fieldname == 'sanctioned_amount'){
        // 
        // console.log(this.db.form_values);
        this.info.map(res => {
          if(res.fieldname == "sanctioned_amount"){
            res.value = eve.target.value;
           }
         })


      }
    }
  } 

    select_value(event:any){
      const inputElement = event.target.querySelector('input') as HTMLInputElement;
      inputElement.select();
    }

    get_blur(value){
      value = Number(value).toFixed(2);
    }

    updateElapsedTime() {
      if (this.isTimerRunning && this.fromTime) {
        if (this.toTime) {
          this.elapsedTime = moment.duration(this.toTime.diff(this.fromTime));
        } else {
          this.elapsedTime = moment.duration(moment().diff(this.fromTime));
        }
      }
    }
  
    toggleTimer() {
      if (this.isTimerRunning) {
        this.stopTimer();
      } else {
        this.startTimer();
      }
    }
  
    startTimer() {
      if (!this.fromTime) {
        this.fromTime = moment();
        this.selectedFromTime = this.fromTime.format('YYYY-MM-DDTHH:mm');
      }
  
      if (this.toTime) {
        const elapsedMilliseconds = moment().diff(this.fromTime);
        this.fromTime = moment().subtract(elapsedMilliseconds);
        this.selectedFromTime = this.fromTime.format('YYYY-MM-DDTHH:mm');
      }

      this.form_ctrl_data['from_time'].setValue(this.selectedFromTime);

  
      this.toTime = null;
      this.updateElapsedTime();
  
      this.timerInterval = setInterval(() => {
        this.updateElapsedTime();
      }, 1000);
  
      this.isTimerRunning = true;
    }
  
    stopTimer() {
      clearInterval(this.timerInterval);
      this.toTime = moment();
      this.selectedToTime = this.toTime.format('YYYY-MM-DDTHH:mm');
      this.form_ctrl_data['to_time'].setValue(this.selectedToTime);
      this.updateElapsedTime();
      this.isTimerRunning = true;
      this.formatElapsedTime()
    }
  
    formatElapsedTime(): any {
      if (this.elapsedTime) {
        const hours = Math.floor(this.elapsedTime.asHours());
        const minutes = this.elapsedTime.minutes();
        const seconds = this.elapsedTime.seconds();
  
        this.time_duration = hours;
        this.form_ctrl_data['hours'].setValue(this.time_duration);
        // return `${hours} : ${minutes} : ${seconds}`;
        return `${hours < 10 ? ('0' + hours) : hours} : ${minutes < 10 ? ('0' + minutes) : minutes} : ${seconds < 10 ? ('0' + seconds) : seconds}`;
      } else {
        return '00:00:00';
      }
    }
  
    onFromTimeChange() {
      const currentTime = moment();
      const elapsedTimeBeforeChange = this.elapsedTime;
    
      this.fromTime = moment(this.selectedFromTime);
    
      // if (this.isTimerRunning) {
      //   this.stopTimer();
      //   this.toTime = this.fromTime.clone().add(elapsedTimeBeforeChange);
      //   // this.selectedToTime = this.toTime.format('YYYY-MM-DDTHH:mm');
      // }
    
      this.startTimer();
    }

    onToTimeChange(data,each) {
      
      // console.log(this.selectedFromTime)
      // this.toTime = moment();
      this.selectedToTime = data.detail.value;
      this.form_ctrl_data['to_time'].setValue(this.selectedToTime);
      let dateString1 = this.selectedFromTime ? this.selectedFromTime : undefined
      let dateString2 = data.detail.value;

      if(dateString1){
        const date1 = new Date(dateString1);
        const date2 = new Date(dateString2);
  
        if (date1 > date2) {
          this.db.alert('To date cannot be before from date')
          this.form_ctrl_data[each.fieldname].setValue('');
        } else if (date1 < date2) {
          // this.stopTimer();
          this.toTime = moment(data.detail.value);
        } else {
          // this.stopTimer();
          this.toTime = moment(data.detail.value);
        }
      }else{
        this.form_ctrl_data[each.fieldname].setValue('');
        this.db.alert('Please select the from time')
      }

      this.updateElapsedTime();
      // this.formatElapsedTime()

    }
  
  
    // onToTimeChange(data) {
    //   console.log(data)
    //   if (this.isTimerRunning) {
    //     this.stopTimer();
    //     this.toTime = moment(data.detail.value);
    //     this.startTimer();
    //   } else {
    //     this.toTime = moment(data.detail.value);
    //     this.updateElapsedTime();
    //   }
    //   this.formatElapsedTime()
    // }
  

    start_time(eve){
      this.start_time_ = eve.detail.value
      let startDate = new Date(this.start_time_);
      let endDate = new Date(this.end_time_);
      this.calculateDuration(startDate,endDate)
    }

    stop_time(eve){
      this.end_time_ = eve.detail.value
      let startDate = new Date(this.start_time_);
      let endDate = new Date(this.end_time_);
      this.calculateDuration(startDate,endDate)
    }

    calculateDuration(endDate,startDate) {
      const diffMilliseconds = startDate.getTime() - endDate.getTime();
  
      const hours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
      const minutes = Math.floor((diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMilliseconds % (1000 * 60)) / 1000);
  
      this.time_duration  = hours + (minutes / 60) + (seconds / 3600);
      // console.log(this.time_duration)
      this.form_ctrl_data['hours'].setValue(this.time_duration);
  
    }

    get_billable_details(activity){
      let data = {
        activity_type: activity,
        currency: 'INR'
      }
      this.db.get_billable_details(data).subscribe(res => {
        // console.log(res)
        if(res && res.message){
          this.form_ctrl_data['billing_rate'].setValue(res.message.billing_rate);
          this.form_ctrl_data['costing_rate'].setValue(res.message.costing_rate);
        }
      })
    }

    open_dynamic_link(each){
      if(this.form_ctrl_data['reference_doctype']['status'] == "VALID" && this.form_ctrl_data['reference_doctype']['value']){
        this.reference_name = this.form_ctrl_data['reference_doctype']['value']
        this.open_drop_down_options(each.options,each.fieldname,'item_name')
      }
    }
}

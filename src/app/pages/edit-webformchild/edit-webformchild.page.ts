import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
// import { SignaturePad } from 'angular2-signaturepad';
import { DbService } from 'src/app/services/db.service';
import * as moment from 'moment';

@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-webformchild',
  templateUrl: './edit-webformchild.page.html',
  styleUrls: ['./edit-webformchild.page.scss'],
})

export class EditWebformchildPage implements OnInit {

  @Input() all_data;
  @Input() child_table_field_name;
  @Input() all_values;
  @Input() index_value;
  @Input() enabled_read_only =false;
  submitted = false;
  // signature pad
  signatureImg: any;
  project_name: any;
  task_description: any;
  // @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 700,
    'canvasHeight': 300
  };
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
  form_data:any = FormGroup;
  form_ctrl_data: any = {};
  // section_break_data;
  json_data;
  doctype;
  form_tile;
  link_flelds_name:any = [];
  image_field_check = "no uploads";
  values;
  time_duration: any;
  duration : any;
  reference_name:any;
  constructor(public ref: ChangeDetectorRef, public db: DbService, private formBuilder: FormBuilder, public alertController: AlertController, public modalctrl: ModalController,private loadingCtrl:LoadingController) {
    // this.ref.detectChanges();
    // this.db.preventBackButton();
  }

  ngOnInit() {
    // this.db.preventBackButton();
    // console.log("all values", this.all_values);

    // if(this.all_values[0].to_time && this.all_values[0].from_time){
    //   let startDate = new Date(this.all_values[0].from_time);
    //   let endDate = new Date(this.all_values[0].to_time);
    //   this.calculateDuration(startDate,endDate)
    // }

    if(this.all_values[0].from_time && !this.all_values[0].to_time){
      let startDate = this.all_values[0].from_time
      this.fromTime = startDate;
      this.selectedFromTime =  this.fromTime
      this.startTimer();
      // let startDate = new Date(this.all_values[0].from_time);
      // this.fromTime = moment(startDate);
      // this.selectedFromTime =  this.fromTime
      // this.startTimer();
    } else if(this.all_values[0].from_time && this.all_values[0].to_time){

      let startDate = this.all_values[0].from_time
      this.fromTime = startDate;
      this.selectedFromTime =  this.fromTime
      
      // let startDate = new Date(this.all_values[0].from_time);
      // this.fromTime = moment(startDate);
      // this.selectedFromTime =  this.fromTime
    }

    // doctype = "Supplier Quotation Item"

    // if(this.all_values && this.all_values[0] && this.all_values[0].doctype && this.all_values[0].doctype == 'Supplier Quotation Item'){
    if(this.all_data && this.all_data.docs[0] && this.all_data.docs[0].name && this.all_data.docs[0].name == 'Supplier Quotation Item'){
      let count = this.all_data.docs[0].fields.findIndex((res)=>{ return res.label == 'Item Weight Details'})
      if(count >= 0){
        this.all_data.docs[0].fields = this.all_data.docs[0].fields.slice(0,count);
        // console.log(this.all_data.docs[0].fields)
      }
    }

    // this.db.drop_down_value = {};
    let field_data = this.all_data.docs[0].fields;
    this.info = this.all_data.docs[0].fields;
    let filter =  this.info.filter((res:any)=>{ return (res.fieldname == 'conversion_factor' || res.fieldname == 'base_rate' ) })
    // console.log(filter)
    this.doctype = this.all_data.docs[0].name;
    // let field_data = this.all_data.data.fields;
    // this.doctype = this.all_data.data.name;
    // let field_data = this.all_data.message.meta_data.fields;
    // this.doctype = this.all_data.message.meta_data.name;
    this.json_data = field_data

    // Store doctype for api resource method to db

    // this.db.doc_type = this.doctype;
    // this.db.ad_name = this.titleCase(this.form_tile);

    // setTimeout(() => {
    //   this.store_info()
    //   this.filter_section_break();
    //   this.assign_final_data()
    // }, 50);

    this.store_info()
    this.splitForms();
    // this.filter_section_break();
    this.assign_final_data();

    // this.ref.detectChanges();

    this.form_data = this.formBuilder.group(
      this.form_ctrl_data
    );

    this.sub = this.db.select_drop_down.subscribe((res:any)=>{
      if(res && res.status && res.status == 'success'){
        // console.log(res);
        delete res.status;
        let value = res.fieldname_value
        if(this.form_ctrl_data && this.form_ctrl_data[res.fieldname] && (res.fieldname == 'item_name' || res.fieldname == 'item_code' || res.fieldname == 'project')){
          this.form_ctrl_data[res.fieldname].setValue(res['name']);
          this.form_ctrl_data[res.fieldname_value].setValue(res['label']);
          this.db.drop_down_value[res.fieldname] = res.name;
          this.db.drop_down_value[res.fieldname_value] = res.label;

          if(res.fieldname == 'item_code'){
            // this.get_item_details(res);
          }
          // this.selected_value(res);
        }else if(this.form_ctrl_data && this.form_ctrl_data[res.fieldname]){
          this.form_ctrl_data[res.fieldname].setValue(res['name']);
          this.db.drop_down_value[res.fieldname] = res.label;
          if(res.fieldname == 'expense_type'){
            let data ={
               "expense_type":res['name'],
               "company":(this.db.form_values && this.db.form_values['company']) ? this.db.form_values['company'] : ''
            }
           this.db.get_default_account(data).subscribe(res=>{
              if(res.status == "Success"){
               this.form_ctrl_data['default_account'].setValue(res['message'][0]['default_account']);
               this.db.drop_down_value['default_account'] = res['message'][0]['default_account'];
              }
           })
         }else if (res.fieldname == "reference_doctype") {
          this.form_ctrl_data['reference_doctype'].setValue(res['value'])
          this.db.drop_down_value[res.fieldname] = res['value'];
          this.reference_name = this.db.drop_down_value[res.fieldname]
          localStorage['reference_name'] = this.reference_name
        }else if(res.fieldname == "activity_type" && this.doctype == 'Timesheet Detail'){
          this.get_billable_details(res.name)
        }else if(res.fieldname == "task" && this.doctype == 'Task Depends On'){
          this.getTaskName(res.name)
        }
        }
      }
    })


    // this.get_data();

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

  calculateDuration(endDate,startDate) {
    const diffMilliseconds = startDate.getTime() - endDate.getTime();

    const hours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMilliseconds % (1000 * 60)) / 1000);

    this.time_duration  = hours + (minutes / 60) + (seconds / 3600);
    // console.log(this.time_duration)
    this.form_ctrl_data['hours'].setValue(this.time_duration);
  }


  get_item_details(res){
    // let data = {
    //    "item_code":res['name'],
    //    "customer":this.db.customer_details['customer'],
    //    "doctype":"Sales Order"
    // }
    // this.db.get_item_detail(data).subscribe(r=>{
    //    if(r && r.status == 'Success' && r.message){
    //     this.form_ctrl_data['item_code'].setValue(r.message.item_code)
    //     this.form_ctrl_data['item_name'].setValue(r.message.item_name)

    //     if(this.form_ctrl_data['rate'] && res.rate){

    //       let keys = Object.keys(r.message)
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

    //       // this.form_ctrl_data['rate'].setValue(res.rate);
    //       // this.form_ctrl_data['base_rate'] ? this.form_ctrl_data['base_rate'].setValue(res.rate) : null;
    //       this.form_ctrl_data['base_amount'] ? this.form_ctrl_data['base_amount'].setValue(res.rate) : null;
    //       this.form_ctrl_data['amount'] ? this.form_ctrl_data['amount'].setValue(res.rate) : null;
        

    //     }else if(this.form_ctrl_data['rate'] && r.message.valuation_rate){
    //       this.form_ctrl_data['rate'].setValue(r.message.valuation_rate);
    //     }

    //     this.selected_value(r.message);
    //    }
    // })
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


 selected_value(eve){
   let selected_values = eve;
   let qty =  this.info.find(res => res.fieldname == "qty");
   qty.value = 1;
   // this.item_name = selected_values.item_name;
   // this.item_name = selected_values.item_code;
   this.info.map(res => {
      if(res.fieldname == "rate"){
       res.value = selected_values.rate;
       res.value = Number(res.value).toFixed(2);
      }else if(res.fieldname == "amount"){
       res.value = selected_values.rate * (qty.value ? qty.value : 1);
       res.value = Number(res.value).toFixed(2);
      }else if(res.fieldname == "qty"){
       res.value = res.value ? res.value : 1;
       // res.value = Number(res.value).toFixed(2);
      }
   })
 }

  ngAfterContentChecked() {
    // this.ref.detectChanges();
  }

  sub:any;

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }


  // ngAfterContentInit() {

  //   this.store_info()
  //   this.filter_section_break();
  //   this.assign_final_data()

  // }

  // async get_data() {

  //   await this.get_assign_data();

  //   this.form_data = this.formBuilder.group(
  //     this.form_ctrl_data
  //   );

  // }

  // get_assign_data() {

  //   this.store_info()
  //   this.filter_section_break();
  //   this.assign_final_data()

  // }

  // Title case the title 

  // titleCase(str) {
  //   return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
  // }

  // store form control details
  all_select_values = {};
  store_info() { 

    // For Storing filtered data

    this.json_data.map(res => {

      if (res.fieldtype != "Barcode"&&res.fieldtype != "Section Break" && res.fieldtype != "Button" && res.fieldtype != "Color" && res.fieldtype != "Duration"  && res.fieldtype != "Fold" && res.fieldtype != "Geolocation" && res.fieldtype != "Heading" && res.fieldtype != "Image" && res.fieldtype != "Markdown Editor" && res.fieldtype != "Percent" && res.fieldtype != "Read Only" && res.fieldtype != "Rating" && res.fieldtype != "Table" && res.fieldtype != "Table MultiSelect") {
        // if (res.fieldtype != "Barcode" && res.fieldtype != "Button" && res.fieldtype != "Color" && res.fieldtype != "Duration"  && res.fieldtype != "Fold" && res.fieldtype != "Geolocation" && res.fieldtype != "Heading" && res.fieldtype != "Image" && res.fieldtype != "Markdown Editor" && res.fieldtype != "Percent" && res.fieldtype != "Read Only" && res.fieldtype != "Rating" && res.fieldtype != "Table MultiSelect") {

        // this.info.push(res);

        // getting link field options

        if (res.fieldtype == "Link") {

          // this.current_gen_links(res.options);

          this.link_flelds_name.push(res.options);
        }
        if(res.fieldtype == "Select"){
          this.all_select_values[res.fieldname]  = res.options.split('\n')
         }
      }

      if(this.doctype == "Expense Claim Detail"){
        if(res.fieldname == "lead" || res.fieldname == "branch" || res.fieldname == "appointment" || res.fieldname == "about_us_settings" || res.fieldname == "address" || res.fieldname == "divisions" || res.fieldname == "access_log"){
          res.hidden = 1
        }
      }else if(this.doctype == "Timesheet Detail"){
        // || res.fieldname == "completed"
        if(res.fieldname == "expected_hours" || res.fieldname == "checklist_html" || res.fieldname == "checklist_json" || res.fieldname == "billing_hours" || res.fieldname == "billing_rate" || res.fieldname == "costing_rate" || res.fieldname == "base_costing_amount" || res.fieldname == "costing_amount"){
          res.hidden = 1
        }
      }

      if(res.fieldname == 'hours'){
        // this.form_ctrl_data['hours'].setValue(this.time_duration);
        res.value = this.time_duration
        res.value = Number(res.value).toFixed(2);
       }

    })

    // Assign value to form input

    let edit_field_array;
//  console.log(this.all_values ,  this.info);
 
    edit_field_array = Object.keys(this.all_values[this.index_value]);

    
    this.info.map(fil => {
     let obj = edit_field_array.find(arr => { return arr == fil.fieldname })
     if(obj){
      fil.editValue = this.all_values[this.index_value][fil.fieldname];
     }
    });

    // this.info.map(fil => {

    //   edit_field_array.map(arr => {

    //     if (arr == fil.fieldname) {

    //       //  console.log(arr, '=', fil.fieldname)

    //       fil.editValue = this.all_values[this.index_value][arr];
           
    //       // console.log("VVVVVV", this.all_values[this.index_value][arr]);

    //       // console.log("fil", fil)
    //     }

    //   })
    // });

        this.info.map(res=>{
          if(res.fieldname=='client_loc'){
            this.change_data1(res.editValue)
          }
        })
    // console.log("filtered data", this.info)

    this.assign_form_control();

  }

  change_eve(data){
    // console.log(data)
  }

  // Get link field options


  ref_doc:any = [];

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

        let link_opts:any = [];

        res_data.map(res => {

          link_opts.push(res.name)

        })

        // console.log("link options", refdoc, "=====", link_opts)

        this.all_link_opts[refdoc] = link_opts;
      })

    })
    // console.log("each array link options", this.all_link_opts)
    // }

    // console.log("array link options", this.all_link_opts)

    // return this.all_link_opts[refdoc]

  }

  // End
  change_data(event,fieldname){
    let value = event.target.value
    if (fieldname == 'client_loc'){
     this.info.map(res=>{
       if(res.depends_on){
         if(value=='Yes'){res.show = true}else{res.show = false}
       }
      })
    }
   }
   change_data1(value){
     this.info.map(res=>{
       if(res.depends_on){
         if(value=='Yes'){res.show = true}else{res.show = false}
       }
      })
   }

  // For web form controls

  assign_form_control() {

    // console.log("filtered data", this.info)

    // this.info.data.web_form_fields.map(res => {

    this.info.map(res => {
      
      if (res.label && res.fieldtype != "Section Break" && res.fieldtype != "Column Break" && res.fieldtype != "Barcode" && res.fieldtype != "Button" && res.fieldtype != "Color" && res.fieldtype != "Duration"  && res.fieldtype != "Fold" && res.fieldtype != "Geolocation" && res.fieldtype != "Heading" && res.fieldtype != "Image" && res.fieldtype != "Markdown Editor" && res.fieldtype != "Percent" && res.fieldtype != "Read Only" && res.fieldtype != "Rating" && res.fieldtype != "Table" && res.fieldtype != "Table MultiSelect") {
        // if (res.label && res.fieldtype != "Section Break" && res.fieldtype != "Column Break" && res.fieldtype != "Barcode" && res.fieldtype != "Button" && res.fieldtype != "Color" && res.fieldtype != "Duration"  && res.fieldtype != "Fold" && res.fieldtype != "Geolocation" && res.fieldtype != "Heading" && res.fieldtype != "Image" && res.fieldtype != "Markdown Editor" && res.fieldtype != "Percent" && res.fieldtype != "Read Only" && res.fieldtype != "Rating" && res.fieldtype != "Table MultiSelect") {
       
        res.value = res.editValue ? res.editValue : '';
        this.db.drop_down_value[res.fieldname] = res.value;
        // console.log(this.enabled_read_only)

        if(!res.value && res.read_only == 1){
          res.hidden = 1;
        }

        if(this.enabled_read_only){
          res.read_only = 1;
 
          res.editValue = {
           value: res.value ,
           disabled: res.read_only == 1 ? true : false,
         };
         }
 
         if (res.reqd == 1 && res.options != 'Email') {
           this.form_ctrl_data[res.fieldname] = new FormControl((res.editValue), Validators.required)
         }else if (res.reqd == 1 && res.options == 'Email') {
           this.form_ctrl_data[res.fieldname] = new FormControl((res.editValue), [Validators.required, Validators.email])
         }else if (res.options == 'Email') {
           this.form_ctrl_data[res.fieldname] = new FormControl((res.editValue), Validators.email)
         }else if (res.fieldtype == 'Check') {
 
           let check = 0;
 
           if(res.editValue && res.editValue.value){
            if (res.editValue && (res.editValue.value == 1)) {
              check = 1;
            }else if (res.editValue && res.editValue.value == 0) {
              check = 0;
            }
           }else if(res.editValue){
            check = res.editValue;
           }
           
 
           res.default = check
 
           this.form_ctrl_data[res.fieldname] = new FormControl( { value: check, disabled: res.read_only == 1 ? true : false });
           // this.form_ctrl_data[res.fieldname] = new FormControl(check)
         }  else if (res.fieldtype == "Dynamic Link") {
          this.form_ctrl_data[res.fieldname] = new FormControl('')
        } 

        // else if (res.fieldtype == 'Link') {
        //   this.form_ctrl_data[res.fieldname] = new FormControl('')
        // }

        else {
          // this.ref.detectChanges();
          this.form_ctrl_data[res.fieldname] = new FormControl(res.editValue)

          // if (res.editValue != 0) {
          //   this.form_ctrl_data[res.fieldname] = new FormControl(res.editValue)
          // }
          // else if (res.editValue == 0) {
          //   this.form_ctrl_data[res.fieldname] = new FormControl('')
          // }
        }
      }
      if (res.fieldtype == "Link" || res.fieldtype == "Dynamic Link") {
        this.link_flelds_name.push(res.options);
      }
    })
    // console.log('loop form group data', this.form_ctrl_data)

    this.json_data.map(resJs => {
      if(this.doctype == "Test Case Child"){
        if(resJs.fieldname == "procedure" || resJs.fieldname == "expected_result"){
          var htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
          if(this.all_values && this.all_values.length != 0){
            this.all_values.map(resMap => {
              let value = resMap[resJs.fieldname].replace(htmlRegexG, '');
              this.form_ctrl_data[resJs.fieldname].setValue(value);
            })
          }
        }
      }
    })
  }




  // Filter the section for section break and if a form having without section breake last if conditon will work

  section_break_data:any = {};
  each_sec_data:any = [];
  section_break_name:any = [];
  test_section_break_data:any = [];
  test_section_break_name:any = [];

  // if api have column break or not column break and not have section breake the value will be sstore here
  no_sec_col:any = [];
  //end

  // Setting margin value for each flex div
  // The css and the below value must be same for apply e:g flex:0 0 calac(%-flex_margin)
  flex_margin: any = "0px";
  // end var
  store_field_type:any = [];
  // Store field name && check it has lable or not

  // store_field_name;
  // count = 0;


  splitForms(){
    
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

      // if (res.label && res.fieldtype == "Section Break") {

      //   this.store_field_name = res.fieldname;
      //   this.each_sec_data = [];
      //   this.count = 0;

      // }
      // console.log(res.fieldtype)

      this.store_field_type.push(res.fieldtype);

      if (res.fieldtype == "Section Break") {
        let k = index;
        let count = 0;
        // console.log(k)

        while (k < this.info.length) {
          if (k != index) {

            if (this.info[k].fieldtype != "Section Break" && this.info[k].fieldtype != "Column Break") {


              this.each_sec_data.push(this.info[k]);
            }

            else if (this.info[k].fieldtype == "Section Break") {

              break

            }
          }

          if (this.info[k].fieldtype == "Column Break") {

            count++

          }

          k++
        }
      //  console.log(this.each_sec_data);
       
        this.section_break_data[res.fieldname] = this.each_sec_data;
        this.section_break_data[res.fieldname].count = count + 1;
        let p__flex = ((100 / (count + 1)) + '%');
        let flex_out = "0 0 calc(" + p__flex + " " + "-" + " " + this.flex_margin + ")";
        // console.log("percent", p__flex)
        this.section_break_data[res.fieldname].flex = flex_out.toString();
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

        // console.log(this.k)
        // console.log("All section data", this.section_break_data)
        // console.log(this.section_break_name);
      }
    });
    // console.log("type", this.store_field_type)
    if (!this.store_field_type.includes("Section Break")) {
      this.info.map(res => {
        // console.log("wsec", res);
        // console.log(this.section_break_name);
        // console.log(res);
        
        if (res.fieldtype != "Column Break") {
          this.no_sec_col.push(res);
        }

      })
    }
  }

  // End

  // Check and assign a section brake fields into another section break if section comes without label

  label_name;
  section_break_data_2 = undefined;
  count = 0;
  check_assign_sec_break() {

    // console.log(this.section_break_name);

    return new Promise<void>((resolve, reject) => {

      this.test_section_break_name.map((res, index) => {

        //   // console.log(this.section_break_data[res].label);

        // console.log('sec name', this.section_break_data[res]);
        // console.log('name', res);

      //  console.log(this.section_break_data[res]);

        if (this.section_break_data[res] && this.section_break_data[res].label) {
          // console.log(this.section_break_data[res]);
          
          this.label_name = res;

        }

        //   // console.log("________")
        // console.log("label name", this.label_name)

        else if (this.section_break_data[res] && !this.section_break_data[res].label) {
          // console.log("error", res)
          // // console.log("each field", this.section_break_data[res])

          this.section_break_data[res].map(name => {
          // console.log(this.section_break_data,this.label_name);
          
            this.section_break_data[this.label_name].push(name);

          })
          // // console.log("delete sections", this.section_break_data[res]);
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

  save_details() {
    let values = this.form_data.getRawValue();
    // console.log('value', values);

    if(this.form_data && this.form_data.value){
      this.form_data.value = {...this.form_data.value,...values}
    }
    // console.log(this.form_data.controls['title'].errors.required)
    // console.log("check data", this.field_name)

    this.submitted = true;

    // setTimeout(() => {     //Delay the api call for attach and getting image api call response for get the URL of image and attach to image field 

    if (this.image_field_check == "no uploads" || this.image_field_check == "true") {

      // Store empty variables
      this.info.map(res => {

        // if (res.fieldtype == "Attach" || res.fieldtype == "Attach Image") {
        //   this.form_data.value[res.fieldname] = {
        //     filename: "",
        //     filedata: ""
        //   }
        // }

        // if (res.fieldtype == 'Check') {
        //   // console.log('checking', this.form_data.value[res.fieldname])
        //   if (this.form_data.value[res.fieldname]) {
        //     this.form_data.value[res.fieldname] = 1
        //     // console.log('if value checked', this.form_data.value[res.fieldname])
        //   } else if (!this.form_data.value[res.fieldname]) {
        //     this.form_data.value[res.fieldname] = 0
        //   }
        // }

      });

      //To store the base 64 converted image in the current form data

      this.field_name.map((res, index) => {

        // console.log("field///name", this.file_name[index], this.file_name )

        // this.form_data.value[res] = this.base64_url[index]

        // this.form_data.value[res] = {
        //   filename: this.file_name[index],
        //   filedata: this.base64_url[index]
        // }

        this.form_data.value[res] = this.file_name[index]

      })

      this.signature_fieldname.map((res, index) => {
        this.form_data.value[res] = this.signature_base64_url[index]
      })

      // End

      // console.log('value', this.form_data.value)
      // console.log('my form', this.form_data)

      // console.log('Email', this.form_data.get('email_id'))
      // console.log('title', this.form_data.get('title'))
      // console.log('category', this.form_data.get('category'))


      // console.log('value', this.form_data)
      // console.log(this.form_data.get('category').errors.required);
      // console.log('image', this.categoryimagedata)
      // console.log('image', this.field_name, this.base64_url)

      // console.log('field', this.signature_fieldname)
      // console.log('img', this.form_data)

      if (this.form_data.status == "VALID") {
        // alert("Valid")
        let data = {};
        this.info.map(res => {

          // console.log(this.form_data.value)

          if (res.fieldtype != "Column Break" && res.fieldtype != "Section Break") {


            data[res.fieldname] = this.form_data.value[res.fieldname]

          }

        })

        if(data && data['from_time'] && data['from_time'].includes('T')){
          data['from_time'] = data['from_time'].replace('T', ' ')
        }

        if(data && data['to_time'] && data['to_time'].includes('T')){
          data['to_time'] = data['to_time'].replace('T', ' ')
        }

        // console.log("final sent data", data)

        let input_data = {
          responsedata: data
        }

        let vault_data = {
          total_hours: this.time_duration ? this.time_duration : data['hours']
        }

        this.modalctrl.dismiss({
          form_data: data,
          child_table_field_name: this.child_table_field_name,
          vault_data: vault_data
        });

        this.submitted = false;
        this.image_field_check == "true"
        // this.loop = false;

        // this.form_data.reset();

        // this.form_data['controls']['itemname'].reset();

      }
    }

    else if (this.image_field_check == "false") {

      // this.db.imageAlert();

    }
    // }, 1500);

  }


  //Image attach and Path finder 
  image_count:any = [];

  changeListener($event, fieldname, i_value): void {

    this.image_count.push(fieldname);
    this.image_field_check = "false";


    this.readThis($event.target, fieldname, i_value);
  }

  async readThis(inputValue: any, fieldname, i_value): Promise<void> {

    let loader = await this.loadingCtrl.create({ message: 'Please Wait...'});
    await loader.present();

    var file: File = inputValue.files[0];
    var file_size = inputValue.files[0].size;


    this.categoryfile = file.name
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {

      this.categoryimagedata = myReader.result;

      if (this.field_name.includes(fieldname)) {
        this.field_name.map((d, index) => {
          if (d == fieldname) {
            this.base64_url.splice(index, 1, this.categoryimagedata);
            this.field_name.splice(index, 1, fieldname);
          }
        })
      }

      else if (!this.field_name.includes(fieldname)) {
        this.field_name.push(fieldname);
        this.base64_url.push(this.categoryimagedata);
      }


      let img_data = {

        file_name: this.categoryfile,
        content: this.categoryimagedata,
        decode: "True",
      }



      if (file_size <= 10000000) {  //10Mb in BYtes

        this.db.upload_image(img_data).subscribe(res => {

          // console.log("img res", res.data.name)

          let checks_rep = res ? true : false;

          let unique_name = res.data.name;

          if (checks_rep == true) {

            this.db.upload_image_url(unique_name).subscribe(url => {

              let file_url = url.data.file_url
              this.all_values[this.index_value][fieldname] = file_url
              loader.dismiss();
              if (url) {
                
                if (this.field_name.includes(fieldname)) {
                  this.field_name.map((d, index) => {
                    if (d == fieldname) {
                      this.file_name.splice(index, 1, file_url);

                    }
                  })
                }
                else if (!this.field_name.includes(fieldname)) {
                  this.file_name.push(file_url)
                }
              }
              let index_v = this.image_count.indexOf(fieldname);
              this.image_count.splice(index_v, 1);
              if (this.image_count.length == 0) {
                this.image_field_check = "true";
              }
            },error=>{loader.dismiss()})
          }
        },error=>{loader.dismiss()})
      }

      else if (file_size > 10000000) { //10Mb in bytes
        loader.dismiss()
        this.db.filSizeAlert();
        // this.image_field_check = "true";
        if (this.image_count.length == 0) {
          this.image_field_check = "true";
        }
        this.form_data.controls[fieldname].reset();

      }

    }
    myReader.readAsDataURL(file);

  }

  // onclick Get Link Field Options

  // ref_doc = [];

  // res_data = [];

  // link_opts = [];

  // all_link_opts = {};

  // // loop;

  // gen_links(each, refdoc, event) {

  //   // this.loop = true

  //   // console.log("event", event)

  //   // console.log(this.all_link_opts);

  //   // each.editValue = 0;

  //   if (!this.ref_doc.includes(refdoc)) {

  //     this.link_opts = [];

  //     this.ref_doc.push(refdoc);

  //     this.db.ref_doc_type = refdoc;

  //     // console.log("ref doc type", refdoc)
  //     // console.log("Doctype", this.db.doc_type)

  //     // console.log(this.link_opts.length);
  //     // console.log(this.link_opts);

  //     this.db.get_link_field_options().subscribe(res => {

  //       // console.log("link field ", res.data)

  //       this.res_data = res.data

  //       this.res_data.map(res => {

  //         this.link_opts.push(res.name)

  //       })
  //     })
  //     this.all_link_opts[refdoc] = this.link_opts;

  //   }

  // }

  // Link Field on Change Function

  change_value(each, event) {

    // console.log("on change", each);
    // console.log("on change", event.detail.value)

    // setTimeout(() => {
    //   each.editValue = undefined;
    //   each.editValue = event.detail.value
    // }, 50);

    // each.editValue = 0;

    // each.editValue = event.detail.value;



    // this.ref.detectChanges();
    // console.log("change", each.editValue)
  }

  // set_value(each_value) {

  //   console.log("a////////////////////////////////////////////////////////////////////////////////");

  //   setTimeout(() => {
  //     return each_value;
  //   }, 50);


  // }



  // Signature pad 

  // ngAfterViewInit() {
  //   this.signaturePad.set('minWidth', 2);
  //   this.signaturePad.clear();
  // }

  // clearSignature() {
  //   this.signaturePad.clear();
  // }

  // drawComplete(fieldname) {

  //   const base64Data = this.signaturePad.toDataURL();

  //   if (this.signature_fieldname.includes(fieldname)) {

  //     this.signature_fieldname = [];
  //     this.signature_base64_url = [];
  //   }

  //   this.signature_fieldname.push(fieldname);
  //   this.signature_base64_url.push(base64Data);
  //   this.signatureImg = base64Data;
  // }

  // not used functions

  // drawComplete() {
  //   console.log(this.signaturePad.toDataURL());
  // }

  // drawStart() {
  //   console.log('begin drawing');
  // }


  // savePad() {
  //   const base64Data = this.signaturePad.toDataURL();
  //   this.signatureImg = base64Data;
  // }

  // signature End

  // To split the number of options

  // count = 0;
  // all_options = [];
  // temp_store = [];

  // no_of_options(options) {

  //   this.count = this.count + 1

  //   console.log("count", this.count)
  //   console.log("all options", this.all_options)
  //   console.log("temp", this.temp_store)

  //   if (!this.temp_store.includes(this.all_options)) {

  //     this.all_options = options.split("\n")

  //     this.temp_store = this.all_options

  //     // console.log('ALLoptions', all_options)

  //     this.all_options.map(res => {

  //       console.log('options', res)
  //       // document.getElementById("select-options").innerHTML = "<ion-select-option>" + res + "</ion-select-option>"
  //       // let html_var = "<ion-select-option></ion-select-option>"
  //       // var node = document.createElement("<ion-select-option></ion-select-option>")
  //       // var textnode = document.createTextNode(res);
  //       // node.appendChild(textnode);
  //       // document.getElementById("select-options").appendChild(node);
  //       document.getElementById("select-options").innerHTML += "<ion-select-option>" + res + "</ion-select-option>"

  //     })
  //   }
  // let html_var = "<ion-select-option></ion-select-option>";
  // var textnode = document.createTextNode(all_options[0]);
  // node.appendChild(textnode);
  // var node = document.createElement(html_var);
  // document.getElementById("select-options").appendChild(node);

  // document.getElementById("select-options").innerHTML = "<ion-select-option>" + all_options[0] + "</ion-select-option>"
  // document.getElementById("select-options").innerHTML = "<ion-select-option>" + all_options[1] + "</ion-select-option>"

  // }


  // separate_option(options) {
  //   // let temp = ''
  //   // console.log(options)
  //   this.all_options = options.split("\n");
  //   // this.all_options.map(res => {
  //   //   temp  = res
  //   // })
  //   return this.all_options;
  // }

  // changed(event) {
  //   console.log(event.detail.value)
  // }

  // Clear image data from list

  clear_image_data(image_data, fieldname) {

    let image_url = image_data
    if (this.file_name.includes(image_url)) {
      let file_index_value = this.file_name.indexOf(image_url);
      this.file_name.splice(file_index_value, 1, "");
    }
    this.all_values[this.index_value][fieldname] = "";
    this.form_data.controls[fieldname].reset();
  }

  open_drop_down_options(type, fieldname, fieldname_value) {
    this.db.select_options = '';
    if(fieldname != 'default_account' && !this.enabled_read_only && fieldname != 'reference_docname'){
      let data = this.form_data.value;
      let selected_value = data[fieldname] ? data[fieldname] : '';
      this.db.open_drop_down_options(type, fieldname, fieldname_value, selected_value)
    }

    this.db.drop_down_value.reference_docname = ''
    if (fieldname == 'reference_docname') {

      let reference_data = {
        doctype: this.reference_name ? this.reference_name : localStorage['reference_name'],
        page_length: 20,
        page_no: 1,
        search_text: ''
      }
      this.db.open_drop_down_options(type, fieldname, fieldname_value, reference_data)
    }

    // console.log('AFDG',this.form_data)

    
  }

  // open_drop_down_options(type,fieldname,fieldname_value) {
  //   let data = this.form_data.value;
  //   let selected_value = data[fieldname] ? data[fieldname] : '';
  
  //   // if(!this.item_name && this.all_values && this.all_values[this.index_value]){
  //   //   selected_value = this.all_values[this.index_value]['item_code']
  //   // }
  
  //   this.db.open_drop_down_options(type,fieldname,fieldname_value,selected_value)
  // }

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
            }else if(res.fieldname == "base_rate" || res.fieldname == "base_amount" || res.fieldname == "amount"){
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


    isTimerRunning:any;
    fromTime:any;
    toTime:any;
    elapsedTime:any;
    selectedFromTime:any;
    timerInterval:any;
    selectedToTime:any;
    start_time_:any;
    end_time_:any;

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
      this.isTimerRunning = false;
      this.formatElapsedTime()
    }
  
    formatElapsedTime(): any {
      if (this.elapsedTime) {
        const hours = Math.floor(this.elapsedTime.asHours());
        const minutes = this.elapsedTime.minutes();
        const seconds = this.elapsedTime.seconds();
  
        this.time_duration = hours;
        this.form_ctrl_data['hours'].setValue(this.time_duration);
        // return `${hours} : ${minutes} : ${seconds}`;\
        return `${hours < 10 ? ('0' + hours) : hours} : ${minutes < 10 ? ('0' + minutes) : minutes} : ${seconds < 10 ? ('0' + seconds) : seconds}`;
      } else {
        return '00:00:00';
      }
    }
  
    onFromTimeChange(data,each) {
      const currentTime = moment();
      const elapsedTimeBeforeChange = this.elapsedTime;
      this.selectedFromTime = data.detail.value
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


    // calculateDuration(endDate,startDate) {
    //   const diffMilliseconds = startDate.getTime() - endDate.getTime();
  
    //   const hours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    //   const minutes = Math.floor((diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    //   const seconds = Math.floor((diffMilliseconds % (1000 * 60)) / 1000);
  
    //   this.time_duration = hours;
    //   // console.log(this.time_duration)
    //   this.form_ctrl_data['hours'].setValue(this.time_duration);
  
    // }
    
}

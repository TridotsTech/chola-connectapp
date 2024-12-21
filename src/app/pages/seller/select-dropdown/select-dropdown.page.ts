import { Component, Input, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  MenuController,
  LoadingController,
  ModalController,
  AnimationController,
  Platform,
} from '@ionic/angular';
import { WebsiteFormsComponent } from 'src/app/components/forms/website-forms/website-forms.component';
import { HttpClient } from '@angular/common/http';
import { DbService } from 'src/app/services/db.service';
import { QuickFormsComponent } from 'src/app/components/forms/quick-forms/quick-forms.component';

@Component({
  selector: 'app-select-dropdown',
  templateUrl: './select-dropdown.page.html',
  styleUrls: ['./select-dropdown.page.scss'],
})

export class SelectDropdownPage implements OnInit {
  list_values: any = [];
  is_loaded = false;
  @Input() type: any;
  @Input() fieldname: any;
  @Input() form_values: any;
  @Input() fieldname_value: any;
  @Input() selected_value: any;
  @Input() filter_type: any;
  @Input() reference_data: any;
  @Input() select_options: any;
  @Input() send_all_value: any;
  @Input() doctype: any;
  @Input() list_filter: any;
  @Input() parent_doctype: any;
  @Input() hideALlOption: any;

  search_text_ref: any;
  customer_name: any;
  title: any;
  @Input() selectDropDown: any;

  constructor(public modalCtrl: ModalController, public http: HttpClient, public db: DbService, public router: Router) { }

  ngOnInit() {
    console.log('this.doctype',this.doctype)
    this.title = this.fieldname;
    this.title = this.title.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
    // this.fieldname = this.fieldname.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
    if (this.selectDropDown) {
      this.is_loaded = true;
      this.no_products = true;
      if (this.type.includes('\n')) {
        let options = this.type.split('\n')
        let array = [{ label: 'ALL', name: 'ALL' }];
        options.map((res, i) => {
          // if(i > 0){
          array.push({ label: res, name: res })
          // }
        })
        this.is_loaded = true;
        this.list_values = array;
      }

    } else {
      if (this.db.event_list_form && this.type == 'DocType' && this.fieldname == 'reference_type') {
        this.is_loaded = true;
        this.list_values = [
          {
            "label": "Lead",
            "name": "Lead"
          },
          {
            "label": "Opportunity",
            "name": "Opportunity"
          }
        ]
      }  
      // else if (typeof (this.select_options) != 'string' && this.select_options && this.select_options.length != 0) {

      //   this.is_loaded = true;
      //   let arr: any = [];

      //   if (this.select_options && this.select_options.length != 0) {
      //     if (this.select_options[0] == '') {
      //       this.select_options.splice(0, 1)
      //     }
      //   }

      //   arr = this.select_options.map((value) => {
      //     return { label: value };
      //   });


      //   this.list_values = arr && arr.length != 0 ? arr : '';

      // } 
      else if (this.type && this.type.includes('\n')) {
        let options = this.type.split('\n')
        let array = [{ label: 'ALL', name: 'ALL' }];

        if (options && options.length != 0) {
          if (options[0] && options[0].length == 0) {
            options.splice(0, 1)
          }
        }

        options.map((res, i) => {
          if (i > 0) {
            array.push({ label: res, name: res })
          }
        })
        this.is_loaded = true;
        this.list_values = array;
      } else if (this.fieldname != 'reference_docname') {
        if(this.type && typeof(this.type) != 'string' && this.type.length != 0){
          let options = this.type
          let array:any = [];
          if(this.checkAllPush() && !this.hideALlOption){
            array = [{ label: 'ALL', name: 'ALL' }];
          }else{
            array = [];
          }
  
          if (options && options.length != 0) {
            if (options[0] && options[0].length == 0) {
              options.splice(0, 1)
            }
          }
  
          options.map((res, i) => {
            if (i > 0 && this.fieldname != 'is_active') {
              array.push({ label: res, name: res })
            }else if(i >= 0 && (this.fieldname == 'is_active' || this.fieldname == 'status')){
              array.push({ label: res, name: res })
            }
          })
          this.is_loaded = true;
          this.list_values = array;
        }else{
          this.category_products();
        }
      }

      if (this.type == 'reference_doctype' && this.fieldname == 'reference_docname') {
        this.get_reference_name();
      }
    }


    this.db.loadTask.subscribe((res: any) => {
      if (res && res.data && res.data == 'loadTask') {
        this.c_page_no = 1;
        this.no_products = false;
        this.category_products();
      }
    })
    // const modalState = {
    //   modal: true,
    //   desc: 'fake state for our modal',
    // };
    // history.pushState(modalState, '');
    // console.log(this.type)
  }

  // @HostListener('window:popstate', ['$event'])
  // dismissModal() {
  //   this.modalCtrl.dismiss();
  // }

  checkAllPush(){
    if(localStorage['docType'] == 'Daily Update' || localStorage['docType'] == 'Customer'){
      return false;
    }else{
      return true;
    }
  }


  get_text(eve: any) {
    this.search_text_ref = eve.detail.value ? eve.detail.value : eve.target.value;
    this.get_reference_name();
  }

  get_reference_name() {
    let data = {
      doctype: this.selected_value.doctype,
      page_no: this.c_page_no,
      page_length: 20,
      search_text: this.search_text_ref,
    };
    this.db.label_values(data).subscribe((res: any) => {
      // console.log(res);
      this.is_loaded = true;
      if (res.message && res.message.length != 0) {
        if (this.c_page_no == 1) {
          this.list_values = res.message;
        } else {
          this.list_values = [...this.list_values, ...(res.message as never)];
        }
      } else {
        this.no_products = true;
        this.c_page_no == 1 ? (this.list_values = []) : null;
      }
    },
      (error) => {
        this.is_loaded = true;
      }
    );
  }

  category = '';
  c_page_no = 1;
  search_txt = '';
  no_products = false;

  category_products1() {
    this.db.get_master_value(this.type, this.fieldname)
    // console.log(this.db.all_link_opts[this.type])
  }

  // category_products() {
  //   let datas: any = {
  //     doctype: this.type,
  //     page_no: this.c_page_no,
  //     page_length: 20,
  //     search_text: this.search_txt,
  //     customer: this.type == 'Address' ? this.selected_value ? this.selected_value : localStorage['quotation_to'] : undefined,
  //     filter_value: (this.type == 'Sales Taxes and Charges Template' || this.type == 'Project') ? 'TridotsTech' : this.type == 'Address' ? this.form_values['customer'] : null,
  //     filter_name: this.type == 'Address' ? 'Customer' : null,
  //   };

  //   // console.log(this.type)
  //   // console.log(datas);

  // if (this.type == 'Account' && !this.db.employee_role) {
  //   datas['reference'] = this.fieldname;
  //   datas['filter_name'] = 'Company';
  //   datas['filter_value'] = this.form_values && this.form_values['company']  ? this.form_values['company'] : '';
  // } else if (this.type == 'Account' && this.db.employee_role) {
  //   datas['reference'] = this.fieldname;
  //   datas['filter_name'] = 'Company';
  //   datas['filter_value'] = this.form_values && this.form_values['company']  ? this.form_values['company'] : this.db.default_values.default_company;
  // } else if (this.type == 'Cost Center' || this.type == 'Project' && localStorage['docType'] != 'Task') {
  //   datas['filter_name'] = 'Company';
  //   datas['filter_value'] = this.form_values && this.form_values['company'] ? this.form_values['company'] : 'TridotsTech';
  // }else if (this.type == 'Task') {
  //   datas['filter_name'] = 'Project';

  //   if(this.db.ismobile){
  //     datas['filter_value'] = this.db.drop_down_value && this.db.drop_down_value['project_name'] ? this.db.drop_down_value['project_name'] : this.form_values['project'] ? this.form_values['project'] : '';
  //   }else{
  //     datas['filter_value'] = this.form_values && this.form_values['project_name'] ? this.form_values['project_name'] : this.form_values['project'];
  //   } 

  // }else if (this.type == 'Leave Type' && this.db.hr_manager_role) {
  //   datas['filter_name'] = 'Employee';
  //   datas['filter_value'] = this.form_values && this.form_values['employee'] ? this.form_values['employee'] : '';
  // }else if (this.type == 'Leave Type' && this.db.employee_role) {
  //   datas['filter_name'] = 'Employee';
  //   datas['filter_value'] = localStorage['employee_id'] ?  localStorage['employee_id'] : '';
  // }else if (this.type == 'Employee Advance') {
  //   datas['filter_name'] = 'Employee';
  //   datas['filter_value'] = this.form_values && this.form_values['employee'] ? this.form_values['employee'] : this.db.selected_from_employee;
  //   // && this.db.hr_manager_role
  // }else if (this.type == 'DocType') {
  //   datas['filter_name'] = 'Employee';
  //   datas['filter_value'] = localStorage['employee_id'];
  // }else if (this.type == 'Project' && localStorage['docType'] == 'Task') {
  //   datas['filter_name'] = 'Company';
  //   datas['filter_value'] = this.db.default_values.default_company;
  // }else if (this.type == 'Address' && this.db.drop_down_value['party_name' + 'name']) {
  //   datas['filter_name'] = this.db.drop_down_value['quotation_to'];
  //   datas['filter_value'] = this.db.drop_down_value['party_name' + 'name'];
  // }else if (this.type == 'Address' && this.db.drop_down_value['customer' + 'name']) {
  //   datas['filter_name'] = 'Customer';
  //   datas['filter_value'] = this.db.drop_down_value['customer' + 'name'];
  // }else if (this.type == 'Address' && this.form_values['supplier']) {
  //   datas['filter_name'] = 'Customer';
  //   datas['filter_value'] = this.form_values['supplier'];
  // }

  // if (this.type == 'Employee') {
  //   datas['filter_name'] = 'Company';
  //   datas['filter_value'] = this.db.default_values.default_company;
  // }

  // if(this.type == 'Project' && datas['filter_value'] == ''){
  //   datas['filter_value'] = this.db.drop_down_value && this.db.drop_down_value['company']  ? this.db.drop_down_value['company'] : '';
  // }

  // if(this.type == 'link_doctype'){
  //   datas['doctype'] = this.db.drop_down_value && this.db.drop_down_value['link_doctype']  ? this.db.drop_down_value['link_doctype'] : '';
  // }

  //   this.db.label_values(datas).subscribe((res: any) => {
  //       this.is_loaded = true;
  //       if (res.message && res.message.length != 0 && res.status == 'Success') {
  //         if (this.c_page_no == 1) {
  //           if (this.filter_type == 'filter' || this.send_all_value) {
  //             let array = [{ label: 'ALL', name: 'ALL' }];
  //             array = [...array, ...res.message];
  //             this.list_values = array;
  //             if(this.doctype == 'Opportunity' && this.list_values && this.list_values.length !=0){
  //               this.list_values = [
  //                 {
  //                   "label": "Lead",
  //                   "name": "Lead"
  //                 },
  //                 {
  //                   "label": "Customer",
  //                   "name": "Customer"
  //                 }
  //               ]
  //             }
  //           } else {
  //             this.list_values = res.message;
  //           }
  //         } else {
  //           this.list_values = [...this.list_values, ...(res.message as never)];
  //         }
  //       } else {
  //         // console.log(res.message)
  //         if (res && res._error_message) {
  //           this.db.sendErrorMessage(this.stripHtmlTags(res._error_message))
  //         } else if (res && res.message && res.message.length != 0) {
  //           this.db.sendErrorMessage(res.message)
  //         }
  //         this.no_products = true;
  //         this.c_page_no == 1 ? (this.list_values = []) : null;
  //         if (this.select_options && this.select_options.length != 0) {
  //           // console.log(this.select_options)
  //           let arr: any = [];
  //           arr = this.select_options.map((value) => {
  //             return { label: value };
  //           });
  //           this.list_values = arr && arr.length != 0 ? arr : '';
  //         }
  //       }

  //       if (this.list_values.length != 0) {
  //         this.list_values.map((res: any) => {
  //           if (res.name == this.selected_value) {
  //             res['isActive'] = true;
  //           }
  //         });
  //       }
  //     },
  //     (error) => {
  //       this.is_loaded = true;
  //     }
  //   );
  // }

  // Function to remove HTML tags
  stripHtmlTags(htmlString: string): string {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  }

  load_search(term: any) {
    this.search_txt = term.target.value;
    this.c_page_no = 1;
    this.no_products = false;
    this.category_products();
  }

  fetchMore(eve: any) {
    this.loadData(eve);
  }

  loadData(event: any) {
    let value = event.target.offsetHeight + event.target.scrollTop + 1;
    value = value.toFixed();

    if (value >= event.target.scrollHeight) {
      if (!this.no_products) {
        this.c_page_no = this.c_page_no + 1;

        if (this.fieldname != 'reference_docname') {
          this.category_products();
        }
        if (this.fieldname == 'reference_docname') {
          this.get_reference_name();
        }
      }
    }
  }

  add(selected_item: any) {
    if (localStorage['docType'] == 'Material Request') {
      this.db.enabled_hidden_fields = true;
    }
    this.list_values.map((res: any) => {
      if (selected_item.name == res.name) {
        res['isActive'] = true;
        let data = { status: 'success', data: selected_item };
        selected_item['status'] = 'success';
        selected_item['fieldname'] = this.fieldname;
        selected_item['fieldname_value'] = this.fieldname_value;
        this.form_values ? this.form_values[this.fieldname] = res.name : null
        // let obj = {selected_item:selected_item, eve:res}
        // this.db.select_drop_down.next(obj);
        this.db.selecting_drop_down = true;
        // this.db.allocate_agent = true;
        if(this.list_filter){
          selected_item[this.selected_value['name']] = selected_item.name
          selected_item['label'] = selected_item.label
          selected_item['fieldname'] = this.selected_value['name']
        }
        // this.db.reportFilterDestroy = true;
        this.db.select_drop_down.next(selected_item);
        // console.log('selected_item',selected_item)
        this.modalCtrl.dismiss(data);
      } else {
        res['isActive'] = false;
      }
    });
  }

  close_modal() {
    this.modalCtrl.dismiss();
  }

  search_cust(eve: any) {
    this.c_page_no = 1;
    this.no_products = false;
    if (this.type == 'items') {
      this.category_products();
    }
  }

  clear_txt() {
    this.search_txt = '';
    this.category_products();
  }

  new_form(type: any) {
    if (type == 'Customer Group') {
      type = 'customer-group';
    } else if (type == 'Price List') {
      type = 'price-list';
    } else if (type == 'Bank Account') {
      type = 'bank-account';
    } else if (type == 'Market Segment') {
      type = 'market-segment';
    } else if (type == 'Industry Type') {
      type = 'industry-type';
    } else if (type == 'Tax Category') {
      type = 'tax-category';
    } else if (type == 'Terms and Conditions') {
      type = 'terms-and-conditions';
    } else if (type == 'Lead Source') {
      type = 'lead-source';
    } else if (type == 'Payment Terms Template') {
      type = 'payment-terms-template';
    }
    // console.log(type);
    this.router.navigateByUrl('/forms/' + type);
    this.modalCtrl.dismiss();
  }

  async createNewAddress1() {

    if (this.db.drop_down_value['quotation_to']) {
      this.db.addressLinks = [{ "doctype": "Dynamic Link", "link_doctype": this.db.drop_down_value['quotation_to'], "link_name": this.db.drop_down_value['party_name'] }]
    } else if (this.db.drop_down_value['customer' + 'name']) {
      this.db.addressLinks = [{ "doctype": "Dynamic Link", "link_doctype": "Customer", "link_name": this.db.drop_down_value['customer' + 'name'] }]
    } else if (this.db.drop_down_value['party_name']) {
      this.db.addressLinks = [{ "doctype": "Dynamic Link", "link_doctype": "Customer", "link_name": this.db.drop_down_value['party_name'] }]
    }

    if (this.db.ismobile) {
      this.modalCtrl.dismiss()
      this.router.navigateByUrl('/forms/address')
    } else {
      let data = ''
      const modal = await this.modalCtrl.create({
        component: WebsiteFormsComponent,
        cssClass: 'web_site_form',
        componentProps: {
          page_title: 'Add Address',
          page_route: 'address',
          modal: true
          // edit_form_values: this.employeeDetail ? this.employeeDetail : undefined,
          // edit_form: this.edit_form ? this.edit_form : undefined,
          // enable_reference: this.enable_reference,
          // enabled_read_only: this.enabled_read_only,
          // enable_height: data.name == 'Lead' || data.doctype == 'Opportunity' ||  data.doctype == 'Quotation' || data.doctype == 'Customer' || data.name == 'Customer' ? true : false,
          // loader_f:true,
          // load_doc:this.doc_type
        },
        enterAnimation: this.db.enterAnimation,
        leaveAnimation: this.db.leaveAnimation,
      });
      await modal.present();
      const val: any = await modal.onWillDismiss();
      console.log(val)
      if (val && val.data && val.data.status == 'Success' && (val.data.data && val.data.data.doctype)) {
        this.type = val.data.data.doctype;
        this.category = '';
        this.c_page_no = 1;
        this.search_txt = '';
        this.no_products = false;
        this.category_products();
        // this.get_tempate_and_datas(this.doc_type);
      }
    }
  }


  createNewAddress() {
    if (this.type == 'Address') {
      this.createNewAddress1();
    } else if (this.type == 'Task') {
      this.openQuickForm();
    } else if(this.type == 'Module'){
      this.openModuleScreenForm(this.type);
    } else if(this.type == 'Screen'){
      this.openModuleScreenForm(this.type);
    } 
  }

  async openModuleScreenForm(type){
    this.db.SubjectEvent = false;
    const modal = await this.modalCtrl.create({
      component: WebsiteFormsComponent,
      cssClass: 'childTablecss',
      componentProps: {
        page_title: type,
        page_route: type,
        edit_form_values: undefined,
        edit_form: undefined,
        enable_reference: false,
        enabled_read_only: false,
        modal:true
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();
    this.db.SubjectEvent = true;
  }

  async openQuickForm() {

    let detail_doc;
    if (this.type == 'Task') {
      detail_doc = { name: 'Task' }
    } else if(this.type == 'Module'){
      detail_doc = { name: 'Module' }
    } else if(this.type == 'Screen'){
      detail_doc = { name: 'Screen' }
    } 

    const modal = await this.modalCtrl.create({
      component: QuickFormsComponent,
      cssClass: 'quickForms',
      componentProps: {
        detail_doc: detail_doc,
        remove_editFullForm: true,
        modal: true,
        parentTaskCreate: this.type == 'Task' ? true : false
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    // console.log('data',data);
    if (data && data == 'Success') {
      this.c_page_no = 1;
      this.no_products = false;
      this.category_products();
    }
  }



  // category_products(){
  //   let datas: any = {
  //     doctype: this.type,
  //     page_no: this.c_page_no,
  //     page_length: 20,
  //     search_text: this.search_txt,
  //   };

  //   let data = '/assets/leadJson/selectDropDown.json';
  //   let that = this;

  //   this.http.get(data).subscribe((respon: any) => {
  //     let data = respon.data
  //     let findValue:any = data.find(res=> {return res.doctype == this.type})
  //     let obj:any = {};
  //     if(findValue){


  //      for (let key in findValue) {
  //         if (typeof findValue[key] === 'string' && findValue[key].includes('this')) {

  //           findValue[key] = findValue[key].replace(/this./g, '');

  //           if(key == 'filter_value'){
  //             obj[key] = (that[findValue[key]] && that[findValue[key]][findValue['filter_value_key']] ) ? that[findValue[key]][findValue['filter_value_key']] : '';
  //           }else{
  //             obj[key] = that[findValue[key]] ? that[findValue[key]] : '';
  //           }
  //         }else{
  //           obj[key] = findValue[key];
  //         }
  //      }

  //      datas = {...obj,...datas}
  //      datas['filter_value_key'] ? delete datas['filter_value_key'] : null;
  //      this.category_products2(datas)

  //     }else{
  //       this.category_products2(datas)
  //     }
  //   })
  // }


  category_products() {

    if (this.db.formStoreValues) {
      Object.keys(this.db.formStoreValues).map((res) => {
        if (!this.db.drop_down_value[res]) {
          this.db.drop_down_value[res] = this.db.formStoreValues[res];
        }
      })
    }

    let datas: any = {
      doctype: this.type,
      page_no: this.c_page_no,
      page_length: 20,
      search_text: this.search_txt,
    };

    if (this.type == 'Account' && !this.db.employee_role) {
      datas['reference'] = this.fieldname;
      datas['filter_name'] = 'Company';
      datas['filter_value'] = this.form_values && this.form_values['company'] ? this.form_values['company'] : '';
    } else if (this.type == 'Account' && this.db.employee_role) {
      datas['reference'] = this.fieldname;
      datas['filter_name'] = 'Company';
      datas['filter_value'] = this.form_values && this.form_values['company'] ? this.form_values['company'] : this.db.default_values.default_company;
    } else if (this.type == 'Cost Center' || this.type == 'Project' && localStorage['docType'] != 'Task') {
      datas['filter_name'] = 'Company';
      datas['filter_value'] = this.form_values && this.form_values['company'] ? this.form_values['company'] : this.db.default_values.default_company;
    } else if (this.type == 'Task' && ((this.db.drop_down_value && this.db.drop_down_value['project']))) {
      datas['filter_name'] = 'Project';

      // if(this.db.ismobile && this.db.drop_down_value){
      //   let project = this.db.drop_down_value['project'] ? this.db.drop_down_value['project'] : ((this.form_values && this.form_values['project_name']) ? this.form_values['project_name'] : '');

      //   if(this.form_values && (this.db.drop_down_value && this.db.drop_down_value['project_name'])){
      //     project = this.db.drop_down_value['project_name']
      //   }
      //   datas['filter_value'] = project
      //   // datas['filter_value'] = this.form_values && this.form_values['project'] ? this.form_values['project'] : this.db.drop_down_value['project_name'];
      // }else if(this.form_values){
      //   datas['filter_value'] = this.form_values && this.form_values['project'] ? this.form_values['project'] : this.db.drop_down_value['project_name'];
      // } 

      datas['filter_value'] = this.db.drop_down_value['project'];


    } else if (this.type == 'Leave Type' && this.db.hr_manager_role) {
      datas['filter_name'] = 'Employee';
      datas['filter_value'] = this.form_values && this.form_values['employee'] ? this.form_values['employee'] : '';
      datas['reference'] = this.parent_doctype == 'compensatory-leave-request' ? 1 : 0
    } else if (this.type == 'Leave Type' && this.db.employee_role) {
      datas['filter_name'] = 'Employee';
      datas['filter_value'] = localStorage['employee_id'] ? localStorage['employee_id'] : '';
      datas['reference'] = this.parent_doctype == 'compensatory-leave-request' ? 1 : 0
    } else if (this.type == 'Employee Advance') {
      datas['filter_name'] = 'Employee';
      datas['filter_value'] = this.form_values && this.form_values['employee'] ? this.form_values['employee'] : this.db.selected_from_employee;
      // && this.db.hr_manager_role
    } else if (this.type == 'DocType') {
      datas['filter_name'] = 'Employee';
      datas['filter_value'] = localStorage['employee_id'];
    } else if (this.type == 'Project' && localStorage['docType'] == 'Task') {
      datas['filter_name'] = 'Company';
      datas['filter_value'] = this.db.default_values.default_company;
    } else if (this.type == 'Address' && this.db.drop_down_value['party_name']) {
      datas['filter_name'] = this.db.drop_down_value['quotation_to'];
      datas['filter_value'] = this.db.drop_down_value['party_name'];
    } else if (this.type == 'Address' && this.db.drop_down_value['customer' + 'name']) {
      datas['filter_name'] = 'Customer';
      datas['filter_value'] = this.db.drop_down_value['customer' + 'name'];
    } else if (this.type == 'Address' && (this.form_values && this.form_values['supplier'])) {
      // && localStorage['docType'] == 'Purchase Order'
      datas['filter_name'] = 'Supplier';
      datas['filter_value'] = this.form_values['supplier'];
    } else if (this.type == 'Warehouse') {
      datas['filter_name'] = 'Company';
      datas['filter_value'] = this.form_values && this.form_values['company'] ? this.form_values['company'] : 'TridotsTech';
    }

    if (this.type == 'Employee') {
      datas['filter_name'] = 'Company';
      datas['filter_value'] = this.db.default_values.default_company;
    }

    if (this.type == 'Project' && datas['filter_value'] == '') {
      datas['filter_value'] = this.db.drop_down_value && this.db.drop_down_value['company'] ? this.db.drop_down_value['company'] : '';
    }

    if (this.type == 'link_doctype') {
      datas['doctype'] = this.db.drop_down_value && this.db.drop_down_value['link_doctype'] ? this.db.drop_down_value['link_doctype'] : '';
    }

    if (this.fieldname == 'department') {
      datas['filter_name'] = 'Company';
      datas['filter_value'] = this.db.default_values ? this.db.default_values.default_company : '';
    }

    if (this.fieldname && this.fieldname == 'parent_task' && this.type == 'Task' && datas['filter_value']) {
      datas["is_group"] = 1;
    }

    if (!this.type || this.type == "undefined") {
      datas['doctype'] = this.db.drop_down_value['quotation_to'];
    }

    if(datas['filter_name'] == "Company" && !datas['filter_value']){
     let default_values = localStorage['default_values'] ? (JSON.parse(localStorage['default_values'])) : '';
      datas['filter_value'] = (default_values && default_values.default_company) ? default_values.default_company : '';
    }

    if(this.type == 'Module' || this.type == 'Screen'){
      datas['filter_name'] = 'Project';
      datas['filter_value'] = this.form_values && this.form_values['project'] ? this.form_values['project'] : null;
    }

    if(this.db.selected_list.page == 'Quotation'){
      if (this.type == 'Customer') {
        datas['doctype'] = this.form_values['quotation_to'];
      }
    }

    // console.log(this.db.formStoreValues)

    this.category_products2(datas);
  }


  category_products2(datas: any) {


    if(this.type == 'Leave Type'){
      datas['parent_doctype'] = (this.db.parentDoctype) ? this.db.parentDoctype : ''
    }

    this.db.label_values(datas).subscribe((res: any) => {
      this.is_loaded = true;
      if (res.message && res.message.length != 0 && res.status == 'Success') {
        if (this.c_page_no == 1) {
          if (this.filter_type == 'filter' || this.send_all_value) {
            let array = [{ label: 'ALL', name: 'ALL' }];
            array = [...array, ...res.message];
            this.list_values = array;
            if (this.doctype == 'Opportunity' && this.list_values && this.list_values.length != 0) {
              this.list_values = [
                {
                  "label": "Lead",
                  "name": "Lead"
                },
                {
                  "label": "Customer",
                  "name": "Customer"
                }
              ]
            }
          } else {
            this.list_values = res.message;
          }
        } else {
          this.list_values = [...this.list_values, ...(res.message as never)];
        }
      } else {
        // console.log(res.message)
        if (res && res._error_message) {
          this.db.sendErrorMessage(this.stripHtmlTags(res._error_message))
        } else if (res && res.message && res.message.length != 0) {
          this.db.sendErrorMessage(res.message)
        }
        this.no_products = true;
        this.c_page_no == 1 ? (this.list_values = []) : null;
        if (typeof (this.select_options) != 'string' && this.select_options && this.select_options.length != 0) {
          // console.log(this.select_options)
          let arr: any = [];
          arr = this.select_options.map((value) => {
            return { label: value };
          });
          this.list_values = arr && arr.length != 0 ? arr : '';
        }
      }

      if (this.list_values.length != 0) {
        this.list_values.map((res: any) => {
          if (res.name == this.selected_value) {
            res['isActive'] = true;
          }
        });
      }
    },
      (error) => {
        this.is_loaded = true;
      }
    );
  }
}

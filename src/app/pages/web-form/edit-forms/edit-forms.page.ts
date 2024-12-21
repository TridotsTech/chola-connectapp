import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { AlertController, ModalController } from '@ionic/angular';
import { UserListPage } from '../../user-list/user-list.page';

@Component({
  selector: 'app-edit-forms',
  templateUrl: './edit-forms.page.html',
  styleUrls: ['./edit-forms.page.scss'],
})
export class EditFormsPage implements OnInit {
  title: any;
  sale_order_id: any
  reference_id: any;
  enabled_read_only: any;
  web_forms = false;
  @Input() page_route: any;
  @Input() order_detail: any;
  @Input() name: any;
  @Input() task_doctype: any;
  @Input() page_route_name: any;
  @Input() page_name: any;
  @Input() modal: any;
  @Input() enabled_read_only_true: any;
  allocated_user: any = [];
 
  constructor(private route: ActivatedRoute, public db: DbService,public modalCtrl: ModalController) { }

  ngOnInit() {
    if(this.page_name == 'Event' && this.page_route == 'event'){
      this.get_order_details(this.page_name, this.name);

    }

    this.enabled_read_only = this.enabled_read_only_true

    // console.log(this.db.ismobile)
    // console.log(this.page_route)
    if(!this.db.ismobile && (this.page_route == 'todo' || this.page_route == 'event')) {
      this.web_forms = true;
      this.db.edit_web_forms = true;
    }
    // if (this.page_route == "todo" || this.page_route == "event" || this.page_route == "messages") {
    //   this.page_route == "todo" ? this.page_route == "todo" : this.page_route == "event" ? this.page_route == "event" : this.page_route == "messages";
    // }
    if (!this.db.ismobile) {
      this.page_route = this.page_route_name
      // console.log(this.page_route)
      if (this.db.full_width && this.page_name == 'task') {
        this.title = 'task';
        this.get_order_details('Task', this.page_route);
        this.page_route = this.page_name
      }else if (this.db.full_width && this.page_name == 'timesheet') {
        this.title = 'time sheet';
        this.get_order_details('Timesheet', this.page_route);
        this.page_route = this.page_name
      }else if (this.page_route == "todo") {
        this.title = 'Task';
        this.get_order_details('ToDo', this.page_route);
        this.page_route = this.page_name
      }else{

        if(this.page_name){
          if(this.page_name.includes('-')){
            this.page_name = this.page_name.replaceAll('-', ' ')
          }
          this.title = this.toTitleCase(this.page_name);
          this.get_order_details(this.title, this.page_route);
          this.sale_order_id = this.page_route
          if(this.page_name.includes(' ')){
            this.page_route = this.page_name.replaceAll(' ', '-')
          }else{
            this.page_route = this.page_name
          }
        }

      }
    } else {
      this.route.params.subscribe(res => {
        if (res && res['id']) {
          this.page_route = res['id'];
          // if (this.db.purchase_order_id) {
            // this.get_payment_entry();
          // }
          if (res['order_id']) {
            this.reference_id = res['order_id'];
          }
          if (res && res['id'] == 'create-sales-invoice' && res['order_id']) {
            this.title = 'Create Sales Invoice';
            this.get_order_invoice(res['order_id']);
          } else if (res && res['id'] == 'return-sales-order' && res['order_id']) {
            this.title = 'Return';
            this.get_invoice_details(res['order_id']);
          } else if (res && res['id'] == 'purchase-receipt-form' && res['order_id']) {
            this.title = 'Create Purchase Receipt';
            this.get_order_details('Purchase Order', res['order_id']);
          } else if (res && res['id'] == 'purchase-order' && res['order_id']) {
            this.title = 'Create Purchase Order';
            this.get_order_details('Material Request', res['order_id']);
          } else if (res && res['id'] == 'material-request' && res['order_id']) {
            this.title = 'Edit material-request';
            this.sale_order_id = res['order_id']
            this.get_order_details('Material Request', res['order_id']);
          } else if (res && res['id'] == 'payment-entry') {
            this.title = 'Payment Entry';
            // this.get_order_details('Purchase Receipt',this.db.purchase_order_id);
            // this.get_order_details('Material Request',res['order_id']);
          } else if (res && res['id'] == 'lead' && res['order_id']) {
            this.title = 'Lead';
            this.get_order_details('Lead', res['order_id']);
          } else if (res && res['id'] == 'opportunity' && res['order_id']) {
            this.title = 'Opportunity';
            this.get_order_details('Opportunity', res['order_id']);
          } else if (res && (res['id'] == 'lead_opportunity' || res['id'] == 'lead_customer' || res['id'] == 'lead_quotation') && res['order_id']) {
            let method
            if (res['id'] == 'lead_opportunity') {
              method = 'make_opportunity';
              this.title = 'Opportunity';
            } else if (res['id'] == 'lead_customer') {
              method = 'make_customer';
              this.title = 'Customer';
            } else if (res['id'] == 'lead_quotation') {
              method = 'make_quotation';
              this.title = 'Quotation';
            }
            this.get_data(method, 'lead', res['order_id']);
          } 
        }else{

          if(this.page_name){
            if(this.page_name.includes('-')){
              this.page_name = this.page_name.replaceAll('-', ' ')
            }
            this.title = this.toTitleCase(this.page_name);
            this.get_order_details(this.title, this.page_route);
            this.sale_order_id = this.page_route
            if(this.page_name.includes(' ')){
              this.page_route = this.page_name.replaceAll(' ', '-')
            }else{
              this.page_route = this.page_name
            }
          }
          
        }
      })
    }
    // console.log(this.page_route)
  }

  get_data(method, doctype, name) {
    let info = {
      method: method,
      doc_id: name,
      doctype: doctype,
    }
    this.db.get_default_data(info).subscribe(res => {
      if (res.status == 'Success') {
        this.order_detail = res.message;
      }
    })
  }

  get_order_details(doctype, name) {
    let data = {
      name: name,
      doctype: doctype
    }
    this.db.doc_detail(data).subscribe(res => {
      if (res.message && res.message[0] && res.message[0]['status'] && res.message[0]['status'] == 'Success') {
        this.order_detail = res.message[1]
        if(this.title == 'bugsheet'){
          this.get_bug_assign(this.order_detail)
        }
      }else if(res && res.message && res.message.status && res.message.status == "Success"){
        this.order_detail = res.message
      }
    })
  }

  get_payment_entry() {
    // let data = {
    //   "doc": "Purchase Order",
    //   "doc_id": this.db.purchase_order_id
    // }
    // this.db.get_payment_entry_details(data).subscribe(res => {
    //   if (res && res.status == 'Success') {
    //     this.order_detail = res.message;
    //   }
    // })
  }

  //sales order details 
  get_order_invoice(data) {
    // let doc = { order_id: data };
    // this.db.get_order_invoice(doc).subscribe((res: any) => {
    //   if (res.status == 'Success' && res.message) {
    //     this.order_detail = res.message;
    //   } else {
    //     // this.order_detail = undefined;
    //   }
    // })
  }

  // Return sales order from sales-invoice
  get_invoice_details(id: any) {
    // let data = { invoice_id: id };
    // this.db.return_invoice_detail(data).subscribe((res: any) => {
    //   if (res.status == 'Success' && res.message) {
    //     this.order_detail = res.message;
    //   }
    // })
  }

  get_bug_assign(doc_name){
    let data = {
      doctype : "ToDo",
      fields : ["allocated_to"],
      filters : {"reference_name": doc_name.name,"status": doc_name.status}
    }
    this.db.get_list(data).subscribe(res => {
      console.log(res)
      if(res && res.message && res.message.length != 0){
        this.allocated_user = res.message
      }
    })
  }

  async assign_user(){
    const modal = await this.modalCtrl.create({
      component: UserListPage,
      cssClass: this.db.ismobile ? 'user_list' : 'web_site_form',
      componentProps : {
        order_id : this.order_detail.name,
        user_list : this.allocated_user && this.allocated_user.length != 0 ? this.allocated_user : [],
        doctype:'Bug Sheet',
        // share_with: true
      }
    });
    await modal.present();
    // let data: any = await modal.onWillDismiss();
    // if(data){
    //   this.get_assigned_to()
    // }
  }

  toTitleCase(str: any) {
    return str.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

}

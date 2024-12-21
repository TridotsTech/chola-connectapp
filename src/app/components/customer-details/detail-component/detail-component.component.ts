import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { DbService } from '../../../services/db.service';
import { UserListPage } from 'src/app/pages/user-list/user-list.page';

@Component({
  selector: 'app-detail-component',
  templateUrl: './detail-component.component.html',
  styleUrls: ['./detail-component.component.scss'],
})

export class DetailComponentComponent implements OnInit {

  @Input() doctype: any;
  @Input() id: any;
  @Input() forms_route: any;
  @Input() page_title: any;
  @Input() page_route: any;
  @Input() enable_read_only: any;
  @Input() convertedStatusTo: any;

  order_detail: any;
  skeleton: any = true;

  loader = false;
  creation = true;
  order_id: any;
  enabled_read_only = false;
  detail_doc: any = {};
  enable_reference = false;
  items_values: any = [];
  new_user_form = false;
  detailData: any;

  constructor(public db: DbService, public modalctrl: ModalController, public location: Location) { }

  ngOnInit() {
    if (this.id) {
      this.get_order_details(this.doctype, this.id, '')
    }
  }

  async get_order_details(doctype, name, type) {

    let data = {
      name: name,
      doctype: doctype
    }
    this.db.doc_detail(data).subscribe(res => {
      this.loader = false;

      if (res.message && res.message[0] && res.message[0]['status'] && res.message[0]['status'] == 'Success') {
        this.check_permissions(res.message[1], doctype, type);
        this.detailData = res.message[1]
      } else if (res.message && res.message.status && res.message.status == 'failed') {
        setTimeout(() => {
          this.location.back();
        }, 800);
        this.db.alert(res.message.message);
      } else {
        this.location.back();
        this.db.alert('Something went wrong try again later');
      }

      if (res.message && res.message[1] && res.message[1].doctype == 'HD Ticket') {
        // this.db.get_all_conversation(res.message[1].name)
        this.db.mail_send_to = res.message[1]
      }
    }, (error: any) => {
      setTimeout(() => {
        this.location.back();
      }, 800);
      this.db.alert('Something went wrong try again later');
    })
  }

  check_permissions(order_detail, doctype, type) {
    this.doctype = order_detail.doctype
    let next_doc_details;
    this.db.permission_details = JSON.parse(localStorage['permission_details']);

    if (this.db.selected_list.next_doc) {
      next_doc_details = this.db.permission_details.find(r => r.page == this.db.selected_list.next_doc);
    }

    let selected_list;
    if (this.creation) {
      selected_list = this.db.selected_list
      this.db.selected_list.submitted = selected_list.submit;
    } else {
      selected_list = next_doc_details ? next_doc_details : this.db.selected_list
      this.db.selected_list.submitted = selected_list.submit;
    }
    if (selected_list.write == 1 && (order_detail && order_detail.status == 'Draft')) {
      this.order_id = this.id;
      this.creation ? null : this.order_id = undefined;
      this.enabled_read_only = false;
    } else if (selected_list.read == 1) {
      this.enabled_read_only = true;
    }

    if (doctype == 'Leave Application' && order_detail && order_detail.status == 'Open') {
      this.order_id = this.id;
      this.enabled_read_only = false;
    }

    if (this.doctype == 'Employee Grievance' && this.db.hr_manager_role && order_detail.status == 'Open') {
      this.order_id = this.id;
      this.enabled_read_only = false;
    }
    if (doctype == 'HD Ticket' || doctype == 'Test Case') {
      this.order_id = this.id;
      this.enabled_read_only = false;
    }

    if (doctype == 'Item') {
      this.order_id = this.id;
      this.enabled_read_only = false;
    }

    if (doctype == 'Report') {
      this.order_id = this.id;
      this.enabled_read_only = false;
    } else if (doctype == 'Issue') {
      this.order_id = this.id;
      this.enabled_read_only = false;
    }
    if (this.db.selected_list.write == 1 && doctype == 'Task') {
      this.order_id = this.id;
      this.enabled_read_only = false;
    } else if (!this.creation && this.db.selected_list.next_doc == 'Task') {
      this.enabled_read_only = false;
    }

    if (this.doctype == 'Customer') {
      this.enabled_read_only = false;
    }

    if (this.doctype == 'Employee') {
      this.enabled_read_only = false;
    }
    let check;
    if (next_doc_details && next_doc_details.page) {
      check = this.db.check_permission(next_doc_details.page, 'create');
    }
    if (check) {
      if (check && this.creation) {
        this.detail_doc['name'] = this.db.selected_list.next_doc;
        // this.detail_doc['route'] = this.db.selected_list.next_doc 
      }
    } else {
      this.detail_doc['name'] = undefined;
    }

    if (this.db.selected_list.write == 0) {
      this.enabled_read_only = true;
    }

    if (order_detail && order_detail.title && order_detail.title.includes('{')) {
      let value = order_detail.title.slice(1, -1);
      order_detail.title = order_detail[value] ? order_detail[value] : ('New ' + this.page_title);
    } else if (order_detail && !order_detail.title && (doctype == 'Task' || doctype == 'Project')) {
      let value;
      if (doctype == 'Task') {
        value = 'subject'
      } else if (doctype == 'Project') {
        value = 'project_name'
      }
      order_detail.title = order_detail[value] ? order_detail[value] : ('New ' + this.page_title);
    } else if (order_detail.title) {
      order_detail.title = order_detail.title;
    } else if (order_detail && (order_detail.customer_name || order_detail.customer) && !this.new_user_form) {
      order_detail.title = order_detail.customer_name ? order_detail.customer_name : order_detail.customer;
    } else if (order_detail && (order_detail.customer_name || order_detail.customer) && this.new_user_form) {
      order_detail.title = ('New ' + this.page_route)
    } else if (order_detail && order_detail.name) {
      order_detail.title = order_detail.name
    } else {
      order_detail.title = ('New ' + this.page_title)
    }

    this.order_detail = order_detail;

    if (type == 'next_detail') {
      this.order_detail.next_type = type;
      this.order_detail.enable_reference = this.enable_reference
      this.order_detail.order_id = this.order_id
      this.order_detail.enabled_read_only = this.enabled_read_only
      this.order_detail.items_values = this.items_values
      localStorage['Next_Detail'] = JSON.stringify(this.order_detail);
      // this.db.next_previous.next("next_previous");
    }

    this.enabled_read_only = this.enable_read_only;

    this.skeleton = false;
  }

  

}

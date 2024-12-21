import { Component, Input, OnInit, NgZone, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, LoadingController, AnimationController, MenuController, IonFab, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-create-forms',
  templateUrl: './create-forms.component.html',
  styleUrls: ['./create-forms.component.scss'],
})
export class CreateFormsComponent implements OnInit {
  order_detail: any;
  detail_doc: any = {};
  order_id: any;
  page_route: any;
  enabled_read_only = false;
  page_title: any;
  creation = true;
  doctype: any;
  // @ViewChild('fab') fab!: IonFab | any;
  @Input() type;
  @Input() detail_route_name;
  @Input() load_name;
  @Input() data;
  @Input() sale_order_id: any;

  @Output() updateDetails = new EventEmitter();

  constructor(public db: DbService, private ngZone: NgZone, public location: Location, public route: ActivatedRoute, public modalCtrl: ModalController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    if (this.data) {
      this.load_detail(this.data);
    }
  }

  async get_order_details(doctype, name, type) {

    this.order_detail = undefined;

    let loader;

    if (type != 'next_detail' && this.db.enable_detail) {
      loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    }

    let data = {
      name: name,
      doctype: doctype
    }

    this.db.doc_detail(data).subscribe(res => {

      if (res.message && res.message[0] && res.message[0]['status'] && res.message[0]['status'] == 'Success') {
        if (localStorage['docType'] == "Holiday List") {
          this.check_permissions((this.db.ismobile ? res.message[1].holidays : res.message[1]), loader, doctype, type);
        } else {
          this.check_permissions(res.message[1], loader, doctype, type);
        }
      } else if (res.message && res.message.status && res.message.status == 'failed') {
        type != 'next_detail' ? loader.dismiss() : null;
        setTimeout(() => {
          // this.location.back();
        }, 800);
        this.db.sendErrorMessage(res.message.message);
      } else {
        type != 'next_detail' ? loader.dismiss() : null;
        this.db.sendErrorMessage('Something went wrong try again later');
      }

      this.db.show_form_details = true;

    }, (error: any) => {
      (type != 'next_detail' && this.db.enable_detail) ? loader.dismiss() : null;

      setTimeout(() => {
      }, 800);
      this.db.alert('Something went wrong try again later');
    })
    this.db.show_detail_datas = false;
  }

  check_permissions(order_detail, loader, doctype, type) {
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
      this.order_id = this.sale_order_id;
      this.creation ? null : this.order_id = undefined;
      this.enabled_read_only = false;
    } else if (selected_list.read == 1) {
      this.enabled_read_only = true;
    }
    
    if (doctype == 'Leave Application' && order_detail && order_detail.status == 'Open') {
      this.order_id = this.sale_order_id;
      this.enabled_read_only = false;
    }

    if (this.doctype == 'Employee Grievance' && this.db.hr_manager_role && order_detail.status == 'Open') {
      this.order_id = this.sale_order_id;
      this.enabled_read_only = false;
    }

    if (doctype == 'HD Ticket') {
      this.order_id = this.sale_order_id;
      this.enabled_read_only = false;
    }
    if (doctype == 'Report') {
      this.order_id = this.sale_order_id;
      this.enabled_read_only = false;
    } else if (doctype == 'Issue') {
      this.order_id = this.sale_order_id;
      this.enabled_read_only = false;
    }
    if (this.db.selected_list.write == 1 && doctype == 'Task') {
      this.order_id = this.sale_order_id;
      this.enabled_read_only = false;
    } else if (!this.creation && this.db.selected_list.next_doc == 'Task') {
      this.enabled_read_only = false;
    } else if (doctype != this.page_title) {
      order_detail.status = 'Draft'
      order_detail.doctype = this.page_title
      
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
      if (check && this.creation && (this.db.selected_list.page != 'Purchase Order' && this.db.selected_list.page != 'Purchase Receipt')) {
        this.detail_doc['name'] = this.db.selected_list.next_doc;
      }
    } else {
      this.detail_doc['name'] = undefined;
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
    } else {
      order_detail.title = ('New ' + this.page_title)
    }

    this.order_detail = order_detail;

    if (type != 'next_detail' && this.db.enable_detail) {
      loader.dismiss()
    } else {
      this.order_detail.next_type = type;
      this.order_detail.enable_reference = this.enable_reference
      this.order_detail.order_id = this.order_id
      this.order_detail.enabled_read_only = this.enabled_read_only
      this.order_detail.items_values = this.items_values
      localStorage['Next_Detail'] = JSON.stringify(this.order_detail);
      this.db.next_previous.next("next_previous");
    }

    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 600);
    setTimeout(() => {
      this.ngZone.run(() => {
        loader.dismiss()
        this.order_detail = order_detail;
        this.db.skeleton_detail = false;
      });
    }, 700);

  }

  enable_reference = false;
  items_values: any = [];

  load_detail(data) {

    // console.log(data);
    this.items_values = (this.order_detail && this.order_detail.items) ? this.order_detail.items : []
    this.order_detail = undefined;
    this.detail_doc['name'] = undefined;
    this.creation = false;
    this.enabled_read_only = false;
    let doctype = this.db.selected_list.page;
    let name = this.sale_order_id;
    this.page_title = this.db.selected_list.next_doc;
    this.enable_reference = true;
    if (data == 'Customer') {
      this.page_route = data;
    } else if (this.db.selected_list.next_doc) {
      let page_name = this.db.permission_details.find(r => r.page == this.db.selected_list.next_doc);
      this.page_route = page_name.detail_route;
    }

    this.get_order_details(doctype, name, '');

  }



  menu_name(event: any) {
    this.detail_doc['name'] = event;
    if (event == 'Tasks') {
      this.detail_doc['route'] = '/forms/' + event;
    }
  }

}
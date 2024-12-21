import { Component, ViewChild, Input, OnInit, NgZone, Output, EventEmitter } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, LoadingController, AnimationController, MenuController, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { AttachmentsComponent } from 'src/app/components/customer-details/attachments/attachments.component';
import { NavigationLinkPage } from 'src/app/pages/order/navigation-link/navigation-link.page';
import { WizardFormsComponent } from '../../forms/wizard-forms/wizard-forms.component';
// import { CrmCommentComponent } from '../../CRM/crm-comment/crm-comment.component';
import { CreateFormsComponent } from '../create-forms/create-forms.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {

  order_detail: any;
  detail_doc: any = {};
  sale_order_id: any;
  order_id: any;
  page_route: any;
  enabled_read_only = false;
  page_title: any;
  creation = true;
  loader = false;
  // spinner: any;
  @Input() type;
  @Input() doctype: any;;
  @Input() detail_route_name;
  @Input() load_name;

  @Output() updateDetails = new EventEmitter();

  @ViewChild(WizardFormsComponent) wizardComponent: WizardFormsComponent | any;


  custom_header_css: any;
  constructor(public db: DbService, private ngZone: NgZone, private platform: Platform, public location: Location, private menuCtrl: MenuController, public route: ActivatedRoute, private router: Router, public modalCtrl: ModalController, private loadingCtrl: LoadingController, private animationCtrl: AnimationController) { }

  ngOnInit() {
    this.getLoaded();
  }

  getLoaded() {
    this.db.order_detail = undefined
    this.page_route = this.db.selected_list.detail_route
    if (this.doctype == "Employee Advance") {
      this.page_route = 'employee-advance'
    } else if (this.page_route == "Job Opening") {
      this.page_route = "job-opening"
    } else if (this.page_route == "Training Program") {
      this.page_route = "training-program"
    }
    this.sale_order_id = this.db.load_name;
    this.page_title = this.db.selected_list.page;

    if (this.db.show_detail_datas) {
      this.get_order_details(this.db.selected_list.page, this.sale_order_id, '');
    }

  }

  async openMenu() {
    // this.menuCtrl.open();
    const modal = await this.modalCtrl.create({
      component: AttachmentsComponent,
      cssClass: 'attachment_',
      componentProps: {
        order_id: this.sale_order_id,
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
    })
    await modal.present();
    const { data } = await modal.onWillDismiss();
  }


  async get_order_details(doctype, name, type) {
    // console.log(doctype)

    this.check_header(doctype)
    // this.spinner = true;

    this.db.order_detail = undefined;

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
          this.location.back();
        }, 800);
        this.db.sendErrorMessage(res.message.message);
      } else {
        type != 'next_detail' ? loader.dismiss() : null;
        this.location.back();
        this.db.sendErrorMessage('Something went wrong try again later');
      }

      this.db.show_form_details = true;

      if (this.wizardComponent) {
        this.wizardComponent.ngOnInit();
      }

    }, (error: any) => {
      // console.log(error);
      (type != 'next_detail' && this.db.enable_detail) ? loader.dismiss() : null;

      setTimeout(() => {
        this.location.back();
      }, 800);
      this.db.alert('Something went wrong try again later');
    })
    this.db.show_detail_datas = false;
  }

  check_header(doctype) {
    let values = ["Task", "Project", ""]
    if (values.includes(doctype)) {
      this.custom_header_css = true
      return
    }

    this.custom_header_css = false
    return
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


    if (doctype == 'HD Ticket' || doctype == 'Test Case') {
      this.order_id = this.sale_order_id;
      this.enabled_read_only = false;
    }
    // if (doctype == 'Employee Grievance' && order_detail && order_detail.status == 'Open') {
    //   this.order_id = this.sale_order_id;
    //   this.enabled_read_only = false;
    // }
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
      // console.log('this.page_title',this.page_title);
      order_detail.status = 'Draft'
      order_detail.doctype = this.page_title
      if (order_detail.doctype == 'Supplier Invoice' && order_detail['status'] == 'Draft') {
        this.enabled_read_only = false;
      }
    }
    // }else if (doctype == 'Request for Quotation' && (this.page_title && this.page_title == 'Supplier Quotation')) {
    //   order_detail.status = 'Draft' 
    //   order_detail.doctype = 'Supplier Quotation' 
    // }

    if ((doctype == 'Employee Advance' || doctype == 'Expense Claim') && order_detail && order_detail.status == 'Paid') {
      this.order_id = this.sale_order_id;
      this.enabled_read_only = true;
    }

    if (this.doctype == 'Customer') {
      this.enabled_read_only = false;
    }

    if (this.doctype == 'Job Applicant') {
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
        // this.detail_doc['route'] = this.db.selected_list.next_doc 
      }

    } else {
      this.detail_doc['name'] = undefined;
    }

    if (order_detail && order_detail.title && order_detail.title.includes('{')) {
      let value = order_detail.title.slice(1, -1);
      order_detail.title = order_detail[value] ? order_detail[value] : ('New ' + this.page_title);
    } else if (order_detail.title) {
      order_detail.title = order_detail.title;
    } else {
      order_detail.title = ('New ' + this.page_title)
    }

    this.db.order_detail = order_detail;

    if (type != 'next_detail' && this.db.enable_detail) {
      loader.dismiss()
    } else {
      this.db.order_detail.next_type = type;
      this.db.order_detail.enable_reference = this.enable_reference
      this.db.order_detail.order_id = this.order_id
      this.db.order_detail.enabled_read_only = this.enabled_read_only
      this.db.order_detail.items_values = this.items_values
      localStorage['Next_Detail'] = JSON.stringify(this.db.order_detail);
      this.db.next_previous.next("next_previous");
    }

    let read_only = this.db.permission_details.find(res => { return res.page == doctype })
    if (read_only) {
      // console.log(read_only,"read_only")
      this.enabled_read_only = read_only.write ? false : true
    }

    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 600);
    setTimeout(() => {
      this.ngZone.run(() => {
        this.db.order_detail = order_detail;
        // this.spinner = false;
        this.db.skeleton_detail = false;
      });
    }, 700);

  }

  enable_reference = false;
  items_values: any = [];

  load_detail(data) {

    // console.log(data);
    this.items_values = (this.db.order_detail && this.db.order_detail.items) ? this.db.order_detail.items : []
    this.db.order_detail = undefined;
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

  async next_doc(name) {
    this.loader = true;
    // let loader = await this.loadingCtrl.create({ message: 'Please Wait...'});
    // await loader.present();

    let data = {
      "doctype": this.db.selected_list.page,
      "value": this.sale_order_id,
      "filters": [],
      "prev": name
    }
    this.db.next_doc(data).subscribe(res => {
      if (res && res.status == "Failed") {
        // this.db.order_detail = undefined;
        var d = JSON.parse(res._server_messages);
        var d1 = JSON.parse(d);
        this.db.alert(d1.message);
        this.loader = false;
        // this.check_permissions(res.message,loader,doctype_name);
      } else {
        // if(res && res.status && res.status == 'Success')
        this.loader = false;
        this.sale_order_id = res.message;
        // this.content.scrollToTop(400);
        this.get_order_details(this.db.selected_list.page, res.message, 'next_detail');
        //  loader.dismiss(); 
      }
    }, (error: any) => {
      // console.log(error);
      // loader.dismiss(); 
      this.db.alert('Something went wrong try again later');
    })

  }

  async open_pop_up() {
    // console.log(this.detail_doc);

    let select_item = [{ 'label': this.detail_doc.name }];

    // let select_item = [{ 'label':this.db.selected_list.page }];

    if (this.db.selected_list.page == 'Purchase Order') {
      // select_item.push({ 'label': 'Print' })
    }

    const modal = await this.modalCtrl.create({
      component: NavigationLinkPage,
      cssClass: 'web_site_form',
      componentProps: {
        warehouse_list: select_item,
        sale_order_id: this.sale_order_id
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    })
    await modal.present();

    const { data } = await modal.onWillDismiss();
    // console.log(data)
    if (data && data.status == 'Success') {
      // this.load_detail(data.next_route);
      this.open_create_pop_up(data.next_route);
    }
  }

  async open_create_pop_up(datas) {
    const modal = await this.modalCtrl.create({
      component: CreateFormsComponent,
      cssClass: 'create_pop_up',
      componentProps: {
        doctype: this.doctype,
        data: datas,
        sale_order_id: this.sale_order_id
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    })

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.status == 'Success') {

    }

  }

  // ion-model slide left transaction
  enterAnimation = (baseEl: HTMLElement) => {
    var root: any = baseEl.shadowRoot;
    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        this.db.ismobile ? { offset: 0, opacity: '0.09', transform: 'translateY(100%)' } : { offset: 0, opacity: '0.09', transform: 'translateX(100%)' },
        this.db.ismobile ? { offset: 1, opacity: '1', transform: 'translateY(0)' } : { offset: 1, opacity: '1', transform: 'translateX(0)' },
      ]);
    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };

  menu_name(event: any) {
    this.detail_doc['name'] = event;

  }
}

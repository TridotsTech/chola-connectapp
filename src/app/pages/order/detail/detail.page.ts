import { Component, ViewChild, Input, OnInit,OnDestroy,EventEmitter,Output } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ModalController, LoadingController, AnimationController, MenuController, IonFab, Platform, NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { NavigationLinkPage } from '../navigation-link/navigation-link.page';
import { AttachmentsComponent } from 'src/app/components/customer-details/attachments/attachments.component';
import { FormsPage } from '../../forms/forms.page';
// import { trigger, state, style, transition, animate } from '@angular/animations';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ActionSheetController } from '@ionic/angular';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { HttpClient } from '@angular/common/http';
import { Share } from '@capacitor/share';
import { Subscription } from 'rxjs';
import { TagsComponent } from 'src/app/components/CRM/tags/tags.component';
import { UserListPage } from '../../user-list/user-list.page';
import { EditFormsPage } from '../../web-form/edit-forms/edit-forms.page';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss']
})
export class DetailPage implements OnInit,OnDestroy {

  order_detail: any;
  detail_doc: any = {};
  sale_order_id: any;
  order_id: any;
  page_route: any;
  enabled_read_only = false;
  page_title: any;
  hasClass = false;
  creation = true;
  load_drop_down = false;
  loader = false;
  fab_lead = [{ name: 'Opportunity', icon: '/assets/detail-fab/fab-Opportunity.svg' }, { name: 'Quotation', icon: '/assets/detail-fab/fab-Quotation.svg' }, { name: 'Customer', icon: '/assets/detail-fab/fab-Customer.svg' }];
  fab_opportunity = [{ name: 'Call', icon: "/assets/detail-fab/fab-phone.svg" }, { name: 'Mail', route: '/create-orders', icon: 'assets/detail-fab/fab-mail.svg' }, { name: 'Whatsapp', icon: '/assets/detail-fab/fab-whatsapp.svg' }, { name: 'Quotation', icon: '/assets/detail-fab/fab-Quotation.svg' }, { name: 'Customer', icon: '/assets/detail-fab/fab-Customer.svg' }];
  fab_quotation = [{ name: 'Call', icon: "/assets/detail-fab/fab-phone.svg" }, { name: 'Mail', route: '/create-orders', icon: 'assets/detail-fab/fab-mail.svg' }, { name: 'Whatsapp', icon: '/assets/detail-fab/fab-whatsapp.svg' } , { name: 'Set as Lost', icon: '/assets/detail-fab/fab-lost.svg' }];
  fab_items: any = [];
  new_user_form = false;
  contact_number: any;
  contact_email: any;
  lead_comments:any = [];
  readOnly: boolean = false;
  @ViewChild('fab') fab: IonFab | any;
  @Input() type;
  @Input() doctype: any;
  @Input() forms_route: any;
  @Input() modalPopup: any;
  @Input() modal_sale_order_id: any;

  @ViewChild(IonContent) content!: IonContent;
  

  tabs_array = [
    { name: 'Overview', route: 'Summary', value: 'Summary' },
    { name: 'Info', route: 'lead', value: 'lead' },
    { name: 'Notes', route: 'comment', value: 'comment' },
    { name: 'Tasks', route: 'activities', value: 'activities' },
    { name: 'Meetings', route: 'activities', value: 'activities' },
  ];

  routeSubscription: any;
  createNew = false;


  
  loader_:any=false;
  
  constructor(private navCtrl: NavController,private http: HttpClient,public db: DbService, private platform: Platform, public location: Location, private menuCtrl: MenuController, public route: ActivatedRoute, private router: Router, public modalCtrl: ModalController, private loadingCtrl: LoadingController, private animationCtrl: AnimationController, private socialSharing: SocialSharing, public actionSheetController: ActionSheetController) { }

  ngOnInit() {

    if(localStorage['selected_list']){
      this.db.selected_list = JSON.parse(localStorage['selected_list']);
    }

    if(this.modalPopup){
      this.page_route = this.forms_route;
      this.sale_order_id = this.modal_sale_order_id
      this.get_order_details(this.doctype, this.modal_sale_order_id, '');
    }else{
      this.routeSubscription = this.route.params.subscribe(res => {
        if (res && res['route_1'] && res['route_2']) {
          if(localStorage['selected_list']){
            this.db.selected_list = JSON.parse(localStorage['selected_list']);
          }
          this.page_route = res['route_1'];
          this.sale_order_id = res['route_2'];
          this.page_title = this.db.selected_list.page_name;
          if(res['route_1'] == "task") {
            this.db.selected_list.page = "Task"
          }
          if(this.db.selected_list.page == "Customer" || (res['route_1'] == 'event')){
            this.readOnly=true;
          }
          if(res['route_1'] == 'event'){
            this.db.selected_list.page = "Event"
          }
          this.get_order_details(this.db.selected_list.page, res['route_2'], '');
        } else if (res && res['route_1'] && !res['route_2']) {
  
        }
  
      
      })
    }


    if(this.db.detailHeaderName){
      this.db.tab_buttons(this.tabs_array, 'Summary', 'value');
      // this.db.tab_buttons(this.tabs_array, 'Summary', 'value');
    }


  //   this.platform.backButton.subscribeWithPriority(10, () => {
  //     // Handle the back button here
  //     console.log('Back button pressed');
  //     this.navCtrl.back();
  //     // For example, you can navigate or modify behavior
  // });

  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  

  // load_search($event){
  //   console.log($event,"$event detail")
  // }

  async edit_event(item: any) {
    // this.router.navigateByUrl('/detail/event/' + item.name)
    // this.readOnly = false
    // this.db.store_old_id = this.sale_order_id;
    const modal = await this.modalCtrl.create({
      component: EditFormsPage,
      cssClass: this.db.ismobile ? 'crm-edit-event' : 'web_site_form',
      componentProps: {
        name: item.name,
        page_route: this.doctype == 'Customer' ? 'Customer' : 'event',
        page_name: this.doctype == 'Customer' ? 'Customer' : 'Event',
        page_route_name: this.doctype == 'Customer' ? 'customer' : 'event',
        title: this.doctype == 'Customer' ? 'Edit Customer' : 'Edit Event',
        order_detail: this.doctype == 'Customer' ? this.order_detail : null,
        modal: true
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    // this.enable_activities = true;
    // console.log(data)
    if(data && data.status && data.status == 'Success'){
      // this.meetingList[index] = data.data
      this.order_detail = {...this.order_detail,...data.data}
    }
  }

  async openMenu() {
    // this.menuCtrl.open();
    const modal = await this.modalCtrl.create({
      component: AttachmentsComponent,
      cssClass: 'attachment_',
      componentProps: {
        order_id: this.sale_order_id,
        doctype:this.db.selected_list.page

      },
      enterAnimation: this.db.enterAnimationLeftToRight,
      leaveAnimation: this.db.leaveAnimationLeftToRight,
    })
    await modal.present();
    const { data } = await modal.onWillDismiss();
  }

  back_btn(){
    // console.log(this.doctype)
    if(this.doctype == 'HD Ticket'){
      this.db.hd_ticket_show = false;
    this.db.enable_detail = false;
    this.db.enable_material = false;
    this.db.profile_side_menu = false;
     this.db.detail_route_bread = '';
     this.router.navigateByUrl('/list/hd-ticket')
    this.db.load_template_datas_list.next('Success');
      // this.location.replaceState('/list/hd-ticket');
    }
  }

  ionViewWillEnter() {
    this.db.attachment_menu = true;
  }

  ionViewWillLeave() {
    this.db.attachment_menu = false;
    this.db.scroll_event.detail_head = false;
  }

  async get_invoice_detail(doctype, name, type) {
    // this.loader = true;

    // let data = {
    //   doc_name: name,
    //   doctype: doctype
    // }
    // this.db.get_payment_entry_detail(data).subscribe((res:any) => {
    //   this.loader = false;

    //   if(res && res.message && res.message.status && res.message.status == 'Success' ){
    //     res.message.message['party'] = this.employeeId;
    //     this.check_permissions(res.message.message, doctype, type);
    //   }
    // })
  }

  async get_order_details(doctype, name, type) {
    if((doctype != "HD Ticket" || this.db.ismobile) && (!this.db.ismobile || this.db.ismobile))
      this.loader = true;

    let data = {
      name: name,
      doctype: doctype
    }
    this.db.doc_detail(data).subscribe(res => {
    
      if (res.message && res.message[0] && res.message[0]['status'] && res.message[0]['status'] == 'Success') {
        this.check_permissions(res.message[1], doctype, type);
      } else if (res.message && res.message.status && res.message.status == 'failed') {
        setTimeout(() => {
          this.location.back();
        }, 800);
        this.db.alert(res.message.message);
      } else {
        this.location.back();
        this.db.alert('Something went wrong try again later');
      }

      if(res.message && res.message[1] && res.message[1].doctype == 'HD Ticket'){
        // this.db.get_all_conversation(res.message[1].name)
        this.db.mail_send_to = res.message[1]
        // this.db.loadTicketDetailName = true;
        // this.db.loadTicketDetails.next(res.message[1])
      } 
      setTimeout(()=>{ this.loader = false, this.loader_ = false }, 300)
    }, (error: any) => {
      setTimeout(() => {
        this.location.back();
      }, 800);
      this.db.alert('Something went wrong try again later');
    })
  }

  check_permissions(order_detail, doctype, type) {
    this.doctype = order_detail.doctype
    this.contact_number = order_detail.phone ? order_detail.phone : order_detail.contact_mobile;
    this.contact_email = order_detail.email_id ? order_detail.email_id : order_detail.contact_email;
    let next_doc_details;
    this.db.permission_details = JSON.parse(localStorage['permission_details']);

    if (this.db.selected_list.next_doc) {
      next_doc_details = this.db.permission_details.find(r => r.page == this.db.selected_list.next_doc);
    }
    //  if (doctype == 'Sales Order') {
    //   if (order_detail.status == 'Draft' || order_detail.status == 'Cancelled' || order_detail.status == 'Closed' || order_detail.status == 'On Hold' || order_detail.status == 'To Deliver') {
    //     next_doc_details ? next_doc_details.create = 0 : null;
    //   }else {
    //     next_doc_details ? next_doc_details.create = 1 : null;
    //   }
    // } else if (doctype == 'Lead' || doctype == 'Opportunity') {
    //   this.db.tab_buttons(this.tabs_array, 'Summary', 'value');
    //   next_doc_details ? next_doc_details.create = 0 : null;
    //   if (order_detail.status == 'Converted') {
    //     next_doc_details ? next_doc_details.create = 0 : null;
    //   } else if (order_detail.status == 'Quotation' && this.db.selected_list.role == "Sales User") {
    //     next_doc_details ? next_doc_details.create = 0 : null;
    //   }
    // } else if (doctype == 'Opportunity') {
    //   next_doc_details ? next_doc_details.create = 0 : null;
    //   if (order_detail.status == 'Lost') {
    //     next_doc_details ? next_doc_details.create = 0 : null;
    //   }
    // } else if (doctype == 'Quotation') {
    //   next_doc_details ? next_doc_details.create = 0 : null;
    // }else if (doctype == 'Request for Quotation' && this.page_title == 'Supplier Quotation') {
    //   order_detail.status = 'Draft'
    // }

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
    // if ((doctype == 'Lead' || doctype == 'Opportunity' || doctype == 'Sales Order') && selected_list.write == 1) {
    //   this.order_id = this.sale_order_id;
    //   this.enabled_read_only = false;
    // }
    
    if (doctype == 'Leave Application' && order_detail && order_detail.status == 'Open') {
      this.order_id = this.sale_order_id;
      this.enabled_read_only = false;
    }
    if (doctype == 'Bug Sheet') {
      this.order_id = this.sale_order_id;
      this.enabled_read_only = false;
    }

    if(this.doctype == 'Employee Grievance' && this.db.hr_manager_role && order_detail.status == 'Open'){
      this.order_id = this.sale_order_id;
      this.enabled_read_only = false;
    }
    if (doctype == 'HD Ticket') {
      this.order_id = this.sale_order_id;
      this.enabled_read_only = false;
    }

    if (doctype == 'Item') {
      this.order_id = this.sale_order_id;
      this.enabled_read_only = false;
    }
    if (doctype == 'Report') {
      this.order_id = this.sale_order_id;
      this.enabled_read_only = false;
    }else if (doctype == 'Issue') {
      this.order_id = this.sale_order_id;
      this.enabled_read_only = false;
    }
    if (this.db.selected_list.write == 1 && doctype == 'Task') {
      this.order_id = this.sale_order_id;
      this.enabled_read_only = false;
    } else if (!this.creation && this.db.selected_list.next_doc == 'Task') {
      this.enabled_read_only = false;
    } 
    if(this.doctype == 'Customer'){
      this.enabled_read_only = false;

    }

    if(this.doctype == 'Employee'){
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
      } else if (check && this.creation && (this.db.selected_list.page == 'Purchase Order' || this.db.selected_list.page == 'Purchase Receipt')) {
        if (this.db.selected_list.page == 'Purchase Order' && order_detail && order_detail.status == 'To Bill') {
          let route;
          if (this.db.selected_list.page == 'Purchase Order') {
            route = this.db.permission_details.find(r => r.page == 'Purchase Receipt');
            route.page = this.db.selected_list.page;
          } else {
            route = this.db.selected_list;
          }
          this.db.selected_list = route;
          this.detail_doc['name'] = this.db.selected_list.next_doc;
        } else if (this.db.selected_list.page == 'Purchase Order') {
          this.detail_doc['name'] = this.db.selected_list.next_doc;
        }
      }

    } else {
      this.detail_doc['name'] = undefined;
    }

    if(doctype == 'Sales Order' && this.page_route == 'Sales Invoice' && this.page_title == 'Sales Invoice'){
      this.enabled_read_only = false;
    }

    if(doctype == 'Employee Letter Request'){
      this.enabled_read_only = false;
    }

    if(this.db.selected_list.write == 0){
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
    } else if (order_detail && (order_detail.customer_name || order_detail.customer ) && !this.new_user_form) {
      order_detail.title = order_detail.customer_name ? order_detail.customer_name : order_detail.customer;
    } else if (order_detail && (order_detail.customer_name || order_detail.customer ) && this.new_user_form) {
      order_detail.title = ('New ' + this.page_route)
    }else if (order_detail && order_detail.name) {
      order_detail.title = order_detail.name
    }  else  {
      order_detail.title = ('New ' + this.page_title)
    }

    this.order_detail = order_detail;

    if (type != 'next_detail') {
    } else {
      this.order_detail.next_type = type;
      this.order_detail.enable_reference = this.enable_reference
      this.order_detail.order_id = this.order_id
      this.order_detail.enabled_read_only = this.enabled_read_only
      this.order_detail.items_values = this.items_values
      localStorage['Next_Detail'] = JSON.stringify(this.order_detail);
    }


    if(this.db.selected_list && this.db.selected_list.page && (this.db.selected_list.page == 'Lead' || this.db.selected_list.page == 'Opportunity')){
      this.detail_doc['name'] = 'Overview'
    }
  }

  enable_reference = false;
  items_values: any = [];
  employeeId:any;

  load_detail(data) {
    this.items_values = (this.order_detail && this.order_detail.items) ? this.order_detail.items : []
    let material_request_type = (this.order_detail && this.order_detail.material_request_type) ? this.order_detail.material_request_type : undefined
    if(this.order_detail && this.order_detail.employee){
      this.employeeId = this.order_detail.employee
    }
    this.order_detail = undefined;
    this.detail_doc['name'] = undefined;
    this.creation = false;
    this.hasClass = false;
    this.enabled_read_only = false;
    this.load_drop_down = false;
    let doctype = this.db.selected_list.page;
    let name = this.sale_order_id;
    this.page_title = this.db.selected_list.next_doc;
    this.enable_reference = true;
    if (data == 'Quotation') {
      this.page_route = data;
    } if (data == 'Opportunity') {
      this.page_route = data;
    } else if (data == 'Customer') {
      this.page_route = data;
    } else if (data == 'Sales Invoice') {
      this.page_route = data;
    } else if (data == 'Sales Order') {
      this.page_route = 'sales-order-creation';
    } else if(doctype == 'Material Request'){
      this.page_route = this.page_title 
    } else if (this.db.selected_list.next_doc) {
      let page_name = this.db.permission_details.find(r => r.page == this.db.selected_list.next_doc);
      this.page_route = page_name.detail_route;
    }
    if (doctype == 'Project') {
      this.project_to_task(doctype, name);
    } else {
      if ((this.page_title == 'Purchase Order' && (material_request_type && material_request_type == 'Purchase')) || this.page_title == 'Purchase Receipt' || doctype == 'Lead' || doctype == 'Opportunity') {
        this.createNew = true;
        let type = '';
        if (this.page_title == 'Purchase Order') {
          type = 'make_purchase_order'
        } else if (this.page_title == 'Purchase Receipt') {
          type = 'make_purchase_receipt'
        }
        if (doctype == "Lead") {
          if (this.page_route == 'Opportunity') {
            type = "make_opportunity"
          } else if (this.page_route == 'Quotation') {
            type = "make_quotation"
          } else if (this.page_route == 'Customer') {
            type = "make_customer"
          }
        } else if (doctype == "Opportunity") {
          if (this.page_route == 'Quotation') {
            type = "make_quotation"
          } else if (this.page_route == 'Customer') {
            type = "make_customer"
          }
        } else if (doctype == "Quotation") {
          if (this.page_route == 'sales-order-creation') {
            type = "make_sales_order"
          }
        }
        this.get_create_detail(doctype, name, type)
      } else {
        if(this.page_title && this.page_title == 'Payment Entry'){
        }else{
          this.get_order_details(doctype, name, '');
        }
      }
    }
  }

  async project_to_task(doctype, name) {
    let data_obj = {
      'project': name,
      'status': 'Open'
    }
    this.check_permissions(data_obj, doctype, '');
  }


  async get_create_detail(doctype, name, type) {

    let doctype_name = doctype;
    doctype = doctype.toLocaleLowerCase();

    if (doctype.includes(' ')) {
      doctype = doctype.replace(/ /g, '_');
    } else {
      doctype = doctype;
    }

    let data = {
      "doctype": doctype,
      "doc_id": name,
      "method": type
    }
    this.db.get_default_data(data).subscribe(res => {
      if (res && res.status && res.status == 'Success') {
        this.check_permissions(res.message, doctype_name, '');
      } else {
        this.db.alert('Something went wrong try again later');
      }
    }, (error: any) => {
      this.db.alert('Something went wrong try again later');
    })

  }

  async next_doc(name) {
    this.loader = true;
    let data = {
      "doctype": this.db.selected_list.page,
      "value": this.sale_order_id,
      "filters": [],
      "prev": name
    }
    this.db.next_doc(data).subscribe(res => {
      if (res && res.status == "Failed") {
        var d = JSON.parse(res._server_messages);
        var d1 = JSON.parse(d);
        this.db.alert(d1.message);
        this.loader = false;
      } else {
        this.loader = false;
        this.sale_order_id = res.message;
        localStorage['selected_project_id'] = res.message
        this.content.scrollToTop(400);
        this.get_order_details(this.db.selected_list.page, res.message, 'next_detail');
      }
    }, (error: any) => {
      this.db.alert('Something went wrong try again later');
    })

  }

  goBack(){
     if(this.db.path && this.db.path.includes('/detail/customer/')){
      this.router.navigateByUrl('/tabs/list/Customer')
    }else if(this.db.path && this.db.path.includes('/detail/Lead/')){
      this.router.navigateByUrl('/tabs/list/Lead')
    }else{
      this.location.back();
    }
  }

  async create_new(data) {
    if (data == '/forms/Tasks') {
      const modal = await this.modalCtrl.create({
        component: FormsPage,
        cssClass: 'crm-add-comment',
        componentProps: {
          name: this.sale_order_id,
          page_title: 'New Task',
          task_doctype: this.doctype,
          modal:true
        }
      });
      await modal.present();
      let val: any = await modal.onWillDismiss();
      if (val && val.data && val.data.status && val.data.status == "Success") {
        
      }
    } else if (data == '/forms/Meetings') {
      const modal = await this.modalCtrl.create({
        component: FormsPage,
        cssClass: 'crm-event-comment',
        componentProps: {
          name: this.sale_order_id,
          page_title: 'New Event',
          event_doctype: this.doctype,
          modal:true
        }
      });
      await modal.present();
      let { data } = await modal.onWillDismiss();
      if (data && data.status && data.status == "Success") {
        this.order_detail = data.data
        if (this.order_detail) {
          let value = {
            name: this.sale_order_id,
            doctype: this.doctype,
          }
          this.db.doc_detail(value).subscribe(res => {
           this.order_detail = res.message;
           this.db.loader = false;
            if (this.order_detail && this.order_detail.events) {
              this.order_detail.events.sort((a, b) => {
                const dateA = new Date(a.starts_on);
                const dateB = new Date(b.starts_on);
                return dateB.getTime() - dateA.getTime();
              });
            }
          })
        }

      }
    } else if(data == '/forms/Notes'){
      
    }
  
  }

  create_btn(eve) {
    this.open_pop_up();
  }


  async open_pop_up() {
    let select_item = [{ 'label': this.detail_doc.name }];
    if (this.db.selected_list.page == 'Purchase Order') {
    }

    const modal = await this.modalCtrl.create({
      component: NavigationLinkPage,
      cssClass: 'navigation-link-popup',
      componentProps: {
        warehouse_list: select_item,
        sale_order_id: this.sale_order_id
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    })
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data == 'Success') {
      this.load_detail('');
    }
  }

  // ion-model slide left transaction

  menu_name(event: any) {
    this.detail_doc['name'] = event ? event.name  : event;
    if (event.name == 'Tasks' || event.name == 'Meetings' || event.name == 'Notes') {
      this.detail_doc['route'] = '/forms/' + event.name;
    }
  }

  fab_() {
    let val;
    val = document.getElementById('fab');
    val.click();
    this.db.hasClass = false;
  }

  nav() {
    this.db.hasClass = this.db.hasClass ? false : true;
  }

  navigate_to_next(item) {
    this.new_user_form = true;
    // if (item.name == 'Call') {
    //   this.contact_number ? this.call() : this.db.sendErrorMessage("This customer doesn't have a phone number.so, can't connect");
    // } else if (item.name == 'Mail') {
    //   this.contact_email ? this.sendEmail() : this.db.sendErrorMessage("This customer doesn't have a Email.so, can't connect");
    // } else if (item.name == 'Whatsapp') {
    //   this.contact_number ? this.openWhatsApp() : this.db.sendErrorMessage("This customer doesn't have a Whatsapp number. So, can't connect");
    // } else if (item.name == 'Opportunity') {
    //   this.load_detail('Opportunity');
    // } else if (item.name == 'Quotation') {
    //   this.load_detail('Quotation');
    // } else if (item.name == 'Customer') {
    //   this.load_detail('Customer');
    // } else if (item.name == 'Sales Invoice') {
    //   this.load_detail('Sales Invoice');
    // } else if (item.name == 'Sales Order') {
    //   this.load_detail('sales-order-creation');
    // } else if(item.name == 'Set as Lost'){
    //   // this.db.lost_quotation.next(item.name)
    //   this.add_reason();
    // }
    this.db.hasClass = !this.db.hasClass;
  }

  navigate_to_next_opportunity(item) {
    this.new_user_form = true;
    // if (item.name == 'Call') {
    //   // console.log(this.contact_number)
    //   this.order_detail.contact_mobile ? this.call_1(this.order_detail.contact_mobile) : this.db.sendErrorMessage("This customer doesn't have a phone number.so, can't connect");
    // } else if (item.name == 'Mail') {
    //   this.order_detail.contact_email ? this.sendEmail_1(this.order_detail.contact_email) : this.db.sendErrorMessage("This customer doesn't have a Email.so, can't connect");
    // } else if (item.name == 'Whatsapp') {
    //   this.order_detail.contact_mobile ? this.openWhatsApp_1(this.order_detail.contact_mobile) : this.db.sendErrorMessage("This customer doesn't have a Whatsapp number. So, can't connect");
    // } else if (item.name == 'Opportunity') {
    //   this.load_detail('Opportunity');
    // } else if (item.name == 'Quotation') {
    //   this.load_detail('Quotation');
    // } else if (item.name == 'Customer') {
    //   this.load_detail('Customer');
    // } else if (item.name == 'Sales Invoice') {
    //   this.load_detail('Sales Invoice');
    // } else if (item.name == 'Sales Order') {
    //   this.load_detail('sales-order-creation');
    // } else if(item.name == 'Set as Lost'){
    //   // this.db.lost_quotation.next(item.name)
    //   this.add_reason();
    // }
    this.db.hasClass = !this.db.hasClass;
  }

  call_1(contact_number) {
    let number = 'tel:' + contact_number;
    let element = document.createElement('a');
    element.setAttribute('href', number);
    element.click();
  }

  sendEmail_1(contact_email) {
    // Check if the app is running on a mobile device
    if (this.platform.is('mobile')) {
      let email = `mailto:${contact_email}`;
      let element = document.createElement('a');
      element.setAttribute('href', email);
      element.click();
    } else {
      // Handle email redirection on desktop or other platforms
      window.open(`mailto:${contact_email}`, '_blank');
    }
  }

  openWhatsApp_1(contact_number) {
    const phoneNumber = contact_number.replace('+', '%2B');
    // const url = `whatsapp://send?phone=91${phoneNumber}`
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}`;
    window.open(url, '_system');
  }

  call() {
    let number = 'tel:' + this.contact_number;
    let element = document.createElement('a');
    element.setAttribute('href', number);
    element.click();
  }

  sendEmail() {
    // Check if the app is running on a mobile device
    if (this.platform.is('mobile')) {
      let email = `mailto:${this.contact_email}`;
      let element = document.createElement('a');
      element.setAttribute('href', email);
      element.click();
    } else {
      // Handle email redirection on desktop or other platforms
      window.open(`mailto:${this.contact_email}`, '_blank');
    }
  }

  openWhatsApp() {
    const phoneNumber = this.contact_number.replace('+', '%2B');
    // const url = `whatsapp://send?phone=91${phoneNumber}`
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}`;
    window.open(url, '_system');
  }

  async add_reason(){
    // console.log(this.order_detail)
    const modal = await this.modalCtrl.create({
      component: FormsPage,
      cssClass: this.db.ismobile ? 'crm-add-event' : 'web_site_form',
      componentProps: {
        page_title: 'Set as Lost',
        name: this.order_detail.name,
        modal:true
      },
    });
    await modal.present();
    let { data } = await modal.onWillDismiss();
    // console.log(data)
    if(data && data == 'Success'){
      let value = {
        name: this.order_detail.name,
        doctype: this.order_detail.doctype
      }
      this.db.doc_detail(value).subscribe(res => {
        if(res && res.status == 'Success'){
          this.order_detail = res.message[1];
        }
      })
    }
  }

  download_SI(){
    let url = this.db.baseMethod + `frappe.utils.print_format.download_pdf?doctype=Sales%20Invoice&name=${this.order_detail.name}&format=Tax%20Invoice&no_letterhead=0&letterhead=Tridots%20Header%20and%20Footer&settings=%7B%7D&_lang=en`
    window.open(url, '_blank');
  }

  async savePDF() {
    try {
      const pdfUrl = this.db.baseMethod + `frappe.utils.print_format.download_pdf?doctype=Sales%20Invoice&name=${this.order_detail.name}&format=Tax%20Invoice&no_letterhead=0&letterhead=Tridots%20Header%20and%20Footer&settings=%7B%7D&_lang=en`; // URL to the sample PDF file
      const response = await this.http.get(pdfUrl, { responseType: 'blob' }).toPromise();
      const pdfBlob = response as Blob;
      const fileName = 'Sales Invoice' + this.order_detail.name;;
  
      await Filesystem.writeFile({
        path: fileName,
        data: pdfBlob,
        directory: Directory.Documents,
        recursive: true
      });
  
      // console.log('PDF file saved successfully');
    } catch (error) {
      // console.error('Unable to save PDF file', error);
    }
  }

  async share() {
    await Share.share({
      title: 'Title',
      text: 'This is the message to be shared.',
      url: this.db.baseMethod + `frappe.utils.print_format.download_pdf?doctype=Sales%20Invoice&name=${this.order_detail.name}&format=Tax%20Invoice&no_letterhead=0&letterhead=Tridots%20Header%20and%20Footer&settings=%7B%7D&_lang=en`,
      dialogTitle: 'Share with buddies'
    });
  }

  // async share() {
  //   const actionSheet = await this.actionSheetController.create({
  //     header: 'Share via',
  //     buttons: [
  //       {
  //         text: 'Twitter',
  //         icon: 'logo-twitter',
  //         handler: () => {
  //           this.shareOnTwitter();
  //         }
  //       },
  //       {
  //         text: 'Facebook',
  //         icon: 'logo-facebook',
  //         handler: () => {
  //           this.shareOnFacebook();
  //         }
  //       },
  //       {
  //         text: 'Cancel',
  //         icon: 'close',
  //         role: 'cancel'
  //       }
  //     ]
  //   });
  //   await actionSheet.present();
  // }

  // shareOnTwitter() {
  //   this.socialSharing.shareViaTwitter('Check out this awesome Ionic app!');
  // }
  
  // shareOnFacebook() {
  //   this.socialSharing.shareViaFacebook('Check out this awesome Ionic app!');
  // }

  async Tag_btn() {
    const modal = await this.modalCtrl.create({
      component: TagsComponent,
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
        this.order_detail = d.message;
        this.tag_filter(this.order_detail);
      });
    }
  }

  save_comments(value) {

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
        this.order_detail = d.message;
        this.tag_filter(this.order_detail);
      });
    });
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
        this.order_detail = d.message;
        this.tag_filter(this.order_detail);
      });
    });
  }

  tag_filter(data) {
    this.order_detail._user_tags = data._user_tags.filter((res) => {return res.value == 1;});
    // this.db.next_tag = false;
  }


  openWhatsApp1() {
    if (this.order_detail.mobile_no || this.order_detail.contact_mobile) {
      let url = this.order_detail.mobile_no  ? (`https://api.whatsapp.com/send?phone=${this.order_detail.mobile_no}`) : (`https://api.whatsapp.com/send?phone=${this.order_detail.contact_mobile}`);
      window.open(url, '_system');
    } else {
      this.db.sendErrorMessage( "This customer doesn't have a Whatsapp number.so, can't connect");
    }
  }

  call1() {
    if (this.order_detail.mobile_no || this.order_detail.contact_mobile) {
      let number = this.order_detail.mobile_no || this.order_detail.contact_mobile;
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

  async assigned() {
    const modal = await this.modalCtrl.create({
      component: UserListPage,
      cssClass: 'job-detail-popup',
      componentProps: {
        order_id: this.sale_order_id ? this.sale_order_id : this.order_detail.name,
        // user_list: this.db.selected_mail && this.db.selected_mail.length != 0 ? this.db.selected_mail : null,
        user_list: (this.order_detail && this.order_detail.assign_to) ?  this.order_detail.assign_to : [],
        description: this.order_detail.title,
        doctype: this.doctype,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    // console.log('data',data);
    if (data && data == 'Success') {
      console.log(this.db.selected_mail);
      this.order_detail.assign_to = this.db.selected_mail;
      
      // this.order_detail.assign_to = [...this.order_detail.assign_to,...this.db.selected_mail];

      // this.order_detail.assign_to = this.order_detail.assign_to.filter((obj, index, self) =>
      //   index === self.findIndex((t) => (
      //     t.email === obj.email
      //   ))
      // );

      // this.assign_to = true;
      // this.get_assigned_list();
    }
  }

  returnSubmitValues(eve){
    // console.log(eve);
    this.order_detail = eve;
    let doc = {
      name: this.sale_order_id,
      doctype: this.doctype,
    };
    this.db.doc_detail(doc).subscribe((d) => {
      this.order_detail = d.message;
      this.tag_filter(this.order_detail);
    });
    // this.db.infoSummary = true;
  }

  async assign_user(){
    const modal = await this.modalCtrl.create({
      component: UserListPage,
      cssClass: this.db.ismobile ? 'user_list' : 'web_site_form',
      componentProps : {
        order_id : this.order_detail.name,
        user_list : [],
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
}

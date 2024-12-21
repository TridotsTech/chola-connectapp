import { Component, OnInit, ViewChild, Input, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { IonContent } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
})
export class FormsPage implements OnInit {
  @Input() forms_route: any;
  @Input() name: any;
  @Input() page_title: any;
  @Input() task_doctype: any;
  @Input() event_doctype: any;
  @Input() action_meet: any;
  @Input() modal: any;

  page_route: any;
  sale_order_id: any;
  edit_form = false;
  order_detail: any;
  enable_readonly: any;
  tasks: any;
  data: any;
  
  @ViewChild(IonContent) content!: IonContent;
  constructor(public db: DbService, private router: Router, private route: ActivatedRoute, public modalctrl: ModalController, public viewContainerRef:ViewContainerRef) { 

    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationStart) {
    //     // Log navigation start event
    //     console.log('Navigation started');
    //     console.log('event',event);
    //   } else if (event instanceof NavigationEnd) {
    //     // Log navigation end event
    //     console.log('Navigation ended');
    //     console.log('event',event);
    //   } else if (event instanceof NavigationCancel) {
    //     // Log navigation cancel event
    //     console.log('Navigation canceled');
    //     console.log('event',event);
    //   } else if (event instanceof NavigationError) {
    //     // Log navigation error event
    //     console.error('Navigation error:', event.error);
    //     console.log('event',event);
    //   }
    // });

  }

  ngOnInit() {
    this.sale_order_id = this.name;
    // console.log(this.page_title)
    if (this.page_title && this.page_title == 'New Task') {
      // this.get_task();
      this.db.update_id = true;
    } else if (this.page_title && this.page_title == 'New Event') {
      this.db.update_id = true;
      // this.get_event();
    }
    if (!this.db.ismobile) {
      this.page_route = this.forms_route
      if (this.page_route && this.page_route.includes('-')) {
        this.page_title = this.page_route.replace(/-/g, ' ');
      } else {
        this.page_title = this.page_route;
      }
    } else {
      if (this.db.permission_details && this.db.permission_details.length == 0) {
        this.db.permission_details = JSON.parse(localStorage['permission_details']);
      }
      this.route.params.subscribe(res => {
        if (res && res['id']) {
          // console.log(res);
          let route = this.db.permission_details.find(r => r.page == 'Expense Claim');
          if (res['id'] == 'expense-claim' && route && route.page == 'Expense Claim') {
            this.get_claim_details(res['id']);
          } else {
            this.page_route = res['id'];
            this.edit_form = false;
          }
          if (res['id'] && res['id'].includes('-')) {
            this.page_title = res['id'].replace(/-/g, ' ');
            if (this.page_title == "employee employee advance") {
              this.page_title = "employee advance"
            }
          } else {
            this.page_title = res['id'];
          }
        }
      })
    }
    // console.log(this.page_title);
    // console.log(this.page_route);
    if(this.page_title == 'Set as Lost'){
      this.page_route = 'lost-quotation'
    }
  }

  get_claim_details(id) {
    let data = {
      employee_id: localStorage['employee_id']
    };
    this.db.employee_claim_details(data).subscribe(res => {
      if (res && res.status && res.status == 'Success' && this.db.selected_list && this.db.selected_list.page != 'Employee') {
        this.order_detail = res.message
        this.page_route = id;
        this.edit_form = true;
        this.enable_readonly = true;
      } else {
        this.page_route = id;
        this.edit_form = false;
        this.enable_readonly = false;
      }
    }, error => { this.db.alert('Something went wrong try again later') })
  }

  scrollToTop() {
    this.content.scrollToTop(500);
  }

  get_task() {
    // this.db.get_task_form().subscribe(res => {
    //   // console.log(res)
    //   this.tasks = res.route;
    // })
  }

  get_event() {
    // this.db.get_event_form().subscribe(res => {
    //   this.data = res.route;
    //   this.db.loader = false;
    // })
    // var data={
    //   user:localStorage['customerRefId'],
    //   web_form:'Event'
    // }
    // this.db.custom_doc_fields(data).subscribe(res => {
    //   // this.data = res.message;
    //   localStorage['Event_json'] = res.message.form_json;
    //   this.data = JSON.parse(localStorage['Event_json']);
    //   this.db.loader = false;
    // })
  }

  ngOnDestroy(): void {
    // console.log('ngOnDestroy');
    // window.removeEventListener("popstate", this.popstateListener);
  }
  
  // private popstateListener = (event) => {
  //   console.log(
  //     `location: ${document.location}, state: ${JSON.stringify(event.state)}`,
  //   );
  // }
  
}

import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { DbService } from '../../../services/db.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-leave-application-list',
  templateUrl: './leave-application-list.component.html',
  styleUrls: ['./leave-application-list.component.scss'],
})
export class LeaveApplicationListComponent  implements OnInit {
  @Input() leave_application_table:any;
  @Input() data:any;
  @Input() doctype:any;
  @Output() load_data = new EventEmitter();
  // @Output() click_data = new EventEmitter();
  @Output() leaveConfirm = new EventEmitter();
  @Output() tab_filter = new EventEmitter();
  skeleton = false;
  @Input() employee: any;
  @Input() supplier_id: any;
  @Input() doc_type: any;
  @Input() json_filter: any;
  @Input() page_title: any;
  @Input() search_filter: any;
  @Input() module_tab: any;
  @Input() leave_type: any;
  @Input() detail_loader: any;
  @Output() filterList = new EventEmitter();
  @Output() load_popup = new EventEmitter();
  // @Output() hrTab = new EventEmitter();

  showCalendar:any;
  search_data:any;

  constructor(public db:DbService,private modalCtrl:ModalController) { }

  ngOnInit() {
    this.db.tab_filter = true
    this.skeleton = true;
    if(this.data && this.data.data && this.data.data.length > 0){
      this.skeleton = false;
    }else{
      setTimeout(() => {
        this.skeleton = false;
      }, 500);
    }

    if(this.leave_application_table && this.leave_application_table.length > 0){
      for (let i = 0; i < this.leave_application_table.length; i++) {
        if(this.leave_application_table[i]['name'] == "Actions"){
          this.leave_application_table[i]['name'] = 'Status'
        }        
      }
    }

  }

  icons_array = [
    '/assets/leaves/calendar-purple.svg',
    '/assets/leaves/calendar-yellow.svg',
    '/assets/leaves/calendar-green.svg',
    '/assets/leaves/calendar-red.svg',
    '/assets/leaves/calendar-red.svg',
  ]


  leave_confirm(event:MouseEvent,data,type,index){
    event.stopPropagation()
    let val = {}
    val['data'] = data
    val['type'] = type
    val['index'] = index
    this.leaveConfirm.emit(val)
  }

  get_leave_details(datas){
    let data = {
        "search_data": this.search_data,
        "page_no": 1,
        "page_length": 20,
        "date": this.db.current_event_date,
        "employee_id": '',
        // "employee_id": datas == 'All Leaves' ? '' : localStorage['employee_id'],
        "dashboard_name": "HR Leave Application Dashboard"
        // "dashboard_name": (datas != 'All Leaves' && this.db.hr_manager_role) ? 'Employee Leave Application Dashboard' : "HR Leave Application Dashboard"
    }
    this.db.leave_details(data).subscribe(res => {
      this.data = res.message
    })
  }

  profile_menu = [
    {name: 'All Leaves',value: 'All Leaves',icon: '/assets/img/unmarked.svg',active_icon: '/assets/img/unmarked-active.svg'},
    {name: 'My Leaves',value: 'My Leaves',icon: '/assets/img/summary.svg',active_icon: '/assets/img/summary-active.svg'},
  ]
   
  getDateFromCalendar(eve){
    this.db.current_event_date = eve;
    this.get_leave_details(this.db.current_leave_segment);
  }

  getFilters(eve){
    this.search_data = eve.data;
    this.get_leave_details(this.db.current_leave_segment);
  }

  tabValue(event){
    this.db.current_leave_segment = event.name
    this.db.tab_buttons(this.profile_menu, 'All Leaves', 'value');
    this.tab_filter.emit(event);
  }
}

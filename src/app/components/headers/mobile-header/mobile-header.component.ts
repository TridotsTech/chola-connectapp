import { Modal } from '@amcharts/amcharts4/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss'],
})
export class MobileHeaderComponent implements OnInit {
  @Input() notify: any;
  @Input() back_route: any;
  @Input() back_btn: any;
  @Input() new_btn: any;
  @Input() new_btn_route: any;
  @Input() no_home: any;
  @Input() home: any;
  @Input() title: any;
  @Input() tab_array: any;
  @Input() model: any;
  @Input() order_detail: any;
  @Input() modal_control: any;
  @Input() projects: any;
  @Input() return: any;
  @Input() create: any;
  @Input() doc_type: any;
  @Input() kanban: any;
  @Input() no_filter: any;
  @Input() showYear: any;
  @Input() showMonth: any;
  @Input() freeze: any;
  @Input() selectall:any;
  @Input() is_select:any;

  @Output() create_btn: any = new EventEmitter();
  @Output() menu_name: any = new EventEmitter();
  @Output() select_change: any = new EventEmitter();
  @Output() load_detail: any = new EventEmitter();
  @Output() get_project_name: any = new EventEmitter();
  @Output() toggleKanban: any = new EventEmitter();
  @Output() toggleKanban_task: any = new EventEmitter();
  @Output() filters: any = new EventEmitter();
  @Output() freezeEvent: any = new EventEmitter();
  @Output() select_all = new EventEmitter();

  constructor(public db: DbService, public location: Location, public menuCtrl: MenuController, public navCtrl: NavController, public router: Router,public route : ActivatedRoute) { }

  ngOnInit() {
    console.log(this.is_select)
    console.log(this.selectall)
    if(this.title == 'todo'){
      this.title = 'Tasks'
    }
    // console.log(this.title);
    // console.log(this.doc_type)
    // console.log(this.back_route);
    // console.log(this.model);
    
  //  this.db.get_permission_details();

    const today = new Date();
    this.db.selectedYear = today.getFullYear();
    this.db.selectedMonth = today.getMonth()+1;
  }

  openMenu() {
    console.log('12345')
    this.menuCtrl.open();
    // this.db.get_employee_detail()
    // this.db.get_permission_details();
  }

  backbtn() {
    if (this.back_route) {
      this.navCtrl.navigateRoot(this.back_route);
    } else if (this.model) {
      this.db.close_modal();
    }  else {
      // this.location.back()
      window.history.back()
    }
    // this.db.get_dashboard();
    // this.db.checkin_var_load = true;
    // this.db.get_checkin_var.next('success')
  }

  focusof() {

  }

  purchase_receipt() {

    if (this.return && this.return == 1) {
      this.load_detail.emit('success');
    } else {
      if (this.modal_control && (this.new_btn == 'Create Receipt' || this.new_btn == 'Payment Entry')) {
        // this.db.material_receipt = true;
        this.db.close_modal();
      }

      if (this.modal_control) {
        this.db.close_modal();

        this.router.navigateByUrl(this.new_btn_route);
      } else {
        this.router.navigateByUrl(this.new_btn_route);
      }
    }

  }

  notification(){
    // console.log('hi')
  }

  getIconName() {
    if (this.db.sales_manager_role) {
      return 'chevron-back-outline';
    } else {
      return 'arrow-back-outline';
    }
  }

  search(){
    if(this.model){
      this.db.close_modal();
    }
    this.db.headers_search_icon()
  }

  // select_all(){
  //   this.reg_selectAll.emit();
  // }

}

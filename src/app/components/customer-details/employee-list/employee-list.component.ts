import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { DatePipe } from '@angular/common';
import { FiltersComponent } from 'src/app/components/categories/filters/filters.component';
import { ModalController } from '@ionic/angular';
import { DetailDirectoryComponent } from '../detail-directory/detail-directory.component';
import { EmployeeReadonlyScreenComponent } from '../../employee-readonly-screen/employee-readonly-screen.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss', '../orders/orders.component.scss'],
})
export class EmployeeListComponent implements OnInit {

  @Input() list_data: any;
  @Input() view: any;
  @Output() scroll_data = new EventEmitter();
  @Output() go_to_detail = new EventEmitter();
  @Output() createNew = new EventEmitter();
  @Output() send_pagination_count = new EventEmitter();
  @ViewChild('tabList') tabList: ElementRef | any;

  @Input() supplier_id: any;
  @Input() doc_type: any;
  @Input() json_filter: any;
  @Input() page_title: any;
  @Input() search_filter: any;
  @Input() search_data: any;

  @Output() filterList = new EventEmitter();

  @Output() call_clear_txt = new EventEmitter()
  @Output() search_txt_value = new EventEmitter();
  @Output() supplier_filter = new EventEmitter();
  @Output() tab_filter = new EventEmitter();

  department_seg = false;

  constructor(public db: DbService, public modalCtrl: ModalController) {}

 
  ngOnInit() {
    // this.getSearch();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    let current_date = formattedDate

    this.list_data.map((res, i) => {
      if (i == this.db.selected_index) {
        res['selected'] = true;
        this.check_active(this.db.selected_index);
      } else {
        res['selected'] = false;
      }
    });
    this.department_seg = false;

    this.db.get_employee_type_counts("Employee Dashboard",current_date);

  }

  load_data(eve) {
    this.scroll_data.emit(eve);
  }

  add_wish(event, data) {
    event.stopPropagation();
    this.db.addTowishList(data)
    // data['fav_employee'] = !data['fav_employee'];
  }

  go_detail(data, index) {
    if(this.db.ismobile){
      if(this.db.employee_role){
        this.openDirectory(data);
      }else{
        this.openEmployeeDetail(data)
      }
    }else{
      if(this.db.employee_role){
        this.openDirectory(data);
      }else{
        this.go_to_detail.emit({ item: data, index: index });
        this.check_active(index);
      }
    }
  }

  check_active(index: any) {
    if(this.tabList){
      const element = this.tabList.nativeElement.children[index];
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',
          });
        }, 500);
      }
    }
  }

  getDateDifference(startDate: Date) {
    const endDate = new Date(); // Current date

    const start = new Date(startDate);
    const end = new Date(endDate);

    let yearsDiff = end.getFullYear() - start.getFullYear();
    let monthsDiff = end.getMonth() - start.getMonth();

    // Adjusting months and years if necessary
    if (monthsDiff < 0) {
      yearsDiff--;
      monthsDiff += 12;
    }

    return `${yearsDiff} yr, ${monthsDiff} m`;
  }

  icon_array = [
    '/assets/img/office-chair.svg',
    '/assets/img/alert-diamond.svg',
    '/assets/img/office-chair.svg',
    '/assets/img/beach.svg'
  ]

  async open_filter(event) {

    if((typeof(this.search_data) != 'string')){
      let data = Object.keys(this.search_data)
      if(data.length != 0){
        this.search_data = JSON.stringify(this.search_data);
      }
    }

    const modal = await this.modalCtrl.create({
      component: FiltersComponent,
      cssClass: this.db.ismobile ? 'job-detail-popup' : 'filter-popup',
      componentProps: {
        // supplier_id: this.supplier_id,
        search_filter: this.search_filter,
        search_data: (this.search_data && this.search_data != '' ? JSON.parse(this.search_data) : {}),
        doctype: 'Employee'
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data)
    if(data && data.status == 'success'){
      this.filterList.emit(data);
    }
  }
  


  async openDirectory(employeeDetail){
    const modal = await this.modalCtrl.create({
      component: DetailDirectoryComponent,
      cssClass: 'detailDirecory-popup',
      componentProps: {
        employeeDetail:employeeDetail
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });

    
    // modal.swipeToCloseEnabled = true;
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if(data && data.status == 'success'){
      
    }
  }

  async openEmployeeDetail(employeeDetail){
    const modal = await this.modalCtrl.create({
      component: EmployeeReadonlyScreenComponent,
      cssClass: 'detailDirecory-popup',
      componentProps: {
        employeeDetail:employeeDetail,
        doctype:'Employee'
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });

    
    // modal.swipeToCloseEnabled = true;
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if(data && data.status == 'success'){
      
    }
  }

  sendFavorite(favorite){
    console.log(favorite,'favorite')
  }

}
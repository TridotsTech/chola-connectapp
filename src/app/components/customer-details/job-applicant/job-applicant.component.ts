import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { DatePipe } from '@angular/common';
import { FiltersComponent } from 'src/app/components/categories/filters/filters.component';
import { AlertController, ModalController } from '@ionic/angular';
import { DetailDirectoryComponent } from '../detail-directory/detail-directory.component';

@Component({
  selector: 'app-job-applicant',
  templateUrl: './job-applicant.component.html',
  styleUrls: ['./job-applicant.component.scss'],
})
export class JobApplicantComponent  implements OnInit {

  @Input() list_data: any;
  @Input() view: any;
  @Output() scroll_data = new EventEmitter();
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

  constructor(public db: DbService, public modalCtrl: ModalController) {}

  ngOnInit() {
    this.list_data.map((res, i) => {
      if (i == this.db.selected_index) {
        res['selected'] = true;
        this.check_active(this.db.selected_index);
      } else {
        res['selected'] = false;
      }
    });
  }

  load_data(eve) {
    this.scroll_data.emit(eve);
  }


  check_active(index: any) {
    if(this.tabList){
      const element = this.tabList.nativeElement.children[index];
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
        }, 500);
      }
    }
  }

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
    // console.log(data)
    if(data && data.status == 'success'){
      this.filterList.emit(data);
    }
  }
  
  async openDirectory(employeeDetail){
    const modal = await this.modalCtrl.create({
      component: DetailDirectoryComponent,
      cssClass: 'detailDirecory-popup',
      componentProps: {
        employeeDetail:employeeDetail,
        doctype:'Job Applicant'
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });

    await modal.present();
  }

}

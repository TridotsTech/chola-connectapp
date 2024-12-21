import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { DatePipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { FiltersComponent } from 'src/app/components/categories/filters/filters.component';

@Component({
  selector: 'app-month-filter',
  templateUrl: './month-filter.component.html',
  styleUrls: ['./month-filter.component.scss'],
})
export class MonthFilterComponent implements OnInit, OnChanges {

  @Input() search_data: any;
  @Input() search_filter: any;
  @Input() showCalendar: any;
  @Input() selectedDate: any;
  @Input() doctype: any;
  @Input() noSort: any;
  @Input() hideDate: any;
  @Input() titleName: any;
  @Input() search: any;
  @Input() dateCal: any;
  search_value: any;

  @Output() getDateFromCalendar = new EventEmitter();
  @Output() getFilters = new EventEmitter();
  @Output() search_txt_value = new EventEmitter();
  @Output() call_clear_txt = new EventEmitter();

  month_year: any = false;
  constructor(public db: DbService, public datePipe: DatePipe, public modalCtrl: ModalController) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['search_data'] && changes['search_data'].currentValue) {
      this.search_data = changes['search_data'].currentValue;
    }
  }


  ngOnInit() {
    if (!this.selectedDate) {
      this.selectedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    }
    this.checkFilters();
  }

  checkFilters() {
    let arr = ["Expense Claim", "Leave Application", "Attendance"];

    for (let i = 0; i < arr.length; i++) {
      if (this.doctype == arr[i]) {
        this.month_year = true;
      }
    }
  }

  async month_filter() {
    this.showCalendar = !this.showCalendar
  }

  hideDiv() {
    this.showCalendar = false;
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    this.getDateFromCalendar.emit(this.selectedDate);
    // this.hideDiv();
  }


  date_change(eve){
    this.selectedDate = eve.value
    this.getDateFromCalendar.emit(this.selectedDate);
  }

  async filters() {
    if ((typeof (this.search_data) != 'string')) {
      let data = Object.keys(this.search_data)
      if (data.length != 0) {
        this.search_data = JSON.stringify(this.search_data);
      }
    }

    const modal = await this.modalCtrl.create({
      component: FiltersComponent,
      cssClass: this.db.ismobile ? 'job-detail-popup' : 'filter-popup',
      componentProps: {
        // supplier_id: this.supplier_id,
        search_filter: this.search_filter,
        search_data: (typeof (this.search_data) == 'string' && this.search_data && this.search_data != '') ? JSON.parse(this.search_data) : {},
        doctype: this.doctype
        // search_data: (this.page_title == 'meeting' || this.page_title == 'tasks') ? this.json_filter : (this.search_data && this.search_data != '' ? JSON.parse(this.search_data) : {}),
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.status == 'success') {
      this.getFilters.emit(data);
    }
  }
  sort: any;
  sort_by() {
    let val = {}
    if (this.sort && this.sort == 'creation ASC') {
      this.sort = 'creation DESC'
    } else {
      this.sort = 'creation ASC'
    }

    val['sort_by'] = this.sort
    val['sort'] = true;
    this.getDateFromCalendar.emit(val)
  }


  search_text_send(data){
    this.search_value = data.target.value
    this.search_txt_value.emit(data)
  }

  clear_txt() {
    this.search_value = "";
    this.call_clear_txt.emit({ target: { value: "" } });
  }

  onInputFocus(event: any) {
    // this.db.centerFabShow = false;
  }

  onInputBlur(event: any) {
    // this.db.centerFabShow = true;
  }

}

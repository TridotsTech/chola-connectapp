import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { SelectDropdownPage } from 'src/app/pages/seller/select-dropdown/select-dropdown.page';
@Component({
  selector: 'app-tab-filter',
  templateUrl: './tab-filter.component.html',
  styleUrls: ['./tab-filter.component.scss'],
})
export class TabFilterComponent implements OnInit {
  @Input() filters: any;
  @Input() search: any;

  @Input() noSort: any;
  @Input() noSortUp: any;
  @Input() noView: any;
  @Input() noLeft: any;
  @Input() noRight: any;

  @Output() tab_filter = new EventEmitter()
  @Output() toggleKanban_task: any = new EventEmitter();
  @Output() freezeEvent: any = new EventEmitter();

  sub: any;
  @Input() sort:any;
  @Input() actionButton;
  activeSort = false;
  activeSortup = false;


  constructor(private modalCtrl: ModalController, public db: DbService) { }

  ngOnInit() {

    this.sub = this.db.select_drop_down.subscribe((res: any) => {
      // if((this.db.hr_manager_role && this.this.doctype == 'Timesheet')){
      //   this.db.drop_down_value_task['employee'] = res.name
      //   this.db.drop_down_value_task['employee_name'] = res.label
      // }else{
      // }
      // console.log('Drop down value : ', res);
      if(this.db.SubjectEvent){
        this.db.drop_down_value_task[res.fieldname] = res.name ? res.name : res.label
        // this.db.drop_down_value_task[res.fieldname + '_name'] = res.label
        this.tab_filter.emit(res);
      }



      // this.dropdownSelection(res);
      // this.ref.detectChanges()
    });
  }

  filterData($event, item) {
    // $event.target.value
    this.send_values($event.target.value,item)
  }

  send_values(value,item){
    let val = {}
    if (item == 'search') {
      val[item] = value
      val['fieldname'] = item
    } else {
      val[item.name] = value == 'ALL' ? '' : value;
      val['fieldname'] = item.name
      item['value'] = value
    }

    this.tab_filter.emit(val)
  }

  async open_drop_down_options(item) {
    const modal = await this.modalCtrl.create({
      component: SelectDropdownPage,
      cssClass: this.db.ismobile ? 'job-detail-popup' : 'filter-popup',
      componentProps: {
        // type: type,
        type: 'reference_doctype',
        fieldname: 'reference_docname',
        fieldname_value: '',
        selected_value: item,
        list_filter: true
        // select_options: this.select_options,
        // form_values: this.formStoreValues,
        // selectDropDown: (fieldname_value && fieldname_value == 'select') ? true : false
      },
    });
    await modal.present();
  }

  clearFilter(event: MouseEvent, item) {
    event.stopPropagation()
    this.send_values('',item)
    delete this.db.drop_down_value_task[item.name]
  }


  // sort_up_by(){
  //   let val = {}
  //   this.sort = this.activeSortup ? '' : 'creation ASC'
  //   this.activeSortup =! this.activeSortup
  //   val['sort_by'] = this.sort 
  //   this.tab_filter.emit(val)
  // }

  // sort_by(){
  //   let val = {}
  //   this.sort = this.activeSort ? '' : 'creation DESC'
  //   this.activeSort =! this.activeSort
  //   val['sort_by'] = this.sort
  //   this.tab_filter.emit(val)
  // }
  
  sort_by(){
    let val = {}
    if(this.sort && this.sort == 'creation ASC'){
      this.sort = 'creation DESC'
    }else{
      this.sort = 'creation ASC'
    }

    val['sort_by'] = this.sort 
    this.tab_filter.emit(val)
  }

  shareBugs(){
    let data = {
      status: 'Success',
      selctedAction: 'Share'
    }

  }

}

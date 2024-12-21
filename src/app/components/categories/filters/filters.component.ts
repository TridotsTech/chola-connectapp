import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SelectDropdownPage } from 'src/app/pages/seller/select-dropdown/select-dropdown.page';
import { DbService } from 'src/app/services/db.service';
import { MonthFilterComponent } from '../../customer-details/month-filter/month-filter.component';
import { DatePipe } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  supplier_name: any;
  search_txt = '';
  selected_value = {};
  @Input() supplier_id;
  @Input() date_filter;
  @Input() search_data:any = {};
  @Input() search_filter;
  @Input() projects;
  @Input() selected_project;
  @Input() page_title;
  @Input() json_filter;
  @Input() isNotModal;
  @Input() doctype;
  @Input() showCalendar;
  @Input() selectedDate;
  @Input() noClearButton;
  @Input() noPopup;
  @Input() projectDetail;
  selectType: any;
  @Output() filterList = new EventEmitter();

  // @ViewChild('dateInput') dateInput:QueryList<ElementRef> | any;
  @ViewChild('myDiv') myDiv: ElementRef | undefined;
  // @ViewChild('select') select: ElementRef | any; 
  // @ViewChild('select', { static: false }) select: NgSelectComponent | any;
  @ViewChildren('select') select: QueryList<NgSelectComponent> | any;
  search_value = {};
  first_name = 'Dinesh'
  last_name = 'kumar'
  generate_val = ''
  mobile_error = false;
  link_values: any = {}
  highlightedDates: any;
  link_w_fields_name: any = []
  filter_values: any = {}
  selectedDropdownValue: any = []

  constructor(public db: DbService, private modalCtrl: ModalController, private datePipe: DatePipe) { }

  ngOnInit() {
    // console.log(this.search_values,"search_values");
    // console.log(this.db.search_filter);

    if (!(this.db.selected_list && this.db.selected_list.page)) {
      this.db.selected_list['page'] = this.doctype;
    }

    if (this.search_filter && this.search_filter.length > 0) {
      this.filterLinkfields();
      this.removeFilter()
    }


    // if(this.date_filter && this.isNotModal){
    //   this.generateHighlightedDates();
    // }

    // this.doctype ? this.getSearch() : null;

    // let val = this;
    // window.addEventListener('click', function(e:any){ 
    //   let el = document.getElementById('clickbox') as HTMLElement 
    //   if (el.contains(e.target)){
    //     console.log('innside');
    //   } else{
    //     console.log('outside');
    //     //  val.hideDiv();
    //   }
    // });

    if (this.search_data ) {
      this.changeDataFormat()
    }

    this.db.clearFilters.subscribe((resp:any)=>{
      if(resp.status == 'success' && resp.type == 'clear'){
        this.clearFilter()
      } 
    })
    
  }

  changeDataFormat(){
    this.search_data = (typeof this.search_data != 'object' && JSON.parse(this.search_data) && Object.keys(JSON.parse(this.search_data)).length > 0) ? JSON.parse(this.search_data) : this.search_data
    Object.entries(this.search_data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        const filter = value.find((filter) => typeof filter == 'string' && filter.includes('%'));
        if (filter) {
          this.search_data[key] = filter.replace(/%+/g, '').trim();
        } else {
          const filter = value.find((filter) => typeof filter == 'string' && filter.includes('-'));
          if (filter) {
            this.search_data[key] = filter.replace(/%+/g, '').trim();
          }
        }
      }
    });
  }


  // getSearch(){
  //   this.db.search_fields({ doctype: this.doctype }).subscribe((res) => {
  //     if (res.status && res.status == 'failed') {
  //       this.search_filter = [];
  //     } else {
  //       this.search_filter = res['message'];
  //     }
  //     this.db.search_filter = this.search_filter;
  //   });
  // }

  @HostListener('window:resize', ['$event'])
  private func() {
    // this.ismobile = this.db.checkmobile();
  }

  async selectFilters(doctype, field_name) {
    // console.log(this.search_data['supplier'],"this.search_data['supplier']")
    const modal = await this.modalCtrl.create({
      component: SelectDropdownPage,
      cssClass: this.db.ismobile ? 'job-detail-popup' : 'filter-popup',
      componentProps: {
        type: doctype,
        selected_value: this.search_data ? this.search_data['supplier'] : '',
        fieldname: field_name,
        filter_type: 'filter',
        selectDropDown: true
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data && data.data.fieldname) {

      this.selected_value[data.data.fieldname] = data.data['name'];

      if (data.data['name'] == 'ALL') {
        this.search_data[data.data.fieldname] ? delete this.search_data[data.data.fieldname] : null;
        this.link_values[data.data.fieldname] = 'ALL'
      } else {
        this.search_data[data.data.fieldname] = data.data['name'];
      }

      if (this.isNotModal) {
        this.applyFilter();
      }
    }

  }



  async supplier_filter(doctype, field_name) {

    const modal = await this.modalCtrl.create({
      component: SelectDropdownPage,
      cssClass: this.db.ismobile ? 'job-detail-popup' : 'filter-popup',
      componentProps: {
        type: doctype,
        selected_value: this.search_data ? this.search_data['supplier'] : '',
        fieldname: field_name,
        filter_type: 'filter'
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.data.fieldname) {


      this.selected_value[data.data.fieldname] = data.data['name'];
      if (data.data['name'] == 'ALL') {
        this.search_data[data.data.fieldname] ? delete this.search_data[data.data.fieldname] : null;
        this.link_values[data.data.fieldname] = 'ALL'
      } else {
        this.search_data[data.data.fieldname] = data.data['name'];
      }

      if (this.isNotModal) {
        this.applyFilter();
      }

    }
    // console.log('this.search_data', this.search_data)
  }

  applyFilter() {
    // console.log(this.search_data);
    if (
      localStorage['project_filter'] &&
      JSON.parse(localStorage['project_filter'])
    ) {
      localStorage.removeItem('project_filter');
    }
    let value = JSON.stringify(this.search_data);
    this.search_value = JSON.parse(value);
    let data = { 'status': 'success', 'data': this.search_value, 'type': this.selectType };
    this.filterList.emit(data);
    // this.loadSearchValues();
  }

  isStringifiedJson(value) {
    if (typeof value !== 'string') {
      return false;
    }

    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  save() {
    this.search_value = this.search_data;
    let data = { 'status': 'success', 'data': this.search_value };
    this.modalCtrl.dismiss(data);
  }

  clear_filter() {
    this.search_data = {};
    // this.select.clear();
    if (this.select) {
      // this.select.clearModel(); // This clears the selected value(s)
      this.select.forEach(select => {
        select.clearModel()
      })
    }
    let data = { 'status': 'success', 'data': this.search_data };
    this.modalCtrl.dismiss(data);
  }

  load_search(term, data) {
    // console.log(this.search_data)

    this.search_txt = term.target.value;
    if (this.search_data ) {
      this.changeDataFormat()
    }

    if (this.search_txt) {
      this.search_data[data.fieldname] = this.search_txt;
    } else {
      this.filter_values[data.fieldname] ? delete this.filter_values[data.fieldname] : null;
      this.clear_txt(undefined, data);
    }

    this.filter_values = { ...this.filter_values, ...this.search_data }

    // this.db.bugSelectedFilter = this.filter_values

    if (this.db.selected_list.page == "Lead" && data.fieldname == 'mobile_no') {
      // console.log("this.search_txt",this.search_txt)
      // console.log("this.search_txt length",this.search_txt.length)
      if (this.search_txt.length < 10 || this.search_txt.length > 10) {
        this.mobile_error = true;
      } else {
        this.mobile_error = false;
      }
    }

    if (this.isNotModal) {
      this.applyFilter();
    }
  }

  filterKeyEvent(event: KeyboardEvent) {
    if (event.keyCode === 69) {
      event.preventDefault();
    }
  }

  clear_txt(event, data) {
    if (event) {
      event.stopPropagation();
    }
    this.search_txt = '';
    this.search_data = (typeof this.search_data != 'object' && JSON.parse(this.search_data) && Object.keys(JSON.parse(this.search_data)).length > 0) ? JSON.parse(this.search_data) : this.search_data
    delete this.search_data[data.fieldname]
    delete this.filter_values[data.fieldname]
    if (this.isNotModal) {
      this.applyFilter();
    }
    // console.log(data.fieldname,": ",this.search_data[data.fieldname])
    // console.log(this.link_values)
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  selected_projects(data, i) {
    this.projects.map((res, index) => {
      if (i == index) {
        res['selected'] = true
      } else {
        res['selected'] = false
      }
    })
    let datas = {
      selected_project_name: data.name,
      status: "Success"
    }
    this.modalCtrl.dismiss(datas);
  }


  filterLinkfields() {
    this.search_filter.map(res => {
      if (res.fieldtype == 'Link') {
        this.link_w_fields_name.push({ doctype: res.options, fieldname: res.fieldname, });
        let value = res.value ? res.value : ''

        if (value) {
          this.db.all_link_opts[res.options + res.fieldname] = [{ label: value, name: value },];
        }
      }
    })
    // this.get_link_values()
  }

  focusof($event, item) {
    this.get_link_values(item);
    // this.customInput?.nativeElement?.focus();
    if(item.fieldtype == 'Select'){
      this.getSelectItem(item.options)
    }
  }

  ng_select_change(eve, obj) {
    this.selectType = obj.type;
    this.selected_value[obj.fieldname] = eve && eve['name'] ? eve['name'] : undefined;
    if (this.search_data ) {
      this.changeDataFormat()
    }
    
    if (eve) {
      if (eve['name'] == 'ALL') {
        // if (eve['name'] == 'ALL') {
        this.search_data[obj.fieldname] ? delete this.search_data[obj.fieldname] : null;
        this.filter_values[obj.fieldname] ? delete this.filter_values[obj.fieldname] : null;
        this.link_values[obj.fieldname] = 'ALL'
      } else {
        this.search_data[obj.fieldname] = eve['name'];
      }
    } else {
      this.search_data[obj.fieldname] ? delete this.search_data[obj.fieldname] : null;
      this.filter_values[obj.fieldname] ? delete this.filter_values[obj.fieldname] : null;
      this.link_values[obj.fieldname] = 'ALL'
    }

    this.filter_values = { ...this.filter_values, ...this.search_data }

    // this.db.bugSelectedFilter = this.filter_values

    if (this.isNotModal) {
      this.applyFilter();
    }

    if (this.link_w_fields_name && this.link_w_fields_name.length != 0) {
      this.link_w_fields_name.map((res) => {
        this.db.all_link_opts[res.doctype + res.fieldname + 'no_products'] = false;
        this.db.all_link_opts[res.doctype + res.fieldname + 'page_no'] = 0;
      });
    }

  }

  get_link_values(item) {
    // console.log('123456');

    if (this.link_w_fields_name && this.link_w_fields_name.length != 0) {
      this.link_w_fields_name.map((res) => {
        this.db.all_link_opts[res.doctype + res.fieldname + 'no_products'] = false;
        this.db.all_link_opts[res.doctype + res.fieldname + 'page_no'] = 0;
        this.db.all_link_opts[res.doctype + res.fieldname + 'search_text'] = '';
      });
    }


    if (this.link_w_fields_name && this.link_w_fields_name.length != 0) {
      this.link_w_fields_name.map((res) => {
        // this.db.form_values = this.store_old_data;

        if (item.options == res.doctype && !this.db.all_link_opts[res.doctype + res.fieldname + 'no_products']) {
          this.db.get_master_value(res.doctype, res.fieldname);
        }
        // this.db.get_master_value(res.doctype,res.fieldname);
      });
    }


    // console.log(this.db.all_link_opts,"all_link_opts")
  }

  clearFilter() {
    // console.log(this.filter_values, "filter_values")
    this.search_txt = '';
    this.search_data = {}
    this.link_values = {}
    this.filter_values = {}
    if (this.select) {
      // this.select.clearModel(); // This clears the selected value(s)
      this.select.forEach(select => {
        select.clearModel()
      })
    }

    if (
      localStorage['project_filter'] &&
      JSON.parse(localStorage['project_filter'])
    ) {
      localStorage.removeItem('project_filter');
    }

    if (this.isNotModal) {
      this.applyFilter();
    }
  }

  clearFilterCondition() {
    if (this.filter_values && Object.keys(this.filter_values).length > 0 && !this.db.ismobile)
      return true;

    return false;
  }


  removeFilter() {
    const unWantedFields = [{ type: 'Link', options: 'Employee' }, { type: 'Link', options: "Department" }, { type: 'Link', options: "Salary Structure" }];

    for (let i = 0; i < this.search_filter.length; i++) {
      for (let j = 0; j < unWantedFields.length; j++) {
        if (this.db.employee_role) {
          if (this.search_filter[i]['fieldname'] == 'employee_name') {
            this.search_filter.splice(i, 1)
          }

          if((this.search_filter[i]['fieldtype'] == unWantedFields[j]['type']) && (this.search_filter[i]['options'] == unWantedFields[j]['options'])){
            this.search_filter.splice(i, 1)
          }
        }

      }
    }
  }

  selectCheck(item){
    this.search_data[item.fieldname] = this.search_data[item.fieldname] ? 0 : 1
  }

  getSelectItem(data:any){
    if (data.includes('\n')) {
      let options = data.split('\n')
      let array = [{ label: 'All', name: 'ALL' }];
      options.map((res, i) => {
        array.push({ label: res, name: res })
      })
      this.selectedDropdownValue = array
      // console.log(array,'array')
      // return array;
    }
  }
}

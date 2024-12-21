import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Location, DatePipe } from '@angular/common';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.page.html',
  styleUrls: ['./holiday-list.page.scss'],
})
export class HolidayListPage implements OnInit {

  target_months: any;
  holiday_list: any = []
  skeleton = true;
  bodySkeleton = true;
  leave_dashboard: any;
  list_data: any;
  search_data: any = '';
  currentYear: any;
  @ViewChild(IonContent, { static: true }) content: IonContent | any;
  @ViewChild('tabList') tabList: ElementRef | any;
  options = [{ name: "Holiday", route: "holidays_list" },{ name: "Week off", route: "weekoff_list" }];
  holiday_type: any = '';
  currentMonth: any;
  constructor(public db: DbService, public location: Location) { }

  ngOnInit() {

    if(this.db.ismobile){
      let data = {
         name: "Calendar", route: "calendar" ,
      }
      this.options.splice(0, 0, data)
    }

    this.skeleton = true;
    this.db.tab_buttons(this.options, this.options[0].route, 'route');
    this.holiday_type = this.options[0].name

    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.currentMonth = currentDate.getMonth() + 1;

    this.get_holidays();
    // const today = new Date();
    // const monthNumber = today.getMonth();
    // const dayOfMonth = today.getDate();


    // setTimeout(()=>{
    //   this.months.map((res,i)=>{
    //      if((i) == monthNumber){
    //       this.target_months = res.value
    //       this.select_month(this.months,i);
    //       this.get_holiday_list(res.value)
    //      }
    //   })
    // },700)

    this.db.selectedYearSubject.subscribe(res => {
      if(res && this.db.selected_year && this.db.path == '/holiday-list'){
        this.currentYear = this.db.selectedYear;
        this.currentMonth = this.db.selectedMonth

        this.get_holidays()
      }
    })

  }

  get_holidays() {
    let data: any = {
      doctype_name: 'Holiday List',
      // search_data: this.search_data,
      search_data: this.search_data,
      holiday_type: this.holiday_type,
      docname: '',
      fetch_child: true,
      page_no: 1,
      page_length: 20,

    };

    if (this.db.ismobile && false) {
      const now = new Date(data['date'])
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');

      let val = { month: this.currentMonth ? this.currentMonth : month, year: this.currentYear ? this.currentYear : year }
      // let val = { year: this.currentYear ? this.currentYear : year }
      data['month_filter'] = val
    }

    // if(this.db.ismobile){
    //   data['device_type'] = 'Mobile'
    // }

    this.db.get_tempate_and_datas(data).subscribe((res) => {
      this.skeleton = false;
      this.db.bodySkeleton = false
      this.db.listSkeleton = false;
      if (res && res.message && res.message.name) {
        this.list_data = res.message;
        this.list_data['data'] = res.message['list_details'];
      }else if(res && res.message && res.message.status && res.message.status == 'Failed'){
        let alert = res.message.message ? res.message.message : 'Something went wrong try again later';
        this.db.sendErrorMessage(alert);
        this.location.back();
      }
    })
  }

  get_holiday_list(month) {
    if (month) {
      this.skeleton = true
      let data = {
        companyname: this.db.default_values.default_company,
        target_month: month
      }
      this.db.get_holiday_list(data).subscribe(res => {
        this.skeleton = false
        // console.log(res)
        if (res && res.status == "success" && res.holidays && res.holidays.length != 0) {
          this.holiday_list = res.holidays
          this.leave_dashboard = res
        } else {
          this.holiday_list = []
          this.leave_dashboard = ''
        }
      })
    }
  }

  months = [
    { value: "January", name: "Jan", selected: true },
    { value: "February", name: "Feb" },
    { value: "March", name: "Mar" },
    { value: "April", name: "Apr" },
    { value: "May", name: "May" },
    { value: "June", name: "Jun" },
    { value: "July", name: "Jul" },
    { value: "August", name: "Aug" },
    { value: "September", name: "Sep" },
    { value: "October", name: "Oct" },
    { value: "November", name: "Nov" },
    { value: "December", name: "Dec" }
  ]

  select_month(data, index) {
    this.months.map((res, i) => {
      if (index == i) {
        res['selected'] = true
      } else {
        res['selected'] = false
      }
    })
    this.target_months = data.value
    this.get_holiday_list(this.target_months)

    const element = this.tabList.nativeElement.children[index];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }

  searchTxtValue(eve) {
    // this.no_products = false;
    // this.page_no = 1;
    // console.log(eve,"eve")
    this.db.bodySkeleton = true;
    this.list_data['data'] = [];
    if (eve && eve.detail && eve.detail.value) {
      let search_text = eve.detail.value;
      // let data = {
      //   description: ['Like', '%' + search_text + '%'],
      // }
      // this.search_data = JSON.stringify(data);
      this.search_data = search_text;

    } else {
      this.search_data = "";
      //   // this.search_data = {};
    }
    // this.search_data = eve
    this.get_holidays();
  }

  clear_txt(eve) {
    this.db.bodySkeleton = true
    // this.no_products = false;
    // this.page_no = 1;
    this.search_data = {};
    this.get_holidays();
  }


  menu_name(eve) {
    // console.log(eve, "eve")
    this.db.bodySkeleton = true
    this.list_data['data'] = [];
    this.holiday_type = eve.name
    this.get_holidays();
    // if (eve.route == "my") {
    //   this.employee = true
    // } else {
    //   this.employee = false
    //   this.search_data = { status: eve.route }
    //   this.status = eve.name == 'All' ? '' : eve.name
    // }
    // this.leave_details(this.employee_id);
    // setTimeout(() => {
    //   this.content.scrollToTop(0);
    // }, 700)
  }

  menu_name_month(eve){
    console.log('eve',eve)
  }


}

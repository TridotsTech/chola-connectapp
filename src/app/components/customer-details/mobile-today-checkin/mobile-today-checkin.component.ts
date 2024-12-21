import { Component, OnInit, ViewChild } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexLegend,
  ApexResponsive,
  ChartComponent
} from "ng-apexcharts";
import { ModalController } from '@ionic/angular';
import { CheckinMultipleComponent } from '../../checkin-multiple/checkin-multiple.component';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive | ApexResponsive[];
};

@Component({
  selector: 'app-mobile-today-checkin',
  templateUrl: './mobile-today-checkin.component.html',
  styleUrls: ['./mobile-today-checkin.component.scss'],
})
export class MobileTodayCheckinComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent | any;
  public chartOptions: Partial<ChartOptions> | any;
  viewType = 'Overview';
  options = [{ name: "Overview", route: "Overview" }, { name: "List", route: "List" }];
  // db.current_dateAttendance:any;
  filters: any = {};
  chartValues: any = {
    label: '',
    count: '',
    totalCount: 0
  };
  listData: any = [];
  showCalendar: any;
  page_no = 1;
  page_size = 20;
  no_products = false;
  skeleton = true;
  today_employee: any;
  // status:any;

  constructor(public db: DbService, public modalCtrl: ModalController) { }

  ngOnInit() {
    this.getLoad();

    this.db.selectedYearSubject.subscribe(res => {
      if (res && this.db.selected_year && this.db.path == '/list/attendance') {
        const year = this.db.selectedYear
        let date = new Date(this.db.current_dateAttendance);
        const month = String(this.db.selectedMonth).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        this.db.current_dateAttendance = formattedDate;
        this.getMonthAndYear(year, month);
        this.db.selected_year = false;
      }
    })
  }

  getLoad() {
    this.page_no = 1;
    // this.page_size = 20;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    this.db.current_dateAttendance = formattedDate;
    this.initialCall();
  }

  getValue() {

    let data = {
      "date": this.db.current_dateAttendance,
      "page_no": this.page_no,
      "page_length": this.page_size,
    }

    this.db.get_employee_first_checkin(data).subscribe((res: any) => {
      this.skeleton = false;
      if (res.status && res.status == "Success") {
        // this.getPieChart(res.message,);

        let label: any = []
        let count: any = []
        let totalCounts = 0;
        this.today_employee = res.message.employee_count;

        res.message.dashboard.map((resp: any) => {
          label.push(resp.label + ' - ' + resp.count)
          count.push(resp.count)
          totalCounts += resp.count
        })

        // Absent Calculation
        let absentCount = 0

        let getValue = res.message.dashboard.findIndex((resp: any) => { return resp.label.toLowerCase() == "absent" })
        // let checkIn = res.message.dashboard.findIndex((resp: any) => {return resp.label.toLowerCase() == "check in"})

        if (getValue >= 0) {
          count.map((res, i) => {
            if (getValue != i) {
              absentCount = absentCount + res;
            }
          })
          
          // absentCount = res.message.dashboard[getValue]['count']
          
          if (this.today_employee > absentCount) {
            count[getValue] = this.today_employee - absentCount
            label[getValue] = 'Absent - ' + count[getValue]
          }
        }
        // Absent Calculation


        this.chartValues.label = label
        this.chartValues.count = count
        this.chartValues.totalCount = totalCounts
        this.getPieChart(this.chartValues, res.message.employee_count);
        if (this.page_no == 1) {
          this.listData = res.message.employee_checkin;
        } else {
          this.listData = [...this.listData, ...res.message.employee_checkin];
          res.message.employee_checkin.length < 30 ? this.no_products = true : null
        }
      }
    })
  }


  getPieChart(values, employee_count) {

    this.chartOptions = {
      series: values.count,
      chart: {
        type: "donut"
      },
      labels: values.label,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 350,
              height: 350
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

  }

  go_list() {
    this.chartOptions = undefined
    this.no_products = false;
    this.viewType = this.options[1].route
    this.db.tab_buttons(this.options, this.options[1].route, 'route');
    this.getLoad();
  }

  menu_name(eve: any) {
    this.chartOptions = undefined
    this.no_products = false;
    this.viewType = eve.route

    if (this.viewType == 'Overview') {
      this.skeleton = true;
      this.getLoad();
    }
    // this.db.tab_buttons(this.options, this.options[0].route, 'route');
  }

  transform_att_date(value: any) {
    const date = new Date(value);
    const day = ('0' + date.getDate()).slice(-2);
    const dayOfWeek = date.toLocaleString('en-us', { weekday: 'short' });
    const month = date.toLocaleString('en-us', { month: 'short' });
    const year = date.getFullYear();

    return `${day} -${dayOfWeek} / ${month} - ${year}`;
  }

  converHours(data) {
    data = String(data)
    const [time, modifier] = data.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes ? minutes : '00'} Hr`;
  }

  converTime(data) {

    data = String(data)
    let [hours, minutes] = data.split(':');

    // Convert hours to a number
    hours = parseInt(hours);

    // Determine AM or PM suffix
    let suffix = hours >= 12 ? 'PM' : 'AM';

    // Adjust hours for 12-hour format
    hours = (hours % 12) || 12;

    // Add leading zero to minutes if necessary
    if (minutes && minutes.length < 2) {
      minutes = '0' + String(minutes);
    }

    // Construct the new time format
    return `${hours}:${minutes ? minutes : '00'} ${suffix}`
  }

  getFilters(eve) {

  }

  getDateFromCalendar(eve) {

    if (eve.sort) {

    } else {
      this.skeleton = true;
      this.page_no = 1
      this.no_products = false;
      this.db.current_dateAttendance = eve;
      this.getValue();
    }
  }

  filtersLabel = [
    { label: 'Present', icon: '/assets/attendance/present.svg', activeIcon: '/assets/attendance/present-active.svg', isActive: true },
    { label: 'Absent', icon: '/assets/attendance/Absent.svg', activeIcon: '/assets/attendance/Absent-active.svg' },
    { label: 'Half Day', icon: '/assets/attendance/Onleave.svg', activeIcon: '/assets/attendance/Onleave-active.svg' },
  ]

  applyFilter(item, index) {
    this.skeleton = true;

    this.filtersLabel.map((res, i) => {
      if (i != index) {
        res['isActive'] = false;
      }
    })

    item['isActive'] = !item['isActive']
    this.no_products = false;

    if (item['isActive']) {
      this.page_no = 1
      this.filters['status'] = item.label;
      this.getValue();
    } else {
      this.page_no = 1
      this.filters['status'] = undefined;
      this.getValue();
    }
  }

  async scrollEvent(event: Event): Promise<void> {
    const scrollableDiv = event.target as HTMLElement;
    if (scrollableDiv.scrollTop + scrollableDiv.clientHeight >= scrollableDiv.scrollHeight - 20 && !this.no_products) {
      this.page_no = this.page_no + 1
      this.getValue();
    }
  }


  pagination_count = [
    { 'count': 20, 'selected': true },
    { 'count': 50, 'selected': false },
    { 'count': 100, 'selected': false }
  ]

  plus_count = 20;

  send_pagination(data, i) {
    this.pagination_count.map((res, index) => {
      if (i == index) {
        res['selected'] = true;
      } else {
        res['selected'] = false;
      }
    })
    this.db.store_old_pagination = data.count
    this.send_pagination_count(data.count)
  }

  add_pagination() {
    this.plus_count += 20;
    this.send_pagination_count(this.plus_count)
  }

  send_pagination_count(pagination) {
    this.page_no = 1
    this.page_size = pagination;
    this.getValue();
  }


  async do_to_details(item) {
    item.attendance_date = item.attendance_date ? item.attendance_date : item.date;
    const modal = await this.modalCtrl.create({
      component: CheckinMultipleComponent,
      cssClass: 'add-worker-popup',
      componentProps: {
        detail: item,
        popup: true,
        showChekinout: true
      },
    });
    await modal.present();
    const val = await modal.onWillDismiss();
  }

  // db.current_dateAttendance:any;
  year: any;
  month: any;
  // db.tableHeaders:any;
  today: any;
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  initialCall() {
    this.today = new Date();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    this.db.current_dateAttendance = formattedDate;
    this.db.selectedYear = year;
    this.db.selectedMonth = month;
    this.getMonthAndYear(year, month);
    // this.getTimesheetDetail(formattedDate);
  }

  getMonthAndYear(year, month) {
    this.year = year;
    this.month = this.monthNames[Number(month) - 1];
    this.getDaysArray(year, Number(month));
  }

  daysArray: any = [];
  getDaysArray(year, month) {
    // Array to hold the result
    this.daysArray = [];

    // Get the number of days in the month
    const daysInMonth = new Date(year, month, 0).getDate();
    // this.daysInMonth = daysInMonth

    const daysOfWeek: any = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Loop through all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      // Create a new date object for each day
      const date = new Date(year, (month - 1), day);

      // Format the day and date
      const dayOfWeek = daysOfWeek[date.getDay()];
      const formattedDate = day.toString().padStart(2, '0');
      month = month.toString();
      month = month.length == 1 ? ('0' + month) : month;
      let date1 = `${year}-${month}-${formattedDate}`;
      this.daysArray.push({ date: formattedDate, day: dayOfWeek, date_: date1 });
    }
    // this.db.tableHeaders = []
    this.db.tableHeaders = this.daysArray;
    // console.log(this.db.tableHeaders)
    // this.getTimesheetDetail(this.db.current_dateAttendance);
    this.scrollTocenter();
    this.getValue();

  }

  scrollTocenter() {
    setTimeout(() => {
      let data = '';
      const element = document.getElementById(this.db.current_dateAttendance + data + (this.db.path.includes('tabs') ? 's' : ''));
      if (element) {
        // console.log('1234');
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      } else {
        let month: any = this.monthNames.findIndex(res => { return res == this.month });
        month = month + 1;
        month = month.toString();
        month = month.length == 1 ? ('0' + month) : month;
        let date1 = `${this.year}-${month}-01`;
        const element1 = document.getElementById(date1 + data);
        element1 ? element1.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }) : null;
      }
    }, 1500);
  }


  chooseDate(item) {
    // this.db.timeSheetDetail = undefined;
    this.db.current_dateAttendance = item.date_;
    this.getValue();
    const element = document.getElementById(this.db.current_dateAttendance);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }


}
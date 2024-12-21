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
  selector: 'app-today-checkin',
  templateUrl: './today-checkin.page.html',
  styleUrls: ['./today-checkin.page.scss'],
})
export class TodayCheckinPage implements OnInit {

  @ViewChild("chart") chart: ChartComponent | any;
  public chartOptions: Partial<ChartOptions> | any;
  viewType = 'Overview';
  options = [{ name: "Overview", route: "Overview" }, { name: "List", route: "List" }];
  current_date:any;
  filters:any = {};
  chartValues: any = {
    label: '',
    count: '',
    totalCount: 0
  };
  listData:any = [];
  showCalendar:any;
  page_no = 1;
  page_size = 20;
  no_products = false;
  skeleton = true;
  today_employee:any;
  // status:any;

  constructor(public db:DbService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getLoad();
  }

  getLoad(){
    this.page_no = 1;
    // this.page_size = 20;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    this.current_date = formattedDate;
    this.getValue();
  }

  getValue(){

    // this.filters['attendance_date'] = this.current_date;
    // this.filters['company'] = (this.db.default_values && this.db.default_values.default_company) ? this.db.default_values.default_company : '';

    let data = {
      "date": this.current_date,
      "page_no": this.page_no,
      "page_length":  this.page_size,
    }

    // data['company'] = (this.db.default_values && this.db.default_values.default_company) ? this.db.default_values.default_company : '';

    this.db.get_employee_first_checkin(data).subscribe((res:any)=>{
      this.skeleton = false;
      if(res.status && res.status == "Success"){
        // this.getPieChart(res.message,);

        let label: any = []
        let count: any = []
        let totalCounts = 0;

        res.message.dashboard.map((resp: any) => {
          label.push(resp.label + ' - ' + resp.count)
          count.push(resp.count)
          totalCounts += resp.count
        })
        this.chartValues.label = label
        this.chartValues.count = count
        this.chartValues.totalCount = totalCounts 
        this.today_employee = res.message.employee_count;
        this.getPieChart(this.chartValues, res.message.employee_count);
        if(this.page_no == 1){
          this.listData = res.message.employee_checkin;
        }else{
          this.listData = [...this.listData,...res.message.employee_checkin];
          res.message.employee_checkin.length < 30 ? this.no_products = true : null
        }
      }
    })
  }


  getPieChart(values, employee_count){

    // this.chartOptions = {
    //   series: values.count,
    //   chart: {
    //     type: "donut"
    //   },
    //   labels: values.label,
    //   responsive: [
    //     {
    //       breakpoint: 480,
    //       options: {
    //         chart: {
    //           width: 350,
    //           height: 350
    //         },
    //         legend: {
    //           position: "bottom"
    //         }
    //       }
    //     }
    //   ]
    // };
    const totalEmployees = employee_count;
    this.chartOptions = {
      // series: values.count.map(count => (count / totalEmployees) * 100),
      series: values.count.map(count => ((count / totalEmployees) * 100).toFixed(2)),
      // series: (values.count[0] / totalEmployees) * 100,
      chart: {
        height: 250,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "70%"
          }
        }
      },
      labels: values.label
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

    if(this.viewType == 'Overview'){
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

  getFilters(eve){
  
  }

  getDateFromCalendar(eve){
    
      if (eve.sort) {

      }else{
        this.skeleton = true;
        this.page_no = 1
        this.no_products = false;
        this.current_date = eve;
        this.getValue();
      }
  }

  filtersLabel = [
    {label:'Present', icon:'/assets/attendance/present.svg', activeIcon:'/assets/attendance/present-active.svg', isActive:true},
    {label:'Absent', icon:'/assets/attendance/Absent.svg', activeIcon:'/assets/attendance/Absent-active.svg'},
    {label:'Half Day', icon:'/assets/attendance/Onleave.svg', activeIcon:'/assets/attendance/Onleave-active.svg'},
  ]
  
  applyFilter(item, index){
    this.skeleton = true;

    this.filtersLabel.map((res,i)=>{
     if(i != index){
       res['isActive'] = false;
     }
    })

    item['isActive'] =! item['isActive']
    this.no_products = false;

    if(item['isActive']){
      this.page_no = 1
      this.filters['status'] = item.label;
      this.getValue();
    }else{
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

}

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
  selector: 'app-mobile-hr-attendance',
  templateUrl: './mobile-hr-attendance.component.html',
  styleUrls: ['./mobile-hr-attendance.component.scss'],
})
export class MobileHrAttendanceComponent  implements OnInit {

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
  no_products = false;
  skeleton = true;

  constructor(public db:DbService) { }

  ngOnInit() {
    this.getLoad();
  }

  getLoad(){
    this.page_no = 1;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    this.current_date = formattedDate;
    this.getValue();
  }


  getValue(){

    this.filters['attendance_date'] = this.current_date;
    this.filters['company'] = (this.db.default_values && this.db.default_values.default_company) ? this.db.default_values.default_company : '';

    let data = {
      "dashboard_name": "Attendance List View",
      // "dashboard_name": "Attendance Dashboard",
      "page_no": this.page_no,
      "page_length": 30,
      "filters": this.filters,
      "date": this.current_date
    }

    this.db.get_dashboard_details(data).subscribe((res:any)=>{
    // this.db.get_employee_first_checkin(data).subscribe((res:any)=>{
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
        this.getPieChart(this.chartValues)
        if(this.page_no == 1){
          this.listData = res.message.data;
        }else{
          this.listData = [...this.listData,...res.message.data];
          res.message.data.length < 30 ? this.no_products = true : null
        }
      }
    })
  }

  getPieChart(values){

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
    this.getLoad();
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
}

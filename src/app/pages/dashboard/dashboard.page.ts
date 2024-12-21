import { Component, NgZone, OnInit, ViewChild, ViewEncapsulation, ChangeDetectionStrategy , ChangeDetectorRef, HostListener, ElementRef  } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { DbService } from 'src/app/services/db.service';
import { DatePipe } from '@angular/common';
import { ApexChartComponent } from 'src/app/components/apex-chart/apex-chart.component';
import { ApexChartDashboardComponent } from 'src/app/components/apex-chart-dashboard/apex-chart-dashboard.component';
import { PayrollDetailComponent } from 'src/app/components/customer-details/payroll-detail/payroll-detail.component';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { WebsiteFormsComponent } from 'src/app/components/forms/website-forms/website-forms.component';
import * as moment from 'moment';
import { IonContent } from '@ionic/angular';

// import { ILoadedEventArgs, ChartComponent, ChartTheme } from '@syncfusion/ej2-angular-charts';
// import { Browser } from '@syncfusion/ej2-base';
// import { ChartComponent } from "ng-apexcharts";

// import {
//   ApexNonAxisChartSeries,
//   ApexResponsive,
//   ApexChart
// } from "ng-apexcharts";

// export type ChartOptions = {
//   series: ApexNonAxisChartSeries;
//   chart: ApexChart;
//   responsive: ApexResponsive[];
//   labels: any;
// };

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexMarkers,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { Router } from '@angular/router';

// import { dataSeries } from "src/app/data";
import { QuickviewdragComponent } from 'src/app/components/quickviewdrag/quickviewdrag.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class DashboardPage implements OnInit {

  @ViewChild(IonContent) content: IonContent | any;

  name = 'Angular';
  chart: any;
  greeting: any;
  show_time: any;
  time: any;
  changedDate: any;
  checkin = true;
  checkout = true;
  new_dashboard_values: any;
  ess_dashboard_data: any

  @ViewChild(ApexChartDashboardComponent) appApexChartDashboardComponent:
  | ApexChartDashboardComponent
  | any;
  @ViewChild(ApexChartComponent) appApexChartComponent:
    | ApexChartComponent
    | any;
  highlightedDates: any;
  currentMonth: any;
  currentYear: any;

  currentChartValue: any = 'Daily'
  chartDataNew: any;

  // chart: am4charts.XYChart;
  // count: any = [];
  // public chartOptions: Partial<ChartOptions>;

  // @ViewChild("chart") charts: any = ChartComponent;


  public series: ApexAxisChartSeries | any;
  public charts: ApexChart | any;
  public dataLabels: ApexDataLabels | any;
  public markers: ApexMarkers | any;
  public title: ApexTitleSubtitle | any;
  public fill: ApexFill | any;
  public yaxis: ApexYAxis | any;
  public xaxis: ApexXAxis | any;
  public tooltip: ApexTooltip | any;
  // hr_dashboard_data: any;

  formattedDate: any;
  check_in_condition: any = [];
  // @ViewChild('myDatetime', { static: false }) datetime: ElementRef | undefined;
  constructor(
    private zone: NgZone,
    public db: DbService,
    private router: Router,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    public modalCtrl:ModalController
  ) {
    this.db.chartOptions = {
      series: [],
      // series: [44, 55, 13, 43, 22 ,44, 55, 13, 43, 22],
      chart: {
        type: 'donut',
      },
      labels: [],
      // labels: ["Team A", "Team B", "Team C", "Team D", "Team E","Team F","Team G","Team H","Team I"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  ngOnInit() {
    // this.db.get_dashboard();
    this.db.side_menu_show = true;
    this.setGreeting();
    // setTimeout(()=>{
    //   this.heatMap();
    // },3000);
    // this.crm_dashboard_value()
    // this.db.get_path()

    // this.db.dashboard.subscribe((res:any)=>{
    //   if(res && res['triggered']){
    //     delete res['triggered'];
    //     this.get_chart(res);
    //   }
    // })

    // console.log(this.db.chartOptions)

    am4core.useTheme(am4themes_animated);

    this.db.chartOptions = {
      series: [],
      // series: [44, 55, 13, 43, 22 ,44, 55, 13, 43, 22],
      chart: {
        type: 'donut',
      },
      labels: [],
      // labels: ["Team A", "Team B", "Team C", "Team D", "Team E","Team F","Team G","Team H","Team I"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
    this.get_attendance();

    if(this.db.employee_role){
      this.checkIn();
    }

    this.db.checkInOutDetail = '';
  }

  ionViewWillLeave(){
    this.db.highlightedDates = []
  }

  ionViewWillEnter() {

    this.scrollToTop();

    this.formattedDate = this.getFormattedDate();

    // console.log('dataSeries',dataSeries)

    // this.initChartData()

    const parts = this.db.current_event_date.split('-');
    
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);

    this.currentMonth = month
    this.currentYear = year

    // if(this.db.employee_role){

    if(this.db.app_name == 'Go1 HR'){
      this.get_hr_dashboard();
      this.get_ess_dashboard();
      this.getChartHr()
    }  
      
    // }

    // if(this.db.hr_manager_role){
      // if(this.db.app_name == 'Go1 HR')
        // this.get_hr_dashboard();
    // }
    // this.db.searchDataValues = '';
    // if(this.db.sales_manager_role){
      
    // }

    if(this.db.employee_role){
      this.checkIn();
    }
    // this.db.get_path()
    this.db.side_menu_show = true;
    if (!this.db.ismobile) {
      this.db.get_dashboard();
    }
    // this.db.get_permission_details();
    // console.log(this.db.path)

  }

  push_sales_data = [
    {
      page: 'Task',
      page_name: 'Tasks',
      route: '/list/tasks',
      enable: 1,
    },
    {
      page: 'Meeting',
      page_name: 'Meeting',
      route: '/list/meeting',
      enable: 1,
    }, {
      page: 'Content',
      page_name: 'Content',
      route: '/messages',
      enable: 1,
    },
  ]

  scrollToTop() {
    this.content.scrollToTop(400);
  }

  ionViewDidEnter(){
    this.scrollToTop();
  }

  apexChartType = [
    {name: 'Daily',isSelected: true},
    {name: 'Weekly',isSelected: false},
    {name: 'Monthly',isSelected: false},
  ]

  checkIn(){
    let datas = {
      "employee": localStorage['employee_id'],
      "employee_name": localStorage['CustomerName'],
      "date":this.changedDate
    }
    this.db.checkIn({data : datas}).subscribe(res => {
      // console.log(res)
      if(res && res.message && res.status == "success"){
        // this.spinner = false;
        if(res.message.length != 0){
          this.check_in_condition = res.message
          res.message.map(res => {
            if(res.log_type == "IN"){
              this.db.checkin = false
            }else if(res.log_type == "OUT"){
              this.db.checkin = true;
            }
          })
        }else{
          this.db.checkin = true;
          this.check_in_condition = [];
        }
      }else if(res && res.message && res.status == "Employee Not Found"){
        this.db.alert(res.message)
      }
    })
  }

  // checkIn() {
  //   this.db.checkIn({ date: this.changedDate }).subscribe(res => {
  //     if (res && res.data.length != 0) {
  //       this.db.emp_checkIn({ id: res.data[0].name }).subscribe(res => {
  //         if (res && res.data) {

  //           if(res.data.length != 0){
  //             let lastIndex = 0
  //             let obj = res.data[lastIndex]
  //             let time = this.getTimeFromTimestamp(obj['time'])
  //             this.db.checkInOutTime = time;
  //             this.db.checkInOutDetail = obj['log_type'] == "IN" ? 'Your last check in was ' + time : 'Your last check out was ' + time
  //             if(obj['log_type'] == "IN"){
  //               this.db.checkin = false;
  //             }else{
  //               this.db.checkin = true;
  //             }
  //           }else{
  //             this.db.checkin = true;
  //           }

  //         }
  //       })
  //     } else {
  //       this.db.checkin = true;
  //     }
  //   })
  //   this.db.checkin_var_load = false;
  // }

  getTimeFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return this.datePipe.transform(date, 'h:mm a');
  }

  // checkIn() {
  //   // if(this.db.current_address){
  //   // console.log(this.db.checkin_enable_from)
  //   this.db.checkIn({ date: this.changedDate }).subscribe((res) => {
  //     if (res && res.data.length != 0) {
  //       this.db.emp_checkIn({ id: res.data[0].name }).subscribe((res) => {
  //         if (res && res.data) {
  //           res.data.map((res) => {
  //             if (res.log_type == 'IN') {
  //               this.checkin = false;
  //             } else if (res.log_type == 'OUT') {
  //               this.checkout = false;
  //             }
  //           });
  //         }
  //       });
  //     } else {
  //       this.checkin = true;
  //       this.checkout = true;
  //     }
  //   });
  //   // }else {
  //   //   this.db.alert("Please Turn On your Location")
  //   // }
  //   this.db.checkin_var_load = false;
  // }

  get_attendance() {
    let today = new Date();
    this.time = new Date().toLocaleTimeString([], { hour12: false });
    this.show_time = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    this.changedDate = '';
    let pipe = new DatePipe('en-US');
    let ChangedFormat = pipe.transform(today, 'yyyy-MM-dd');
    this.changedDate = ChangedFormat;
  }

  get_chart(dash_board) {
    this.db.dashboard_values = dash_board.message;
    let values = this.db.dashboard_values;
    if (values && values.length != 0) {
      let chart_data = Object.keys(dash_board.lable_values);
      // console.log(chart_data);
      var chart = am4core.create('chartdiv', am4charts.PieChart);
      // Add and configure Series
      var pieSeries = chart.series.push(new am4charts.PieSeries());

      // pieSeries.dataFields.value = 'count';
      // pieSeries.dataFields.category = 'page';

      pieSeries.dataFields.value = chart_data[1];
      pieSeries.dataFields.category = chart_data[0];

      // Let's cut a hole in our Pie chart the size of 30% the radius
      chart.innerRadius = am4core.percent(50);
      pieSeries.colors.list = [
        am4core.color('#34bc6e'),
        am4core.color('#8FF58C'),
        am4core.color('#00D4F4'),
        am4core.color('#9b82f3'),
        am4core.color('#FDC841'),
        am4core.color('#00CBDF'),
        am4core.color('#E92E66'),
        am4core.color('#FC585C'),
        am4core.color('#0F1730'),
        am4core.color('#FD8541'),
        am4core.color('#00E9C1'),
        am4core.color('#FFB15A'),
      ];

      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.hidden = true;
      pieSeries.slices.template.stroke = am4core.color('#fff');
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;

      // Add a legend
      chart.legend = new am4charts.Legend();

      chart.data = values;
    }
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        // this.chart.dispose();
      }
    });
  }

  setGreeting() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      this.greeting = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
    // console.log(this.greeting)
  }

  check_In(type) {
    this.router.navigateByUrl('/check-in');
    // this.get_attendance();
    // let data = {
    //   employee: localStorage['employee_id'],
    //   employee_name: localStorage['CustomerName'],
    //   log_type: type,
    //   // "shift": "Day Shift",
    //   time: this.changedDate + ' ' + this.time,
    //   device_id: this.db.current_address,
    // };
    // this.db.employee_checkin({ data: data }).subscribe((res) => {
    //   if (res && res.data && res.data.status == 'Success') {
    //     if (type == 'IN') {
    //       // console.log(this.db.location_info)
    //       this.checkin = false;
    //     } else {
    //       this.checkout = false;
    //     }
    //     let alert = type == 'IN' ? 'Check in successful' : 'Check out successful'
    //     this.db.sendSuccessMessage(alert);
    //   } else {
    //     this.db.alert(res.data.message);
    //   }
    // });
  }

  search_txt(data) {
    // console.log(data)
  }


  get_colors(data) {
    if (data == 'Lead') {
      return {
        background: '#FFF4EC',
      };
    } else if (data == 'Quotation') {
      return {
        background: '#EFEAFF',
      };
    } else if (data == 'Opportunity') {
      return {
        background: '#ECFBFC',
      };
    } else if (data == 'Customer') {
      return {
        background: '#FAF5FE',
      };
    }
  }

  get_progress_colors(data) {
    if (data == 'Lead') {
      return 'radial-gradient(circle at 10% 20%, #FF7919 0%, rgb(245 245 245) 90%)';
    } else if (data == 'Quotation') {
      return 'radial-gradient(circle at 10% 20%, #0D84E6 0%, rgb(245 245 245) 90%)';
    } else if (data == 'Opportunity') {
      return 'radial-gradient(circle at 10% 20%, #32D4DE 0%, rgb(245 245 245) 90%)';
    } else if (data == 'Customer') {
      return 'radial-gradient(circle at 10% 20%, #A33BE3 0%, rgb(245 245 245) 90%)';
    }
  }

  get_icon(value) {
    let img = '';
    let data = '';
    if (value && value.includes(' ')) {
      value = value.replace(/ /g, '');
      data = '/assets/icon/social/' + value + '-active.svg';
    } else if (value) {
      data = '/assets/icon/social/' + value + '-active.svg';
    } else {
      data = img;
    }
    return data;
  }

  load_progress(value) {
    let img = '';
    let data = '';
    if (value && value.includes(' ')) {
      value = value.replace(/ /g, '');
      data = '/assets/icon/social/' + value + '-percent.svg';
    } else if (value) {
      data = '/assets/icon/social/' + value + '-percent.svg';
    } else {
      data = img;
    }
    return data;
  }

  get_color_icon(value) {
    let img = '';
    let data = '';
    if (value && value.includes(' ')) {
      value = value.replace(/ /g, '');
      data = '/assets/dashboard/' + value + '-color.svg';
    } else if (value) {
      data = '/assets/dashboard/' + value + '-color.svg';
    } else {
      data = img;
    }
    return data;
  }

  get_ess_dashboard() {
    let data = {
      dashboard_name: 'Employee Dashboard',
      employee_id: localStorage['employee_id'],
      month_filters: {
        month: this.currentMonth,
        year: this.currentYear,
      },
    };

    this.db.get_dashboard_details(data).subscribe(res => {
      // console.log(res)
      if(res && res.message && res.status == 'Success'){
        this.ess_dashboard_data = res.message;
        this.generateHighlightedDates()
      }
    })
  }

  get_hr_dashboard() {
    let data = {
      dashboard_name: 'HR Dashboard',
      employee_id: localStorage['employee_id'],
    };

    this.db.get_dashboard_details(data).subscribe(res => {
      // console.log(res)
      if(res && res.message && res.status == 'Success'){
        this.db.hr_dashboard_data = res.message;
      }
    })
  }

  check_priority = (status) => {
    if (status == 'Low') {
      return 'arrow-down-outline'
    } else {
      return 'arrow-up-outline'
    }
  }

  get_leaves_icon(data){
    if(data == 'Total Leaves'){
      return '/assets/Employee-Home/Total-Leaves.svg'
    }else if(data == 'Used Leaves'){
      return '/assets/Employee-Home/Used-Leaves.svg'
    }else if(data == 'Available Leaves'){
      return '/assets/Employee-Home/Available-leaves.svg'
    }else if(data == 'Expired Leaves'){
      return '/assets/Employee-Home/Expired-Leaves.svg'
    }else{
      return '/assets/Employee-Home/Total-Leaves.svg'
    }
  }

  get_leaves_color(data){
    if(data == 'Total Leaves'){
      return '#5461FF'
    }else if(data == 'Used Leaves'){
      return '#E08700'
    }else if(data == 'Available Leaves'){
      return '#458F5A'
    }else if(data == 'Expired Leaves'){
      return '#C01212'
    }else{
      return '#5461FF'
    }
  }

  leaveValue = [
    { icon: '/assets/Employee-Home/Total-Leaves.svg', color: '#5461FF' },
    { icon: '/assets/Employee-Home/Used-Leaves.svg', color: '#E08700' },
    { icon: '/assets/Employee-Home/Availabe-Leaves.svg', color: '#458F5A' },
    { icon: '/assets/Employee-Home/Expired-Leaves.svg', color: '#C01212' },
  ]

  generateHighlightedDates() {

    const presentDates: any = [];
    const workFromHomeDates: any = [];
    const onLeaveDates: any = [];
    const absentDates: any = [];

    if(this.ess_dashboard_data && this.ess_dashboard_data.attendance_details && this.ess_dashboard_data.attendance_details.length != 0){
      
      this.ess_dashboard_data.attendance_details.map((record: any) => {
        switch (record.status) {
          case 'Present':
          case 'Half Day':
          case 'Work From Home':
            presentDates.push(record.attendance_date);
            break;
          case 'On Leave':
          case 'Absent':
            absentDates.push(record.attendance_date);
            break;
        }
      });

      // console.log('const presentDates =', presentDates);
      // console.log('const workFromHomeDates =', workFromHomeDates);
      // console.log('const onLeaveDates =', onLeaveDates);
      // console.log('const absentDates =', absentDates);

    }
    
    const dynamicGreenDates = presentDates;
    const dynamicRedDates = absentDates;

    this.highlightedDates = [
      ...dynamicGreenDates.map(date => ({
        date,
        textColor: '#000',
        backgroundColor: '#1DAC4526',
      })),
      ...dynamicRedDates.map(date => ({
        date,
        textColor: '#000',
        backgroundColor: '#AC1D1D26',
      })),
    ];

    this.db.highlightedDates = this.highlightedDates
    this.db.monthChange.next('success')
  }

  getCurrentTime() {
    const now = new Date();
    return this.datePipe.transform(now, 'HH:mm') || '';
  }

  getCalendarDate(eve){
    // console.log(eve)

    const parts = eve.detail.value.split('-');
    
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);

    this.currentMonth = month
    this.currentYear = year

    this.get_ess_dashboard()
  }

  @HostListener('document:click', ['$event'])
  handleGlobalClick(event: Event) {
    const target:any = event.target as HTMLElement;
    // console.log(target.mode)
    if (target.mode && target.mode == 'ios') {
      this.handleButtonClick();
    }
  }

  // swipeStartX: any;
  // swipeEndX: any;
  // swipeThreshold:any = 50; // Minimum distance in pixels to be considered a swipe

  // @HostListener('document:touchstart', ['$event'])
  // onTouchStart(event: TouchEvent) {
  //   this.swipeStartX = event.touches[0].clientX;
  // }

  // @HostListener('document:touchmove', ['$event'])
  // onTouchMove(event: TouchEvent) {
  //   if (this.swipeStartX !== undefined) {
  //     this.swipeEndX = event.touches[0].clientX;
  //   }
  // }

  // @HostListener('document:touchend', ['$event'])
  // onTouchEnd(event: TouchEvent) {
  //   if (this.swipeStartX !== undefined && this.swipeEndX !== undefined) {
  //     const deltaX = this.swipeEndX - this.swipeStartX;

  //     // Determine if it's a horizontal swipe and meets the threshold
  //     if (Math.abs(deltaX) > this.swipeThreshold) {
  //       if (deltaX > 0) {
  //         this.handleButtonClick();
  //       } else {
  //         this.handleButtonClick();
  //       }
  //     }

  //     // Reset swipe variables
  //     this.swipeStartX = undefined;
  //     this.swipeEndX = undefined;
  //   }
  // }

  handleButtonClick() {
   
    const hostElement = document.querySelector('.calendar_att ion-datetime');
    
    if (hostElement) {
      // Access the shadow root
      const shadowRoot = hostElement.shadowRoot;
  
      if (shadowRoot) {
        // Query the ion-label element inside the shadow DOM
        const ionLabel:any = shadowRoot.querySelector('ion-label');
        console.log('ion-label:', ionLabel);
        if (ionLabel) {
          // Get the text content of the ion-label
          // setTimeout(()=>{
            const labelText = ionLabel.textContent?.trim();
            const parts = labelText.split(' ');
            const month = parts[0]; // "June"
            const year = parts[1];
            // this.currentMonth = month
            this.currentYear = year
            let index = this.db.monthLists.findIndex((res)=>{ return res.label == month})
            // console.log(index)
            console.log(labelText); // Output: April 2024
            this.currentMonth = index + 1
            // let event = {fa
            //   detail:{
            //     value:year + '-' + (index + 1)
            //   }
            // }

            this.get_ess_dashboard()
            // this.getCalendarDate.emit(event);

            // this.show_attendance = false;
            // setTimeout(()=>{ this.show_attendance = true; },700)
          // },5000)
        } else {
          console.log('ion-label element not found inside shadow root.');
        }
      } else {
        console.log('Shadow root not found.');
      }
    } else {
      console.log('Host element containing shadow root not found.');
    }
  }

  attendance_status = [
    {
      label: 'Presence',
      count: '1450'
    },
    {
      label: 'Late',
      count: '213'
    },
    {
      label: 'Absent',
      count: '12'
    }
  ]

  getStatusColor(data){
    if(data == 'Present'){
      return '#458F5A'
    }else if(data == 'Late'){
      return '#E08700'
    }else{
      return '#CF161C'
    }
  }

  attendanceEntry = [
      '/assets/HR-Home/total-workforce.svg',
      '/assets/HR-Home/absent-workforce.svg',
      '/assets/HR-Home/onleave-workforce.svg',
      '/assets/HR-Home/late-arrival.svg',
      '/assets/HR-Home/claimed-expense.svg',
      '/assets/HR-Home/leave-application.svg'
  ]
  
  initChartData(dataChart) {

    // console.log('dataChart',dataChart)

    let ts2: any = 1484418600000;
    let dates: any = [];
    for (let i = 0; i < 120; i++) {
      ts2 = ts2 + 86400000;
      dates.push([ts2, dataChart[1].value]);
    }

    this.series = [
      {
        name: "XYZ MOTORS",
        data: dates
      }
    ];
    this.charts = {
      type: "area",
      stacked: false,
      height: 350,
      width: 1100,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom"
      }
    };
    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0
    };
    this.title = {
      // text: "Stock Price Movement",
      align: "left"
    };
    this.fill = {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxis = {
      labels: {
        formatter: function(val) {
          return (val / 1000000).toFixed(0);
        }
      },
      title: {
        // text: "Price"
      }
    };
    this.xaxis = {
      type: "datetime"
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function(val) {
          return (val / 1000000).toFixed(0);
        }
      }
    };
  }

  chartDay = [
    {name: 'Daily', selected: true, route: 'Daily'},
    {name: 'Weekly', selected: false, route: 'Weekly'},
    {name: 'Monthly', selected: false, route: 'Monthly'}
  ]

  menu_name(eve: any) {
    let route = eve.route
    this.chartDay.map((res,i)=>{
      if(res.route == route){
        this.changeCalendarDay(res,i);
        return 1;
      }
    })
  }


  changeCalendarDay(data,i){
    this.currentChartValue = data.name
    this.chartDay.map((res,index) => {
      if(index == i){
        res.selected = true;
      }else{
        res.selected = false;
      }
    })
    this.getChartHr()
  }

  getChartHr(){
    let data = {
      "month_filters":{
          "month": this.currentMonth,
          "year":this.currentYear
      },
      "date": this.db.current_event_date,
      "view_type": this.currentChartValue
   }

   if(this.currentChartValue == 'Monthly'){
    data['employee'] = localStorage['employee_id']
   }

   this.db.get_hr_attendance_dashboard(data).subscribe(res => {
    // console.log(res)
    if(res && res.message){
      this.chartDataNew = res.message
      if(this.chartDataNew && this.chartDataNew.dashboard && this.chartDataNew.dashboard.length != 0){
        // this.initChartData(this.chartDataNew.dashboard);
        this.loopArray(this.chartDataNew.dashboard)
      }

      this.appApexChartDashboardComponent ? this.appApexChartDashboardComponent.ngOnInit() : null;

      // this.appApexChartComponent ? this.appApexChartComponent.ngOnInit() : null;
    }
   })
  }

  async open_salary_slip(name) {
    const modal = await this.modalCtrl.create({
      component: PayrollDetailComponent,
      cssClass: 'salary-slip-popup',
      componentProps: {
        detail_name: name,
        employee: localStorage['employee_id'],
      },
    });
    await modal.present();
    const val = await modal.onWillDismiss();
  }

  async openWebFormPopup(data) {
    let edit_form_values:any;

    if(data && data.name){
        let value = {
          name: data.name,
          doctype: 'Task',
        };
        this.db.doc_detail(value).subscribe((res) => {
          if(res && res.message && res.message[1]){
            edit_form_values = res.message[1];
            this.openForms(edit_form_values);
          }
        });
    }else{
      this.openForms(data);
    }
  }

  async openForms(edit_form_values){
    const modal = await this.modalCtrl.create({
      component: WebsiteFormsComponent,
      cssClass: 'childTablecss',
      componentProps: {
        page_title: 'Task',
        page_route: 'task',
        enable_height:false,
        loader_f: true,
        load_doc: 'Task',
        popup_centre: false,
        modal: true,
        edit_form_values: edit_form_values ? edit_form_values : undefined,
        edit_form:edit_form_values ? 1 : undefined,
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();
    if (val && val.data && val.data.status && val.data.status == 'Success') {
      // this.get_tempate_and_datas();
      this.get_ess_dashboard();
    }
  }

  chartObject: any = {
    count: [],
    month: []
  };
  
  loopArray(data){
    // console.log(data)

    this.chartObject.month = [];
    this.chartObject.count = [];

    data.map((res: any) => {
      this.chartObject.month.push(res.date)
      this.chartObject.count.push(res.value)
    })
    
    // console.log('this.chartObject',this.chartObject)
  }

  getFormattedDate() {
    const now = moment();
    const day = now.date();
    const suffix = this.getDaySuffix(day);
    return `${day}${suffix} ${now.format('MMM')}, ${now.year()}`;
  }

  getDaySuffix(day: any) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  getCircleColor(data){
    if(data == 'Total Leaves'){
      return '#DDDFFF'
    }else if(data == 'Used Leaves'){
      return '#F9E7CC'
    }else if(data == 'Available Leaves'){
      return '#DAE9DE'
    }else if(data == 'Pending Leaves'){
      return '#DDDFFF'
    }else{
      return '#F2D0D0'
    }
  }


  // heatmapData = {
  //   dataPoints: this.getdatapoints(),
  //   start: new Date('2018-01-01'),
  //   end: new Date('2018-12-31')
  // };

  // getdatapoints() {
  //   const points:any = {};
  //   const now = new Date('2018-12-31');
  //   const daysOfYear = [];
  //   for (const d = new Date(2018, 0, 1); d <= now; d.setDate(d.getDate() + 1)) {
  //     const date = d.getTime() / 1000;
  //     points[date] = Math.floor(Math.random() * 100 + 1);
  //   }
  //   return points;
  // }

  heatmapData:any = {
    dataPoints: [],
    categories: ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December']
  };
  
  // Function to populate dataPoints with random attendance data
  populateDataPoints() {
    const startDate = new Date(2023, 0, 1); // January 1st, 2023
    const endDate = new Date(2023, 11, 31); // December 31st, 2023
    const currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      const timestamp = Math.floor(currentDate.getTime() / 1000); // Convert to seconds
      const label = this.getMonthDay(currentDate); // Format: 'Jan 1', 'Feb 2', etc.
      const value = Math.floor(Math.random() * 100); // Random attendance count (0-100)
  
      this.heatmapData.dataPoints.push({ timestamp, label, value });
  
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
  }
  
  // Helper function to get month and day formatted as 'MMM D' (e.g., 'Jan 1', 'Feb 2', etc.)
  getMonthDay(date: Date): string {
    const month = date.toLocaleString('default', { month: 'short' }); // Short month name (Jan, Feb, etc.)
    const day = date.getDate();
    return `${month} ${day}`;
  }

  async editQuick(){
    const modal = await this.modalCtrl.create({
      component: QuickviewdragComponent,
      cssClass: 'quickViewDragAndDrop-popup',
      // componentProps: {},
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();
    if (val && val.data && val.data.status && val.data.status == 'Success') {
      
    }
  }

  routeToSpecificPage(data){
    // console.log(data)
    if(data.label == "Claimed Expences"){
      this.router.navigateByUrl('/list/expense-claim')
    }else if(data.label == "Leave Applications"){
      this.router.navigateByUrl('/leave-application-detail')
    }else{
      this.router.navigateByUrl('/list/attendance')
    }
  }

  selectApex(item,i){
    this.apexChartType.map((res, index) => {
      if(i == index){
        res['isSelected'] = true
      }else{
        res['isSelected'] = false
      }
    })
    this.changeCalendarDay(item,i);
  }

//  chartOptions:any = {};


//  heatMap() {
//   this.chartOptions = {
//     series: [{
//       name: 'Heatmap',
//       data: this.heatmapData.dataPoints.map((point: any) => ({
//         x: new Date(point.timestamp * 1000),
//         y: point.label,
//         value: point.value
//       }))
//     }],
//     chart: {
//       height: 350,
//       type: 'heatmap',
//     },
//     plotOptions: {
//       heatmap: {
//         colorScale: {
//           ranges: [{
//             from: 0,
//             to: 50,
//             name: 'Low',
//             color: '#FFD700'
//           },
//           {
//             from: 51,
//             to: 100,
//             name: 'High',
//             color: '#7FFF00'
//           }]
//         }
//       }
//     },
//     dataLabels: {
//       enabled: false
//     },
//     xaxis: {
//       type: 'category',
//       categories: this.heatmapData['categories'], // Example: Access categories from heatmapData
//     },
//     title: {
//       text: 'Heatmap Chart'
//     }
//   };
// }

// generateAttendanceData() {
//   const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//   const attendanceData:any = [];

//   months.forEach((month, monthIndex) => {
//     const daysInMonth = new Date(2023, monthIndex + 1, 0).getDate(); // Get number of days in the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const attendanceCount = Math.floor(Math.random() * 100); // Generate random attendance count (0-100)
//       attendanceData.push({
//         x: month,
//         y: day.toString(),
//         value: attendanceCount
//       });
//     }
//   });

//   return attendanceData;
// }

// generateMonthLabels() {
//   return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// }


//  heatmapData = {
//   dataPoints: this.getDatapoints(),
//   start: new Date('2018-01-01'),
//   end: new Date('2018-12-31')
// };

// constructor() { }

// ngOnInit(): void {
//   this.updateChartOptions();
// }

// getDatapoints() {
//   const points: any = {};
//   const now = new Date('2018-12-31');
//   const daysOfYear = [];
//   for (let d = new Date(2018, 0, 1); d <= now; d.setDate(d.getDate() + 1)) {
//     const date = d.getTime() / 1000;
//     points[date] = Math.floor(Math.random() * 100 + 1);
//   }
//   return points;
// }

//  heatMap() {
//   this.chartOptions = {
//     series: [{
//       name: 'Heatmap',
//       data: Object.keys(this.heatmapData.dataPoints).map(key => ({
//         x: new Date(parseInt(key) * 1000),
//         y: this.heatmapData.dataPoints[key]
//       }))
//     }],
//     chart: {
//       height: 350,
//       type: 'heatmap',
//     },
//     dataLabels: {
//       enabled: false
//     },
//     xaxis: {
//       type: 'datetime',
//       labels: {
//         format: 'dd MMM'
//       },
//       min: this.heatmapData.start.getTime(),
//       max: this.heatmapData.end.getTime()
//     },
//     title: {
//       text: 'Dynamic Heatmap Chart'
//     }
//   };
// }

// Optional: If your data needs to be updated dynamically, you can implement a function to refresh the data.
// refreshData() {
//   this.heatmapData.dataPoints = this.getDatapoints();
//   this.heatMap();
// }

  // heatMap(){
  //   this.chartOptions = {
  //     series: [{
  //       name: 'Metric1',
  //       data: [
  //         { x: 'Monday', y: 5 },
  //         { x: 'Tuesday', y: 10 },
  //         { x: 'Wednesday', y: 15 },
  //         { x: 'Thursday', y: 20 },
  //         { x: 'Friday', y: 25 }
  //       ]
  //     }, {
  //       name: 'Metric2',
  //       data: [
  //         { x: 'Monday', y: 30 },
  //         { x: 'Tuesday', y: 25 },
  //         { x: 'Wednesday', y: 20 },
  //         { x: 'Thursday', y: 15 },
  //         { x: 'Friday', y: 10 }
  //       ]
  //     }],
  //     chart: {
  //       height: 350,
  //       type: 'heatmap',
  //     },
  //     dataLabels: {
  //       enabled: false
  //     },
  //     xaxis: {
  //       type: 'category'
  //     },
  //     title: {
  //       text: 'Heatmap Chart'
  //     }
  //   };
  //  }
  
}

import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";
import { ModalController } from '@ionic/angular';

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  stroke: ApexStroke | any;
  dataLabels: ApexDataLabels | any;
  yaxis: ApexYAxis | any;
  title: ApexTitleSubtitle | any;
  labels: any;
  legend: ApexLegend | any;
  subtitle: ApexTitleSubtitle | any;
};
import { ApexChartComponent } from 'src/app/components/apex-chart/apex-chart.component';
import { DbService } from 'src/app/services/db.service';
import { ReportDetailPage } from '../report-detail/report-detail.page';
import { ReportFilterComponent } from 'src/app/components/report-filter/report-filter.component';
import { FreezeColumnComponent } from 'src/app/components/freeze-column/freeze-column.component';
// import { RevoGridComponent } from '@revolist/angular-datagrid';
// import RevoGrid from 'revogrid';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  @ViewChild('revoGrid', { static: false }) revoGrid: any;
  // @ViewChild('revoGrid') revoGrid: ElementRef | any;
  @ViewChild(ApexChartComponent) appApexChartComponent: ApexChartComponent | any;
  @ViewChild("chart") chart: ChartComponent | any;
  public chartOptions: Partial<ChartOptions> | any;
  current_date: any;
  chart_value: any;
  report_value: any;
  rows: any;
  columns: any = [];
  page_route: any;
  from_date: any;
  to_date: any;
  select_year: any;
  select_month: any;
  employee_analytics_parameter: any;
  hover_label: any;
  selected_department: any;
  selected_group: any;
  selected_designation: any;
  selected_employee: any;
  current_date_leave: any;
  selected_holiday: any;
  selected_leave: any;
  select_status: any;
  skeleton = false;
  constructor(public db: DbService,public route: ActivatedRoute, private router: Router,public zone:NgZone,private modalCtrl: ModalController,private datePipe: DatePipe) { }

  ngOnInit() {

    this.skeleton = true;

    this.db.select_drop_down.subscribe((res : any) => {
      this.skeleton = true;
      console.log(res)
      if(res && res.status && res.status == 'success'){
        if(res.fieldname == 'department'){
          this.selected_department = res.name != 'ALL' ? res.name : ''
        }else if(res.fieldname == 'group'){
          this.selected_group = res.name != 'ALL' ? res.name : ''
        }else if(res.fieldname == 'designation'){
          this.selected_designation = res.name != 'ALL' ? res.name : ''
        }else if(res.fieldname == 'employee'){
          this.selected_employee = res.name != 'ALL' ? res.name : ''
        }else if(res.fieldname == 'holiday_list'){
          this.selected_holiday = res.name != 'ALL' ? res.name : ''
        }else if(res.fieldname == 'leave_type'){
          this.selected_leave = res.name != 'ALL' ? res.name : ''
        }
        this.get_report(this.page_route)
      }
    })
    
  }

  ionViewWillEnter(){
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    this.current_date = formattedDate;

    this.from_date = formattedDate
    this.to_date = formattedDate
    this.current_date_leave = formattedDate

    const today = new Date();
    const monthNumber = today.getMonth();
    const dayOfMonth = today.getDate();

    this.select_year = new Date().getFullYear();
    this.months.map((res,i)=>{
        if((i) == monthNumber){
        this.select_month = res.name
        }
    })

    this.employee_analytics_parameter = 'Department'
    this.select_status = 'Present'

    this.route.params.subscribe(res => {
      // console.log(res)
      if(res && res['id']){
        this.page_route = res['id']
        this.get_report(res['id'])
      }
    })



  }

  moveItem(array, fromIndex, toIndex) {
    // Check if indices are within bounds
    if (fromIndex >= array.length || toIndex >= array.length || fromIndex < 0 || toIndex < 0) {
      throw new Error('Index out of bounds');
    }
  
    // Remove the item from the original position
    const [item] = array.splice(fromIndex, 1);
  
    // Insert the item at the new position
    array.splice(toIndex, 0, item);
  
    return array;
  }

  get_report(doctype_name){
    let data_payload: any = {
      report_name: doctype_name,
      employee: this.selected_employee ? this.selected_employee : ''
    };
    
    if (doctype_name == 'Attendance') {
      data_payload.data = {
        from_date: this.from_date,
        to_date: this.to_date,
        status: this.select_status
      };
    }

    if(doctype_name == 'Timesheet'){
      data_payload.data = {
        from_date: this.from_date,
        to_date: this.to_date
      };
    }

    if(doctype_name == 'Monthly Attendance Sheet'){
      data_payload.data = {
        month: this.select_month,
        year: this.select_year,
        status: 'Present'
      };
    }

    if(doctype_name == 'Employee Analytics'){
      data_payload.data = {
        filter_value: this.employee_analytics_parameter ? this.employee_analytics_parameter : '',
        company: this.db.default_values.default_company
      };
    }

    if(doctype_name == 'Daily Work Summary Replies'){
      data_payload.data = {
        from_date: this.from_date,
        to_date: this.to_date,
        group: this.selected_group ? this.selected_group : ''
      };
    }

    if(doctype_name == 'Employee Information'){
      data_payload.data = {
        department: this.selected_department ? this.selected_department : '',
        employee_status: "Active",
        company: this.db.default_values.default_company
      }
    }

    if(doctype_name == 'Employee Exits'){
      data_payload.data = {
        from_date: this.from_date,
        to_date: this.to_date,
        department: this.selected_department ? this.selected_department : '',
        designation: this.selected_designation ? this.selected_designation : '',
        employee: this.selected_employee ? this.selected_employee : '',
        company: this.db.default_values.default_company
      }
    }

    if(doctype_name == 'Employee Leave Balance Summary'){
      data_payload.data = {
        date: this.current_date_leave,
        department: this.selected_department ? this.selected_department : '',
        employee_status: "Active",
        company: this.db.default_values.default_company,
        employee: this.selected_employee ? this.selected_employee : ''
      }
    }

    if(doctype_name == 'Employee Birthday'){
      data_payload.data = {
        department: this.selected_department ? this.selected_department : '',
        company: this.db.default_values.default_company,
      }
    }

    if(doctype_name == 'Employee Advance Summary'){
      data_payload.data = {
        from_date: this.from_date,
        to_date: this.to_date,
        company: this.db.default_values.default_company,
        employee: this.selected_employee ? this.selected_employee : '',
        status: ''
      }
    }

    if(doctype_name == 'Employee Leave Balance'){
      data_payload.data = {
        company: this.db.default_values.default_company,
        employee: this.selected_employee ? this.selected_employee : '',
        employee_status: 'Active',
        department: this.selected_department ? this.selected_department : '',
        leave_type: this.selected_leave ? this.selected_leave : ''
      }
    }

    if(doctype_name == 'Employees Working on a Holiday'){
      data_payload.data = {
        holiday_list: this.selected_holiday ? this.selected_holiday : '',
        from_date: this.from_date,
        to_date: this.to_date,
      }
    }

    data_payload.data['company'] = (this.db.default_values && this.db.default_values.default_company) ? this.db.default_values.default_company : ''

    this.db.report_data(data_payload).subscribe(res => {
      this.skeleton = false;
      this.columns = []
      this.rows = []
      // console.log(res)
      if(res && res.message && res.message.chart && res.message.report){
        this.chart_value = res.message.chart
        this.hover_label = res.message.label
        this.rows = res.message.report
        this.rows.map(res_col => { 
          if(res_col && res_col.total_hours){
            res_col.total_hours = res_col.total_hours.toFixed(2);
          }
        })
        if(this.rows && this.rows.length != 0){
          if(this.db.ismobile){
            this.loadRevoGrid(undefined);
          }else{
            Object.keys(this.rows[0]).map(res_upper => {
              let result = res_upper.toUpperCase();
              if(result && result.includes('_')){
                result = result.replace(/_/g, ' ')
              }
              if(result == 'NAME'){
                result = 'ID'
              }
              this.columns.push({name: result,prop:res_upper,size: res_upper == 'employee_name' ? 450 : 250, order: 'asc',sortable: true})
            })
          }
        }
        this.appApexChartComponent ? this.appApexChartComponent.ngOnInit() : null;
      }else if(!res.message.chart && res.message.report){
        this.rows = res.message.report
        this.rows.map(res_col => {
          if(res_col && res_col.total_hours){
            res_col.total_hours = res_col.total_hours.toFixed(2);
          }
        })
        if(this.rows && this.rows.length != 0){
          Object.keys(this.rows[0]).map(res_upper => {
            let result = res_upper.toUpperCase();
            if(result && result.includes('_')){
              result = result.replace(/_/g, ' ')
            }
            if(result == 'NAME'){
              result = 'ID'
            }
            this.columns.push({name: result,prop:res_upper,size: res_upper == 'employee_name' ? 450 : 400, order: 'asc',sortable: true})
          })
        }
      }else{
        this.rows = []
        this.columns = []
      }
    }, error=>{
      this.rows = []
      this.columns = []
    })
  }

  optionsValue:any = {
    columnResize: true,
    resizable: true
    // columnResize: true,
    // columnResizeMode: 'standard',
    // resizable: true
    // columnResize: true,
    // columnResizeMode: 'exact',
    // resizable: true
  };

  ngAfterViewInit() {
    // this.setupResizeObserver();
  }

  private resizeObserver!: ResizeObserver;
  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target instanceof HTMLElement) {
          console.log('Column resized:', entry.target);
          // Handle the resize event here
        }
      }
    });

    const columns = this.revoGrid.nativeElement.querySelectorAll('.revo-column-class'); // Adjust selector as needed
    columns.forEach(column => this.resizeObserver.observe(column));
  }

  loadRevoGrid(colPinStart){
    let columnsValue:any = [];
    Object.keys(this.rows[0]).map(res_upper => {

      // let result = res_upper.toUpperCase();
      let result = res_upper;
      if(result && result.includes('_')){
        result = result.replace(/_/g, ' ')
      }
      if(result == 'NAME'){
        result = 'ID'
      }

      columnsValue.push({name: result,prop:res_upper,size: res_upper == 'employee_name' ? 180 : 150, order: 'asc',sortable: true,  resizable: true  })
    
    })

    let findIndexValue = -1
    if(colPinStart){
    findIndexValue = columnsValue.findIndex((res)=>{ return res.prop == colPinStart.prop})
    }

    if(findIndexValue >= 0){
      columnsValue = this.moveItem(columnsValue, findIndexValue, 0);
      columnsValue[0].pin = 'colPinStart'
      columnsValue[0].size = (colPinStart && colPinStart.width) ? colPinStart.width : columnsValue[0].size 
    }

    this.columns = columnsValue;

  }  

  load_chart(){
    let chartOptions = {
      series: [
        {
          name: "Lead",
          data: this.chart_value,
          waveColor: '#ddd'
        }
      ],
      chart: {
        type: "area",
        height: 350,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight",
        colors: ['#FFBF48']
      },

      title: {
        text: "",
        align: "left"
      },
      subtitle: {
        text: "",
        align: "left"
      },
      labels: this.report_value,
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        opposite: false
      },
      legend: {
        horizontalAlign: "left"
      }
    };

    this.zone.run(() => {
      this.chartOptions = chartOptions;
    });
  }

  change_from_date(eve){
    this.skeleton = true;
    this.from_date = eve.target.value
    this.get_report(this.page_route)
  }

  change_to_date(eve){
    this.skeleton = true;
    this.to_date = eve.target.value
    this.get_report(this.page_route)
  }

  change_current_date(eve){
    this.skeleton = true;
    this.current_date_leave = eve.target.value
    this.get_report(this.page_route)
  }

  change_employee_analytics(eve){
    this.skeleton = true;
    this.employee_analytics_parameter = eve.target.value
    this.get_report(this.page_route)
  }

  async open_reports() {
    const modal = await this.modalCtrl.create({
      component: ReportDetailPage,
      cssClass: 'web_site_form',
      componentProps: {
        modal: true
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();
    console.log(val);
    if(val && val.data){
      this.selected_leave = '';
      this.selected_holiday = '';
      this.selected_employee = '';
      this.selected_designation = '';
      this.selected_group = '';
      this.selected_department = '';
      this.page_route = val.data
      this.get_report(val.data)
    }
  }

  months = [
    {value: "January", name: "Jan", selected: true},
    {value: "February", name: "Feb"},
    {value: "March", name: "Mar"},
    {value: "April", name: "Apr"},
    {value: "May", name: "May"},
    {value: "June", name: "Jun"},
    {value: "July", name: "Jul"},
    {value: "August", name: "Aug"},
    {value: "September", name: "Sep"},
    {value: "October", name: "Oct"},
    {value: "November", name: "Nov"},
    {value: "December", name: "Dec"}
  ]

  year = [
    {value: 2022},
    {value: 2023},
    {value: 2024}
  ]
  
  statusAttendance = [
    {value: 'Present'},
    {value: 'Absent'}
  ]

  parameter_employee_analytics = [
    {value: 'Branch'},
    {value: 'Grade'},
    {value: 'Department'},
    {value: 'Designation'},
    {value: 'Employment Type'}
  ]

  change_month(eve){
    this.skeleton = true;
    this.select_month = eve.target.value
    this.get_report(this.page_route)
  }

  change_status(eve){
    this.skeleton = true;
    this.select_status = eve.target.value
    this.get_report(this.page_route)
  }

  change_year(eve){
    this.skeleton = true;
    this.select_year = eve.target.value
    this.get_report(this.page_route)
  }

  open_drop_down_options(data,fieldname){
    this.db.open_drop_down_options2(data,fieldname,'',this.selected_department ? this.selected_department : '')
  }

  async open_filter(){
    const modal = await this.modalCtrl.create({
      component: ReportFilterComponent,
      cssClass: 'job-detail-popup',
      componentProps: {
        page_route: this.page_route,
        selected_employee: this.selected_employee ? this.selected_employee : '',
        selected_department: this.selected_department ? this.selected_department : '',
        selected_designation: this.selected_designation ? this.selected_designation : '',
        selected_group: this.selected_group ? this.selected_group : '',
        selected_holiday: this.selected_holiday ? this.selected_holiday : ''
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();
    console.log(val)
    if(val && val.data){
      this.skeleton = true;
      this.selected_employee = val.data.selected_employee
      this.selected_department = val.data.selected_department
      this.selected_designation = val.data.selected_designation
      this.selected_group = val.data.selected_group
      this.selected_holiday = val.data.selected_holiday
      this.get_report(this.page_route)
    }
  }

  zoomValue = 1;

  onZoomChange(event: CustomEvent<number>) {
    this.zoomValue = event.detail;
  }

  // @ViewChild('gridContainer') gridContainer!: ElementRef;
  // gridInstance:any;
  // // private gridInstance: RevoGrid | null = null;

  // ngAfterViewInit(): void {
  //   // Initialize RevoGrid instance
  //   this.gridInstance = new RevoGrid.Grid(this.gridContainer.nativeElement);

  //   // Set initial scale or zoom level
  //   if (this.gridInstance) {
  //     this.gridInstance.setScale(1); // Initial zoom level
  //   }

  //   // Handle pinch-to-zoom for mobile devices
  //   this.gridContainer.nativeElement.addEventListener('pinch', this.handlePinch);
  // }

  // ngOnDestroy(): void {
  //   // Cleanup event listener
  //   this.gridContainer.nativeElement.removeEventListener('pinch', this.handlePinch);
  // }

  // private handlePinch = (event:any) => {
  //   event.preventDefault();
  //   if (this.gridInstance) {
  //     const scale = this.gridInstance.scale * event.scale;
  //     this.gridInstance.setScale(scale);
  //   }
  // };


  chartDay = [
    // {name: 'Daily', selected: true, route: 'Daily'},
    {name: 'Weekly', selected: false, route: 'Weekly'},
    {name: 'Monthly', selected: false, route: 'Monthly'}
  ]

  menu_name(eve: any) {
    let route = eve.route
  }

  selectValue:any;

  async freezeEvent(eve) {

    const modal = await this.modalCtrl.create({
      component: FreezeColumnComponent,
      cssClass: 'freezeComponent-css',
      componentProps: {
        columns:this.columns,
        selectValue:this.selectValue
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();
    // console.log(val);
    if(val && val.data && val.data.name){
      if(val.data.name == 'nullValue'){
        this.selectValue = undefined;
        this.loadRevoGrid(undefined);
      }else{
        this.selectValue = val.data;
        this.loadRevoGrid(this.selectValue);
      }
      // this.page_route = val.data
      // this.get_report(val.data)
    }
  }

}

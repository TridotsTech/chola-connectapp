import { Component, OnInit, ViewChild , NgZone, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.page.html',
  styleUrls: ['./report-detail.page.scss'],
})
export class ReportDetailPage implements OnInit {
  @Input() modal: any;
  chart_value: any;
  report_value: any;
  rows: any;
  constructor(public db: DbService,public route: ActivatedRoute, private router: Router,private modalcntrl: ModalController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    // this.get_report()
  }

  report_list = [
    {name: 'Attendance',icon: '/assets/dashboard/Attendance.svg'},
    {name: 'Timesheet', icon: '/assets/dashboard/Timesheet.svg'},
    {name: 'Monthly Attendance Sheet', icon: '/assets/dashboard/Timesheet.svg'},
    // {name: 'Recruitment Analytics', icon: '/assets/dashboard/Timesheet.svg'},
    {name: 'Employee Analytics', icon: '/assets/dashboard/Timesheet.svg'},
    {name: 'Employee Leave Balance', icon: '/assets/dashboard/Timesheet.svg'},
    {name: 'Employee Leave Balance Summary', icon: '/assets/dashboard/Timesheet.svg'},
    {name: 'Employee Advance Summary', icon: '/assets/dashboard/EmployeeAdvance.svg'},
    {name: 'Employee Exits', icon: '/assets/dashboard/Timesheet.svg'},
    {name: 'Employee Information', icon: '/assets/dashboard/Employee.svg'},
    {name: 'Employee Birthday', icon: '/assets/dashboard/Timesheet.svg'},
    {name: 'Employees Working on a Holiday', icon: '/assets/dashboard/HolidayList.svg'},
    {name: 'Daily Work Summary Replies', icon: '/assets/dashboard/Timesheet.svg'},
  ]

  enable_detail(data){
    if(this.modal){
      this.modalcntrl.dismiss(data.name)
    }else{
      this.router.navigateByUrl('/report/' + data.name)
    }
  }

}

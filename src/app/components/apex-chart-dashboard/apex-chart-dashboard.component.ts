import { Component, OnInit, ViewChild , NgZone, Input } from '@angular/core';
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

// import { dataSeries } from "src/app/data";
import { DbService } from 'src/app/services/db.service';

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

@Component({
  selector: 'app-apex-chart-dashboard',
  templateUrl: './apex-chart-dashboard.component.html',
  styleUrls: ['./apex-chart-dashboard.component.scss'],
})
export class ApexChartDashboardComponent  implements OnInit {
  @Input() new_dashboard_values: any
  @Input() chart_value: any
  @Input() hover_name: any
  @Input() currentChartValue: any

  @ViewChild("chart") chart: ChartComponent | any;
  public chartOptions: Partial<ChartOptions> | any;

  constructor(public zone:NgZone,public db: DbService) {}

  ngOnInit() {
    setTimeout(() => {
      this.load_chart1()
      // console.log(this.chart_value,"chart_value")
    }, 500)
  }

  load_chart1(){

    let chartOptions:any = {
      series: [
        {
          name: this.hover_name,
          data: this.new_dashboard_values ? this.new_dashboard_values.datasets[0].values : this.chart_value ? this.chart_value.count : '',
          // waveColor: '#ddd'
          // name: "Inflation",
          // data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
        }
      ],
      chart: {
        height: 200,
        type: "bar",
        toolbar: {
          show: false // Disable the toolbar which includes the menu icon
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top" // top, center, bottom
          },
          fill: {
            colors: ['#cce5fa']
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val + "%";
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"]
        }
      },

      xaxis: {

        categories: this.new_dashboard_values ? this.new_dashboard_values.labels : this.chart_value ? this.chart_value.month : '',
        position: "bottom",
        labels: {
          offsetY: 0, 
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
              colors: ['#cce5fa']
          }
        },
        tooltip: {
          enabled: true,
          offsetY: -35
        }
      },
      fill: {
        colors: ['#cce5fa']
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          formatter: function(val) {
            return val + "%";
          }
        }
      },
      title: {
        text: "",
        floating: 0,
        offsetY: 320,
        align: "center",
        style: {
          color: "#444"
        }
      }
    };


    if(this.db.ismobile){
      // chartOptions.stroke.colors = ['#f1f1f1']
    }

   if(this.currentChartValue && this.currentChartValue != 'Monthly'){
      chartOptions.xaxis.labels.formatter = function(val) {
        // Convert "2024-07-01" to "01 July"
        if(val){
        const dateParts = val.split('-');
        const date = new Date(dateParts[0], parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        const options:any = { day: '2-digit', month: 'short' };
        return date.toLocaleDateString('en-GB', options);
        }
      }
    }if(this.currentChartValue && this.currentChartValue == 'Monthly'){
      chartOptions.xaxis.labels.formatter = function(val) {
        return val.substring(0, 3); // Return the first 3 characters (abbreviated month name)
      }
    }

    if(this.currentChartValue && this.currentChartValue == 'Daily'){
      chartOptions.chart.width = 1400;
    }else if(this.currentChartValue && this.currentChartValue == 'Weekly'){
      chartOptions.chart.width = 500;
    }else if(this.currentChartValue && this.currentChartValue == 'Monthly'){
      chartOptions.chart.width = 700;
    }

    this.zone.run(() => {
      this.chartOptions = chartOptions;
      // console.log(this.chartOptions,"chartOptions modified....")
    });

    

  }

  load_chart(){
    let chartOptions: any = {
      series: [
        {
          name: this.hover_name,
          data: this.new_dashboard_values ? this.new_dashboard_values.datasets[0].values : this.chart_value ? this.chart_value.count : '',
          waveColor: '#ddd'
        }
      ],
      chart: {
        type: "area",
        height: 200,
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false // Hide the chart toolbar if necessary
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight",
        width: 2,
        colors: ["transparent"],
        show: true,
      },

      title: {
        text: "",
        align: "left"
      },
      subtitle: {
        text: "",
        align: "left"
      },
      labels: this.new_dashboard_values ? this.new_dashboard_values.labels : this.chart_value ? this.chart_value.month : '',
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

    // if(!this.db.ismobile){
      // chartOptions.chart.width = 1100;
      chartOptions.chart.width = 700;
    // }

    if(this.db.ismobile){
      chartOptions.stroke.colors = ['#FFBF48']
    }

    this.zone.run(() => {
      this.chartOptions = chartOptions;
    });
    
  }

}

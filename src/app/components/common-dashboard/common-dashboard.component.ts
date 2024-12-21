import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-common-dashboard',
  templateUrl: './common-dashboard.component.html',
  styleUrls: ['./common-dashboard.component.scss'],
})
export class CommonDashboardComponent  implements OnInit {
@Output() send_format_date = new EventEmitter();
@Output() month_goToPreviousDay = new EventEmitter();
@Output() month_goToNextDay = new EventEmitter();
@Input() icons: any;
@Input() data: any;
@Input() date_change_section: any;
@Input() month_change_section: any;
@Input() month: any;
@Input() daysInMonth: any;
@Input() year: any;
@Input() count_with_title: any;
@Input() doctype:any;
@Input() yearLoader:any;

today: any;
// current_date: any;

  constructor(public db: DbService) { }

  ngOnInit() {
    this.today = new Date();
  }

  goToPreviousDay() {
    this.today = new Date(this.today.getTime() - 86400000);
    this.formatDate(this.today);
  }

  goToNextDay() {
    this.today = new Date(this.today.getTime() + 86400000);
    this.formatDate(this.today);
  }

  formatDate(date: any) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    this.db.current_date = `${year}-${month}-${day}`;
    this.send_format_date.emit(this.db.current_date)
  }


  check_percentage(data){
    if(data && (data % 1 != 0)){
      // if(data && data.includes('.')){
      let val = data.toFixed(2)
      return val;
    }

    return 0;
  }

}

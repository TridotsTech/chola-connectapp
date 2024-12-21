import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-attendance-summary',
  templateUrl: './attendance-summary.component.html',
  styleUrls: ['./attendance-summary.component.scss'],
})
export class AttendanceSummaryComponent implements OnInit {
  check_in: boolean = false;
  check_out: boolean = false;
  changedDate: any;
  greeting: any;
  show_time: any;
  today: any;
  time: any;
  attendance_statistics: any;
  constructor(public db: DbService, private datePipe: DatePipe,) { }

  ngOnInit() {

    this.setGreeting();

    this.get_attendance();
    this.checkIn();
    this.getAttendanceStatistics();
  }


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
    // this.router.navigateByUrl('/check-in');
    this.get_attendance();
    let data = {
      employee: this.db.employee,
      employee_name: localStorage['CustomerName'],
      log_type: type,
      // "shift": "Day Shift",
      time: this.changedDate + ' ' + this.time,
      device_id: this.db.current_address,
    };
    this.db.employee_checkin({ data: data }).subscribe((res) => {
      if (res && res.message && res.status == 'Success') {
        if (type == 'IN') {
          this.check_in = false;
          this.check_out = true;
        } else {
          this.check_out = false;
        }
        let alert = type == 'IN' ? 'Check in successful' : 'Check out successful'
        this.db.sendSuccessMessage(alert);
      } else {
        this.db.alert(res.data.message);
      }
    });
  }


  getTimeFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return this.datePipe.transform(date, 'h:mm a');
  }


  checkIn() {
    this.db.checkIn({ date: this.changedDate }).subscribe(res => {
      if (res && res.data.length != 0) {
        this.db.emp_checkIn({ id: res.data[0].name }).subscribe(res => {
          if (res && res.data) {

            if (res.data.length != 0) {
              let lastIndex = 0
              let obj = res.data[lastIndex]
              let time = this.getTimeFromTimestamp(obj['time'])
              this.db.checkInOutTime = time;
              this.db.checkInOutDetail = obj['log_type'] == "IN" ? 'Your last check in was ' + time : 'Your last check out was ' + time;
              res.data.map(resp => {
                if (resp.log_type == "IN") {
                  this.check_in = false;
                } else if (resp.log_type == "OUT") {
                  this.check_out = false;
                }
              })
            } else {
              this.check_in = true;
            }

          }
        })
      } else {
        this.check_in = true;
      }
    })
    // this.db.checkin_var_load = false;
  }

  getAttendanceStatistics(){
    let data = {
      employee: localStorage['employee_id'],
      date: this.db.current_event_date,
      month_filters: {
        month: '8',
        year: 2024,
      },
    };
    this.db.get_attendance_statistics_details(data).subscribe(res => {
      console.log(res)
      if(res && res.message && res.message.length != 0 && res.status == 'Success'){
        this.attendance_statistics = res.message;
      }else{
        this.attendance_statistics = [];
      }
    })
  }


}

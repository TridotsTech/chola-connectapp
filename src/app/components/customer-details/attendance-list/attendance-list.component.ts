import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  isSameDay,
  isSameMonth,
} from 'date-fns';
import {
  CalendarEvent,
  CalendarView
} from 'angular-calendar';
@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss', '../orders/orders.component.scss'],
})
export class AttendanceListComponent implements OnInit {
  @Input() list_data: any;
  @Input() highlightedDates: any;
  @Input() search_filter: any;
  @Input() doc_type: any;
  @Input() search_data: any = {};
  @Input() supplier_id: any;
  @Input() page_title: any;
  @Input() json_filter: any;
  @Input() showCalendar: any;

  @Output() load_popup = new EventEmitter()
  @Output() show_att_cal = new EventEmitter()
  @Output() getCalendarDate = new EventEmitter()
  @Output() do_to_details = new EventEmitter()
  @Output() getDateFromCalendars = new EventEmitter()
  @Output() getFilters = new EventEmitter()

  view = 'list'
  views: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  currentMonth: any;
  currentYear: any;
  check_in: boolean = false;
  check_out: boolean = false;
  employee: any;
  // clr_month:any = false
  constructor(public db: DbService, private datePipe: DatePipe, private router: Router,) { }

  ngOnInit() {
    this.db.employee = localStorage['employee_id']
    const parts = this.db.current_event_date.split('-');

    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);

    this.db.currentMonth = month
    this.db.currentYear = year
    this.get_ess_dashboard()
    // this.setGreeting();

    // this.get_attendance();
    // this.checkIn();
  }

  get_ess_dashboard() {

    // let val = { employee: localStorage['employee_id'] }

    // this.search_data = {...this.search_data,...val}

    let data = {
      dashboard_name: 'Attendance Dashboard',
      employee_id: localStorage['employee_id'],
      month_filters: {
        month: this.db.currentMonth,
        year: this.db.currentYear,
      },
      filters: (this.search_data && this.search_data != "") ? this.search_data : {}
    };

    // if(this.clr_month){
    //   delete data.month_filters.month
    //   delete data.month_filters.year
    // }

    this.db.get_dashboard_details(data).subscribe(res => {
      if (res && res.message && res.status == 'Success') {
        // this.list_data = {};
        this.list_data['data'] = res.message.data
        // this.ess_dashboard_data = res.message;
        // this.generateHighlightedDates(res.message.data)
        this.bindHolidays(res.message.data)
      }
    })
  }


  transform_att_date(value: any) {
    const date = new Date(value);
    const day = ('0' + date.getDate()).slice(-2);
    const dayOfWeek = date.toLocaleString('en-us', { weekday: 'short' });
    const month = date.toLocaleString('en-us', { month: 'short' });
    const year = date.getFullYear();

    return `${day} -${dayOfWeek} / ${month} - ${year}`;
  }

  converTime(data) {
    // Split the input string by ':'
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
    return `${(hours && hours != "undefined") ? hours : '00'}:${minutes ? minutes : '00'} Hr`;
  }


  filterList(data) {
    // this.db.listSkeleton = true;

    if (data && data.status == 'success') {

      this.list_data.data = [];
      this.search_data = {}
      Object.keys(data.data).map((res) => {
        this.search_data[res] = data.data[res]
      })

      if (data.data && data.data.employee_name) {
        let search: any = Object.fromEntries(
          // Object.entries(data.data).map(([key, value]) => [key, [key == 'status' ? '=' : 'Like', `%${value}%`]])
          Object.entries(data.data).map(([key, value]) => [key, ['Like', `%${value}%`]])

          // Object.entries(data.data).map(([key, value]) => [key, value])
        );
        if(search && search.employee){
          delete search.employee
        }

        if(search && search.attendance_date){
          let date = new Date(search.attendance_date)
          this.db.currentMonth = date.getMonth()+1;
          this.db.currentYear = date.getFullYear();
          // this.clr_month = true
          delete search.attendance_date
        }
        
        this.search_data = search ? { ...this.search_data, ...search } : this.search_data;
      }

      if(data.data && data.data.attendance_date){
        let date = new Date(data.data.attendance_date)
        this.db.currentMonth = date.getMonth()+1;
        this.db.currentYear = date.getFullYear()
        // this.clr_month = true
      }

      // }

      if (data.data && !data.data.employee) {
        if (this.search_data['employee'])
          delete this.search_data['employee']
      }

      if (data.data && Object.keys(data.data).length == 0) {
        this.db.employee = localStorage['employee_id']
        this.search_data = {}
        const parts = this.db.current_event_date.split('-');

        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);

        this.db.currentMonth = month
        this.db.currentYear = year
        // this.clr_month = false
      }

      this.get_ess_dashboard()

    }
  }


  search: any;
  sort_by_order: any;
  async tab_filter(event: any) {

    let val = {}
    val[event['fieldname']] = event[event['fieldname']]
    if (event['fieldname'] == 'search') {
      this.search = event['search']
      delete val['search']
    }

    if (this.search_data) {
      this.search_data = JSON.parse(this.search_data)
      if (event['fieldname'] == "") {
        this.search_data['fieldname'] ? delete this.search_data['fieldname'] : null;
      }
      this.search_data = { ...this.search_data, ...val }
    } else {
      this.search_data = val
    }

    if (event && event.sort_by) {
      this.sort_by_order = event.sort_by
    }

    this.search_data = JSON.stringify(this.search_data)

    // await this.get_tempate_and_datas(this.doc_type)
  }

  viewChange(event) {
    // console.log(event)
    this.view = this.view == 'list' ? 'calendar' : 'list'
    const parts = this.db.current_event_date.split('-');
    this.viewDate = this.db.current_event_date;
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);

    this.db.currentMonth = month
    this.db.currentYear = year
  }


  leaveIndicators: any = [];
  bindHolidays(data) {
    this.leaveIndicators = []
    data.map(res => {
      let obj = {
        start: new Date(res.attendance_date),
        end: new Date(res.attendance_date),
        title: res.status,
        color: { primary: '#e3bc08', secondary: '#FDF1BA' }
      }

      this.leaveIndicators.push(obj)
    })
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  greeting: any;
  show_time: any;
  today: any;
  time: any
  changedDate: any;
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

  getTimeFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return this.datePipe.transform(date, 'h:mm a');
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

  calendarDateChange(){
    this.activeDayIsOpen = false;
    this.db.currentMonth = this.viewDate.getMonth()+1
    this.db.currentYear = this.viewDate.getFullYear()
    this.get_ess_dashboard()
  }

  getDateFromCalendars1(eve){
    const parts = eve.split('-');
    this.db.currentMonth = parts[1];
    this.db.currentYear = parts[0];
    this.get_ess_dashboard();
  }


}

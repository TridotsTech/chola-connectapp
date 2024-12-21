import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-grid-attendance',
  templateUrl: './grid-attendance.component.html',
  styleUrls: ['./grid-attendance.component.scss'],
})
export class GridAttendanceComponent  implements OnInit {
  @Input() list_data: any;
  @ViewChild('tableScroll') tableScroll: ElementRef | any;
  daysArray: any = []
  tableHeaders: any;
  total_count: any = 0;
  today: any;
  current_date: any;
  year: any;
  month: any;
  monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  skeletonLoad = true;
  attendanceDetails: any = [];
  loaderTable = [];
  loaderTableCount = [];
  page_length = 20;
  page_no = 1;
  searchFilter: any = {}
  search_filter: any = [];
  daysInMonth: any;
  employee_shift: any = [];
  skeletonDashboard: any;
  constructor(public db: DbService) { }

  ngOnInit() {
    this.skeletonLoad = true;
    this.skeletonDashboard = true;
    this.loaderTable.length = 30;
    this.loaderTableCount.length = 30;
    // this.total_count = 20;
    let splitDate = this.db.current_event_date.split('-')
    // console.log(splitDate)

    this.page_no = 1;

    this.initialCall()
    this.page_length  = 10;
    this.getSearchFilter();

    // console.log('search_filter',this.search_filter)
  }

  initialCall(){
    this.today = new Date();
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    // console.log(formattedDate);
    this.current_date = formattedDate;
    this.getMonthAndYear(year,month);
  }

  getMonthAndYear(year,month){
    this.year = year;
    this.month = this.monthNames[Number(month) - 1];
    this.getDaysArray(year, Number(month));
  }

  getDaysArray(year, month) {
    // Array to hold the result
    const daysArray:any = [{'title':'Employee Name'}];

    const daysInMonth = new Date(year, month, 0).getDate();
    this.daysInMonth = daysInMonth
    const daysOfWeek:any = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, (month - 1), day);
      const dayOfWeek = daysOfWeek[date.getDay()];
      const formattedDate = day.toString().padStart(2, '0');
      month = month.toString();
      month = month.length == 1 ? ('0' + month) :  month;
      let date1 = `${year}-${month}-${formattedDate}`;
      daysArray.push({ date: formattedDate, day: dayOfWeek, date_: date1});
    }

    daysArray.push({'title':'Total Days'});

    this.daysArray =  daysArray;
    this.tableHeaders =  this.daysArray;
    this.skeletonLoad = true;
    this.getDashboardDetails();
    this.getEmployeeDetails();
}

scrollTocenter(){
  setTimeout(()=>{
    // let data = 'Employee Name';
    const element = document.getElementById(this.current_date);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }else{
      let month:any = this.monthNames.findIndex(res=>{ return res == this.month });
      month = month + 1;
      month = month.toString();
      month = month.length == 1 ? ('0' + month) :  month;
      let date1 = `${this.year}-${month}-01`;
      const element1 = document.getElementById(date1);
      element1 ? element1.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }) : null;
    }
  },2000);
}

status = [
  { name: 'Present'},
  { name: 'Present'},
  { name: 'Absent'},
  { name: 'Present'},
  { name: 'On Leave'},
  { name: 'Absent'},
  { name: 'Present'},
  { name: 'Absent'},
  { name: 'On Leave'},
  { name: 'Absent'},
  { name: 'Present'},
  { name: 'Absent'},
  { name: 'On Leave'},
  { name: 'Absent'},
  { name: 'Present'},
  { name: 'Absent'},
  { name: 'Present'},
  { name: 'Absent'},
  { name: 'Present'},
  { name: 'On Leave'},
  { name: 'Absent'},
  { name: 'Present'},
  { name: 'Absent'},
  { name: 'On Leave'},
  { name: 'Absent'},
  { name: 'Present'},
  { name: 'Absent'},
  { name: 'Present'},
  { name: 'Absent'},
  { name: 'Present'},
  { name: 'On Leave'},
]

getColors(name){
  if(name == 'Present'){
    return { 'background': '#CDEADD' };
  }else if(name == 'Absent'){
    return { 'background': '#F5D0D2' };
  }else if(name == 'On Leave'){
    return { 'background': '#FFF1DB' };
  }else if(name == 'Half Day'){
    return { 'background': '#F7D2C4' };
  }else if(name == 'Work From Home'){
    return { 'background': '#F7D2E4' };
  }
}

getEmployeeDetails(){
  let findMonth = this.monthNames.findIndex(res => {return res == this.month})
  // console.log(findMonth)
  let data = {
    employee_filters:this.searchFilter,
    month_filters: {
        "month": findMonth + 1,
        "year": this.year
    },
    page_no: 1,
    page_length: this.page_length,
    order_by : "employee_name ASC"
  }
  this.db.get_employee_attendance_details(data).subscribe((res: any) => {
    this.skeletonLoad = false;
    // console.log(res)
    if(res && res.message && res.message.length != 0 && res.status == 'Success'){
      this.total_count = res.employee_count
      this.attendanceDetails = res.message
      this.scrollTocenter()
    }else{
      this.attendanceDetails = [];
    }
  }, error => {this.skeletonLoad = false;})
}

openTooltip(item){
  // console.log(item)
  item['enableToolTip'] = true;
}

sctollTo(direction: string, type, event:MouseEvent) {
  event.stopPropagation();

  const tableScrollElem = this.tableScroll.nativeElement;
  if (tableScrollElem) {
      if (direction === 'next') {
          tableScrollElem.scrollBy({ top: 0, left: 250, behavior: 'smooth' });
      } else {
          tableScrollElem.scrollBy({ top: 0, left: -250, behavior: 'smooth' });
      }
  }
  // el?.classList.add('sticky_head')
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
  this.plus_count += this.db.store_old_pagination ? this.db.store_old_pagination : 20;
  this.send_pagination_count(this.plus_count)
}

send_pagination_count(pagination) {
  this.page_no = 1
  this.page_length = pagination;
  this.getEmployeeDetails();
}

filterList(eve){
  // console.log(eve)

  let val = {};

  if(eve && eve.data){
    let keyValue: any = Object.keys(eve.data)

    if(keyValue && keyValue.length != 0){
      keyValue.map(resKey => {

        if(resKey == 'employee_name'){
          val[resKey] = ['Like', '%' + eve.data[resKey] + '%']
        }else{
          val[resKey] = eve.data[resKey]
        }
      })
    }

  }

  this.searchFilter = val;
  setTimeout(() => {
    this.getEmployeeDetails();
  },500)
}

getSearchFilter(){
  this.db.search_fields({ doctype: 'Employee' }).subscribe((res) => {
    if (res.status && res.status == 'failed') {
      this.search_filter = [];
    } else {
      this.search_filter = res['message'];
    }

  });
}

// employee_shift = [
//   {
//     icon: '/assets/timesheet/office-chair.svg',
//     percentage: '10',
//     label: 'No of Entries',
//     count: '1,450 - 1500'
//   },
//   {
//     icon: '/assets/timesheet/alert-diamond.svg',
//     percentage: '10',
//     label: 'No of Non Entries',
//     count: '50'
//   },
//   {
//     icon: '/assets/timesheet/beach.svg',
//     percentage: '10',
//     label: 'On leave',
//     count: '38'
//   }
// ]

icons = [
  '/assets/timesheet/office-chair.svg',
  '/assets/timesheet/alert-diamond.svg',
  '/assets/timesheet/beach.svg',
  '/assets/timesheet/alert-diamond.svg',
  '/assets/timesheet/office-chair.svg',
]

getDashboardDetails(){

  let findMonth = this.monthNames.findIndex(res => {return res == this.month})

  let data = {
    "dashboard_name": "Monthly Attendance Dashboard",
      "month_filters": {
      "month": findMonth + 1,
        "year": this.year
    }
  }
  this.db.get_dashboard_details(data).subscribe(res => {
    this.skeletonDashboard = false;
    // console.log(res)
    if(res && res.message && res.message.dashboard && res.message.dashboard.length != 0 && res.status == 'Success'){
      this.employee_shift = res.message.dashboard;

      this.employee_shift.map(resL => {
        if(resL.label && resL.label.includes('Total')){
          resL.label = resL.label.replace('Total', ' ')
        }
      })
    }else{
      this.employee_shift = [];
    }
  })

}

goToPreviousDay() {
  let year = this.year;
  let month = this.monthNames.findIndex((res)=>{ return res == this.month});
  let day = 1;
  
  if (month === 0) { // January case
    month = 11; // December
    year--; // Previous year
  } else {
    month--; // Previous month
  }
  
  // Handle the case where the previous month has fewer days than the current day
  const previousMonthDate = new Date(year, month, day);
  if (previousMonthDate.getMonth() !== month) {
    // This handles cases like moving from March 31 to February (which doesn't have 31 days)
    previousMonthDate.setDate(0); // Go to the last day of the previous month
  }

  this.year = year;
  this.month = this.monthNames[Number(month)];

  this.getDaysArray(this.year, (Number(month) + 1));
}

goToNextDay() {
    const today = new Date();
    const date = new Date(today);
    
    let year = this.year;
    let month = this.monthNames.findIndex((res)=>{ return res == this.month});
    let day = 1;
    
    // Calculate the next month
    if (month === 11) { // December case
      month = 0; // January
      year++; // Next year
    } else {
      month++; // Next month
    }
    
    // Handle the case where the next month has fewer days than the current day
    const nextMonthDate = new Date(year, month, day);
    if (nextMonthDate.getMonth() !== month) {
      // This handles cases like moving from January 31 to February (which doesn't have 31 days)
      nextMonthDate.setDate(0); // Go to the last day of the previous month
    }

    this.year = year;
    this.month = this.monthNames[Number(month)];

    this.getDaysArray(nextMonthDate.getFullYear(), Number(nextMonthDate.getMonth() + 1));
}

}

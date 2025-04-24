import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import {
  isSameDay,
  isSameMonth,
  format
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';


@Component({
  selector: 'app-holiday-lists',
  templateUrl: './holiday-lists.component.html',
  styleUrls: ['./holiday-lists.component.scss','../orders/orders.component.scss'],
})
export class HolidayListsComponent  implements OnInit {

  @Input() list_data:any;
  @Input() options:any;
  @Input() holiday_type:any;
  @Input() currentYear: any;
  @Input() currentMonth: any;

  @ViewChild('tabList') tabList: ElementRef | any;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  @Output() load_data = new EventEmitter();
  // @Output() holidaySearch = new EventEmitter();
  @Output() searchTxtValue = new EventEmitter();
  @Output() clear_txt = new EventEmitter();
  @Output() menu_name = new EventEmitter();
  @Output() menu_name_month = new EventEmitter();
  leaveIndicators:any=[];
  // skeleton:boolean=true;
  selectedSegment: any = "Calendar View";
  // currentYearValue: any;
  // currentMonthValue: any;
  // currentMonth: any;
  highlightedDates: any = [];
  constructor(public db:DbService) { }

  ngOnInit() {

    // const currentDate = new Date();
    // this.currentYearValue = currentDate.getFullYear(); // Returns the 4-digit year (e.g., 2024)
    // this.currentMonth = currentDate.getMonth()
    // const currentMonth = currentDate.getMonth() + 1; // Adding 1 to convert to 1-based index
    // this.currentMonthValue = currentMonth.toString().padStart(2, '0');
    // console.log('sd',this.db.monthLists[this.currentMonth].label);

    // console.log(this.currentYear,'currentYear');
    // console.log(this.currentMonth,'currentMonth');

    if(this.db.ismobile){
      this.selectedSegment = 'List View'
    }else{
      this.selectedSegment = "Calendar View"
    }

    this.generateHighlightedDates();
    
    if(this.list_data && (this.list_data.data && this.list_data.data.length > 0)){
      this.initiateLeaveIndicators(this.list_data.data)
      // console.log(this.list_data.data,'this.list_data.data')
      // this.skeleton = true
    }else{
      // this.skeleton = false
    }
    this.db.sendViewType.subscribe(res => {
      if(res){
        this.options[0].isActive = true;
      }
    })
  }

  ngOnChanges(changes: any){
    if(changes && changes['holiday_type'] && changes['holiday_type'].currentValue){
      this.holiday_type = changes['holiday_type'].currentValue
      // console.log(this.holiday_type,'this.holiday_type')
      if(this.holiday_type == 'Calendar'){
        this.generateHighlightedDates();
      }
    }

    if(changes && changes['list_data'] && changes['list_data'].currentValue){
      this.list_data = changes['list_data'].currentValue
      // console.log(this.list_data,'this.list_data')
      this.generateHighlightedDates();
    }

    if(changes && changes['currentYear'] && changes['currentYear'].currentValue){
      this.currentYear = changes['currentYear'].currentValue
      // console.log(this.currentYear,'this.currentYear')
    }

    if(changes && changes['currentMonth'] && changes['currentMonth'].currentValue){
      this.currentMonth = changes['currentMonth'].currentValue
      // console.log(this.currentMonth,'this.currentMonth')
    }
  }

  checkDateFormat(data,type){
    const date = new Date(data);
    const formattedDate = format(date, type == 'date' ? 'dd MMM yyyy' : 'EEEE');
    return formattedDate
  }


  activeDayIsOpen: boolean = true;
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

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    // this.handleEvent('Dropped or resized', event);
    // this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  
  initiateLeaveIndicators(data) {
    this.bindHolidays(data)
  }

  bindHolidays(data){
    data.map(res=>{
      let obj = {
        start: new Date(res.date),
        end: new Date(res.date),
        title: res.description,
        // color: { primary: '#e3bc08', secondary: '#FDF1BA' }
        color: { primary: 'rgb(4 142 255)', secondary: '#FDF1BA' }
      }

      this.leaveIndicators.push(obj)
    })

  }

  segmentOptions = [
    {name: 'Calendar View', value: 'Calendar View'},
    {name: 'List View', value: 'List View'}
  ]

  months = [
    { value: "January", name: "Jan", },
    { value: "February", name: "Feb" },
    { value: "March", name: "Mar" },
    { value: "April", name: "Apr" },
    { value: "May", name: "May" },
    { value: "June", name: "Jun" },
    { value: "July", name: "Jul" },
    { value: "August", name: "Aug" },
    { value: "September", name: "Sep" },
    { value: "October", name: "Oct" },
    { value: "November", name: "Nov" },
    { value: "December", name: "Dec" }
  ]

  menu_name_segment(seg){
    // console.log(seg)
    this.selectedSegment = seg.value
  }

  holidayListKey = [
    'description',
    'date',
    'day',
    'weekly_off',
    'name'
  ]

  changeCalendarMonth(viewDate){
    this.activeDayIsOpen = false;
    // console.log('viewDate',viewDate)
  }

  getHolidayIcon(item){
    if(item.label == 'Working Days'){
      return '/assets/Holiday-Page/WorkingDays.svg'
    }else if(item.label == 'Holidays'){
      return '/assets/Holiday-Page/Holidays.svg'
    }
  }

  getBoxColor(item){
    if(item.label == 'Working Days'){
      return '#E7F8ED'
    }else if(item.label == 'Holidays'){
      return '#E9F7FB'
    }
  }

  generateHighlightedDates() {

    const holidayDates: any = [];
    const weekoffDates: any = [];

    if(this.list_data && this.list_data.all_list && this.list_data.all_list.length != 0){
      
      this.list_data.all_list.map((record: any) => {
        // switch (record.status) {
        //   case 'Saturday':
        //   case 'Sunday':
        //     holidayDates.push(record.attendance_date);
        //     break;
        //   case 'Saturday':
        //   case 'Sunday':
        //     weekoffDates.push(record.attendance_date);
        //     break;
        // }
        if(record.day == 'Saturday' || record.day == 'Sunday'){
          weekoffDates.push(record.date);
        }else{
          holidayDates.push(record.date);
        }
      });
    }
    
    const dynamicGreenDates = holidayDates;
    const dynamicRedDates = weekoffDates;

    this.highlightedDates = [
      ...dynamicGreenDates.map(date => ({
        date,
        textColor: '#000',
        backgroundColor: '#a2cdff',
      })),
      ...dynamicRedDates.map(date => ({
        date,
        textColor: '#000',
        backgroundColor: '#ecf0ed',
      })),
    ];

    this.db.highlightedDates = this.highlightedDates
    this.db.monthChange.next('success')

    // console.log(this.list_data.data,'this.list_data.data')
    // console.log(this.highlightedDates,'this.highlightedDates');
    // console.log(this.db.highlightedDates,'this.db.highlightedDates')
  }

  changeMonthCal(event){
    // console.log(event,'event')
    let month = event.detail.value.split('-')[1]
    this.db.selectedMonth = Number(month);
    this.db.selected_year = true;
    this.db.selectedYearSubject.next(this.db.selectedMonth);
  }

}

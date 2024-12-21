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
  constructor(public db:DbService) { }

  ngOnInit() {
    // console.log('sd',this.list_data);

    if(this.db.ismobile){
      this.selectedSegment = 'List View'
    }else{
      this.selectedSegment = "Calendar View"
    }
    
    if(this.list_data && (this.list_data.data && this.list_data.data.length > 0)){
      this.initiateLeaveIndicators(this.list_data.data)
      console.log(this.list_data.data,'this.list_data.data')
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
      console.log(this.holiday_type,'this.holiday_type')
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
    console.log('viewDate',viewDate)
  }

}

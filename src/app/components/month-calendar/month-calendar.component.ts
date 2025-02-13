import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, HostListener } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
@Component({
  selector: 'app-month-calendar',
  templateUrl: './month-calendar.component.html',
  styleUrls: ['./month-calendar.component.scss'],
})
export class MonthCalendarComponent implements OnInit, OnDestroy {
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  daysOfWeek: any[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  years: any;
  currentMonth: number;
  currentYear: number;
  days: any[] = [];
  selectedDateTime: any;
  @Input() highlightedDates: any
  @Output() onChange = new EventEmitter()
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  slideDirection: 'left' | 'right' | null = null;
  constructor(public db: DbService) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.selectedDateTime = this.dateFormat1(today)
    this.generateYears();
    this.generateDays();
  }

  ngOnInit() {
    const today = new Date();
    this.selectedDateTime = this.dateFormat1(today)

    this.db.monthChange.subscribe(res=>{
      if(res == 'success'){
        this.generateDays()
      }
  })

  // console.log(this.highlightedDates,'this.highlightedDates');
  // console.log(this.db.highlightedDates,'this.db.highlightedDates')
  }

  dateFormat1(date) {


    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(d.getDate()).padStart(2, '0');
    // if (this.web_form && !this.selectedDate) {
    //   // return "yyyy/mm/dd"
    //   this.selectedHour = d.getHours()
    //   this.selectedMinute = String(d.getMinutes())
    //   this.selectedPeriod = 'AM'
    // }
    const format = `${year}/${month}/${day}`

    return format;
  }

  ngOnDestroy() {
    this.db.highlightedDates = []
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe(): void {
    const swipeThreshold = 50; // Minimum distance in pixels for a swipe
    const swipeDistance = this.touchEndX - this.touchStartX;

    if (swipeDistance > swipeThreshold) {
      // Swipe right (previous month)
      this.changeMonth(-1);
    } else if (swipeDistance < -swipeThreshold) {
      // Swipe left (next month)
      this.changeMonth(1);
    }
  }

  resetAnimation(): void {
    this.slideDirection = null;
  }

  changeMonth(direction: number) {
    this.slideDirection = direction > 0 ? 'left' : 'right';
    this.currentMonth += direction;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }

    let param = {
      "detail": {
        "value": `${this.currentYear + "-" + (this.currentMonth + 1)}`
      }
    }

    this.onChange.emit(param)
    // console.log(param,"this.param")

    this.generateDays();
  }

  // generateDays() {
  //   const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
  //   const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

  //   this.days = Array.from({ length: daysInMonth }, (_, i) => {
  //     const dayDate = new Date(this.currentYear, this.currentMonth, i + 1);

  //     return { day: i + 1 };
  //   });

  //   for (let i = 0; i < firstDay; i++) {
  //     this.days.unshift(null); // Padding for days before the first day of the month
  //   }

  // }

  generateDays() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    // Map styles from the provided `date` array
    const dateStyles = this.db.highlightedDates.reduce((acc, item) => {
      const dayDate = new Date(item.date);
      const key = `${dayDate.getFullYear()}-${dayDate.getMonth()}-${dayDate.getDate()}`;
      acc[key] = { color: item.textColor, backgroundColor: item.backgroundColor };
      return acc;
    }, {});

    // Generate days with styles
    this.days = Array.from({ length: daysInMonth }, (_, i) => {
      const dayDate = new Date(this.currentYear, this.currentMonth, i + 1);
      const key = `${dayDate.getFullYear()}-${dayDate.getMonth()}-${dayDate.getDate()}`;
      return {
        day: i + 1,
        styles: dateStyles[key] || {}, // Apply styles if available, otherwise empty
      };
    });

    for (let i = 0; i < firstDay; i++) {
      this.days.unshift(null); // Padding for days before the first day of the month
    }

    // console.log(this.days,"this.days")
  }



  isSelected(day: number) {
    // console.log(day,"day")
    this.selectedDateTime = new Date(this.selectedDateTime)
    // console.log(this.selectedDateTime,"this.selectedDateTime")
    // console.log(this.selectedDateTime.getDate(),"this.selectedDateTime.getDate()")

    return this.selectedDateTime && (this.selectedDateTime.getDate()) == day &&
      this.selectedDateTime.getMonth() == this.currentMonth &&
      this.selectedDateTime.getFullYear() == this.currentYear;

  }

  isTimeSelected(day: number) {

    return this.isSelected(day);
  }

  generateYears() {
    const minYear = this.currentYear - 50;
    const maxYear = this.currentYear + 50;
    this.years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
      const year = minYear + i;
      return { year };
    });
  }

  // selectDate(dayObj: { day: number; isDisabled: boolean }) {
  //   if (dayObj && !dayObj.isDisabled) {
  //     const { day } = dayObj;
  //     const date = new Date(this.currentYear, this.currentMonth, day);
  //     const hours = this.selectedPeriod === 'PM' && this.selectedHour !== 12 ? this.selectedHour + 12 : this.selectedHour;
  //     date.setHours(hours);
  //     date.setMinutes(parseInt(this.selectedMinute, 10));
  //     this.selectedDateTime = this.dateFormat(date);

  //     if (this.format !== 'Date and Time') {
  //       this.onChange.emit({ value: this.selectedDateTime })
  //       this.show_cal = false;
  //     }
  //   }
  // }
}

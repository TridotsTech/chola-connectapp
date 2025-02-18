import { Component, OnInit, Input, HostListener, ElementRef, Output, EventEmitter,OnChanges, SimpleChanges } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-custom-calendar',
  templateUrl: './custom-calendar.component.html',
  styleUrls: ['./custom-calendar.component.scss'],
})
export class CustomCalendarComponent implements OnInit {

  @Input() format: any = "Date and Time";
  @Input() selectedDate: any;
  @Input() web_form: any;
  @Input() each: any;
  @Input() read_only: any;
  @Input() field_name: any;
  @Input() table: any;
  @Input() task_form: any;
  @Input() minValue: any; // Minimum allowed date
  @Input() maxValue: any; // Maximum allowed date
  @Output() onChange = new EventEmitter()
  @Output() pick_date = new EventEmitter()

  show_cal = false

  currentMonth: number;
  currentYear: number;
  days: any[] = [];
  selectedDateTime: any = null;
  // selectedDateTime: Date | any = "dd/mm/yyyy";

  selectedHour: number = 12;
  selectedMinute: string = '00'; // Default as string to keep '00' format
  selectedPeriod: string = 'AM';

  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  daysOfWeek: any[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hours: any[] = Array.from({ length: 12 }, (_, i) => i + 1);
  minutes: any[] = Array.from({ length: 60 }, (_, i) => i < 10 ? '0' + i : i.toString());
  years: any;
  constructor(private elRef: ElementRef, public db: DbService) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateYears();
    this.generateDays();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate']) {
      if (this.selectedDate) {
        this.selectedDateTime = this.dateFormat1(this.selectedDate)
        let sel_date = new Date(this.selectedDateTime)
        this.currentMonth = sel_date.getMonth();
        this.currentYear = sel_date.getFullYear();
        this.generateDays();
        this.extractTime(this.selectedDate, 'init')
      }
      // console.log('Input data has changed:', changes['selectedDate'].currentValue);
    }
  }

  ngOnInit() {
      // console.log(this.minValue)

    // console.log(this.selectedDate)
    if (this.selectedDate) {
      this.selectedDateTime = this.dateFormat1(this.selectedDate)
      let sel_date = new Date(this.selectedDateTime)
      this.currentMonth = sel_date.getMonth();
      this.currentYear = sel_date.getFullYear();
      this.generateDays();
      this.extractTime(this.selectedDate, 'init')
    } else {
      let date = new Date()

      this.extractTime(date, 'init')
    }

    if (this.minValue || this.maxValue) {
      this.generateYears();
      this.generateDays();
    }

    if (this.table) {
      this.extractTime(this.selectedDate, 'init')
    }
  }

  changeMonth(direction: number) {
    this.currentMonth += direction;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateDays();
  }

  generateDays() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    const minDate = this.minValue ? new Date(this.minValue) : null;
    const maxDate = this.maxValue ? new Date(this.maxValue) : null;

    this.days = Array.from({ length: daysInMonth }, (_, i) => {
      const dayDate = new Date(this.currentYear, this.currentMonth, i + 1);
      const isDisabled = (minDate && dayDate < minDate) || (maxDate && dayDate > maxDate);
      return { day: i + 1, isDisabled };
    });

    for (let i = 0; i < firstDay; i++) {
      this.days.unshift(null); // Padding for days before the first day of the month
    }

  }

  selectDate(dayObj: { day: number; isDisabled: boolean }) {
    if (dayObj && !dayObj.isDisabled) {
      const { day } = dayObj;
      const date = new Date(this.currentYear, this.currentMonth, day);
      const hours = this.selectedPeriod === 'PM' && this.selectedHour !== 12 ? this.selectedHour + 12 : this.selectedHour;
      date.setHours(hours);
      date.setMinutes(parseInt(this.selectedMinute, 10));
      this.selectedDateTime = this.dateFormat(date);

      if (this.format !== 'Date and Time') {
        let obj = {}
        if (this.web_form && this.each) {
          obj = {
            value: this.selectedDateTime,
            each: this.each
          }
        } else {
          obj = {
            value: this.selectedDateTime,
          }
        }

        if (this.field_name) {
          obj['field_name'] = this.field_name
        }

        this.onChange.emit(obj)
        this.show_cal = false;
      }
    }
  }

  isSelected(day: number) {
    if (this.selectedDateTime) {
      this.selectedDateTime = new Date(this.selectedDateTime)
      let val = this.selectedDateTime && (this.selectedDateTime.getDate()) == day &&
        this.selectedDateTime.getMonth() == this.currentMonth &&
        this.selectedDateTime.getFullYear() == this.currentYear;
      this.selectedDateTime = this.dateFormat1(this.selectedDateTime)

      return val
    } else {

      let date = new Date()
      let val = date && (date.getDate()) == day &&
        date.getMonth() == this.currentMonth &&
        date.getFullYear() == this.currentYear;

      return val
    }
  }

 
  isTimeSelected(day: number) {
    return this.isSelected(day);
  }

  submit() {
    if (this.selectedDateTime) {
      this.selectedDateTime = this.dateFormat(this.selectedDateTime)
    } else {
      this.selectedDateTime = this.dateFormat(new Date())
    }

    let obj = {}
    if (this.table) {
      obj = {
        item: this.each.item,
        index: this.each.index,
        value: this.selectedDateTime
      }
    } else if (this.web_form) {
      obj = {
        value: this.selectedDateTime,
        each: this.each
      }
    } else {
      obj = {
        value: this.selectedDateTime
      }
    }
    this.onChange.emit(obj)
    this.show_cal = false
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.show_cal = false;
    }
  }

  dateFormat(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(d.getDate()).padStart(2, '0');
    const format = this.format == 'Date and Time' ? `${year}-${month}-${day} ${this.selectedHour < 10 ? "0" + this.selectedHour : this.selectedHour}:${this.selectedMinute} ${this.selectedPeriod}` : `${year}-${month}-${day}`

    return format;
  }

  dateFormat1(date) {


    if (date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(d.getDate()).padStart(2, '0');

      const format = this.format == 'Date and Time' ? `${year}/${month}/${day} ${this.selectedHour < 10 ? "0" + this.selectedHour : this.selectedHour}:${this.selectedMinute} ${this.selectedPeriod}` : `${year}/${month}/${day}`
      return format;
    } else {
      return "yyyy / mm / dd"
    }
  }

  generateYears() {

    const minYear = this.minValue ? new Date(this.minValue).getFullYear() : this.currentYear - 50;
    const maxYear = this.maxValue ? new Date(this.maxValue).getFullYear() : this.currentYear + 50;

    this.years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
      const year = minYear + i;
      const isDisabled = (this.minValue && year < new Date(this.minValue).getFullYear()) ||
        (this.maxValue && year > new Date(this.maxValue).getFullYear());
      return { year, isDisabled };
    });

  }

  onMonthYearChange() {
    this.generateDays();
  }

  togglePicker(e) {
    // e.stopPropagation()

    if (this.web_form && this.each && this.each.read_only == 1) {

    } else {
      this.show_cal = this.show_cal ? false : true;

      if (this.show_cal) {
        setTimeout(() => this.adjustCalendarPosition(), 0); // Wait for the calendar to render
      }
    }
  }

  async dateChange(e) {
    e.stopPropagation()
    // console.log(e,"e")
    let obj = {}
    if (this.table) {
      await this.extractTime(e.target.value, 'change')
      this.selectedDateTime = await this.dateFormat(e.target.value)
      obj = {
        item: this.each.item,
        index: this.each.index,
        value: this.selectedDateTime
      }
    } else if (this.web_form && this.each) {
      await this.extractTime(e.target.value, 'change')
      this.selectedDateTime = await this.dateFormat(e.target.value)
      obj = {
        value: this.selectedDateTime,
        each: this.each
      }
    } else {
      obj = {
        value: this.dateFormat(e.target.value)
      }
    }

    this.onChange.emit(obj)

    if (e.target.value) {
      // this.selectedDateTime = this.dateFormat(e.target.value)
    } else {
      this.selectedDateTime = "yyyyy/mm/dd"
    }
  }

  extractTime(dateInput, type) {
    if (dateInput) {
      const date = new Date(dateInput); // Convert input to Date object

      let hours = date.getHours(); // Get hours in 24-hour format
      const minutes = type == 'init' ? date.getMinutes().toString().padStart(2, '0') : date.getMinutes().toString(); // Get minutes
      const period = hours >= 12 ? 'PM' : 'AM'; // Determine AM/PM


      // Convert to 12-hour format
      hours = hours % 12 || 12; // Adjust 0 hours to 12 for 12-hour format
      this.selectedHour = hours
      this.selectedMinute = minutes
      this.selectedPeriod = period
      // return { hours, minutes, period };
    }
  }

  adjustCalendarPosition() {
    const calendarElement = document.querySelector('.calendar-picker') as HTMLElement;
    if (!calendarElement) return;

    const boundingRect = calendarElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust if the calendar is overflowing horizontally
    if ((boundingRect.right - 15) > viewportWidth) {
      // calendarElement.style.left = `${viewportWidth - boundingRect.width}px`;
      calendarElement.style.right = this.db.ismobile ? '20px' : `75px`;
    }

    if (boundingRect.left < 0) {
      calendarElement.style.left = `0px`;
    }

    // Adjust if the calendar is overflowing vertically
    // if (boundingRect.bottom > viewportHeight ) {
    if (boundingRect.bottom > viewportHeight && !((boundingRect.right - 40) > viewportWidth)) {
      // calendarElement.style.top = `${viewportHeight - boundingRect.height - 10}px`; // Add some padding
      // calendarElement.style.top = `0px`; // Add some padding
    }

    if (boundingRect.top < 0) {
      calendarElement.style.top = `10px`; // Add some padding
    }
  }


  enableStart() {
    this.pick_date.emit({ field: this.field_name })
  }
}

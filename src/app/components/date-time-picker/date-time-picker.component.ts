import { Component, OnInit, Input } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
})
export class DateTimePickerComponent  implements OnInit {
@Input() dateTime: any;
  selectedDateTime:  any = '';
  showPicker: any = false;
  currentMonth: any;
  currentYear: any;
  daysOfWeek: any[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDates: { date: any; isCurrentMonth: any }[] = [];
  selectedDay: any;
  selectedHour: any = new Date().getHours();
  selectedMinute: any = new Date().getMinutes();

  private date = new Date();

  constructor(public db: DbService) { }

  ngOnInit() {
    this.selectedDateTime = this.db.current_event_date
    let splitDate = this.db.current_event_date.split('-')
    this.selectedDay = splitDate[2]
    this.currentMonth = this.getMonthName(this.date.getMonth());
    this.currentYear = this.date.getFullYear();
    this.buildCalendar();
  }

  togglePicker() {
    this.showPicker = !this.showPicker;
  }

  buildCalendar() {
    const firstDayOfMonth = new Date(this.currentYear, this.date.getMonth(), 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.date.getMonth() + 1, 0).getDate();
    this.calendarDates = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      this.calendarDates.push({ date: null, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDates.push({ date: i, isCurrentMonth: true });
    }
  }

  selectDate(date: { date: any; isCurrentMonth: any }) {
    if (date.isCurrentMonth) {
      this.selectedDay = date.date;
      this.updateDateTime();
    }
  }

  prevMonth() {
    this.date.setMonth(this.date.getMonth() - 1);
    this.currentMonth = this.getMonthName(this.date.getMonth());
    this.currentYear = this.date.getFullYear();
    this.buildCalendar();
  }

  nextMonth() {
    this.date.setMonth(this.date.getMonth() + 1);
    this.currentMonth = this.getMonthName(this.date.getMonth());
    this.currentYear = this.date.getFullYear();
    this.buildCalendar();
  }

  getMonthName(monthIndex: any) {
    return new Date(0, monthIndex).toLocaleString('en-US', { month: 'long' });
  }

  changeHour(amount: any) {
    this.selectedHour = (this.selectedHour + amount + 24) % 24;
    this.updateDateTime();
  }

  changeMinute(amount: any) {
    this.selectedMinute = (this.selectedMinute + amount + 60) % 60;
    this.updateDateTime();
  }

  updateDateTime() {
    if (this.selectedDay !== undefined) {
      const date = new Date(this.currentYear, this.date.getMonth(), this.selectedDay, this.selectedHour, this.selectedMinute);
      // this.selectedDateTime = `${this.currentYear}-${this.date.getMonth() + 1}-${this.selectedDay} ${this.selectedHour}:${this.selectedMinute}`;
      this.selectedDateTime = `${this.currentYear}-${this.date.getMonth() + 1}-${this.selectedDay}`;
      this.togglePicker();
    }
  }

}

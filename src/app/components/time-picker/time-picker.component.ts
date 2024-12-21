import { Component, OnInit, Input, HostListener, ElementRef, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent implements OnInit, OnChanges {
  @Input() selectedTime: any;
  @Input() each: any = {};
  @Output() onChange = new EventEmitter()
  hours = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
  }));

  minutes = Array.from({ length: 60 }, (_, i) => ({
    value: i,
  }));

  type = [{ value: "AM" }, { value: "PM" }]
  show_picker: boolean = false
  selectedHr: any = '12'
  selectedMin: any = '0'
  selectedType: any = 'AM'


  constructor(private elRef: ElementRef, public db: DbService) { }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['selectedTime'] && changes['selectedTime'].currentValue) {
      this.setDefValues(changes['selectedTime'].currentValue)
    } else {
      this.setDefValues(new Date())
    }
  }

  ngOnInit() {
    this.setDefValues(this.selectedTime ? this.selectedTime : new Date())
  }

  setDefValues(date) {
    const now = new Date(date);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    this.selectedHr = this.hours.find(h => h.value === (currentHour % 12 || 12))?.value || '';
    this.selectedMin = this.minutes.find(m => m.value === currentMinute)?.value || '';
    this.selectedType = currentHour >= 12 ? 'PM' : 'AM';
  }

  setHours(val) {
    this.selectedHr = val > 9 ? val : String(val).padStart(2, "0");
    this.selectedMin = this.minutes[0]['value']
    let el = document.getElementById('min0')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }

    let el1 = document.getElementById(`${val}`)
    el1 ? el1.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }) : null;
  }

  selectMinute(minute: any) {
    this.selectedMin = minute > 9 ? minute : String(minute).padStart(2, '0');
    let el = document.getElementById(`min${minute}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
  }

  selectType(type: any) {
    this.selectedType = type;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Check if the clicked element is outside the calendar picker
    if (this.show_picker && !this.elRef.nativeElement.contains(event.target)) {
      this.show_picker = false;
      let obj = {
        value: this.dateFormat(new Date()),
        // value: `${this.selectedHr}:${this.selectedMin} ${this.selectedType}`,
        ...this.each
      }
      // console.log(obj,"obj")
      this.onChange.emit(obj)
    }
  }

  togglePicker() {
    this.show_picker = !this.show_picker

    setTimeout(() => {
      if (this.show_picker) {
        let el = document.getElementById(`${this.selectedHr}`)
        el ? el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' }) : null;

        let el1 = document.getElementById(`min${this.selectedMin}`)
        el1 ? el1.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' }) : null;
      }
    }, 500);


    setTimeout(() => {
      this.adjustCalendarPosition()
    }, 0);
  }

  adjustCalendarPosition() {
    const calendarElement = document.querySelector('.timepicker_div') as HTMLElement;
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


  dateFormat(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(d.getDate()).padStart(2, '0');
    const format = `${year}-${month}-${day} ${this.selectedHr < 10 ? "0" + this.selectedHr : this.selectedHr}:${this.selectedMin ? this.selectedMin : "0"} ${this.selectedType}`

    return format;
  }
}


import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-month-year-picker',
  templateUrl: './month-year-picker.component.html',
  styleUrls: ['./month-year-picker.component.scss'],
})
export class MonthYearPickerComponent implements OnInit {
  @Input() startYear: number = 2000; // Default start year
  @Input() selectDate: any; // Default start year
  @Input() endYear: number = this.startYear + 50; // Default end year
  @Output() dateChange = new EventEmitter<any>();
  // @Output() dateChange = new EventEmitter<{ year: number; month: number }>();
  years: number[] = [];
  months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ];

  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;
  visible: boolean = false;
  @ViewChild('yearMonthPicker') yearMonthPicker!: ElementRef;
  constructor(public db: DbService,private elRef: ElementRef) { }

  ngOnInit(): void {
    this.years = Array.from(
      { length: this.endYear - this.startYear + 1 },
      (_, index) => this.startYear + index
    );

    if (this.selectDate) {
      this.pickerFormat(this.selectDate)
      let date = new Date(this.selectDate)
      this.selectedYear = date.getFullYear();
      this.selectedMonth = date.getMonth() + 1;


    }
  }

  onChange(val, type): void {
    // console.log(val, "value")

    if (type == 'month') {
      this.selectedMonth = val.value
    } else {
      this.selectedYear = val
    }
    // this.dateChange.emit({ year: this.selectedYear, month: this.selectedMonth });
  }

  togglePicker(e) {
    e.stopPropagation();
    this.visible = !this.visible

    if(this.visible){
      setTimeout(() => {
        let yr = document.getElementById(String(this.selectedYear))
        let mn = document.getElementById(String(this.selectedMonth))
  
        yr ? yr.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }) : null
        mn ? mn.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }) : null
      }, 0)
    }
  }

  hideDiv() {
    this.visible = false;
  }

  pickerFormat(value) {
    console.log(value, "value")
  }


  submit() {
    if (this.selectedYear && this.selectedMonth) {

      // event.detail.value
      let date = `${this.selectedYear}-${this.selectedMonth}`
      let values = {
        detail:{
          value: date
        }
      }
      this.dateChange.emit(values)
      // this.dateChange.emit({ year: this.selectedYear, month: this.selectedMonth })
      this.hideDiv()
    } else if (!this.selectedMonth) {
      this.db.alert('Please select month')
    } else if (!this.selectedYear) {
      this.db.alert('Please select year')
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Check if the clicked element is outside the calendar picker
    if (this.yearMonthPicker && !this.yearMonthPicker.nativeElement.contains(event.target)) {
      // if (!this.elRef.nativeElement.contains(event.target)) {
      this.hideDiv()
    }
  }
}

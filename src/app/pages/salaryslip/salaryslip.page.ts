import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-salaryslip',
  templateUrl: './salaryslip.page.html',
  styleUrls: ['./salaryslip.page.scss'],
})
export class SalaryslipPage implements OnInit {
  yearList:any = [];
  yearLists:any = [];
  selectedYear: any;
  selectedMonth: any;
  constructor(public db: DbService) { }

  ngOnInit() {
    const date = new Date();
    let selectedMonth = date.getMonth() + 1;
    this.selectedMonth = this.db.monthLists[selectedMonth].name

    this.selectedYear = new Date().getFullYear();
    const endYear = this.db.employee_img.date_of_joining ? new Date(this.db.employee_img.date_of_joining).getFullYear() : 1980;

    for (let year = this.selectedYear; year >= endYear; year--) {
      this.yearList.push({name:year,isActive: (this.selectedYear == year) ? true : false})
    }
    this.yearLists = this.yearList
  }

}

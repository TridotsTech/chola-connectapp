import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NewWizardFormComponent } from '../../forms/new-wizard-form/new-wizard-form.component';
import { DbService } from 'src/app/services/db.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-salary-slip-detail',
  templateUrl: './salary-slip-detail.component.html',
  styleUrls: ['./salary-slip-detail.component.scss'],
})
export class SalarySlipDetailComponent implements OnInit {
  @Input() detail_route_name: any
  @Input() load_name: any
  @Input() doc_type: any
  @Input() current_navigation_tab: any
  @Output() call = new EventEmitter();
  @Output() openWhatsApp = new EventEmitter();
  @ViewChild(NewWizardFormComponent) render_wizardform: NewWizardFormComponent | any;
  employeeDetail: any
  button_loader = false;
  forms_route: any = 'salary-slip-detail';
  skeleton = false;
  segment_name: any;
  constructor(public db: DbService, private router: Router, private location: Location) { }

  ngOnInit() {
    if (this.current_navigation_tab) {
      this.segment_name = this.current_navigation_tab
    } else {
      this.segment_name = 'Details';
    }
    this.get_employee_detail(this.load_name)
  }
  total_earnings: any;
  total_salary: any;
  total_deductions: any;

  get_employee_detail(detail_name) {
    this.skeleton = true;
    let data = {
      doctype: this.doc_type,
      name: detail_name
    }
    this.db.doc_detail(data).subscribe(res => {
      this.skeleton = false;
      if (res && res.message && res.message.length != 0) {
        this.employeeDetail = res.message[1]
        if (this.employeeDetail.end_date) {
          const dateString = this.employeeDetail.end_date;
          const date = new Date(dateString);
          const monthIndex = date.getMonth();
          const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          const monthName = monthNames[monthIndex];
          this.employeeDetail.title = 'Salary slip (' + monthName + ')'
        }
        this.render_wizardform ? this.render_wizardform.ngOnInit() : null;
      }
      if (this.employeeDetail) {
        this.employeeDetail.earnings.map(ear_res => {
          this.total_earnings = this.total_earnings + ear_res.amount
        })
        // console.log(this.total_earnings)
        this.employeeDetail.deductions.map(ded_res => {
          this.total_deductions = this.total_deductions + ded_res.amount
        })
        // console.log(this.total_deductions)
        this.total_salary = this.total_salary + (this.total_earnings + this.total_deductions)
        // console.log(this.total_salary)
      }
    }, error => { this.skeleton = false; })
  }

  close_detail() {
    this.db.full_width = false;
    let currentUrl = this.router.url;
    let urls = currentUrl.split('/');
    if (urls && urls.length == 4) {
      currentUrl = urls[1] + '/' + urls[2];
    }
    this.db.enable_material = false;
    this.db.selected_list.page = 'Salary Slip'
    // window.history.pushState('', '', currentUrl + '/' + data.name);
    this.location.replaceState(currentUrl);
    this.db.detail_route_bread = "";
  }

  getDateDifference(startDate: Date) {
    const endDate = new Date(); // Current date

    const start = new Date(startDate);
    const end = new Date(endDate);

    let yearsDiff = end.getFullYear() - start.getFullYear();
    let monthsDiff = end.getMonth() - start.getMonth();

    // Adjusting months and years if necessary
    if (monthsDiff < 0) {
      yearsDiff--;
      monthsDiff += 12;
    }

    return `${yearsDiff} Year, ${monthsDiff} months`;
  }

  async next_doc(name) {
    this.button_loader = true;

    let data = {
      "doctype": this.doc_type,
      "value": this.employeeDetail.name,
      "filters": [],
      "prev": name
    }
    this.db.next_doc(data).subscribe(res => {
      if (res && res.status && res.status == 'Success') {
        localStorage['selected_project_id'] = res.message
        this.get_employee_detail(res.message)

        let currentUrl = this.router.url;
        let urls = currentUrl.split('/');
        if (urls && urls.length == 4) {
          currentUrl = urls[1] + '/' + urls[2];
        }
        window.history.pushState('', '', currentUrl + '/' + res.message);
        this.location.replaceState(currentUrl + '/' + res.message);
        this.db.detail_route_bread = res.message;
      } else {
        this.db.alert('No Further Records')
      }
      this.button_loader = false;
    }, error => { this.button_loader = false; })
  }

  save_details() {
    this.render_wizardform ? this.render_wizardform.save_details1('save') : null;
  }

  download_payroll() {

    let url = this.db.baseUrl + `printview?doctype=Salary%20Slip&name=${this.load_name}&format=Salary%20Slip%20Standard&no_letterhead=0&letterhead=Tridots&settings=%7B%7D&_lang=en`
    window.open(url, '_blank');
  }
}

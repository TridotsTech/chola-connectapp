import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.page.html',
  styleUrls: ['./leave-request.page.scss'],
})
export class LeaveRequestPage implements OnInit {

  data:any;
  emp_detail:any;

  constructor(public db:DbService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((res:any) => {
      if(res && res.id){
        this.leave_details(res.id);
      }
    })
  }


  leave_details(id) {
    let data = {
      doctype: "Compensatory Leave Request",
      name: id
    }

    this.db.doc_detail(data).subscribe(res => {
      if (res && res.message && res.message.length != 0 && res.message[0].status == "Success") {
        this.data = res.message[1];
        this.get_employee_details(this.data.employee)
      } else {
        this.data = undefined;
      }
    })
  }


  
  get_employee_details(name) {
    let data = {
      doctype: "Employee",
      name: name
    }

    this.db.doc_detail(data).subscribe(res => {
      if (res && res.message && res.message.length != 0 && res.message[0].status == "Success") {
        this.emp_detail = res.message[1]
      }
    })
  }

  leave_confirms(){
    let data:any = JSON.stringify(this.data);
    data = JSON.parse(data);
    data.docstatus = 1;
    this.db.inset_docs({ data: data}).subscribe((res) => {
      if (res && res.message && res.message.status == 'Success') {
        
      }else {
        if (res._server_messages) {
          var d = JSON.parse(res._server_messages);
          var d1 = JSON.parse(d);
          this.db.sendErrorMessage(this.stripHtmlTags(d1.message));
        } else {
          let alert = (res && res.message && res.message.message) ? res.message.message : 'Something went wrong try again later'
          this.db.sendErrorMessage(alert);
          // this.db.alert_animate.next(alert);
        }
      }
    },error=>{
      this.db.alert('Something went wrong try again later');
    })
  }

  
  stripHtmlTags(htmlString: string): string {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
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

    return `${yearsDiff} yr, ${monthsDiff} mn`;
  }

}

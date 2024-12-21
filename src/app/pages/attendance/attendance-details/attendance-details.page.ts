import { Component, OnInit } from '@angular/core';
import { DbService } from '../../../services/db.service';
import { Router, ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-attendance-details',
  templateUrl: './attendance-details.page.html',
  styleUrls: ['./attendance-details.page.scss'],
})
export class AttendanceDetailsPage implements OnInit {
  attendance_field_details : any = [];
  constructor(public db : DbService,public route: ActivatedRoute) {
    this.route.params.subscribe((res) => {
      this.get_attendance_form(res['id'])
    })
   }

  ngOnInit() {
  }

  get_attendance_form(id){
    let data = {
      doctype : "Attendance",
      name : id
    }
  
    this.db.doc_detail(data).subscribe( (res : any) => {
      // console.log(res)
      this.attendance_field_details = res.message[1];
      if(this.attendance_field_details && this.attendance_field_details.late_entry == 1){
        return this.attendance_field_details.late_entry = "Yes"
      }
      else if(this.attendance_field_details && this.attendance_field_details.early_exit == 1){
        return this.attendance_field_details.early_exit = "Yes"
      }
    })
  }

}

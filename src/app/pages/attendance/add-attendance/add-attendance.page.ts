import { Component, OnInit } from '@angular/core';
import { DbService } from '../../../services/db.service';

@Component({
  selector: 'app-add-attendance',
  templateUrl: './add-attendance.page.html',
  styleUrls: ['./add-attendance.page.scss'],
})
export class AddAttendancePage implements OnInit {
  // attendance_field : any
  constructor(public db : DbService) { }

  ngOnInit() {
  }


  // get_attendance_form(){
  //   this.db.add_attendance().subscribe( (res : any) => {
  //     console.log(res.data)
  //     this.attendance_field = res.data
  //   })
  // }
}

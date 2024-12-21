import { Component, OnInit } from '@angular/core';
import { DbService } from '../../../services/db.service';

@Component({
  selector: 'app-attendance-checkin',
  templateUrl: './attendance-checkin.page.html',
  styleUrls: ['./attendance-checkin.page.scss'],
})
export class AttendanceCheckinPage implements OnInit {
  // attendance_check : any
  constructor(public db : DbService) { }

  ngOnInit() {
  }

  // get_attendance_check(){
  //   this.db.add_attendance_check().subscribe( (res : any) => {
  //     console.log(res.data)
  //     this.attendance_check = res.data
  //   })
  // }

}

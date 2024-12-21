import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  constructor(public db: DbService,private router: Router) { }

  ngOnInit() {
    this.db.get_notification_list()
  }

  load_data(eve){
    console.log(eve)
  }

  go_to_details(data){
    if(data && data.hd_ticket_id){
      // console.log(data.hd_ticket_id)
      if(!this.db.ismobile){
        this.db.enable_detail = true;
        this.db.hd_ticket_show = true;
        // this.db.get_all_conversation(data.hd_ticket_id)
        this.db.profile_side_menu = true;
        this.db.mail_send_to = data.hd_ticket_id
        this.router.navigateByUrl('/list/hd-ticket')
      }else{
        this.db.hasClass = false;
        this.router.navigateByUrl('/detail/hd-ticket/' + data.hd_ticket_id)
      }
    }
  }

}

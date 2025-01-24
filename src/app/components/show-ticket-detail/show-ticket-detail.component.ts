import { Component, OnInit, Input } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-show-ticket-detail',
  templateUrl: './show-ticket-detail.component.html',
  styleUrls: ['./show-ticket-detail.component.scss'],
})
export class ShowTicketDetailComponent  implements OnInit {
@Input() ticket_send_details: any;

ticket_type_value: any;
priority_value: any;
agent_group_value: any;
rating_value = 0;

  constructor(public db: DbService,public modalCtrl: ModalController) { }

  ngOnInit() {
    // console.log(this.ticket_send_details)
    this.transform(this.ticket_send_details.modified)
    this.ticket_type_value = this.ticket_send_details.ticket_type
    this.priority_value = this.ticket_send_details.priority
    this.agent_group_value = this.ticket_send_details.agent_group
    this.rating_value = this.ticket_send_details.feedback_rating
  }

  set_value(type){
    // console.log(value)
    let data = {
      doctype: 'HD Ticket',
      name: this.ticket_send_details.name,
      fieldname: type
    }
    if(type == 'ticket_type'){
      data['value'] = this.ticket_type_value
    }else if(type == 'priority'){
      data['value'] = this.priority_value
    }else{
      data['value'] = this.agent_group_value
    }
    this.db.set_ticket_value(data).subscribe(res => {
      if(res && res.message){
        this.ticket_send_details = res.message
      }
    })
  }

  ticket_type = [
    {name: 'Bug'},
    {name: 'Incident'},
    {name: 'Question'},
    {name: 'Unspecified'}
  ]
  
  priority = [
    {name: 'Low'},
    {name: 'Medium'},
    {name: 'High'},
    {name: 'Urgent'}
  ]
  
  agent_team = [
    {name: 'Billing'},
    {name: 'Product Experts'},
    {name: 'Support Team'},
    {name: 'Development Team'}
  ]

  transform(value: any) {
    const previous: Date = new Date(value);
    const current: Date = new Date();
    const elapsed: number = +current - +previous;
  
    if (elapsed < 60000) {
      return 'just now';
    } else if (elapsed < 3600000) {
      const minutes = Math.floor(elapsed / 60000);
      return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`;
    } else if (elapsed < 86400000) {
      const hours = Math.floor(elapsed / 3600000);
      return hours === 1 ? 'an hour ago' : `${hours} hours ago`;
    } else {
      const days = Math.floor(elapsed / 86400000);
      return days === 1 ? 'yesterday' : `${days} days ago`;
    }
  }

}

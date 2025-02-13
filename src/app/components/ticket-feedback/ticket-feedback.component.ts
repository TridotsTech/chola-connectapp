import { Component, OnInit, Input } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ticket-feedback',
  templateUrl: './ticket-feedback.component.html',
  styleUrls: ['./ticket-feedback.component.scss'],
})
export class TicketFeedbackComponent  implements OnInit {
  rating_value: any;
  customer_feedback: any;
  showFeedback = true;
  @Input()ticket_send_details: any;
  @Input()type: any;
  constructor(public db: DbService,public modalCntrl: ModalController) { }

  ngOnInit() {}

  get_rating(rating){
    this.rating_value = rating;
    console.log(this.rating_value,'this.rating_value')

    if(this.rating_value > 0.6){
      this.showFeedback = false;
    }else{
      this.showFeedback = true;
    }
  }

  submitFeedback(){
    let data;
    if(this.type == 'Resolved'){
      data = {
        doctype: 'HD Ticket',
        name: this.ticket_send_details.name,
        feedback_extra: this.customer_feedback,
        feedback_rating: this.rating_value,
        status: 'Closed'
      }
    }else{
      data = {
        doctype: 'HD Ticket',
        name: this.ticket_send_details.name,
        custom_reopen_reason: this.customer_feedback,
        status: 'Reopened'
      }
    }
    this.modalCntrl.dismiss(data);
  }

}

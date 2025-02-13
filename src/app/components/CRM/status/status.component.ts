import { Component, Input, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent  implements OnInit {

@Input() status:any;
@Input() head:any;
@Input() noDot:any;
@Input() no_color:any;
@Input() cssLayout:any;
@Input() reverse:any;
@Input() doc_type:any;
@Input() tick:any;
@Input() table:any;

  constructor(public db:DbService) { }

  ngOnInit() {}

  get_style(data: any): any {
    // console.log(data)
    if(isNaN(data)){

      // if(this.db.app_name == 'Go1 Project'){
      //   switch (data.toLowerCase()) {
      //     case 'open': {
      //       return this.doc_type == 'Task' ? 'proj_task_open' : 'proj_open';
      //     }
      //     case 'closed': {
      //       return 'closed';
      //     }
      //     case 'high': {
      //       return 'in-active';
      //     }
      //     case 'medium': {
      //       return 'medium';
      //     }
      //     case 'approved': {
      //       return 'approved';
      //     }
      //     case 'rejected': {
      //       return 'rejected';
      //     }
      //     case 'draft': {
      //       return 'draft';
      //     }
      //     case 'submitted': {
      //       return 'submitted';
      //     }
      //     case 'present': {
      //       return 'present';
      //     }
      //     case 'absent': {
      //       return 'absent';
      //     }
      //     case 'unpaid ': {
      //       return 'unpaid';
      //     }
      //     case 'paid': {
      //       return 'paid';
      //     }
      //     case 'on leave': {
      //       return 'on-leave';
      //     }
      //     case 'half day': {
      //       return 'half-day';
      //     }
      //     case 'working': {
      //       return this.doc_type == 'Task' ? 'proj_task_working' : 'proj_working';
      //     }
      //     case 'completed': {
      //       return this.doc_type == 'Task' ? 'proj_task_completed' : 'proj_completed';
      //     }
      //     case 'closed': {
      //       return 'closed';
      //     }
      //     case 'investigated': {
      //       return 'investigated';
      //     }
      //     case 'pending review': {
      //       // return 'pending_review';
      //       return this.doc_type == 'Task' ? 'proj_task_pending_review' : 'proj_pending_review'
      //     }
      //     case 'overdue': {
      //       return this.doc_type == 'Task' ? 'proj_task_overdue' : 'proj_overdue';
      //     }
      //     case 'fixed': {
      //       return 'fixed';
      //     }
      //     case 're-open': {
      //       return 're-open';
      //     }
      //     case 'verified': {
      //       return 'verified';
      //     }
      //     case 'unpaid': {
      //       return 'unpaid';
      //     }
      //     case 'cancelled': {
      //       return 'cancelled';
      //     }
      //     case 'accepted': {
      //       return 'accepted';
      //     }
      //     case 'replied': {
      //       return 'replied';
      //     }
      //     case 'to do': {
      //       return 'to-do';
      //     }
      //     case 'in progress': {
      //       return 'in-progress';
      //     }
      //     case 'qa inprogress': {
      //       return 'qa-inprogress';
      //     }
      //     default: {
      //       return 'default';
      //     }
      //   }
      // }else{
        switch (data.toLowerCase()) {
          // case 'converted': {
          //   return 'converted';
          // }
          // case 'opportunity': {
          //   return 'opportunity';
          // }
          // case 'lead': {
          //   return 'lead';
          // }
          case 'open': {
            return this.doc_type == "HD Ticket" ? 'open_hd' : 'open';
          }
          case 'replied': {
            return this.doc_type == "HD Ticket" ? 'replied_hd' : 'replied';
          }
          case 'resolved': {
            return this.doc_type == "HD Ticket" ? 'resolved_hd' : 'resolved';
          }
          case 'closed': {
            return this.doc_type == "HD Ticket" ? 'closed_hd' : 'closed';
          }
          // case 'quotation': {
          //   return 'quotation';
          // }
          // case 'lost quotation': {
          //   return 'lost-quotation';
          // }
          // case 'lost': {
          //   return 'lost';
          // }
          case 'interested': {
            return 'interested';
          }
          case 'active': {
            return 'active';
          }
          case 'low': {
            return 'active';
          }
          case 'in active': {
            return 'in-active';
          }
          case 'high': {
            return 'in-active';
          }
          case 'medium': {
            return 'medium';
          }
          case 'approved': {
            return 'approved';
          }
          case 'rejected': {
            return 'rejected';
          }
          case 'draft': {
            return 'draft';
          }
          case 'submitted': {
            return 'submitted';
          }
          case 'present': {
            return 'present';
          }
          case 'absent': {
            return 'absent';
          }
          case 'unpaid ': {
            return 'unpaid';
          }
          case 'paid': {
            return 'paid';
          }
          case 'on leave': {
            return 'on-leave';
          }
          case 'half day': {
            return 'half-day';
          }
          case 'awaiting approval': {
            return 'awaiting';
          }
          case 'working': {
            return 'working';
          }
          case 'completed': {
            return 'completed';
          }
          case 'closed': {
            return 'closed';
          }
          case 'investigated': {
            return 'investigated';
          }
          case 'pending review': {
            return 'pending-review';
          }
          case 'overdue': {
            return 'overdue';
          }
          case 'fixed': {
            return 'fixed';
          }
          case 're-open': {
            return 're-open';
          }
          case 'verified': {
            return 'verified';
          }
          case 'unpaid': {
            return 'unpaid';
          }
          case 'cancelled': {
            return 'cancelled';
          }
          case 'accepted': {
            return 'accepted';
          }
          case 'replied': {
            return 'replied';
          }
          case 'to do': {
            return 'to-do';
          }
          case 'in progress': {
            return 'in-progress';
          }
          case 'qa inprogress': {
            return 'qa-inprogress';
          }
          default: {
            return 'default';
          }
        }
      // }

    }
  }

}

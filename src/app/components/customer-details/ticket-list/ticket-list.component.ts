import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
})
export class TicketListComponent implements OnInit {
  @Input() data: any;
  @Output() load_data = new EventEmitter();
  @Output() click_data = new EventEmitter();
  @Output() menu_name = new EventEmitter<any>();
  @Input() overflow: any
  @Input() tabs_array: any;
  @Input() border_none: any;
  @Input() bg_white: any;
  @Input() doc_type: any;
  skeleton = true;
  constructor(public db: DbService) { }

  ngOnInit() {
    // console.log(this.data.number_card)
    if (this.data && this.data.data && this.data.data.length > 0) {
      this.skeleton = false;
    } else {
      setTimeout(() => {
        this.skeleton = false;
      }, 500);
    }

  //   history.pushState = (function(originalPushState) {
  //     return function(state, title, url) {
  //         // You can add custom behavior here or simply prevent pushState
  //         console.log('Custom pushState behavior');
  //         // Optionally call the original function
  //         return originalPushState.apply(this, arguments);
  //     };
  // })(history.pushState);

  }

  tabs = [
    {
      "name": "ALL",
      "route": "ALL"
    },
    {
      "name": "Open",
      "route": "Open"
    },
    {
      "name": "Replied",
      "route": "Replied"
    },
    {
      "name": "Resolved",
      "route": "Resolved"
    },
    {
      "name": "Closed",
      "route": "Closed"
    }
  ]

  check_priority = (status) => {
    if (status == 'Low') {
      return 'arrow-down-outline'
    } else {
      return 'arrow-up-outline'
    }
  }


}

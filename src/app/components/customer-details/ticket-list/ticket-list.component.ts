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
  showBanner = true;
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

  checkBackground(data){
    if(data == 'Open'){
      return '#E9F7FB';
    }else if(data == 'Resolved'){
      return '#E7F8ED';
    }else if(data == 'Replied'){
      return '#F7F7F7';
    }else{
      return '#FFF4F4';
    }
  }

  getDotColor(data){
    if(data == 'High'){
      return '#FA0204';
    }else if(data = 'Medium'){
      return '#F99900';
    }else if(data == 'Low'){
      return '#5506C4';
    }
  }

  setTicketIcon(data){
    if(data == 'Open'){
      return '/assets/tickets/OpenTicket.svg';
    }else if(data == 'Resolved'){
      return '/assets/tickets/ResolvedTicket.svg';
    }else if(data == 'Replied'){
      return '/assets/tickets/RepliedTicket.svg';
    }else{
      return '/assets/tickets/ClosedTicket.svg';
    }
  }

  check_priority = (status) => {
    if (status == 'Low') {
      return 'arrow-down-outline'
    } else {
      return 'arrow-up-outline'
    }
  }

  getDateFromCalendars(event){
    console.log(event)
  }

  getFilters(event){
    console.log(event)
  }

  transformDateToDays(dateString: string): string {
    const givenDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - givenDate.getTime()); // Difference in milliseconds
    const daysDiff = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
    return `${daysDiff} Days`;
  }  

  stripHtmlTags(htmlString: string): string {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  }

  menu_name_1(event){
    this.db.skeletonLoader = true;
    this.menu_name.emit(event);
  }

}

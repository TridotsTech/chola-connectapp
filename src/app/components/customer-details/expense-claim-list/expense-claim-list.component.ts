import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-expense-claim-list',
  templateUrl: './expense-claim-list.component.html',
  styleUrls: ['./expense-claim-list.component.scss'],
})
export class ExpenseClaimListComponent implements OnInit {
  @Input() data: any;
  @Input() dashboard: any;
  @Input() advance: any;
  @Input() type: any;
  @Output() do_to_details = new EventEmitter()
  @Output() getFilters = new EventEmitter()
  @Output() getDateFromCalendar = new EventEmitter()

  @Output() search_txt_value: any = new EventEmitter();
  @Output() call_clear_txt: any = new EventEmitter();
  
  skeleton = false;
  showCalendar:any;

  constructor(public db: DbService) { }

  ngOnInit() {
    this.skeleton = true
    if (this.data) {
      this.skeleton = false
    }
  }


}

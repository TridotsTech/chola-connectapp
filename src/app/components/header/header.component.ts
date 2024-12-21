import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() model: any;
  @Input() notify: any;
  @Input() back_route: any;
  @Input() back_btn: any;
  @Input() no_home: any;
  @Input() home: any;
  @Input() title: any;
  @Input() tab_array: any;
  @Input() order_detail: any;
  @Input() new_btn: any;
  @Input() new_btn_route: any;
  @Input() return: any;
  @Input() modal_control: any;
  @Input() projects: any;
  @Input() create: any;
  @Input() doc_type: any;
  @Input() kanban: any;
  @Input() no_filter: any;
  @Input() showYear: any;
  @Input() showMonth: any;
  @Input() freeze: any;
  
  @Output() create_btn: any = new EventEmitter();
  @Output() select_change: any = new EventEmitter();
  @Output() menu_name: any = new EventEmitter();
  @Output() load_detail: any = new EventEmitter();
  @Output() get_project_name: any = new EventEmitter();
  @Output() toggleKanban: any = new EventEmitter();
  @Output() filters: any = new EventEmitter();
  @Output() toggleKanban_task: any = new EventEmitter();
  @Output() freezeEvent: any = new EventEmitter();

  constructor(public db: DbService) { }

  ngOnInit() {
    // console.log(this.title)
  }

}

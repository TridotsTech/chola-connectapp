import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-revo-grid-table',
  templateUrl: './revo-grid-table.component.html',
  styleUrls: ['./revo-grid-table.component.scss'],
})
export class RevoGridTableComponent  implements OnInit {
@Input() rows: any;
@Input() columns: any;
  constructor() { }

  ngOnInit() {}

}

import { Component, Input, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-no-record-found',
  templateUrl: './no-record-found.component.html',
  styleUrls: ['./no-record-found.component.scss'],
})
export class NoRecordFoundComponent implements OnInit {

  @Input() image:any;
  @Input() icon:any;
  @Input() router:any;
  @Input() heading:any;
  @Input() height:any;
  @Input() margin_top :any;
  @Input() content:any;
  @Input() column:any;
  @Input() bg_color:any;
  @Input() border_radius:any;
  @Input() border_r:any;
  @Input() Lead_detail:any;
  
  constructor(public db:DbService) { }

  ngOnInit() {
  }

}

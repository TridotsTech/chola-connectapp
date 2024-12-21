import { Component, OnInit, Input } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-assignees',
  templateUrl: './assignees.component.html',
  styleUrls: ['./assignees.component.scss'],
})
export class AssigneesComponent  implements OnInit {
@Input()data : any
@Input()noHeader : any
  constructor(public db: DbService) { }

  ngOnInit() {
    console.log('Assignees',this.data)
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-regularization-detail',
  templateUrl: './regularization-detail.component.html',
  styleUrls: ['./regularization-detail.component.scss'],
})
export class RegularizationDetailComponent  implements OnInit {
@Input() regularizationDetail: any;
  constructor(public db: DbService) { }

  ngOnInit() {
    console.log(this.regularizationDetail,'this.regularizationDetail')
  }

}

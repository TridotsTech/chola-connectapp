import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-regularization-detail',
  templateUrl: './regularization-detail.component.html',
  styleUrls: ['./regularization-detail.component.scss'],
})
export class RegularizationDetailComponent  implements OnInit {
@Input() regularizationDetail: any;
  constructor() { }

  ngOnInit() {
    console.log(this.regularizationDetail,'this.regularizationDetail')
  }

}

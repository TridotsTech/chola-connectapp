import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-common-detail',
  templateUrl: './common-detail.component.html',
  styleUrls: ['./common-detail.component.scss'],
})
export class CommonDetailComponent  implements OnInit {
  @Input() time:any;
  constructor() { }

  ngOnInit() {
    // console.log(this.time);
  }

}

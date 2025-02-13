import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-common-priority',
  templateUrl: './common-priority.component.html',
  styleUrls: ['./common-priority.component.scss'],
})
export class CommonPriorityComponent  implements OnInit {
@Input() priority: any;
@Input() showIcon: any;
  constructor() { }

  ngOnInit() {}

  getDotColor(data){
    if(data == 'High'){
      return '#FA0204';
    }else if(data = 'Medium'){
      return '#F99900';
    }else if(data == 'Low'){
      return '#5506C4';
    }
  }

  check_priority = (status) => {
    if (status == 'Low') {
      return 'arrow-down-outline'
    } else {
      return 'arrow-up-outline'
    }
  }

}

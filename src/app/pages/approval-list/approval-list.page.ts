import { Label } from '@amcharts/amcharts4/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.page.html',
  styleUrls: ['./approval-list.page.scss'],
})
export class ApprovalListPage implements OnInit {

  approvallist:any=[];
  constructor(private router: Router) { }

  ngOnInit() {
    this.approvallist=[
      {name:'Leave request',label:'Leave request'},
      {name:'Leave withdrawal ',label:'Leave withdrawal  '},
      {name:'Regularization',label:'Regularization'},
      {name:'Letter request',label:'Letter request'},
      {name:'Resignation Letter',label:'Resignation Letter'},
      {name:'Employee Transfer',label:'Employee Transfer'}
    ]
  }

  add(item){
    console.log(item)
    if(item.name == 'Leave request')
      this.router.navigateByUrl('/leave-application-detail');
  }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-leave-preview-withdraw',
  templateUrl: './leave-preview-withdraw.component.html',
  styleUrls: ['./leave-preview-withdraw.component.scss'],
})
export class LeavePreviewWithdrawComponent  implements OnInit {
  @Input() title:any;
  constructor() { }

  ngOnInit() {}

}

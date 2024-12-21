import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-regularization-form',
  templateUrl: './regularization-form.component.html',
  styleUrls: ['./regularization-form.component.scss'],
})
export class RegularizationFormComponent  implements OnInit {

  @Input() title;
  missing_days:any=[];
  constructor(public db: DbService,public modalCntrl: ModalController) { }

  ngOnInit() {
    this.get_missing_date()
  }

  get_missing_date(){
    let data = {
      employee:localStorage['employee_id']
      
  }
  this.db.get_missing_punched_days(data).subscribe(res => {
    this.missing_days = res.message
    this.missing_days.map(res=>{
      res.isChecked = false;
      res.duration = 'Full Time';
    })
    // console.log(res)    
  })
  }

  editLeaveLeavePreview(missing_days,tyep,item,i){

  }

  eventPropagation(event){

  }

  addLeaveWithdrawal(event,item){

  }

}

import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { LeavePreviewWithdrawFormComponent } from '../leave-preview-withdraw-form/leave-preview-withdraw-form.component';

@Component({
  selector: 'app-regularization-form',
  templateUrl: './regularization-form.component.html',
  styleUrls: ['./regularization-form.component.scss'],
})
export class RegularizationFormComponent  implements OnInit {

  @Input() title;
  missing_days:any=[];
  constructor(public db: DbService,public modalCtrl: ModalController) { }

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

  async editLeaveLeavePreview(missing_days,tyep,item,i){
    const modal = await this.modalCtrl.create({
      component: LeavePreviewWithdrawFormComponent,
      cssClass: 'job-detail-popup',
      componentProps: {
        title:'Attendance Adjustment Tool',
        type:'regulariztion',
        editFormValues: item
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data) {


    }
  }

  eventPropagation(event){

  }

  addLeaveWithdrawal(event,item){

  }

}

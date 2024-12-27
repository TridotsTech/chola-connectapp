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
  show_btn:any;
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
      res.duration = 'Full Day';
      const now = new Date();
      now.setHours(9);
      now.setMinutes(0);
      now.setSeconds(0);
      res.in_time = now
      // console.log(now.toISOString().slice(0, 16))
    })
    //     
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
      console.log(data)
      item = data
    }
  }

  eventPropagation(event){

  }

  addLeaveWithdrawal(event,item){
    // console.log(event)
    item.isChecked = event.detail.checked
    this.show_btn = false
    this.show_reg_btn()
  }

  create_regularization(){
    let datas:any=[];
    this.missing_days.map(res =>{
      if(res.isChecked == true){
        const now = new Date(res.in_time);
        res.in_time = now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
        // now.setMinutes(0);
        // now.setSeconds(0);
        datas.push(res)
      }
  })

    let data = {
      emp:localStorage['employee_id'],
      workflow_state:'Awaiting Approval',
      dates:datas
  }
  this.db.create_regularization_before_save(data).subscribe(res => {
    if(res.status == 'failed')
      this.db.alert(res.message)
    else
      this.modalCtrl.dismiss()
  })
  }

  async leave_request(item){
    const modal = await this.modalCtrl.create({
      component: LeavePreviewWithdrawFormComponent,
      cssClass: 'job-detail-popup',
      componentProps: {
        title:'Leave Request',
        type:'leave request',
        editFormValues: item
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data) {
      console.log(data)
      // item = data
    }
  }

  show_reg_btn(){
    this.missing_days.map(res =>{
        if(res.isChecked == true){
          return this.show_btn = true
        }
    })
  }

}

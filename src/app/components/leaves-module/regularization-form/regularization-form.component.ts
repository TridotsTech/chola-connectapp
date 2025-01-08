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
  is_no_data:any = false;
  constructor(public db: DbService,public modalCtrl: ModalController) { }

  ngOnInit() {
    this.get_missing_date()
  }

  get_missing_date(){
    let data = {
      employee:localStorage['employee_id']
  }
  this.db.get_missing_punched_days(data).subscribe(res_data => {
    this.missing_days = res_data.message.missing_days
    if(this.missing_days.length != 0){
      this.is_no_data = false;
      this.missing_days.map(res=>{
        res.isChecked = false;
        res.duration = res.half_session ? res.half_session : 'Full Day';
        const now = new Date();
        now.setHours(res.duration == 'Second Half' ? res_data.message.second_half_time.split(":")[0] : res.duration == 'First Half' ? res_data.message.first_half_time.split(":")[0] : 9);
        now.setMinutes(0);
        now.setSeconds(0);
        res.in_time = now
      })   
    }else
      this.is_no_data = true;
  }, error => {
    this.is_no_data = true;
    // console.log(error.error)
    if(error.error){
      let d = JSON.parse(error.error._server_messages)
      let f = JSON.parse(d[0])
      this.db.sendErrorMessage(f.message)
    }
    // this.alert('Soemthing went wrong try again later');
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
    item.isChecked = event.detail.checked
    this.show_btn = false
    this.show_reg_btn()
  }

  create_regularization(){
    let datas:any=[];
    this.missing_days.map(res =>{
      if(res.isChecked == true && res.reg_reason){
        const now = new Date(res.in_time);
        res.in_time = now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
        datas.push(res)
      }
  })
  if(datas.length > 0){
    let data = {
      emp:localStorage['employee_id'],
      workflow_state:'Awaiting Approval',
      dates:datas
    }
    this.db.create_regularization_before_save(data).subscribe(res => {
      if(res.status == 'failed')
        this.db.alert(res.message)
      else{
        this.db.alert('Regularization created successfully')
        this.modalCtrl.dismiss()
      }
        
    })
  }
  else
    this.db.alert('Pls create the any one reason')
  }

  async leave_request(item){
    let datas:any=[];
    this.missing_days.map(res =>{
      if(res.isChecked == true){
        datas.push(res)
      }
  })
  if(datas.length > 0){
    const modal = await this.modalCtrl.create({
      component: LeavePreviewWithdrawFormComponent,
      cssClass: 'job-detail-popup',
      componentProps: {
        title:'Leave Request',
        type:'leave request',
        editFormValues: datas
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data) {
      console.log(data)
    }
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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { WebsiteFormsComponent } from '../../forms/website-forms/website-forms.component';
import { Router } from '@angular/router';
import { LeaveWithdrawalPage } from 'src/app/pages/leave-module/leave-withdrawal/leave-withdrawal.page';
import { LeaveApplicationPage } from 'src/app/pages/order/leave-application/leave-application.page';
import { LeavePreviewWithdrawFormComponent } from '../../leaves-module/leave-preview-withdraw-form/leave-preview-withdraw-form.component';

@Component({
  selector: 'app-leave-detail',
  templateUrl: './leave-detail.component.html',
  styleUrls: ['./leave-detail.component.scss'],
})
export class LeaveDetailComponent  implements OnInit {
  @Input() data:any;
  @Input() dash_board:any;
  @Input() emp_detail:any;
  @Input() selectedTab:any;
  @Output() leave_confirm = new EventEmitter()
  
  
  constructor(public alertController:AlertController,public db:DbService, private modalCtrl: ModalController,public router: Router) { }

  ngOnInit() {

    console.log(this.selectedTab)
   }

  async leave_confirms(event:MouseEvent,data,item,type){
    if(type == 'Approve'){
      const alert = await this.alertController.create({
        header: 'Approval',
        message: 'Are you sure do you want to Approval for leave..?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              // item.status = "Pending"
              this.alertController.dismiss();
            },
          },
          {
            text: 'Ok',
            handler: () => {
              item.status = 'Approved'
              event.stopPropagation()
              let val = {}
              val['data'] = data
              val['item'] = item
              val['type'] = type
              this.leave_confirm.emit(val)
            },
          },
        ],
      });
      await alert.present();
    }
    else{
      item.status = 'Rejected'
      const modal = await this.modalCtrl.create({
        component: LeavePreviewWithdrawFormComponent,
        cssClass: 'job-detail-popup',
        componentProps: {
          title:'Leave Approval Tool',
          type:'leave request tool',
          editFormValues: item
        },
        enterAnimation: this.db.enterAnimation,
        leaveAnimation: this.db.leaveAnimation,
      });
      await modal.present();
      const res  = await modal.onWillDismiss();
      if (res && res.data) {
        console.log(res)
        item = res.data
        event.stopPropagation()
        let val = {}
        val['data'] = data
        val['item'] = item
        val['type'] = type
        this.leave_confirm.emit(val)
      }
      else
        item.status = "Pending"
    }
    // 
  }

  getDateDifference(startDate: Date) {
    const endDate = new Date(); // Current date

    const start = new Date(startDate);
    const end = new Date(endDate);

    let yearsDiff = end.getFullYear() - start.getFullYear();
    let monthsDiff = end.getMonth() - start.getMonth();

    // Adjusting months and years if necessary
    if (monthsDiff < 0) {
      yearsDiff--;
      monthsDiff += 12;
    }

    return `${yearsDiff} yr, ${monthsDiff} mn`;
  }

  async editLeaveApplication(data){
    const modal = await this.modalCtrl.create({
      component: LeaveApplicationPage,
      cssClass: '',
      componentProps: {
        editFormValues: data
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();
    if (val && val.data && val.data == 'Success') {
      // console.log(val)
    }

    // this.modalCtrl.dismiss();
    // this.router.navigate(['/leave-application'], { queryParams: { data: JSON.stringify(data) } });

  }

  eventPropagation(event){

  }

  addLeaveWithdrawal(event,item){
    item.isChecked = event.detail.checked
    // this.show_btn = false
    // this.show_reg_btn()
  }

  async editLeaveLeavePreview(item,index){
    if(this.db.hr_manager_role && this.selectedTab == 'Awaiting Approval'){
    const modal = await this.modalCtrl.create({
      component: LeavePreviewWithdrawFormComponent,
      cssClass: 'job-detail-popup',
      componentProps: {
        title:'Leave Approval Tool',
        type:'leave request tool',
        editFormValues: item
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data) {
      // console.log(data)
      item = data
    }
  }
  }
  async withdrawLeave(){
    // const modal = await this.modalCtrl.create({
    //   component: LeaveWithdrawalPage,
    //   cssClass: '',
    //   componentProps: {
    //     from_date: this.data.from_date,
    //     to_date: this.data.to_date,
    //   },
    //   enterAnimation: this.db.enterAnimation,
    //   leaveAnimation: this.db.leaveAnimation,
    // });
    // await modal.present();
    // const val = await modal.onWillDismiss();
    // if (val && val.data && val.data == 'Success') {
    //   // console.log(val)
    // }

    this.modalCtrl.dismiss();
    // this.router.navigateByUrl('/leave-withdrawal');
    this.router.navigate(['/leave-withdrawal'], { queryParams: { data: JSON.stringify(this.data) } });
  }
}

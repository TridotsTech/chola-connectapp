import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { WebsiteFormsComponent } from '../../forms/website-forms/website-forms.component';
import { Router } from '@angular/router';
import { LeaveWithdrawalPage } from 'src/app/pages/leave-module/leave-withdrawal/leave-withdrawal.page';
import { LeaveApplicationPage } from 'src/app/pages/order/leave-application/leave-application.page';

@Component({
  selector: 'app-leave-detail',
  templateUrl: './leave-detail.component.html',
  styleUrls: ['./leave-detail.component.scss'],
})
export class LeaveDetailComponent  implements OnInit {
  @Input() data:any
  @Input() dash_board:any
  @Input() emp_detail:any
  @Output() leave_confirm = new EventEmitter()
  
  constructor(public db:DbService, private modalCtrl: ModalController,public router: Router) { }

  ngOnInit() { }

  leave_confirms(event:MouseEvent,data,type){
    event.stopPropagation()
    let val = {}
    val['data'] = data
    val['type'] = type
    this.leave_confirm.emit(val)
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

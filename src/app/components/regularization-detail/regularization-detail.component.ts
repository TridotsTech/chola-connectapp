import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { LeavePreviewWithdrawFormComponent } from '../leaves-module/leave-preview-withdraw-form/leave-preview-withdraw-form.component';

@Component({
  selector: 'app-regularization-detail',
  templateUrl: './regularization-detail.component.html',
  styleUrls: ['./regularization-detail.component.scss'],
})
export class RegularizationDetailComponent  implements OnInit {
@Input() regularizationDetail: any;
  constructor(public db: DbService,public alertController:AlertController,public modalctrl:ModalController) { }

  ngOnInit() {
    // this.get_workflow_states(this.regularizationDetail.name)
    // console.log(this.regularizationDetail,'this.regularizationDetail')
  }

  // get_workflow_states(id){
  //   let data = {
  //     doctype: 'Regularization',
  //     docname: id
  //   }
  //   this.db.get_workflow_states(data).subscribe(res => {
  //     console.log(res)
  //     if(res && res.message && res.message.length != 0 && res.message[0].status == 'Success'){
       
  //     }
  //   })
  // }

  async approve(item,type){
    if(type == 'Approved'){
    const alert = await this.alertController.create({
      header: type == 'Approved' ?'Approval':'Reject',
      message: `Are you sure do you want to ${type == 'Approved' ?'Approval':'Reject'} for regularization..?`,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            this.alertController.dismiss();
          },
        },
        {
          text: 'Ok',
          handler: () => {
            this.submit({doctype:'Regularization',name:item.name,status:type,employee:item.employee,docstatus:1},type)
          },
        },
      ],
    });
    await alert.present();
  }
    else{
        // item.status = 'Rejected'
        const modal = await this.modalctrl.create({
          component: LeavePreviewWithdrawFormComponent,
          cssClass: 'job-detail-popup',
          componentProps: {
            title:'Reject Reason',
            type:'leave request tool',
            editFormValues: item
          },
          enterAnimation: this.db.enterAnimation,
          leaveAnimation: this.db.leaveAnimation,
        });
        await modal.present();
        const res  = await modal.onWillDismiss();
        if (res && res.data) {
          item.rejected_reason = res.data.rejected_reason
          console.log(item.rejected_reason)
          this.submit({doctype:'Regularization',name:item.name,status:type,employee:item.employee,docstatus:1},type)
          // this.approve_leave(data,item,type)
        }
        // else
          // item.status = "Awaiting Approval"
      }
  }

  submit(data,type){
    this.db.inset_docs({ data: data }).subscribe(res => {
      if (res && res.message && res.message.status == 'Success') {
          this.db.sendSuccessMessage(`Regularization ${type} successfully!`)
          setTimeout(() => {
            this.modalctrl.dismiss(res.message.data);
          }, 500);
      }else{
        if(res._server_messages){
          let d = JSON.parse(res._server_messages)
          let f = JSON.parse(d[0])
          this.db.sendErrorMessage(f.message)
        }else{
          this.db.sendErrorMessage(res.message.message)
        }
      }
    }, error => {
      if(error.error){
        let d = JSON.parse(error.error._server_messages)
        let f = JSON.parse(d[0])
        this.db.sendErrorMessage(f.message)
      }
    })
  }

}

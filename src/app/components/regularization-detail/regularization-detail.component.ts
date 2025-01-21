import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-regularization-detail',
  templateUrl: './regularization-detail.component.html',
  styleUrls: ['./regularization-detail.component.scss'],
})
export class RegularizationDetailComponent  implements OnInit {
@Input() regularizationDetail: any;
  constructor(public db: DbService,public alertController:AlertController,public modalctrl:ModalController) { }

  ngOnInit() {
    // console.log(this.regularizationDetail,'this.regularizationDetail')
  }

  async approve(item,type){
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

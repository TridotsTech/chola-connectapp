import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { LeavePreviewWithdrawFormComponent } from '../leaves-module/leave-preview-withdraw-form/leave-preview-withdraw-form.component';

@Component({
  selector: 'app-create-letter-request',
  templateUrl: './create-letter-request.component.html',
  styleUrls: ['./create-letter-request.component.scss'],
})
export class CreateLetterRequestComponent  implements OnInit {
  @Input() title;
  letterType:any=[];
  save_only:any = false;
  @Input() letterRequestDetail:any;
  constructor(public loadingCtrl:LoadingController, private nav: NavController,public modalCtrl: ModalController, public db: DbService) { }

  ngOnInit() {
    this.get_reference_name()
  }

  get_reference_name() {
    let data = {
      doctype: 'Letter Type',
      page_no: 1,
      page_length: 100,
      // search_text: this.search_text_ref,
    };
    this.db.label_values(data).subscribe((res: any) => {
      console.log(res)
      this.letterType = res.message
    },
      (error) => {
      }
    );
  }

  async add(item){
    item.remarks = '';
    if(item.name == 'Visa Letter'){
      item.from_date = ''
      item.to_date = ''
    }
    const modal = await this.modalCtrl.create({
      component: LeavePreviewWithdrawFormComponent,
      cssClass: 'job-detail-popup',
      componentProps: {
        title:'Purpose of the Letter',
        type:'letterrequest',
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
      this.insert_letter_request(item)
    }
  }

  async insert_letter_request(item){
    let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    await loader.present();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    // const formattedDate = `${year}-${month}-${day}`;
      let data:any ={}
      data.doctype = 'Employee Letter Request'
      if(this.letterRequestDetail && this.letterRequestDetail.name){
        data.name = this.letterRequestDetail.name;
      }
      data.letter_type = item.name
      data.remarks = item.remarks
      data.from_date = item.from_date
      data.to_date = item.to_date
      data.employee_id = localStorage['employee_id']
      data.country = 'India'
      data.request_date = `${year}-${month}-${day}`;
      this.save_only ? data.workflow_state = 'Awaiting Approval' : data.workflow_state = 'Draft'

      this.db.inset_docs({data: data}).subscribe(res => {
        setTimeout(() => {
          loader.dismiss()
        }, 1000);
        if (res && res.message && res.message.status == 'Success') {
          this.db.sendSuccessMessage("Letter Request created successfully!")
          this.letterRequestDetail = res.message.data;
          this.db.inset_docs({data: {name:res.message.data.name,workflow_state:'Pending',doctype:'Employee Letter Request'}}).subscribe(r => {
            this.modalCtrl.dismiss(res.message.data);
          })
        }else{
          if(res._server_messages){
            let d = JSON.parse(res._server_messages)
            let f = JSON.parse(d[0])
            this.db.sendErrorMessage(f.message)
          }else{
            this.db.sendErrorMessage(res.message.message)
          }
        }
      })
  }

}

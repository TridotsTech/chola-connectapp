import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
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
  show_btn = false;
  
  constructor(public loadingCtrl:LoadingController,public alertController:AlertController,public db:DbService, private modalCtrl: ModalController,public router: Router) { }

  ngOnInit() {
    // console.log(this.selectedTab)
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
                  this.alertController.dismiss();
                },
              },
              {
                text: 'Ok',
                handler: () => {
                  item.status = 'Approved'
                  this.approve_leave(data,item,type)
                  // this.show_btn = false
                  // this.show_reg_btn()
                  // event.stopPropagation()
                  // let val = {}
                  // val['data'] = data
                  // // val['item'] = item
                  // val['type'] = type
                  // this.leave_confirm.emit(val)
                },
              },
            ],
          });
          await alert.present();
        // }
        // else
        //   this.db.sendErrorMessage()
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
          item.rejected_reason = res.data.rejected_reason
          console.log(item.rejected_reason)
          this.approve_leave(data,item,type)
          // this.show_btn = false
          // this.show_reg_btn()
          // event.stopPropagation()
          // let val = {}
          // val['data'] = data
          // // val['reas']
          // // val['item'] = item
          // val['type'] = type
          // this.leave_confirm.emit(val)
        }
        else
          item.status = "Pending"
      }
    // }
    // else
    //   this.db.sendErrorMessage('Please select any one item')
    // 
  }

  async leave_approve(eve,data,type){
    if(type == 'Approve'){
      const alert = await this.alertController.create({
        header: 'Approval',
        message: 'Are you sure do you want to Approval for leave..?',
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
              let res_data ={
                leave_status:'Approve',
                name:data.name
              }
              this.update_doc(res_data)
            },
          },
        ],
      });
      await alert.present();
  }
  else{
    const modal = await this.modalCtrl.create({
      component: LeavePreviewWithdrawFormComponent,
      cssClass: 'job-detail-popup',
      componentProps: {
        title:'Leave Approval Tool',
        type:'leave request tool',
        editFormValues: data
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const res  = await modal.onWillDismiss();
    console.log(res)
    if (res && res.data) {
      let res_data ={
        leave_status:'Reject',
        leave_rejected_reason:res.data.rejected_reason,
        name:data.name
      }
      this.update_doc(res_data)
    }
  }
  }

  async update_doc(res_data){
    let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    await loader.present();
    setTimeout(() => {
      loader.dismiss()
    }, 20000);
    this.db.auto_submit_leave_request(res_data).subscribe(res => {
      setTimeout(() => {
        loader.dismiss()
      }, 1000);
      if(res && res.message && res.message.status == 'Success'){
        this.db.sendSuccessMessage(res.message.message)
        this.modalCtrl.dismiss(res)
      }
      else{
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

  approve_leave(data,item, type) {
    let datas:any=[];
    let doc_status = 0;
  //   data.leave_preview.map(res =>{
  //     if(res.isChecked == true){
        datas.push({date:item.date, status:item.status, rejected_reason:item.rejected_reason})
  //     }
  // })
    let check = this.data.leave_preview.filter(res => res.status == 'Approved' || res.status == 'Rejected' || res.count == 'Weekly Off' || res.count == 'Holiday' || res.count == 'Applied' || res.count == 'Attendance Marked')
    if(check && check.length == this.data.leave_preview.length){
      doc_status = 1
    }
    let res_data ={
      employee:data.employee,
      "from_date":data.from_date,
      "to_date": data.to_date,
      leave_preview:datas,
      docstatus:doc_status
    }
    // console.log(res_data)
    this.db.leave_approve_reject(res_data).subscribe(res => {
        if(res.status == 'Success'){
          this.db.sendSuccessMessage(res.message)
        }
        else if (res._server_messages) {
          var d = JSON.parse(res._server_messages);
          var d1 = JSON.parse(d);
          this.db.alert(d1.message)
        }
        else{
          this.db.alert(res.message)
        }
        if(doc_status)
          this.modalCtrl.dismiss(res)
      })
  }

  submit() {
      let datas = {
        doctype: "Leave Request",
        employee: localStorage['employee_id'],
        posting_date: this.db.current_event_date,
        // total_leave_days: this.total_leave_days ? this.total_leave_days : 0
      }

      if(this.data.leave_preview && this.data.leave_preview.length != 0){
        datas['leave_preview'] = this.data.leave_preview;
      }

      // datas = {...datas, ...this.leave_form.value}
      // // datas['half_day'] = datas['half_day'] ? 1 : 0;

      // if(this.leave_detail && this.leave_detail.name){
      //   datas['name'] = this.leave_detail.name;
      // }

      // if(this.editFormValues && this.editFormValues.name){
      //   datas['name'] = this.editFormValues.name;
      // }

        datas['docstatus'] = 1;
        datas['name'] = this.data.name
      this.db.inset_docs({ data: datas }).subscribe(res => {
        if (res && res.message && res.message.status == 'Success') {  
          if(res.message.data && res.message.data.name)
            // this.db.sendSuccessMessage("Leave Request Send For Approval successfully!")
            setTimeout(() => {
              this.modalCtrl.dismiss(datas)
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
        editFormValues: data,
        model:true
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();
    console.log(val)
    // if (val && val.data && val.data == 'Success') {
      // console.log(val)
    // }

    // this.modalCtrl.dismiss();
    // this.router.navigate(['/leave-application'], { queryParams: { data: JSON.stringify(data) } });

  }

  eventPropagation(event){

  }

  addLeaveWithdrawal(event,item){
    item.isChecked = event.detail.checked
  }

  show_reg_btn(){
    let check = this.data.leave_preview.filter(res => res.status == 'Approved' || res.status == 'Rejected' || res.count == 'Weekly Off' || res.count == 'Holiday' || res.count == 'Applied')
    console.log(check)
    if(check && check.length == this.data.leave_preview.length){
      this.show_btn = true
    }
    // this.data.leave_preview.map(res =>{
    //     if(res.status == 'Approved' || ){
    //       return this.show_btn = true
    //     }
    // })
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { LeaveApplicationPage } from '../order/leave-application/leave-application.page';
import { LetterRequestDetailComponent } from 'src/app/components/letter-request-detail/letter-request-detail.component';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.page.html',
  styleUrls: ['./approvals.page.scss'],
})
export class ApprovalsPage implements OnInit {
  page_no: any = 1;
  approvalList: any = []
  no_products = false;
  skeleton = true;
  searchDoctypeTest: any;
  constructor(public db: DbService,private router: Router,private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.page_no = 1;
    this.no_products = false;
    this.skeleton = true;
    this.getApprovalsList();
  }

  getApprovalsList(){
    let data = {
      doctype: 'Workflow Action',
      fields: ["*"],
      page_no: this.page_no,
      page_size : 20,
      filters : { 
        reference_doctype : 
        ['Like' , '%' + (this.searchDoctypeTest ? this.searchDoctypeTest : '') + '%' ],
        
        status:'Open'
      }
    }
    this.db.get_list(data).subscribe(res => {
      this.skeleton = false;
      // console.log(res)
      if(res && res.message && res.message.length != 0){
        this.page_no == 1 ? this.approvalList = res.message : this.approvalList = [...this.approvalList,...res.message]
      }else{
        this.no_products = true;
        this.page_no == 1 ? this.approvalList = [] : null;
      }
    })
  }

  load_more(event){
    if(!this.no_products){
      let value = event.target.offsetHeight + event.target.scrollTop + 1;
      value = value.toFixed();
      if(value >= event.target.scrollHeight){
        this.page_no += 1;
        this.getApprovalsList();
      }
    }
  }

  searchDoctype(event){
    // console.log(event)
    this.searchDoctypeTest = event.detail.value;
    this.page_no = 1;
    this.getApprovalsList();
  }

  clear_txt(event){
    // console.log(event)
    this.searchDoctypeTest = '';
    this.page_no = 1;
    this.getApprovalsList();
  }

  async send_to_detail(item){
    console.log(item,'item')
    if(item.reference_doctype == 'Leave Withdrawal'){
      this.router.navigate(['/leave-withdrawal/' + item.reference_name]);
    }else if(item.reference_doctype == 'Leave Request'){
      this.getLeaveReqDetails(item.reference_name)
    }else if(item.reference_doctype == 'Employee Letter Request'){
      let data = item;
      data.name = item.reference_name
      const modal = await this.modalCtrl.create({
        component: LetterRequestDetailComponent,
        cssClass: 'regularization-popup',
        componentProps: {
          letterrequestDetail: data,
        },
      });
      await modal.present();
      const val = await modal.onWillDismiss();
      if(val){
        this.page_no = 1;
        this.getApprovalsList();
      }
    }else if(item.reference_doctype == 'Salary Fitment'){
      this.db.approval('app/salary-fitment/'+item.reference_name)
    }


  }

  getLeaveReqDetails(id){
    let data = {
      doctype: 'Leave Request',
      name: id
    }
    this.db.doc_detail(data).subscribe(res => {
      if (res && res.message && res.message.length != 0 && res.message[0].status == "Success") {
        this.openQuickForm(res.message[1])
      }
    })
  }

  async openQuickForm(item) {
    const modal = await this.modalCtrl.create({
      component: LeaveApplicationPage,
      cssClass: '',
      componentProps: {
        inputEmployeeDetails: item,
        selectedTabSec: 'Pending'
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
  }

}

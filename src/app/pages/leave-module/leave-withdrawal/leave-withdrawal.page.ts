import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LeavePreviewWithdrawFormComponent } from '../../../components/leaves-module/leave-preview-withdraw-form/leave-preview-withdraw-form.component';

@Component({
  selector: 'app-leave-withdrawal',
  templateUrl: './leave-withdrawal.page.html',
  styleUrls: ['./leave-withdrawal.page.scss'],
})
export class LeaveWithdrawalPage implements OnInit {
  selectedEmployee: any;
  withdrawal_form: any = FormGroup;
  filterStartDate: any;
  filterEndDate: any;
  leave_preview: any = [];
  leave_withdarawal_list: any = [];
  from_date: any;
  to_date: any;
  sendApproval = false;
  withdrawalDetail: any;
  newForm = false;
  constructor(public db: DbService,private formbuilder:FormBuilder,private route: ActivatedRoute,private modalCtrl: ModalController) { }

  ngOnInit() {

    this.route.params.subscribe(res => {
      if(res && res['id']){
        if(res['id'] != 'New'){
          this.getWithdrawalDetail(res['id'])
        }else{
          this.newForm = true;
        }
      }
    })

    this.route.queryParams.subscribe(params => {
      let data = JSON.parse(params['data'] || '[]');
      console.log(data,'data')
      this.filterStartDate = data.from_date ? data.from_date : data.filter_start_date;
      this.filterEndDate = data.to_date ? data.to_date : data.filter_end_date;
    });

    this.withdrawal_form = this.formbuilder.group({
      employee: new FormControl(''),
      reason: new FormControl(''),
    })

    this.db.select_drop_down.subscribe((res: any) => {
      this.db.drop_down_value['employee'] = res.label
      this.selectedEmployee = res.name
      this.withdrawal_form.value['employee'] = res.label;
    });

    this.calculateLeavePreview()
  }

  statusType = [
    {name: 'Open'},
    {name: 'Approved'},
    {name: 'Pending'},
    {name: 'Withdraw'}
  ]

  get employee(){
    return this.withdrawal_form.get('employee');
  }

  get reason(){
    return this.withdrawal_form.get('reason');
  }

  open_dropdown() {
    let val = {
      type: 'Employee',
      fieldname: 'employee',
      fieldname_value: '',
      selected_value: this.selectedEmployee,
      send_all_value: true
    }

    let selected_value = {
      doctype: "Employee"
    }

    this.db.open_drop_down_options(val.type, val.fieldname, val.fieldname_value, selected_value)
  }

  datePickerChange(type,eve){
    if(type == 'from_date'){
      this.filterStartDate = eve.value
    }else{
      this.filterEndDate = eve.value
    }

    this.sendApproval = false;
    // console.log(eve)
  }

  calculateLeavePreview(){
    let data = {
      "employee": localStorage['employee_id']
    }
    this.db.get_leave_withdraw_preview(data).subscribe(res => {
      console.log(res);
      if(res && res.message && res.message && res.message.length != 0){
        this.leave_preview = res.message;
      }else{
        this.leave_preview = [];
      }
    })
  }

  eventPropagation(event: any) {
    event.stopPropagation();
  }

  addLeavePreview(event, item){
    event.stopPropagation();
    console.log(item,'item')
    item['isChecked'] =! item['isChecked']
  }

  addLeaveWithdrawal(event, item){
    event.stopPropagation();
    console.log(item,'item')
    item['isChecked'] =! item['isChecked']

    let selectedArray = this.leave_withdarawal_list.filter(res => {return res['isChecked'] == true});
    // console.log(selectedArray,'selectedArray')
  }

  checkIfLeaveSelected(){
    let selectedArray = this.leave_preview.filter(res => {return res['isChecked'] == true});
    if(selectedArray && selectedArray.length != 0){
      return true
    }else{
      return false
    }
  }

  checkIfWithdrawSelected(){
    let selectedArray = this.leave_withdarawal_list.filter(res => {return res['isChecked'] == true});
    if(selectedArray && selectedArray.length != 0){
      return true
    }else{
      return false
    }
  }
  
  deleteLeave(){
    this.leave_preview = this.leave_preview.filter(res => {return !res['isChecked']});
  }

  deleteWithdraw(){
    this.leave_withdarawal_list = this.leave_withdarawal_list.filter(res => {return !res['isChecked']});
  }

  sendLeaveWithdraw(){
    this.sendApproval = false;
    let selectedArray = this.leave_preview.filter(res => {return res['isChecked'] == true});
    selectedArray.map(resS => {
      if(resS.status != 'Open'){
        resS.oldStatus = resS.status
        resS.status = 'Pending'
      }
    })
    this.leave_withdarawal_list = [...this.leave_withdarawal_list,...selectedArray];
    this.leave_preview = this.leave_preview.filter(res => {return !res['isChecked']});
    this.leave_withdarawal_list.map(res => {
      res['isChecked'] = false
    })
  }

  sendLeavePreview(){
    this.sendApproval = false;
    let selectedArray = this.leave_withdarawal_list.filter(res => {return res['isChecked'] == true});
    selectedArray.map(resS => {
      if(resS.oldStatus){
        resS.status = resS.oldStatus
      }
    })
    this.leave_preview = [...this.leave_preview,...selectedArray];
    this.leave_withdarawal_list = this.leave_withdarawal_list.filter(res => {return !res['isChecked']});
    this.leave_preview.map(res => {
      res['isChecked'] = false
    })
  }

  sure_submit(){
    let datas: any = {
      doctype: 'Leave Withdrawal',
      employee: localStorage['employee_id'],
      employee_name: localStorage['employee_name'],
      filter_start_date: this.filterStartDate,
      filter_end_date: this.filterEndDate,
      posting_date: this.db.current_event_date,
      withdraw_reason: this.withdrawal_form.value['reason']
    }

    if(this.leave_preview && this.leave_preview.length != 0){
      datas['leave_preview'] = this.leave_preview;
    }

    if(this.leave_withdarawal_list && this.leave_withdarawal_list.length != 0){
      datas['leave_withdraw_date'] = this.leave_withdarawal_list;
    }

    if(this.withdrawalDetail && this.withdrawalDetail.name){
      datas['name'] = this.withdrawalDetail.name
    }

    this.db.inset_docs({ data: datas }).subscribe(res => {
      // console.log(res)
      if (res && res.message && res.message.status == 'Success') {
        this.db.sendSuccessMessage("Leave Withdrawal created successfully!")
        setTimeout(() => {
          
        }, 500);
        this.sendApproval = true;
        this.withdrawalDetail = res.message.data;
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

  getWithdrawalDetail(id){
    let data = {
      doctype: 'Leave Withdrawal',
      name: id
    }
    this.db.doc_detail(data).subscribe(res => {
      console.log(res)
      if(res && res.message && res.message.length != 0 && res.message[0].status == 'Success'){
        this.withdrawalDetail = res.message[1]
        if(res.message[1] && res.message[1].leave_preview && res.message[1].leave_preview.length != 0){
          this.leave_preview = res.message[1].leave_preview
        }
        if(res.message[1] && res.message[1].leave_withdraw_date && res.message[1].leave_withdraw_date.length != 0){
          this.leave_withdarawal_list = res.message[1].leave_withdraw_date
        }
        this.filterStartDate = res.message[1].filter_start_date
        this.filterEndDate = res.message[1].filter_end_date
      }
    })
  }

  changeStatus(event,item){
    item['status'] = event.detail.value
    this.sendApproval = false;
  }

  async editLeaveLeavePreview(list,type, data,index){
    const modal = await this.modalCtrl.create({
      component: LeavePreviewWithdrawFormComponent,
      cssClass: 'job-detail-popup',
      componentProps: {
        editFormValues: data,
        title: type
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();
    console.log(val)
    if(val && val.data){
      list[index] = val.data
    }
  }

  async addNewForm(list,type){
    const modal = await this.modalCtrl.create({
      component: LeavePreviewWithdrawFormComponent,
      cssClass: 'job-detail-popup',
      componentProps: {
        editFormValues: {},
        title: type
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();
    if(val && val.data){
      console.log(val)
      list.splice(0, 0, val.data)
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { DbService } from '../../../services/db.service';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { DatePipe } from '@angular/common';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CommonDetailComponent } from 'src/app/components/common-detail/common-detail.component';
@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.page.html',
  styleUrls: ['./attendance-list.page.scss'],
})
export class AttendanceListPage implements OnInit {
  page_no = 1
  loader = true;
  no_products = false;
  attendance_list : any;
  
  changedDate: any;
  time:any
  checkin_time : any;
  checkout_time : any;
  checkin = true;
  checkout = true;
  // logIn_type = true;
  spinner = true;
  segment_value = 'check';
  
  constructor(public db : DbService,private modalCtrl:ModalController,public router: Router,private route :ActivatedRoute, public actionsheetCtrl: ActionSheetController) { }

  ngOnInit() {
    let today = new Date();
    this.time = new Date().toLocaleTimeString([], { hour12: false })
    this.changedDate = '';
    let pipe = new DatePipe('en-US');
    let ChangedFormat = pipe.transform(today, 'YYYY-MM-dd');
    this.changedDate = ChangedFormat;
  }

  ionViewWillEnter(){
    this.segment_value = 'check';
    this.db.getCurrentLocation();
    this.get_attendance_list();
    this.checkIn();
  }

  segment(eve){
    this.segment_value = eve.detail.value;
  }

  checkIn(){
    this.db.checkIn({date : this.changedDate}).subscribe(res =>{
      if(res && res.data.length !=0){
        this.db.emp_checkIn({id : res.data[0].name}).subscribe(res =>{
          if(res && res.data){
            res.data.map(res =>{
              this.spinner = false;
              if(res.log_type == "IN"){
                this.checkin = false;
                // this.checkin_time = res.time;
                let data =  res.time.split(' ')
                this.checkin_time = data[1];
              }else if(res.log_type == "OUT"){
                this.checkout = false;
                // this.checkout_time = res.time;
                let data =  res.time.split(' ')
                this.checkout_time = data[1];
              }
            })
          }
        })
      }else{
        this.spinner = false;
      }
    })
  }

  check_In(type){
    // this.router.navigateByUrl('/edit-form/attendance-check')
    // this.db.edit_form_data.employee = 'HR-EMP-00093'
    // this.db.edit_form_data.log_type = this.logIn_type ? 'IN' : 'OUT';
    // this.db.edit_form_data.time = this.changedDate +' '+ this.time;
    // this.db.edit_form_data.device_id = this.db.current_address;
    // data.shift = "Day Shift"
    let data = {
      "employee": localStorage['employee_id'],
      "employee_name": localStorage['CustomerName'],
      "log_type": type,
      "shift": "Day Shift",
      "time":this.changedDate +' '+ this.time,
      "device_id":this.db.current_address
    }
    this.db.employee_checkin({data : data}).subscribe(res =>{
      if(res && res.data && res.data.status == 'Success'){
        this.db.alert(res.data.message);
        type == 'IN' ? this.checkin = false : this.checkout = false;
      }else{
        this.db.alert(res.data.message);
      }
    })
  }



  get_attendance_list(){
    let data = {
      doctype : "Attendance",
      fields : ['employee_name','status','attendance_date','name'],
      page_no : this.page_no,
      page_size : 20,
      order_by : "creation desc",
      filters : { employee_name : localStorage['CustomerName']}
    }
    this.db.sub_product_category(data).subscribe( (res : any) => {
      this.loader = false;
      if(res && res.message && res.message.length != 0){
        if(this.page_no == 1){
          this.attendance_list = res.message
        }else{
          this.attendance_list = [...this.attendance_list,...res.message]
        }
      }else{
        this.no_products = true
        this.page_no == 1 ? this.attendance_list = [] : null;
      }
      setTimeout(() => {
        this. loader = false;
      }, 1000);
    })
  }

  loadData(data:any) {
    if(!this.no_products){
      this.page_no = this.page_no + 1;
      this.get_attendance_list();
    }
    setTimeout(()=>{ data.target.complete() },400);
  }

  // goto_details(data){
  //   this.router.navigateByUrl("/attendance-details/" + data.name);
  // }

  openMenu(id){
    this.db.action_data({id : id}).subscribe(res =>{
      if(res && res.data.length !=0){
        this.popup_time(res.data);
      }else{
        this.db.alert("No Time for In and Out")
      }
    })
  }

  async popup_time(item) {
    const modal = await this.modalCtrl.create({
      component: CommonDetailComponent,
      cssClass: 'time_popup',
      componentProps: {
        time: this.action_data(item),
      },
    });
    await modal.present();
  }

  action_data(item){
      let time: any = {};
      item.map(res =>{
        if(res.log_type == 'IN'){
          let data =  res.time.split(' ')
          time.In_time = data[1];
          time.in_device_id = res.device_id;
        }else if(res.log_type == 'OUT'){
          let data =  res.time.split(' ')
          time.Out_time = data[1];
          time.out_device_id = res.device_id;
        }
      })
      return time 
  }



  // async action_data(item) {
  //   let In_time:any; 
  //   let Out_time:any; 
  //     item.map(res =>{
  //       if(res.log_type == 'IN'){
  //         In_time = res.time ? res.time : '';
  //       }else if(res.log_type == 'OUT'){
  //         Out_time = res.time ? res.time : '';
  //       }
  //     }) 
  //   const actionSheet = await this.actionsheetCtrl.create({  
  //     header: 'DateTime',
  //     buttons : this.boi(In_time,Out_time)
      // buttons: [  
      //   {    
      //     text: 'In  ' + ' ' +  In_time,  
      //     role: 'destructive',  
      //     handler: () => {  
      //       // console.log('Destructive clicked');  
      //     }  
      //   },
      //   {
            
      //     text: 'Out  ' + ' ' +  Out_time,  
      //     role: 'destructive',  
      //     handler: () => {  
      //       // console.log('Destructive clicked');  
      //     }  
      //   },
      //   {  
      //     text: 'Cancel',  
      //     role: 'cancel',  
      //     handler: () => {  
      //       // console.log('Cancel clicked');  
      //     }  
      //   }  
      // ]  
  //   });  
  //   await actionSheet.present();  
  // } 
  
  
  boi(In_time,Out_time){
    let val:any = []
    if(In_time && Out_time){
      val = [  
        {   
          text: 'In  ' + ' ' +  In_time,  
          role: 'destructive',  
          handler: () => {  
            
          }  
        },
        {    
          text: 'Out  ' + ' ' +  Out_time,  
          role: 'destructive',  
          handler: () => {  
           
          }  
        },
        {  
          text: 'Cancel',  
          role: 'cancel',  
          handler: () => {  
          
          }  
        }  
      ]  
      return val
    }else if(In_time){
      val = [  
        {   
          text: 'In  ' + ' ' +  In_time,  
          role: 'destructive',  
          handler: () => {  
            
          }  
        },
        {  
          text: 'Cancel',  
          role: 'cancel',  
          handler: () => {  
          
          }  
        }  
      ]  
      return val
    }else if(Out_time){
      val = [  
        {    
          text: 'Out  ' + ' ' +  Out_time,  
          role: 'destructive',  
          handler: () => {  
           
          }  
        },
        {  
          text: 'Cancel',  
          role: 'cancel',  
          handler: () => {  
          
          }  
        }  
      ]  
      return val
    }
  }

}



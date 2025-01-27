import { Component, OnInit,Input } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { DatePipe  } from '@angular/common';
import {
  AlertController,
  LoadingController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { format, parse } from 'date-fns';
import * as moment from 'moment';
import { YearPopupComponent } from '../year-popup/year-popup.component';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegularizationFormComponent } from '../leaves-module/regularization-form/regularization-form.component';
let ip_address;
@Component({
  selector: 'app-checkin-multiple',
  templateUrl: './checkin-multiple.component.html',
  styleUrls: ['./checkin-multiple.component.scss'],
})
export class CheckinMultipleComponent  implements OnInit {

  loadNext = true;
  all_values:any = [];
  list:any = [];
  changedDate:any;
  today:any;
  time:any;
  checkin:any;
  fromTime:any;
  toTime:any;
  elapsedTime:any;
  timerInterval:any;
  last_check_In_name: any;
  current_date: any;
  employee_checkin_list: any = [];
  totalSeconds = 0;
  @Input() attendance:any;
  @Input() detail:any;
  @Input() popup:any;
  @Input() showChekinout:any;
  show_timer:boolean = false;
  page_title:any=''
  doc_type:any = "Attendance"
  latitude:any;
  longitude:any;
  locationError:any;
  chartDay:any = [
    // {name: 'Monthly', selected: false, route: 'Monthly'}
    // {name: 'Daily', selected: false, route: 'Daily'},
  ]
  employee_id:any;
  is_Attendance:any = false;
  constructor(private http: HttpClient,private geo: Geolocation,private locationAccuracy: LocationAccuracy,private loadingCtrl:LoadingController,private platform: Platform,public db:DbService, public datePipe:DatePipe, public alertCtrl:AlertController, public modalCtrl: ModalController) { }

  ngOnInit() {
    if(this.db.employee_role && !this.popup){
      this.db.getCurrentLocation()
    }
    if (this.platform.is('android')) 
     this.db.enable_location();
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    this.current_date = formattedDate;
    let employee_id = localStorage['employee_id']

    this.today = new Date();
    this.time = new Date().toLocaleTimeString([], { hour12: false })
    this.changedDate = '';
    let pipe = new DatePipe('en-US');
    let ChangedFormat
    if(this.detail && this.detail.attendance_date && this.popup){
      employee_id = this.detail.name
      if(this.current_date == this.detail.attendance_date ){
        this.show_timer = true
      }else{
        this.show_timer = false
      }


      this.page_title = `Attendance - ( ${this.detail.attendance_date} )`

      let dateString = this.detail.attendance_date
      const [year , monthNumber, day] = dateString.split('-');
      this.selectedYear = year;
      this.selectedMonth = Number(monthNumber)
     
      ChangedFormat = (this.detail && this.detail.attendance_date) ? this.detail.attendance_date : pipe.transform(this.today, 'YYYY-MM-dd');
      this.current_date = this.detail.attendance_date
    }else{
      this.show_timer = true
    }

    this.changedDate = ChangedFormat;
    this.employee_id = employee_id;
    this.get_employee_checkin(employee_id)

    if(this.popup){
      console.log(month,'month')
      this.months.map((res, index) => {
        if(index+1 == Number(month)){
          res['isActive'] = true;
          let eve = {
            name: res.name
          }
          this.menu_name(eve);
        }else{
          res['isActive'] = false;
        }
      })
    }
      this.http.get<{ ip: string }>('https://api.ipify.org?format=json').subscribe((data) => {
        ip_address = data.ip;
      });
  }


  // checkInDetails(){
  //   this.db.checkIn({date : this.changedDate}).subscribe(res =>{
  //     if(res && res.data.length != 0){
  //       this.db.emp_checkIn({id : res.data[0].name}).subscribe(res =>{
  //        this.loadNext = false;
  //         if(res && res.data){
  //           this.last_check_In_name = res.data[0]
  //           this.all_values = res.data;
  //           if(this.all_values.length != 0){
  //             // let lastIndex =  this.all_values.length - 1
  //             this.list = this.all_values;
  //             let lastIndex = 0
  //             let obj = this.all_values[lastIndex]
  //             let time =  this.getTimeFromTimestamp(obj['time'])
  //             this.db.checkInOutTime = time;
  //             this.db.checkInOutDetail = obj['log_type'] == "IN" ? 'Your last check in was ' + time : 'Your last check out was ' + time
  //             if(obj['log_type'] == 'IN'){
  //               this.list.splice(0,1)
  //               this.checkin = false;
  //               this.db.checkin = false;
  //               this.fromTime = obj.time;
  //               this.startTimer()
  //             }else{
  //               this.checkin = true
  //               this.db.checkin = true;
  //             }
  //           }else{
  //             this.checkin = true
  //             this.db.checkin = true;
  //           }
            
  //         }
  //       })
  //     }else{
  //       this.checkin = true
  //       this.db.checkin = true;
  //       this.loadNext = false;
  //     }
  //   })
  // }

  // check_In1(type){
  //   if (this.platform.is('android')) 
  //    this.db.enable_location();


  //   if(!this.show_timer){
  //     // this.db.sendErrorMessage("User already checkin...");
  //     return;
  //   }

  //   // console.log(this.last_check_In_name)
  //   this.today = new Date();
  //   this.time = new Date().toLocaleTimeString([], { hour12: false })
  //   this.changedDate = '';
  //   let pipe = new DatePipe('en-US');
  //   let ChangedFormat = pipe.transform(this.today, 'YYYY-MM-dd');
  //   this.changedDate = ChangedFormat;

  //   let data = {
  //     "employee": localStorage['employee_id'],
  //     "employee_name": localStorage['CustomerName'],
  //     "log_type": type,
  //     // "shift": "Day Shift",
  //     "time":this.changedDate +' '+ this.time,
  //     "device_id":this.db.current_address,
  //     "last_checkin": type == "OUT" ? (this.last_check_In_name && this.last_check_In_name.name) : null,
  //     latitude: (this.db.location_info && this.db.location_info.latitude) ? this.db.location_info.latitude : '',
  //     longitude: (this.db.location_info && this.db.location_info.longitude) ? this.db.location_info.longitude : '',
  //     custom_office_type:"HO"
  //     // "custom_check_in": type == "OUT" ? (this.last_check_In_name && this.last_check_In_name.name) : null
  //   }
  //   // if(this.db.location_info && this.db.location_info.latitude != undefined && this.db.location_info.latitude != '' && this.db.location_info && this.db.location_info.longitude != undefined && this.db.location_info.longitude != ''){
  //     this.db.employee_checkin({data : data}).subscribe(res =>{
  //     if(res && res.data && res.data.status && res.data.status == 'Success' || (res && res.status && res.status == 'Success')){
  //       // this.db.alert(res.data.message);
  //       if(type == 'IN'){
  //         this.checkin = false;
  //         this.db.alert('Check In successfully');
  //         // this.db.sendSuccessMessage('Check In successfully');
  //         // this.fromTime = res.data.data.time;
  //         // this.startTimer()
  //       }else{
  //         this.db.alert('Check Out successfully');
  //         // this.db.sendSuccessMessage('Check Out successfully');
  //         this.fromTime = undefined;
  //         this.checkin = true;
  //         this.stopTimer()
  //       }
  //       this.get_employee_checkin(localStorage['employee_id'])
  //       // this.checkInDetails();

  //     }else{
  //       let alert = (res.message && res.message.message) ? res.message.message : 'Something went wrong try again later'
  //       this.db.alert(alert);
  //       // this.db.sendErrorMessage(alert);
  //       // this.db.alert(res.data.message);
  //     }
  //     })
  //   // }
  //   // else{
  //   //   this.check_In1(type)
  //   // }
  // }

  // startTimer() {

  //   if (!this.fromTime) {
  //     this.fromTime = moment();
  //   }

  //   if (this.toTime) {
  //     const elapsedMilliseconds = moment().diff(this.fromTime);
  //     this.fromTime = moment().subtract(elapsedMilliseconds);
  //   }

  //   this.toTime = null;
  //   this.updateElapsedTime();

  //   this.timerInterval = setInterval(() => {
  //     this.updateElapsedTime();
  //   }, 1000);

  // }

  // stopTimer() {
  //   this.fromTime = undefined;
  //   this.elapsedTime = undefined;
  //   this.formatElapsedTime();
  // }

  formatElapsedTime(): any {
    if (this.elapsedTime) {
      const hours = Math.floor(this.elapsedTime.asHours());
      const minutes = this.elapsedTime.minutes();
      const seconds = this.elapsedTime.seconds();
      // this.time_duration = hours;
      return `${hours < 10 ? ('0' + hours) : hours} : ${minutes < 10 ? ('0' + minutes) : minutes} : ${seconds < 10 ? ('0' + seconds) : seconds}`;
    } else {
      return '00:00:00';
    }
  }


  updateElapsedTime() {
    if (this.fromTime) {
      if (this.toTime) {
        this.elapsedTime = moment.duration(this.toTime.diff(this.fromTime));
      } else {
        this.elapsedTime = moment.duration(moment().diff(this.fromTime));
      }
    }
  }


  getTimeFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return this.datePipe.transform(date, 'h:mm a');
  }

  get_employee_checkin(employee_id){
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    this.changedDate = `${year}-${month}-${day}`;
    let datas = {
      "employee": localStorage['employee_id'],
      "employee_name": localStorage['CustomerName'],
      "date":this.changedDate
    }
    this.db.checkIn(datas).subscribe(res => {
      this.loadNext = false;
      if(res && res.message && res.message.status == "success"){
        this.is_Attendance = true;
      }else if(res && res.message && res.status == "Employee Not Found"){
        this.db.alert(res.message)
      }
    })
    // let data = {
    //     employee_id : employee_id,
    //     date: this.current_date
    // }
    // this.db.get_employee_checkin(data).subscribe(res => {
    //   // console.log(res)
    //   this.loadNext = false;

    //   if(res && res.status && res.status == "Success" && (res.message && res.message.length != 0)){
    //     this.employee_checkin_list = res.message;
    //     this.calculateTotalDuration();

    //     let lastIndex = 0
    //     let obj = this.employee_checkin_list[lastIndex]
    //     let time =  this.getTimeFromTimestamp(obj['out_time'] ? obj['out_time'] : obj['in_time'])
    //     this.db.checkInOutDetail = obj['out_time'] ? 'Your last check out was ' + time : 'Your last check in was ' + time 
    //     this.last_check_In_name = obj
        
    //     if(obj['out_time']){
    //       this.checkin = true
    //       this.db.checkin = true;
    //     }else{
    //       this.checkin = false;
    //       this.db.checkin = false;
    //       this.fromTime = obj.in_time;
    //       // this.startTimer()
    //     }
    //   }else{
    //     this.employee_checkin_list = []
    //     this.checkin = true
    //     this.db.checkin = true;
    //   }
    // })
  }

  calculateTotalDuration(): string {
    let totalSeconds = 0;

    // Calculate total seconds
    this.employee_checkin_list.forEach(res_duration => {
      const [hours, minutes, seconds] = res_duration.duration.split(':').map(Number);
      totalSeconds += hours * 3600 + minutes * 60 + seconds;
    });

    // Convert total seconds back to hours, minutes, and seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  // Helper function to pad single digit numbers with leading zeros
  pad(num: number): string {
    return (num < 10 ? '0' : '') + num;
  }

  async check_In(type){
    if(type == 'IN'){
      
      let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
      await loader.present();
      setTimeout(() => {
        loader.dismiss()
      }, 12000);
      // this.db.get_ip().subscribe(async res =>{
      //   ip_address = res.ip;
      // })
       
      this.geo
    .getCurrentPosition()
    .then((resp) => {
      const latitude = resp.coords.latitude;
      const longitude = resp.coords.longitude;
    this.today = new Date();
    this.time = new Date().toLocaleTimeString([], { hour12: false })
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    this.changedDate = `${year}-${month}-${day}`;
    let data = {
      user:localStorage['customerRefId'],
      "time":this.changedDate +' '+ this.time,
      ip:ip_address,
      latitude: latitude,
      longitude:longitude,
      platform:'Mobile'
    }
      this.db.attendance_checkin(data).subscribe(async res =>{
        setTimeout(() => {
          loader.dismiss()
        }, 100);
      if(res && res.message && res.message.status && res.message.status == 'success'){
          this.db.alert('Attendance created successfully');
          this.fromTime = undefined;
          this.checkin = true;
        this.get_employee_checkin(localStorage['employee_id'])
      }else if(res.message.missing_days){
        const modal = await this.modalCtrl.create({
          component: RegularizationFormComponent,
          // cssClass: 'yearPopup',
          componentProps: {
            title:'Attendance Adjustment Tool',
            selectedYear: this.selectedYear
          },
          enterAnimation: this.db.enterAnimation,
          leaveAnimation: this.db.leaveAnimation,
        });
        await modal.present();
        const { data } = await modal.onWillDismiss();
        if (data && data) {


        }
      }
      else if(res._server_messages){
        let d = JSON.parse(res._server_messages)
        let f = JSON.parse(d[0])
        this.db.sendErrorMessage(f.message)
      }
      else{
        let alert = (res.message && res.message.message) ? res.message.message : 'Something went wrong try again later'
        this.db.alert(alert);
        // const modal = await this.modalCtrl.create({
        //   component: RegularizationFormComponent,
        //   // cssClass: 'yearPopup',
        //   componentProps: {
        //     title:'Attendance Adjustment Tool',
        //     selectedYear: this.selectedYear
        //   },
        //   enterAnimation: this.db.enterAnimation,
        //   leaveAnimation: this.db.leaveAnimation,
        // });
        // await modal.present();
      }
      })
    })
    .catch((error) => {
      console.log('Error getting address', error);
      loader.dismiss()
      setTimeout(() => {
        this.enable_location(type)
      }, 1000)
    });

    }
    // this.db.location_info.latitude = ''
    // this.db.location_info.longitude = ''
    // this.db.getCurrentLocation();
    // if (this.platform.is('android') || this.platform.is('ios')) 
    //   this.db.enable_location();
    // if(type == 'IN'){
    //   // let loader = await this.loadingCtrl.create({ message: 'Please Wait...'});
    //   // await loader.present();
    //   // setTimeout(() =>{
    //   //   loader.dismiss();
    //     this.check_In1(type);
    //   // },1500)
    // }else{
    //   const alert = await this.alertCtrl.create({
    //     header: 'Checkout',
    //     message: 'Are you sure do you want to checkout?',
    //     buttons: [
    //       {
    //         text: 'No',
    //         handler: () => {
    //           this.alertCtrl.dismiss();
    //         },
    //       },
    //       {
    //         text: 'Yes',
    //         handler: () => {
    //         this.check_In1(type);
    //         },
    //       },
    //     ],
    //   });
    //   await alert.present();
    // }


  }


  enable_location(type) {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
          this.check_In(type);
        },
        error => {
          setTimeout(() => {
            this.check_In(type);
          }, 1500)
          console.log('Error requesting location permissions', error)
        }
      )
    }), error => console.log('Error requesting location permissions', error);
  }


routeValue:any
monthwise_checkins:any =[];
selectedYear:any;
selectedMonth:any;
monthWiseSkeleton =true;

async yearPopUp(showYear) {
  const modal = await this.modalCtrl.create({
    component: YearPopupComponent,
    cssClass: 'yearPopup',
    componentProps: {
      selectedYear: this.selectedYear
    },
    enterAnimation: this.db.enterAnimation,
    leaveAnimation: this.db.leaveAnimation,
  });
  await modal.present();
  const { data } = await modal.onWillDismiss();
  if (data && data.name) {
    this.monthwise_checkins = [];
    this.selectedYear = data.name;
    this.monthWiseSkeleton = true;
    if(!this.routeValue){
      this.routeValue = this.months[this.selectedMonth - 1].name
      this.db.tab_buttons(this.months, this.routeValue, 'name');
    }
    this.employee_monthwise_checkins();
  }
}

  menu_name(eve: any) {
    this.monthwise_checkins = [];
    this.routeValue = eve.name
    this.monthWiseSkeleton = true;
    let extractedMonth = this.months.findIndex(res=>{ return res.name == eve.name})
    this.selectedMonth = extractedMonth + 1
    this.employee_monthwise_checkins()
  }

  employee_monthwise_checkins(){
    let data = {
        employee : this.employee_id,
        "month_filter": {
            "month": Number(this.selectedMonth),
            "year": Number(this.selectedYear)
        }
    }
    this.db.employee_monthwise_checkins(data).subscribe(res => {
      this.monthWiseSkeleton = false;
       if(res.status == 'Success'){
        this.monthwise_checkins = res.message
       }
    },error=>{
      this.monthWiseSkeleton = false;
    })
  }

  getFormattedTime(timeString): string {
    const parsedTime = parse(timeString, 'HH:mm:ss', new Date());
    return format(parsedTime, 'hh:mm a');
  }

  months = [
    { value: "January", name: "Jan", },
    { value: "February", name: "Feb" },
    { value: "March", name: "Mar" },
    { value: "April", name: "Apr" },
    { value: "May", name: "May" },
    { value: "June", name: "Jun" },
    { value: "July", name: "Jul" },
    { value: "August", name: "Aug" },
    { value: "September", name: "Sep" },
    { value: "October", name: "Oct" },
    { value: "November", name: "Nov" },
    { value: "December", name: "Dec" }
  ]

}

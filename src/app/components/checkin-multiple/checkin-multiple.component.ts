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
import { Geolocation } from '@capacitor/geolocation';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
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
  coordinates:any;
  constructor(private http: HttpClient,private locationAccuracy: LocationAccuracy,private loadingCtrl:LoadingController,private platform: Platform,public db:DbService, public datePipe:DatePipe, public alertCtrl:AlertController, public modalCtrl: ModalController) { }

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
      // console.log(month,'month')
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
      try {
      let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
      await loader.present();
      this.coordinates = await Geolocation.getCurrentPosition();

      const latitude = this.coordinates.coords.latitude;
      const longitude = this.coordinates.coords.longitude;

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
        }, 1000);
      if(res && res.message && res.message.status && res.message.status == 'success'){
          this.db.alert('Attendance created successfully');
          this.fromTime = undefined;
          this.checkin = true;
        this.get_employee_checkin(localStorage['employee_id'])
      }else if(res.message.missing_days){
        const modal = await this.modalCtrl.create({
          component: RegularizationFormComponent,
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
      }
      })
  } catch (error) {
    console.error('Error getting location:', error);
    this.enable_location(type)
    setTimeout(() => {
      this.loadingCtrl.dismiss()
    },100)
     // You can pass options if necessary
  }

    }
  }


  async enable_location(type) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-alert-class',
      header: "Enable Location",
      message: `Please enable the GPS (location) on the mobile device.`,
      backdropDismiss: false,
      buttons: [{
        text: 'No',
        handler: () => {
          this.enable_location(type);
        }
      },
      {
        text: 'Yes',
        handler: () => {
          NativeSettings.open({
            optionAndroid: AndroidSettings.Location, 
            optionIOS: IOSSettings.LocationServices
          });
        }
      }]
    });
    await alert.present();
    // this.locationAccuracy.canRequest().then((canRequest: boolean) => {
    //   this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
    //     () => {
    //       this.check_In(type);
    //     },
    //     error => {
    //       setTimeout(() => {
    //         this.check_In(type);
    //       }, 1500)
    //       console.log('Error requesting location permissions', error)
    //     }
    //   )
    // }), error => console.log('Error requesting location permissions', error);
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

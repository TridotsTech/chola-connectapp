import { Component, OnInit,Input } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { AlertController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';

@Component({
  selector: 'app-checkin-checkout',
  templateUrl: './checkin-checkout.component.html',
  styleUrls: ['./checkin-checkout.component.scss'],
})
export class CheckinCheckoutComponent  implements OnInit {

  coordinates : any
  @Input() changedDate: any;
  @Input() time:any
  checkin_time : any;
  checkout_time : any;
  checkin = true;
  checkout = true;
  // logIn_type = true;
  spinner = true;
  segment_value = 'check';

  constructor(public db:DbService,private alertController: AlertController) { }

  ngOnInit() {
    this.checkLocationEnabled();
    this.db.getCurrentLocation();
    this.checkIn();
  }

  ionViewWillEnter(){
    this.checkLocationEnabled();
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
                this.checkin = false;
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

  async checkLocationEnabled() {
    try {
      this.coordinates = await Geolocation.getCurrentPosition();
      console.log('Current position:', this.coordinates);
    } catch (error) {
      console.error('Error getting location:', error);
      this.enable_location()
       // You can pass options if necessary
    }
  }

  async enable_location() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-alert-class',
      header: "Enable Location",
      message: 'For a better experience, turn on device location, Which uses Google Location Service',
      buttons: [{
        text: 'No',
        handler: () => {
          this.alertController.dismiss();
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
  }

}

import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-purchase',
  templateUrl: './car-purchase.page.html',
  styleUrls: ['./car-purchase.page.scss'],
})
export class CarPurchasePage implements OnInit {

  search_data: any = {};
  page_no: any = 1;
  page_length: any = 20;
  carPurchaselist: any = [];
  @Input() modalPopup:any;
  constructor(public db:DbService, private router: Router, public modalCtrl:ModalController, private zone: NgZone) { }

  ngOnInit() {
    this.getcarPurchaselist();

  }

  getcarPurchaselist(){
    let data = {
      user_id: localStorage['customerRefId'],
    }
    this.db.get_request(data).subscribe(res => {
      // if(res.)
      if(res.message.status != 'failed')
        this.carPurchaselist = res.message
      // console.log(this.car_request)
    })
  }

}

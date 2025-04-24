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

  }

  getcarPurchaselist(){
    let data = {
      "doctype_name": "Car Purchase Request",
      "search_data": this.search_data,
      "docname": "",
      "fetch_child": true,
      "page_no": this.page_no,
      "page_length": this.page_length,
      "view_type": "List View",
    }
    this.db.get_tempate_and_datas(data).subscribe(res => {
      if(res && res.message && res.message.data && res.message.data.length != 0 && res.status == 'success'){
        if(this.page_no == 1){
          this.db.get_saleslist = res.message;
          this.db.get_saleslist.data = res.message.data;
        }else{
          this.db.get_saleslist.data = [...this.db.get_saleslist.data,...res.message.data]
        }
      }else{
        this.page_no == 1 ? this.db.get_saleslist.data = [] : null;
      }
    })
  }

}

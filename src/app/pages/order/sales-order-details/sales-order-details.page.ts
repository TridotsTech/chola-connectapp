import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { AlertController, MenuController,LoadingController, ModalController,AnimationController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-sales-order-details',
  templateUrl: './sales-order-details.page.html',
  styleUrls: ['./sales-order-details.page.scss'],
})
export class SalesOrderDetailsPage implements OnInit {

  @Input() type;
  @Input() order_id;
  @Input() doctype;

  order_detail:any;
  detail_doc:any = {};

  constructor(public modalCtrl: ModalController,public db:DbService,public router:ActivatedRoute, private route : Router) { }


  ngOnInit() {

    let check = this.db.check_permission('Sales Invoice','create');
    if(check){
      this.detail_doc['name'] = 'Create Sale Invoice';
      // this.detail_doc['route'] = '/forms/sale-order';
    }

    this.router.params.subscribe(res=>{
      if(res && res['route_1']){
        this.get_order_details(res['route_1']);
      }
    })

    if(this.order_id){
      this.get_order_details(this.order_id);
    }
  }


  get_order_details(name){
    let data = {
      name:name,
      doctype:this.doctype ? this.doctype:'Sales Order'
      // doctype:'Sales Order'
    }

    this.db.doc_detail(data).subscribe(res=>{
      if(res.message && res.message[0]['status'] && res.message[0]['status'] == 'Success'){
        this.order_detail = res.message[1]
      }
    })
  }


  close_modal(){
    this.modalCtrl.dismiss();
  }

  submit(){
    this.modalCtrl.dismiss('success');
  }

}
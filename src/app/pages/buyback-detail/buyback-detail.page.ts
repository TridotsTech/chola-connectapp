import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-buyback-detail',
  templateUrl: './buyback-detail.page.html',
  styleUrls: ['./buyback-detail.page.scss'],
})
export class BuybackDetailPage implements OnInit {
  buybackDetail: any = {};
  loader_ = true;
  constructor(private route: ActivatedRoute, public db: DbService,private loadingCntrl: LoadingController) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      console.log(res['id']);
      this.loader_ = true;
      this.getBuyBackDetail(res['id']);
    })
  }

  async getBuyBackDetail(id){
    let data = {
      doctype: 'Asset Buyback',
      name: id
    }
    this.db.doc_detail(data).subscribe(res => {
      this.loader_ = false;
      console.log(res)
      if(res && res.message && res.message.length != 0 && res.message[0] && res.message[0].status == 'Success'){
        this.buybackDetail = res.message[1];
      }else{
        this.buybackDetail = {};
      }
    })
  }

}

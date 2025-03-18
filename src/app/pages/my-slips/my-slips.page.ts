import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MyslipDownloadComponent } from 'src/app/components/myslip-download/myslip-download.component';

@Component({
  selector: 'app-my-slips',
  templateUrl: './my-slips.page.html',
  styleUrls: ['./my-slips.page.scss'],
})
export class MySlipsPage implements OnInit {

  constructor(public modalCtrl:ModalController) { }

  ngOnInit() {
  }

  async download(title){
    if(title == 'Salary Slip'){
      const modal = await this.modalCtrl.create({
        component: MyslipDownloadComponent,
        cssClass: 'download-slip-popup',
        componentProps: {
          title:title
        }
      });
      await modal.present();
    }
  }
}

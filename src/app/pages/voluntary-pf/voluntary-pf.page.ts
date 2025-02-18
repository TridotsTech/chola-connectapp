import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewVoluntaryPfComponent } from 'src/app/components/new-voluntary-pf/new-voluntary-pf.component';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-voluntary-pf',
  templateUrl: './voluntary-pf.page.html',
  styleUrls: ['./voluntary-pf.page.scss'],
})
export class VoluntaryPfPage implements OnInit {
  voluntaryList: any = {};
  constructor(public db: DbService,public modalCntrl: ModalController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getVoluntaryPfList();
  }

  getVoluntaryPfList(){
    let data = {
      "doctype_name": "Employee VPF",
      "search_data": "",
      "docname": "",
      "fetch_child": true,
      "page_no": 1,
      "page_length": 20,
      "view_type": "List View"
    }
    this.db.get_tempate_and_datas(data).subscribe(res => {
      if(res && res.message && res.message.data && res.message.data.length != 0){
        this.voluntaryList = res.message.data[0]
      }else
        this.voluntaryList = {};
    })
  }

  async newVoluntarypf(){
    const modal = await this.modalCntrl.create({
      component: NewVoluntaryPfComponent,
      cssClass: 'new-vpf-form'
    })
    await modal.present();
    const val = await modal.onWillDismiss();
    if(val && val.data){
      this.getVoluntaryPfList();
    }
  }

}

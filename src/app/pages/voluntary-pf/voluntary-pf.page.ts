import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-voluntary-pf',
  templateUrl: './voluntary-pf.page.html',
  styleUrls: ['./voluntary-pf.page.scss'],
})
export class VoluntaryPfPage implements OnInit {
  voluntaryList: any = {};
  constructor(public db: DbService) { }

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
      console.log(res);
      if(res && res.message && res.message.data && res.message.data.length != 0){
        this.voluntaryList = res.message.data[0]
      }else{
        this.voluntaryList = {};
      }
    })
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-job-opening-list',
  templateUrl: './job-opening-list.component.html',
  styleUrls: ['./job-opening-list.component.scss'],
})
export class JobOpeningListComponent  implements OnInit {
@Input() doctype: any;
@Input() selectedValue: any;
page_no = 1;
no_products = false;
jobOpeningList: any = [];
  constructor(public db: DbService, public modalcntrl: ModalController) { }

  ngOnInit() {
    this.getJobOpening();
  }

  getJobOpening(){
    let data = {
      doctype : 'Job Opening',
      fields: ["*"],
      page_no : this.page_no,
      page_size : 20,
    }
    this.db.get_list(data).subscribe(res =>{
      if(res && res.message && res.message.length != 0){
        if(this.page_no == 1){
          this.jobOpeningList = res.message
        }else{
          this.jobOpeningList  = [...this.jobOpeningList,...res.message]
        }

        if(this.selectedValue){
          this.jobOpeningList.map(resSelect => {
            if(resSelect.name == this.selectedValue){
              resSelect.isSelected = true;
            }else{
              resSelect.isSelected = false;
            }
          })
        }

      }else{
        this.no_products = true;
        this.page_no == 1 ? this.jobOpeningList = [] : null;
      }
    },error=>{
      this.db.alert('Something went wrong try again later');
    })
  }

  sendJob(data){
    // console.log(data)
    this.modalcntrl.dismiss(data)
  }

}

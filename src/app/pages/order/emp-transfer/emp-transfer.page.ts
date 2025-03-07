import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-emp-transfer',
  templateUrl: './emp-transfer.page.html',
  styleUrls: ['./emp-transfer.page.scss'],
})
export class EmpTransferPage implements OnInit {

  page_no: any = 1;
  page_length: any = 20;
  empTransferList: any = [];
  constructor(public db: DbService) { }

  ngOnInit() {
    this.page_no = 1;
    this.page_length = 10;
    this.get_employee_transfer();
  }

  get_employee_transfer(){
    let data = {
      employee_id: localStorage['employee_id'],
      page_no: this.page_no,
      page_length:this.page_length
    }
    this.db.get_employee_transfers(data).subscribe(res => {
      console.log(res)
      // if(res && res.message && res.message.length != 0 && res.message[0].status == 'Success'){
       
      // }
    })
  }

}

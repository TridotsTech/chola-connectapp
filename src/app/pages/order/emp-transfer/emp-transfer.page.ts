import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-emp-transfer',
  templateUrl: './emp-transfer.page.html',
  styleUrls: ['./emp-transfer.page.scss'],
})
export class EmpTransferPage implements OnInit {

  page_no: any = 1;
  page_length: any =10;
  empTransferList: any = [];
  no_transfer_found = false;
  constructor(public route: Router,public db: DbService) { }

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
      // console.log(res)
      if(res && res.message && res.message.data && res.message.data.length != 0){
        if(this.page_no == 1){
          this.empTransferList = res.message.data;
        }else{
          this.empTransferList = [...this.empTransferList,...res.message.data]
        }
      }else{
        this.no_transfer_found = true;
        this.page_no == 1 ? this.empTransferList = [] : null;
      }
     
    })
  }

  load_more(event){
    if (!this.no_transfer_found) {
      let value = event.target.offsetHeight + event.target.scrollTop + 1;
      value = value.toFixed();
      if (value >= event.target.scrollHeight) {
        this.page_no += 1;
        this.get_employee_transfer();
      }
    }
  }

  goto_route(route){
    this.route.navigateByUrl('/emp-transfer-detail/'+route)
  }

}

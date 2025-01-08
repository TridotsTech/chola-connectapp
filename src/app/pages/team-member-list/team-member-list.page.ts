import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EmployeeReadonlyScreenComponent } from 'src/app/components/employee-readonly-screen/employee-readonly-screen.component';
import { DbService } from 'src/app/services/db.service';
@Component({
  selector: 'app-team-member-list',
  templateUrl: './team-member-list.page.html',
  styleUrls: ['./team-member-list.page.scss'],
})
export class TeamMemberListPage implements OnInit {
  teamList: any;
  page_no: any = 1;
  no_products = false;
  skeleton = true;
  search_txt: any;
  constructor(public db: DbService,public modalCtrl: ModalController) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.skeleton = true;
    this.getEmployeeList();
  }

  search_txt_value(eve) {
    // console.log(eve);
    this.search_txt = eve.target.value;
    this.getEmployeeList();
  }

  clear_txt(eve) {
    // console.log(eve);
    this.search_txt = '';
    this.getEmployeeList();
  }

  getEmployeeList() {
    let data = {
      employee_id: localStorage['employee_id'],
      filters: this.search_txt,
      page_no: this.page_no,
      page_length: 10,
    };
    this.db.get_manager_team_members(data).subscribe((res) => {
      this.skeleton = false;
      // console.log(res);
      if (res && res.message && res.message.length != 0) {
        if(this.page_no == 1){
          this.teamList = res.message;
        }else{
          this.teamList = [...this.teamList,...res.message]
        }
      } else {
        this.no_products = true;
        this.page_no == 1 ? this.teamList = [] : null;
      }
    });
  }

  load_more(event){
    if(!this.no_products){
      let value = event.target.offsetHeight + event.target.scrollTop + 1;
      value = value.toFixed();
      if(value >= event.target.scrollHeight){
        this.page_no += 1;
        this.getEmployeeList();
      }
    }
  }

  async openEmployeeDetail(employeeDetail) {
    const modal = await this.modalCtrl.create({
      component: EmployeeReadonlyScreenComponent,
      cssClass: 'detailDirecory-popup',
      componentProps: {
        employeeDetail: employeeDetail,
        doctype: 'Employee'
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });


    // modal.swipeToCloseEnabled = true;
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.status == 'success') {

    }
  }

  getDateDifference(startDate: Date) {
    const endDate = new Date(); // Current date

    const start = new Date(startDate);
    const end = new Date(endDate);

    let yearsDiff = end.getFullYear() - start.getFullYear();
    let monthsDiff = end.getMonth() - start.getMonth();

    // Adjusting months and years if necessary
    if (monthsDiff < 0) {
      yearsDiff--;
      monthsDiff += 12;
    }

    return `${yearsDiff} yr, ${monthsDiff} m`;
  }

  add_wish(event, data) {
    event.stopPropagation();
    this.db.addTowishList(data)
    // data['fav_employee'] = !data['fav_employee'];
  }
}

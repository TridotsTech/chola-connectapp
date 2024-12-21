import { Component, OnInit, Input, HostListener, NgZone } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { Router } from '@angular/router';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { WebsiteFormsComponent } from 'src/app/components/forms/website-forms/website-forms.component';

@Component({
  selector: 'app-job-applicant-list',
  templateUrl: './job-applicant-list.page.html',
  styleUrls: ['./job-applicant-list.page.scss'],
})
export class JobApplicantListPage implements OnInit {

  job_applicant_category:any = [];
  skeleton = true;
  listValue:any = [{label:'Open' , count:34}, {label:'Selected' , count: 20}, {label:'Rejected' , count:10}  ]
  @Input() selectedName:any
  @Input() modalPopup:any
  search_data: any = {};
  page_no: any = 1;
  page_length: any = 20;
  jobApplicantList: any = [];
  columns: any = [];
  rows: any = [];
  search_filter: any = [];
  searchFilter: any = {};
  search_text: any;
  isHandlingEvent = false;
  active: any
  constructor(public db:DbService, private router: Router, public modalCtrl:ModalController, private zone: NgZone) { }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.db.selected_list = {};
    this.page_no = 1;
    this.page_length = 20;
    this.get_job_applicant_dashboard();
    this.getSearchOption();
  }

  get_job_applicant_dashboard(){

    let data = {
      filters : this.searchFilter,
      page_no : 1,
      page_length : 20
    };
    
    this.db.job_applicant_dashboard(data).subscribe((res:any)=>{
      this.skeleton = false;
      if(res && res.status == 'Success'){
        this.job_applicant_category = res.message;
      }
    })
  }


  load_search(eve){
    let val = {}
    val['project_name'] = ['Like', '%' + eve.target.value + '%']
  }

  clear_txt(eve){
    this.search_text = '';
    let val = {}
    val['job_title'] = ['Like', '%%'];
    this.searchFilter = val
    this.get_job_applicant_dashboard();
  }

  selectCategory(data,i){
    this.active = i;
    this.db.jobOpeningName = data.job_title;
    if(this.modalPopup){
     this.modalCtrl.dismiss({status: 'success',value:data.name});
    }else{
      if(this.db.ismobile){
        this.router.navigateByUrl('/list/job-applicant/' + data.name);
      }else{
        if(this.job_applicant_category && this.job_applicant_category.length != 0){
          this.job_applicant_category.map((res, index) => {
            if(i == index){
              res['isSelected'] = true;
            }else{
              res['isSelected'] = false;
            }
          })
        }
        this.search_data = {
          job_title: ['=', data.name]
        }
        this.search_data = JSON.stringify(this.search_data)
        this.getJobApplicantList()
        this.db.seperateJobSection = true;
        // this.db.selectedJobApplicant = data.name
        // this.router.navigateByUrl('/list/job-applicant');
      }
    }
  }

  ionViewWillLeave(){
    this.db.seperateJobSection = false;
  }

  getJobApplicantList(){
    let data = {
      "doctype_name": "Job Applicant",
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

        this.rows = res.message.keys
            if (!this.db.ismobile && this.rows && this.rows.length != 0) {
              this.db.get_saleslist['table'] = []
              this.columns = []
              this.rows.map((res_upper,index) => {
                let result = res_upper.toUpperCase();
                if (result && result.includes('_')) {
                result = result.replace(/_/g, ' ')
                } 

                this.columns.push({ name: result, prop: res_upper, size: index == 0 ? 250 : res_upper == 'employee_name' ? 400 : 200 })
              // this.columns.push({ name: result, prop: res_upper, size: res_upper == 'employee_name' ? 450 : 300 })
              })

              this.db.get_saleslist['table'] = this.columns;

              for (let i = 0; i < this.db.get_saleslist.data.length; i++) {
                for (let val in this.db.get_saleslist.data[i]) {
                  if (!this.rows.includes(val)) {
                    delete this.db.get_saleslist.data[i][val]
                  }
                }
              }            
            }

      }else{
        this.page_no == 1 ? this.db.get_saleslist.data = [] : null;
      }
    })
  }

  getSearchOption(){
    this.db.search_fields({ doctype: 'Job Opening' }).subscribe((res) => {
      if (res.status && res.status == 'failed') {
        this.search_filter = [];
      } else {
        this.search_filter = res['message'];
      }
    });
  }

  filterList(eve){
    let val = {};
    if(eve && eve.data){
      let keyValue: any = Object.keys(eve.data)
      if(keyValue && keyValue.length != 0){
        keyValue.map(resKey => {
          if(resKey == 'job_title'){
            val[resKey] = ['Like', '%' + eve.data[resKey] + '%']
          }else{
            val[resKey] = eve.data[resKey]
          }
        })
      }
    }
    this.searchFilter = val;
    this.get_job_applicant_dashboard();
  }

  load_search_text(eve){
    this.search_text = eve.target.value;
    let data = {
      job_title: ['Like', '%' + eve.target.value + '%']
    }
    this.searchFilter = data;
    this.get_job_applicant_dashboard();
  }

  closeList(){
    this.db.seperateJobSection = false;
    this.searchFilter = {};
    this.job_applicant_category.map(res => {
      res['isSelected'] = false;
    })
  }

  async openWebFormPopup() {

    this.db.SubjectEvent = false;

    const modal = await this.modalCtrl.create({
      component: WebsiteFormsComponent,
      cssClass: 'web_site_form',
      componentProps: {
        page_title: 'Job Applicant',
        page_route: 'job-applicant',
        modal: true
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    const val = await modal.onWillDismiss();
    this.db.SubjectEvent = true;
    console.log(val)
    if(val && val.data && val.data == "Success"){
      this.getJobApplicantList();
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.zone.run(() => {
      this.isHandlingEvent = true;

      let key = event.key;
      let current_active = this.active;
      if (key == 'ArrowDown') {
        if (current_active + 1 < this.job_applicant_category.length) {
          this.active = current_active + 1;
          this.selectCategory(this.job_applicant_category[this.active],this.active)
        }
      } else if (key == 'ArrowUp') {
        if (current_active - 1 < this.job_applicant_category.length && current_active - 1 != -1) {
          this.active = current_active - 1;
          this.selectCategory(this.job_applicant_category[this.active],this.active)
        }
      }

      // Reset the flag after a short delay
      setTimeout(() => {
        this.isHandlingEvent = false;
      }, 100);
    });
  }

}

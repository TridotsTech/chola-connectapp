import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { JobReferalFiltersComponent } from 'src/app/components/job-referal-filters/job-referal-filters.component';
import { JobReferralDetailComponent } from 'src/app/components/job-referral-detail/job-referral-detail.component';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-job-referral-list',
  templateUrl: './job-referral-list.page.html',
  styleUrls: ['./job-referral-list.page.scss'],
})
export class JobReferralListPage implements OnInit {
  jobReferralList: any = [];
  skeleton = true;
  page_no: any = 1;
  no_jobs = false;
  searchTxt: any;
  selectFilters: any = {};
  totalFilterCount: any = 0;
  constructor(public db: DbService,public modalCntrl: ModalController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.get_job_referral_list();
  }

  getJobReferralList(){
    this.db.get_job_opening().subscribe(res => {
      this.skeleton = false;
      if(res && res.message && res.message.length != 0){
        this.jobReferralList = res.message;
      }else{
        this.jobReferralList = [];
      }
    })
  }

  getBeforeDays(date){
    const givenDate = new Date(date);
    const currentDate = new Date();
    const diffInTime = currentDate.getTime() - givenDate.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return '1 day ago';
    } else {
      return `${diffInDays} days ago`;
    }
  }

  changeDescription(description){
    var htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
    description = description.replace(htmlRegexG, '');
    return description;
  }

  async getReferralDetail(item){
    const modal = await this.modalCntrl.create({
      component: JobReferralDetailComponent,
      cssClass: 'job-referral-detail',
      componentProps: {
        jobReferralDetail: item
      }
    })
    await modal.present();
  }

  get_job_referral_list(){
    let data = {
      page_no: this.page_no,
      "filters": {
        "location": this.selectFilters.location ? this.selectFilters.location : '',
        "postion": this.searchTxt ? this.searchTxt : '',
        "name": this.selectFilters.name ? this.selectFilters.name : '',
        "job_type": this.selectFilters.job_type ? this.selectFilters.job_type : ''
      }
    }
    this.db.get_jobs(data).subscribe(res => {
      this.skeleton = false;
      if(res && res.message && res.message.length != 0){
        if(this.page_no == 1){
          this.jobReferralList = res.message
        }else{
          this.jobReferralList = [...this.jobReferralList,...res.message]
        }
      }else{
        this.no_jobs = true;
        this.page_no == 1 ? this.jobReferralList = [] : null;
      }
    })
  }

  load_more(event){
    if(!this.no_jobs){
      let value = event.target.offsetHeight + event.target.scrollTop + 1;
      value = value.toFixed();
      if(value >= event.target.scrollHeight){
        this.page_no += 1;
        this.get_job_referral_list();
      }
    }
  }

  async openSearchFilter(){
    const modal = await this.modalCntrl.create({
      component: JobReferalFiltersComponent,
      cssClass: 'job-referral-filters',
      componentProps: {
        selectFilters: this.selectFilters
      }
    })
    await modal.present();
    let data = await modal.onWillDismiss();
    let total_count: any = 0;
    if(data && data.data){
      if(data.data && Object.keys(data.data).length != 0){
        total_count = 0;
        Object.keys(data.data).map((res: any) => {
          this.selectFilters[res] = data.data[res];
          if(data.data[res]){
            total_count += 1;
          }
        })
        this.totalFilterCount = total_count;
      }else{
        this.totalFilterCount = 0;
        this.selectFilters = {};
      }
      this.get_job_referral_list();
    }
  }

  searchPro(event){
    this.searchTxt = event.target.value;
    this.page_no = 1;
    this.get_job_referral_list();
  }

  clear_txt(event){
    this.searchTxt = '';
    this.page_no = 1;
    this.get_job_referral_list();
  }

}

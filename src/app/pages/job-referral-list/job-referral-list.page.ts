import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
  constructor(public db: DbService,public modalCntrl: ModalController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    // this.getJobReferralList();
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
        "location": "",
        "postion": "",
        "name": "",
        "job_type": ""
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

}

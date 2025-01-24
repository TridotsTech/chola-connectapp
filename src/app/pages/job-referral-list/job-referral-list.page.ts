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
  constructor(public db: DbService,public modalCntrl: ModalController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getJobReferralList();
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

}

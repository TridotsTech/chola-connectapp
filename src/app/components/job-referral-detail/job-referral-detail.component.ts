import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ReferFriendFormComponent } from '../refer-friend-form/refer-friend-form.component';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-job-referral-detail',
  templateUrl: './job-referral-detail.component.html',
  styleUrls: ['./job-referral-detail.component.scss'],
})
export class JobReferralDetailComponent  implements OnInit {
@Input() jobReferralDetail: any;
referralDetail: any = {};
  constructor(public modalCntrl: ModalController,public db: DbService) { }

  ngOnInit() {
    console.log(this.jobReferralDetail,'this.jobReferralDetail');
    this.getDocDetails();
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

  parseString(stringValue) {
    return stringValue ? stringValue.replace(/\n/g, '<br>'): '';
  }

  changeDescription(description){
    var htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
    description = description.replace(htmlRegexG, '');
    return description;
  }

  experienceList = [
    {name: 'Frontend Developer'},
    {name: 'Web Developer'},
    {name: 'HTML/CSS'},
  ]

  educationList = [
    {name: 'High School'},
    {name: 'Bachelor'},
    {name: 'MBA'},
    {name: 'MASTER'},
  ]

  async referFriendForm(){
    // this.modalCntrl.dismiss();
    const modal = await this.modalCntrl.create({
      component: ReferFriendFormComponent,
      cssClass: 'friend-referral-form',
      componentProps: {
        jobReferralDetail: this.referralDetail.job_opening
      }
    })
    await modal.present();
  }

  getDocDetails(){
    let data = {
      "job_opneningId":this.jobReferralDetail.name,
      "job_requisitionId":this.jobReferralDetail.job_requisition,
      // "skills":skill_list
      // doctype: 'Job Opening',
      // name: this.jobReferralDetail.name
    }
    this.db.get_joboping_details(data).subscribe(res => {
      // console.log(res)
      if(res && res.message && (res.message.job_opening || res.message.job_requisition || res.message.skills)){
        this.referralDetail.job_opening = res.message.job_opening
        this.referralDetail.job_requisition = res.message.job_requisition
        this.referralDetail.job_opening.skills = res.message.skills
      }else{
        this.referralDetail = {}
      }
    })
  }

}

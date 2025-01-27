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
    this.modalCntrl.dismiss();
    const modal = await this.modalCntrl.create({
      component: ReferFriendFormComponent,
      cssClass: 'friend-referral-form',
      componentProps: {
        jobReferralDetail: this.jobReferralDetail
      }
    })
    await modal.present();
  }

  getDocDetails(){
    let data = {
      doctype: 'Job Opening',
      name: this.jobReferralDetail.name
    }
    this.db.doc_detail(data).subscribe(res => {
      console.log(res)
    })
  }

}

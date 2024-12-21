import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { AssigneesComponent } from '../task/assignees/assignees.component';

@Component({
  selector: 'app-assign-to',
  templateUrl: './assign-to.component.html',
  styleUrls: ['./assign-to.component.scss'],
})
export class AssignToComponent  implements OnInit {
  hoverName: any;
  @Input() showCount:any;
  @Input() assignTo:any;
  @Input() small:any;
  @Input() mini:any;
  @Input() left:any;

  constructor(public db:DbService,public modal: ModalController) { }

  ngOnInit() {
  }

  mouseHover(data){
    // console.log('mouseHover',data)
    this.hoverName = data.user_name
  }

  async openAssignees(event,data) {
    event.stopPropagation()
    const modal = await this.modal.create({
      component: AssigneesComponent,
      cssClass: this.db.ismobile ? 'assigneesStyle' : 'job-detail-popup',
      componentProps: {
        data: data,
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
  }

}

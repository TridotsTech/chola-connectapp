import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-job-referal-filters',
  templateUrl: './job-referal-filters.component.html',
  styleUrls: ['./job-referal-filters.component.scss'],
})
export class JobReferalFiltersComponent  implements OnInit {
@Input() selectFilters: any;
searchFilters: any = {};
  constructor(public modalCntrl: ModalController) { }

  ngOnInit() {
    console.log(this.selectFilters,'this.selectFilters');
    if(this.selectFilters && Object.keys(this.selectFilters).length != 0){
      Object.keys(this.selectFilters).map((res: any) => {
        this.searchFilters[res] = this.selectFilters[res];
      })
    }
  }

  jobType = [
    {name: 'Permanent'},
    {name: 'Contractual'},
  ]

  clearFilter(){
    console.log(this.searchFilters,'this.searchFilters')
    this.searchFilters = {};
    this.modalCntrl.dismiss(this.searchFilters);
  }

  sendFilter(){
    console.log(this.searchFilters,'this.searchFilters')
    this.modalCntrl.dismiss(this.searchFilters);
  }

}

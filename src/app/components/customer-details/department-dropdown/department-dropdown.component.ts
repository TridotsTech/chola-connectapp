import { Component, OnInit, Input } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-department-dropdown',
  templateUrl: './department-dropdown.component.html',
  styleUrls: ['./department-dropdown.component.scss'],
})
export class DepartmentDropdownComponent  implements OnInit {

  @Input() departments:any;

  constructor(public db: DbService, public modalCtrl:ModalController) { }

  ngOnInit() {}

  get_data(item,index){
    this.modalCtrl.dismiss({item:item,index:index})
  }

}

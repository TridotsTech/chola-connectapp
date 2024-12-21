import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-website-form-header',
  templateUrl: './website-form-header.component.html',
  styleUrls: ['./website-form-header.component.scss'],
})
export class WebsiteFormHeaderComponent implements OnInit {
  
  @Input() Title: any;
  @Input() enableHeader: any;
  @Input() close_btn: any;
  @Input() doctype: any;
  @Input() primary_bg: any;
  @Input() noBackBtn: any;
  @Output() assign_user = new EventEmitter<any>();

  constructor(public db: DbService, private modalCtrl: ModalController) {}

  ngOnInit() {}
  
  dismiss() {
    this.modalCtrl.dismiss();
  }
}

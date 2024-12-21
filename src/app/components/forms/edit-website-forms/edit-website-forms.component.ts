import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-edit-website-forms',
  templateUrl: './edit-website-forms.component.html',
  styleUrls: ['./edit-website-forms.component.scss'],
})
export class EditWebsiteFormsComponent implements OnInit {
  sale_order_id: any;
  @Input() page_title: any;
  @Input() page_route: any;
  @Input() edit_form_values: any;
  @Input() enable_reference: any;
  @Input() enabled_read_only: any;
  @Input() enable_height: any;
  @Input() modal: any;

  web_form = false;

  constructor(public db: DbService, private modalCtrl: ModalController) {}

  ngOnInit() {
    // console.log(this.enable_height)
    // console.log(this.page_route);
    this.page_route = this.page_route.toLocaleLowerCase();
    if (this.page_route.includes(' ')) {
      this.page_route = this.page_route.replace(/ /g, '-');
    } else {
      this.page_route = this.page_route;
    }
    if (this.edit_form_values) {
      this.sale_order_id = this.edit_form_values.party_name;
    }

    if (this.page_route && this.page_route == 'customer') {
      this.web_form = true;
    }
  }

  backbtn() {
    this.modalCtrl.dismiss();
  }
}

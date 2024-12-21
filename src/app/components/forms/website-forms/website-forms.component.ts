import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
@Component({
  selector: 'app-website-forms',
  templateUrl: './website-forms.component.html',
  styleUrls: ['./website-forms.component.scss'],
})
export class WebsiteFormsComponent implements OnInit {
  @Input() page_title: any;
  @Input() page_route: any;
  @Input() page: any;
  @Input() enable_height: any;
  @Input() edit_form: any;
  @Input() edit_form_values: any;
  @Input() loader_f: any;
  @Input() load_doc: any;
  @Input() modal: any;
  @Input() popup_centre: any;
  @Input() parentTaskName: any;
  @Input() parentTaskId: any;
  @Input() sale_order_id: any;
  @Input() dailyUpdateDetail: any;

  enable_save = false;
  // sale_order_id: any;
  constructor(public db: DbService, private modalcntr: ModalController) { }

  ngOnInit() {
    console.log('edit_form_values',this.edit_form_values)
    console.log(this.page_route,"page_route")
    // console.log(this.page_title)
    if (this.page_route == "advance") {
      this.page_route = "employee-advance"
    } else if(this.page_route == 'Quotation'){
      this.enable_save = true;
    }
  }

  backbtn() {
    this.modalcntr.dismiss()
  }

}

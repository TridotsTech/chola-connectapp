import { Router } from '@angular/router';
import { Component, Input, OnInit, HostListener } from '@angular/core';
import { AlertController, MenuController, LoadingController, ModalController, AnimationController, Platform } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
// import { TaskListPage } from '../../../pages/project/task-list/task-list.page';
import { SalesOrderListPage } from 'src/app/pages/order/sales-order-list/sales-order-list.page';
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  field_values: any = [];
  list_values: any = [];
  activity: boolean = false;
  is_loaded = true;
  @Input() type;
  @Input() fieldname;
  @Input() fieldname_value;
  @Input() selected_value;
  @Input() filter_type;

  constructor(public modalCtrl: ModalController, public db: DbService, public router: Router) { }

  ngOnInit() {
    this.category_products();
    const modalState = {
      modal: true,
      desc: 'fake state for our modal'
    };
    history.pushState(modalState, '');

    // console.log(this.type);
    // console.log(this.selected_value);
    // console.log(this.fieldname);
    // console.log(this.fieldname_value);
    if (this.fieldname) {
      this.field_values = this.fieldname;
      this.activity = true
    }
  }

  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.modalCtrl.dismiss();
  }

  category = '';
  c_page_no = 1;
  search_txt = '';
  no_products = false;

  category_products() {

    let datas = {
      doctype: this.type,
      "page_no": this.c_page_no,
      "page_length": 20,
      search_text: this.search_txt,
    }

    // console.log(datas);

    this.db.label_values(datas).subscribe((res: any) => {
      // console.log(res)

      if (res.message && res.message.length != 0) {
        this.is_loaded = false;
        if (this.c_page_no == 1) {
          if (this.filter_type == 'filter') {
            let array = [{ 'label': 'ALL', 'name': 'ALL' }]
            array = [...array, ...res.message];
            this.list_values = array;
          }
          else {
            this.list_values = res.message;
          }
        } else {
          this.list_values = [...this.list_values, ...res.message as never]
        }
      } else {
        this.is_loaded = false;
        this.no_products = true;
        this.c_page_no == 1 ? this.list_values = [] : null;
      }

      if (this.list_values.length != 0) {
        this.list_values.map(res => {
          if (res.name == this.selected_value) {
            res['isActive'] = true;
          }
        })
      }
    }, error => { this.is_loaded = true })
  }

  load_search(term) {
    this.search_txt = term.target.value;
    this.c_page_no = 1;
    this.no_products = false;
    this.category_products();
  }

  fetchMore(eve) {
    this.loadData(eve);
  }

  loadData(event) {
    let value = event.target.offsetHeight + event.target.scrollTop + 1;
    value = value.toFixed();
    if (value >= event.target.scrollHeight) {
      if (!this.no_products) {
        this.c_page_no = this.c_page_no + 1;
        this.category_products();
      }
    }
  }

  add(selected_item) {
    this.list_values.map(res => {
      if (selected_item.name == res.name) {
        res['isActive'] = true;
        let data = { 'status': 'success', 'data': selected_item };
        selected_item['status'] = 'success';
        this.db.select_drop_down.next(selected_item);
        this.modalCtrl.dismiss(data);
      } else {
        res['isActive'] = false;
      }
    })
  }

  added(selected_item) {
    // console.log(selected_item);
    this.modalCtrl.dismiss(selected_item);
  }

  adding(selected_item) {
    // console.log(selected_item);
    this.modalCtrl.dismiss(selected_item);
  }

  close_modal() {
    this.modalCtrl.dismiss();
  }

  search_cust(eve: any) {
    this.c_page_no = 1;
    this.no_products = false;
    if (this.type == 'items') {
      this.category_products();
    }
  }

  clear_txt() {
    this.search_txt = '';
    this.category_products();
  }
  async task_form() {
    // Navigate to another page

    this.router.navigateByUrl('/forms/task');

    // Close the current modal
    await this.modalCtrl.dismiss();

    // Close all other open modals
    while (this.modalCtrl.getTop()) {
      await this.modalCtrl.dismiss();
    }

  }
  async project_form() {

  }
}

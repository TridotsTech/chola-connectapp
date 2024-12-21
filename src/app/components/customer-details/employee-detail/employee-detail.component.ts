import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, NgZone, HostListener, OnDestroy } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { NewWizardFormComponent } from '../../forms/new-wizard-form/new-wizard-form.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  LoadingController,
} from '@ionic/angular';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {

  @Input() detail_route_name: any
  @Input() list_data: any
  @Input() load_name: any
  @Input() doctype: any
  @Input() search_filter: any
  @Input() current_navigation_tab: any
  @Output() call = new EventEmitter();
  @Output() openWhatsApp = new EventEmitter();

  @Output() filterList = new EventEmitter();
  @Output() search_txt_value = new EventEmitter();
  @Output() call_clear_txt = new EventEmitter();
  @Output() supplier_filter = new EventEmitter();

  @ViewChild(NewWizardFormComponent) render_wizardform: NewWizardFormComponent | any;
  @ViewChild(NewWizardFormComponent) buttonLoader: NewWizardFormComponent | any;

  @ViewChild('tabList') tabList: ElementRef | any;

  detailUIshow = true;
  employeeDetail: any
  button_loader = false;
  forms_route: any;
  skeleton = true;
  segment_name: any;
  collapseListIcon = true
  selectedIndexs: any;
  isSaveBtn = false;
  readonly = false;
  employeeRole = false;
  constructor(public db: DbService, private router: Router, public loadingCtrl: LoadingController, private location: Location, private cdr: ChangeDetectorRef, public zone: NgZone) { }
  ngOnDestroy(): void {
    this.db.profile_side_menu = false;
  }

  ngOnInit() {
    this.segment_name = 'Overview';
    this.detailUIshow = this.segment_name == 'Overview' ? true : false;

    this.get_employee_detail(this.load_name)

    if (this.doctype == 'Employee') {
      this.forms_route = 'employee-detail'
    }

    if (this.list_data && this.list_data.data && this.list_data.data.length != 0) {
      let index = this.list_data.data.findIndex(res => { return res.name == this.load_name })
      this.db.selected_index = index
    }

    this.checkPermission()

    if (localStorage['role'] == 'Employee' || localStorage['role'] == 'Tridots Employee') {
      this.employeeRole = true;
    }


  }

  checkPermission() {
    if (this.db.permission_details && this.db.permission_details.length > 0) {
      let find = this.db.permission_details.find(res => { return res.page == this.doctype })
      if (find) {
        this.isSaveBtn = find.write ? true : false;
        this.readonly = !find.write ? true : false
      }
    }
  }

  loadDetail(eve) {
    if (eve && eve.data) {
      this.employeeDetail = {
        project_name: eve.data.project_name,
        name: eve.data.name
      }

      this.get_employee_detail(eve.data.name)
    }
  }

  get_employee_detail(detail_name) {
    // this.skeleton = true;
    this.detailUIshow = true;
    let data = {
      doctype: this.doctype,
      name: detail_name
    }
    this.db.doc_detail(data).subscribe(res => {
      setTimeout(() => { this.skeleton = false; }, 200)
      if (res && res.message && res.message.length != 0) {
        this.employeeDetail = res.message[1]
        this.render_wizardform ? this.render_wizardform.ngOnInit() : null;
      }
    }, error => { this.skeleton = false; })
  }

  close_detail() {
    this.db.full_width = false;
    let currentUrl = this.router.url;
    let urls = currentUrl.split('/');
    if (urls && urls.length == 4) {
      currentUrl = urls[1] + '/' + urls[2];
    }
    this.location.replaceState(currentUrl);
    this.db.detail_route_bread = "";
  }

  getDateDifference(startDate: Date) {
    const endDate = new Date(); // Current date

    const start = new Date(startDate);
    const end = new Date(endDate);

    let yearsDiff = end.getFullYear() - start.getFullYear();
    let monthsDiff = end.getMonth() - start.getMonth();

    // Adjusting months and years if necessary
    if (monthsDiff < 0) {
      yearsDiff--;
      monthsDiff += 12;
    }

    return `${yearsDiff} yr, ${monthsDiff} m`;
  }

  async next_doc(name) {
    this.button_loader = true;
    if (name == 0) {
      this.db.selected_index = this.db.selected_index + 1
    } else {
      this.db.selected_index = this.db.selected_index - 1
    }
    let data = {
      "doctype": this.doctype,
      "value": this.employeeDetail.name,
      "filters": [],
      "prev": name
    }
    this.db.next_doc(data).subscribe(res => {
      if (res && res.status && res.status == 'Success') {
        localStorage['selected_project_id'] = res.message
        
        this.get_employee_detail(res.message)

        let currentUrl = this.router.url;
        let urls = currentUrl.split('/');
        if (urls && urls.length == 4) {
          currentUrl = urls[1] + '/' + urls[2];
        }
        window.history.pushState('', '', currentUrl + '/' + res.message);
        this.location.replaceState(currentUrl + '/' + res.message);
        this.db.detail_route_bread = res.message;
      } else {
        this.db.alert('No Further Records')
      }
      this.button_loader = false;
    }, error => { this.button_loader = false; })
  }

  save_details() {
    this.render_wizardform ? this.render_wizardform.save_details1('save') : null;
  }

  get_status_clr(data) {
    if (data == "Open") {
      return '#458F5A'
    } else if (data == "Cancelled") {
      return '#FF4B4B'
    } else {
      return '#FFC24B'
    }
  }

  get_percent_color(data) {
    if (data <= 50) {
      return '#FF4B4B'
    } else if (data <= 80) {
      return '#FFC24B'
    } else {
      return '#458F5A'
    }
  }

  menu_name(eve) {

    this.segment_name = eve.name
    this.detailUIshow = this.segment_name == 'Overview' ? true : false;

    if (eve.name == 'Bug Sheet') {
      localStorage['docType'] = eve.name
    }

    let currentUrl = this.router.url;

    let urls = window.location.href.split('/');
    if (urls && urls.length == 6 || urls && urls.length == 7) {
      currentUrl = urls[3] + '/' + urls[4] + '/' + urls[5];
    }
    window.history.pushState('', '', currentUrl + '/' + eve.name);
    this.location.replaceState(currentUrl + '/' + eve.name);
  }


  expenses_list = [
    { name: 'Total Expenses', ruppees: '2,59,500 ₹', icon: 'assets/img/arrow-blue.svg' },
    { name: 'Billable Expenses', ruppees: '2,59,500 ₹', icon: 'assets/img/arrow-yellow.svg' },
    { name: 'Unbillable Expenses', ruppees: '2,59,500 ₹', icon: 'assets/img/arrow-red.svg' },
    { name: 'Billed Expenses', ruppees: '2,59,500 ₹', icon: 'assets/img/arrow-green.svg' }
  ]

  get_expense_color(data) {
    if (data == 'Total Expenses') {
      return 'var(--gray-color)'
    } else if (data == 'Billable Expenses') {
      return '#E5B406'
    } else if (data == 'Unbillable Expenses') {
      return '#E21B22'
    } else {
      return '#19AA41'
    }
  }

  collapseList() {
    this.collapseListIcon = !this.collapseListIcon

    if (!this.collapseListIcon && this.doctype == 'Employee') {
      this.getEmployeeList()
    }
  }


  social(type, data) {

    if (type == 'mail') {
      const emailLink = 'mailto:' + data;
      const element = document.createElement('a');
      element.setAttribute('href', emailLink);
      element.click();
    } else if (type == 'call') {
      let number = 'tel:' + data;
      let element = document.createElement('a');
      element.setAttribute('href', number);
      element.click();
    } else if (type == 'whatsapp') {
      let url = `https://api.whatsapp.com/send?phone=${data}`;
      window.open(url, '_system');
    }
  }


  changeListener1($event: any) {
    this.base64($event.target);
  }

  async base64(inputValue: any): Promise<void> {

    if (inputValue.files && inputValue.files.length > 0) {
      var file: File = inputValue.files[0];
      var file_size = inputValue.files[0].size;
      let categoryfile = file.name;
      var myReader: FileReader = new FileReader();
      let multiple_array = [];
      myReader.onloadend = (e) => {
        let categoryimagedata = myReader.result;
        // Push file name

        let img_data = {
          file_name: categoryfile,
          content: categoryimagedata,
          // decode: "True",
        };

        let array_image: any = [];
        array_image.push(img_data);


        if (file_size <= 10000000) {
          //10Mb in BYtes

        } else if (file_size > 10000000) {
          this.db.filSizeAlert();
        } else if (file_size == 0) {

        }

        this.upload_file(img_data);
      };
      myReader.readAsDataURL(file);
    }
  }

  async upload_file(img_data) {
    // console.log(img_data);
    let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    await loader.present();
    this.db.profile_loader = true;
    let data = {
      file_name: img_data.file_name,
      content: img_data.content,
      is_private: 0,
      // folder: "Home/Attachments",
      doctype: 'File',
      attached_to_doctype: "Employee",
      attached_to_name: this.employeeDetail.employee,
      decode: true,
    };
    this.db.inset_docs({ data: data }).subscribe((res) => {

      if (res && res.message && res.message.status == 'Success') {
        // this.db.alert('Updated Successfully');
        this.insert_user_image(res.message, loader)
      } else {
        this.db.alert('Something went wrong try again later');
      }
    }, error => {
      this.db.alert('Something went wrong try again later');
      loader.dismiss();
    });

  }

  insert_user_image(image, loader) {
    let data = {
      image: image ? image.data.file_url : '',
      name: this.employeeDetail.employee,
      doctype: 'Employee'
    }
    this.db.inset_docs({ data: data }).subscribe(res => {
      // console.log(res)
      loader.dismiss();
      if (res && res.message && res.message.status && res.message.status == 'Success') {
        this.employeeDetail.image = image.data.file_url
      } else {
        this.db.alert('Something went wrong try again later');
      }
    }, error => {
      this.db.alert('Something went wrong try again later');
      loader.dismiss();
    });
  }

  loadMoreEmployee(event) {
    if (!this.no_products) {
      let value = event.target.offsetHeight + event.target.scrollTop + 1;
      value = value.toFixed();
      if (value >= event.target.scrollHeight) {
        this.page_no += 1;
        this.getEmployeeList()
      }
    }
  }

  search_data: any = {};
  employeeList: any = [];
  page_no = 1;
  page_size = 20;
  no_products = false;
  listSkeleton = true;

  getEmployeeList() {
    let status: any = { status: ["=", "Active"] };
    this.search_data = { ...this.search_data, ...status };
    let search_Value = JSON.stringify(this.search_data);

    let data = {
      "doctype_name": "Employee",
      "search_data": search_Value,
      "docname": "",
      "fetch_child": true,
      "page_no": this.page_no,
      "page_length": this.page_size,
      "view_type": "List View"
    }

    this.db.get_tempate_and_datas(data).subscribe((res: any) => {
      this.listSkeleton = false;
      if (res && res.status && res.status == 'success') {

        if (res.message && res.message.data && res.message.data.length != 0) {
          this.page_no == 1 ? this.employeeList = [] : null
          this.employeeList = [...this.employeeList, ...res.message.data]
        } else {
          this.page_no == 1 ? this.employeeList = [] : null;
          this.no_products = true
        }

        if (this.employeeList.length != 0) {
          this.employeeList.map((res, i) => {
            res.selected = res.name == this.load_name ? true : false
            if (res.selected) {
              this.selectedIndexs = i
            }
          })
        }

      }
    }, error => {
      this.listSkeleton = true;
      this.db.alert('Something went wrong try again later');
    })
  }

  searchTxtValue(eve) {
    this.listSkeleton = true;
    this.search_data = { employee_name: ['Like', (eve && eve.detail && eve.detail.value) ? ('%' + eve.detail.value + '%') : ''] }
    this.page_no = 1;
    this.no_products = false;
    this.getEmployeeList();
  }

  clear_txt(eve) {
    this.listSkeleton = true;
    this.search_data = {};
    this.page_no = 1;
    this.no_products = false;
    this.getEmployeeList();
  }


  loadEmployee(data) {
    if (data) {
      this.load_name = data.name ? data.name : '';
      this.get_employee_detail(this.load_name);
    }

    this.employeeList.map((res, i) => {
      res.selected = res.name == data.name ? true : false;
      if (res.selected) {
        this.selectedIndexs = i
      }
    })
  }

  check_active(index: any) {
    if (this.tabList) {
      const element = this.tabList.nativeElement.children[index];
      // console.log(element,'element');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',
          });
        }, 500);
      }
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let key = event.key;
    if (key == 'ArrowDown') {
      let index = this.selectedIndexs + 1;
      if ((index + 1) <= this.employeeList.length) {
        this.selectedIndexs = index;
        this.loadEmployee(this.employeeList[this.selectedIndexs]);
        this.check_active(this.selectedIndexs);
      }

      //  this.scrollToSelected()
    } else if (key == 'ArrowUp') {
      this.selectedIndexs = this.selectedIndexs - 1;
      this.selectedIndexs = this.selectedIndexs < 0 ? 0 : this.selectedIndexs
      this.loadEmployee(this.employeeList[this.selectedIndexs]);
      this.check_active(this.selectedIndexs);
    }
  }

  onScroll(event): void {
    this.page_no = this.page_no + 1;
    const scrollElement = event.target as HTMLElement;
    const pos = scrollElement.scrollTop + scrollElement.offsetHeight;
    const max = scrollElement.scrollHeight;

    if (max - pos < 100 && !this.no_products) {
      this.getEmployeeList();
    }
  }

  add_wish(event, data) {
    event.stopPropagation();
    this.db.addTowishList(data)
  }

}

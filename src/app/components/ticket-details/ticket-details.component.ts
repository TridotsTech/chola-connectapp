import { Component, OnInit,NgZone } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { WebsiteFormsComponent } from '../forms/website-forms/website-forms.component';
import { ModalController, LoadingController } from '@ionic/angular';
import { ShowTicketDetailComponent } from '../show-ticket-detail/show-ticket-detail.component';
import { Router } from '@angular/router';
import { TicketFeedbackComponent } from '../ticket-feedback/ticket-feedback.component';
@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss'],
})
export class TicketDetailsComponent implements OnInit {
  timestamp: any = Date.now();
  ticketDetails: any = [];
  message_data = '';
  
  submitted = false;
  error = false;
  isattach = false;
  file_name;
  attach_list: any = [];
  Event: any = [];
  categoryfile: any;
  categoryimagedata: any;
  image_field_check = 'no uploads';
  field_name: any = [];
  base64_url: any = [];
  edit_data_details: any = {};
  img_file_name: any = [];
  attach_file_name = '';

  ticket_type_value: any;
  priority_value: any;
  agent_group_value: any;

  ticket_status_value: any = '';

  allocate_agent: any = '';

  selectedTabs: any = 'Messages';

  modules = {
    formula: false,
    toolbar: this.db.ismobile
      ? [
          ['bold', 'italic', 'underline'], // toggled buttons
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ align: [] }],
        ]
      : [
          ['bold', 'italic', 'underline'], // toggled buttons
          ['blockquote'],
          //  [{'header': 1}, {'header': 2}],               // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          // [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction
          //  [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],
          // ['clean'],                                       // remove formatting button
          //  ['link', 'image', 'video',]    ,               // link and image, video
          // ['link']
        ],
  };
  ticket_send_details: any;
  ticket_status: any = [];
  rating_value = 0;
  constructor(
    public db: DbService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    public zone: NgZone,
    private router:Router
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.db.getRandomColor(this.db.ticket_details);
    }, 500);
    this.get_doc_detail();
    this.get_ticket_status();
    this.get_allocate_user();

    this.db.select_drop_down.subscribe((res: any) => {
      // console.log(res)
      if (res && this.db.allocate_agent) {
        this.allocate_agent = res.name;
        // console.log(this.allocate_agent)
        this.set_allocate_mb(this.allocate_agent);
      }
    });

    this.db.loadTicketDetails.subscribe(resDetails => {
      if(resDetails && this.db.loadTicketDetailName){
        this.get_doc_detail();
        // console.log(this.db.mail_send_to,'this.db.mail_send_to')
        // console.log(resDetails,'resDetails')
      }
    })
    this.db.skeleton_detail = true;
    this.db.get_all_conversation(this.db.mail_send_to.name ? this.db.mail_send_to.name : this.db.mail_send_to);
  }

  ticketTabs = [
    {
      "name": "Messages",
      "route": "Messages"
    },
    {
      "name": "Info",
      "route": "Info"
    },
  ]

  menu_name(event){
    this.selectedTabs = event.name;

    if(this.selectedTabs == 'Messages'){
      this.db.skeleton_detail = true;
      this.db.get_all_conversation(this.db.mail_send_to.name ? this.db.mail_send_to.name : this.db.mail_send_to);
    }
  }

  changeSelectTabs(event){
    this.selectedTabs = event.detail.value

    if(this.selectedTabs == 'Messages'){
      this.db.skeleton_detail = true;
      this.db.get_all_conversation(this.db.mail_send_to.name ? this.db.mail_send_to.name : this.db.mail_send_to);
    }
  }

  getName_url(url) {
    this.attach_file_name = url.split('/').pop().split('#')[0];
    this.db.attach_filter(this.attach_file_name, '');
  }

  uploadFiles(event) {
    if (event) {
      for (let i = 0; i <= event.target.files.length - 1; i++) {
        this.attach_list.push(event.target.files[i].name);
        this.Event.push(event.target.files[i]);
      }
    }
  }

  get_doc_detail() {
    let data = {
      name: this.db.mail_send_to.name ? this.db.mail_send_to.name : this.db.mail_send_to,
      doctype: 'HD Ticket',
    };
    this.db.doc_detail(data).subscribe((res) => {
      // console.log(res);
      if (res && res.message && res.message.length != 0 && res.status && res.status == 'Success') {
        this.ticket_send_details = res.message[1];
        // console.log(this.ticket_send_details,'this.ticket_send_details')
        this.ticket_status_value = res.message[1].status ? res.message[1].status : '';
        this.ticket_type_value = this.ticket_send_details.ticket_type;
        this.priority_value = this.ticket_send_details.priority;
        this.agent_group_value = this.ticket_send_details.agent_group;
        this.rating_value = this.ticket_send_details.feedback_rating;
      }
    });
    this.db.loadTicketDetailName = false;
  }

  // onsubmit(){
  //   if(this.attach_list.length > 0 && this.Event.length !=0){
  //    this.sendFiles(this.Event,'attach');
  //   }
  //   else{
  //      this.send("");
  //   }
  // }

  onsubmit() {
    this.send('');
  }

  submitCommonText(event){
    console.log(event)
    this.message_data = event
    this.send('');
  }

  async send(link) {
    if (this.message_data) {
      let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
      await loader.present();
      this.error = false;
      let data = {
        ticket_id: this.db.mail_send_to.name ? this.db.mail_send_to.name : this.db.mail_send_to,
        message: this.message_data,
        // attachments:link,
        attachments: this.attach_list,
        email_id: this.db.cust_email,
        sender_type: localStorage['role'],
      };
      this.db.submit_conversation_via_agent({data : data}).subscribe(async (res) => {
        if (res.message && res.message.status && res.message.status == 'Success') {
          this.db.text_width = false;
          await this.db.get_all_conversation(this.db.mail_send_to.name ? this.db.mail_send_to.name : this.db.mail_send_to);
          res.message.message['commented_by'] = res.message.message.sender;
          this.ticketDetails.push(res.message.message);
          this.attach_list = [];
          setTimeout(() => {
            this.db.getRandomColor(this.ticketDetails);
          }, 500);
          this.message_data = '';
          loader.dismiss();
          
          let ticket = `ticket${this.db.ticket_details.length-1}`
          let el = document.getElementById(ticket)
          // console.log(el);
          el?.scrollIntoView({ behavior: "smooth", block: "end" , inline:"nearest"});
        } else {
          loader.dismiss();
          this.db.alert(res.message.message ? res.message.message : 'something went wrong please try again');
        }
      });
    } else {
      this.error = true;
    }
  }

  sendFiles(inputValue, list) {
    if (inputValue.length > 0) {
      for (let i = 0; i <= inputValue.length - 1; i++) {
        var file: File = inputValue[i];
        var file_size = inputValue[i].size;
        var fieldname = list;
        // this.convertion(file_size, file, i);
      }
    }
  }

  get_ticket_status() {
    // if (this.db.business_role_rj) {
    //   this.ticket_status = this.ticket_status_bs;
    // } else {
      this.ticket_status = this.ticket_status_cs;
    // }
  }

  ticket_status_bs = [
    { name: 'Open' },
    { name: 'Replied' },
    { name: 'Resolved' },
    { name: 'Closed' },
  ];

  ticket_status_cs = [{ name: 'Open' }, { name: 'Resolved' }];

  readMultipleFile(inputValue: any) {
    inputValue = inputValue.target;
    if (inputValue.files.length > 0) {
      for (let i = 0; i <= inputValue.files.length - 1; i++) {
        var file: File = inputValue.files[i];
        var file_size = inputValue.files[i].size;
        this.convertion1(file_size, file);
      }
    }
  }

  convertion1(file_size, file) {
    let categoryfile = file.name;
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      // console.log(myReader.result)
      let categoryimagedata = myReader.result;

      let img_data = {
        file_name: categoryfile,
        base_64: categoryimagedata,
      };

      if (file_size <= 10000000) {
        //10Mb in BYtes
        this.attach_list.push(img_data);
      } else if (file_size > 10000000) {
        this.db.filSizeAlert();
      }
    };
    myReader.readAsDataURL(file);
    // console.log('this.attach_list', this.attach_list);
  }

  convertion(file_size, file, index) {
    let categoryfile = file.name;
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      // console.log(myReader.result)
      this.categoryimagedata = myReader.result;
      this.img_file_name.push(this.categoryimagedata);
      if (index == this.attach_list.length - 1) {
        this.send(this.img_file_name);
        this.attach_list = [];
        this.Event = [];
      }

      let img_data = {
        file_name: categoryfile,
        image: this.categoryimagedata,
      };

      if (file_size <= 10000000) {
        //10Mb in BYtes
        this.attach_list.push(img_data.file_name);
      } else if (file_size > 10000000) {
        this.db.filSizeAlert();
      }
    };
    myReader.readAsDataURL(file);
  }

  //Image attach and Path finder
  image_count = [];
  changeListener($event, fieldname): void {
    //  this.image_count.push(fieldname);
    this.image_field_check = 'false';
    //  this.readThis($event.target, fieldname);
  }

  removeLink(index) {
    this.attach_list.map((res, i) => {
      if (i == index) {
        this.attach_list.splice(res, 1);
      }
    });
  }

  validate() {
    if (this.message_data == null) {
      this.error = true;
    } else {
      this.error = false;
    }
  }

  focus() {
    this.db.text_width = !this.db.text_width;
    console.warn(this.db.text_width);
    if (!this.db.text_width) {
      this.attach_list = [];
      this.error = false;
    }
  }

  attach() {
    this.isattach = !this.isattach;
  }

  async open_feedback() {
    const modal = await this.modalCtrl.create({
      component: WebsiteFormsComponent,
      cssClass: this.db.ismobile ? 'web_site_form' : 'hd_ticket_feedback_form',
      componentProps: {
        page_title: 'Feedback',
        page_route: 'customer-feedback',
        edit_form_values: this.ticket_send_details,
        edit_form: 1,
      },
      enterAnimation: this.db.enterAnimation,
      leaveAnimation: this.db.leaveAnimation,
    });
    await modal.present();
    let data: any = await modal.onWillDismiss();
    if (data && data.data && data.data.status == 'Success') {
      this.get_doc_detail();
      this.final_set_value(data.data.final_data);
      setTimeout(() => {
        this.db.load_template_datas_list.next('Success');
      }, 500);
    }
  }

  close_detail() {
    this.db.hd_ticket_show = false;
    this.db.enable_detail = false;
    this.db.enable_material = false;
    this.db.profile_side_menu = false;
    if(!this.db.ismobile){
      this.db.detail_route_bread = '';
      this.router.navigateByUrl('/list/hd-ticket')
    }
    this.db.load_template_datas_list.next('Success');
    // this.db.get_notification_list();
  }

  update_ticket() {
    if (this.ticket_status_value == 'Resolved') {
      this.open_feedback();
    } else {
      this.final_update_ticket();
    }
  }

  final_update_ticket() {
    let data = {
      name: this.db.mail_send_to.name,
      status: this.ticket_status_value,
      doctype: 'HD Ticket',
    };
    this.db.inset_docs({ data: data }).subscribe((res) => {
      // console.log(res)
      if (
        (res &&
          res.message &&
          res.message.status &&
          res.message.status == 'Success') ||
        (res.status && res.status == 'Success')
      ) {
        this.db.sendSuccessMessage('Ticket Updated');
      } else {
        this.get_doc_detail();
        this.db.sendErrorMessage(res.message);
      }
    });
  }

  final_set_value(datas) {
    // console.log(value)
    let data = {
      doctype: 'HD Ticket',
      name: this.ticket_send_details.name,
      fieldname: {
        feedback: datas.feedback,
        feedback_extra: datas.feedback_text,
        status: this.ticket_status_value,
      },
    };
    this.db.update_hd_ticket(data).subscribe((res) => {
      if (res && res.message) {
        this.ticket_send_details = res.message;
      }
    });
  }

  transform(value: any) {
    const previous: Date = new Date(value);
    const current: Date = new Date();
    const elapsed: number = +current - +previous;

    if (elapsed < 60000) {
      return 'just now';
    } else if (elapsed < 3600000) {
      const minutes = Math.floor(elapsed / 60000);
      return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`;
    } else if (elapsed < 86400000) {
      const hours = Math.floor(elapsed / 3600000);
      return hours === 1 ? 'an hour ago' : `${hours} hours ago`;
    } else {
      const days = Math.floor(elapsed / 86400000);
      return days === 1 ? 'yesterday' : `${days} days ago`;
    }
  }

  ticket_type = [
    { name: 'Bug' },
    { name: 'Incident' },
    { name: 'Question' },
    { name: 'Unspecified' },
  ];

  priority = [
    { name: 'Low' },
    { name: 'Medium' },
    { name: 'High' },
    { name: 'Urgent' },
  ];

  agent_team = [
    { name: 'Billing' },
    { name: 'Product Experts' },
    { name: 'Support Team' },
    { name: 'Development Team' },
  ];

  set_value(type) {
    // console.log(value)
    let data = {
      doctype: 'HD Ticket',
      name: this.ticket_send_details.name,
      fieldname: type,
    };
    if (type == 'ticket_type') {
      data['value'] = this.ticket_type_value;
    } else if (type == 'priority') {
      data['value'] = this.priority_value;
    } else {
      data['value'] = this.agent_group_value;
    }
    this.db.set_ticket_value(data).subscribe((res) => {
      if (res && res.message) {
        this.ticket_send_details = res.message;
      }
    });
  }

  async open_detail() {
    // console.log(this.ticket_send_details,'this.ticket_send_details')
    const modal = await this.modalCtrl.create({
      component: ShowTicketDetailComponent,
      cssClass: 'job-detail-popup',
      componentProps: {
        // ticket_send_details: this.ticket_send_details,
        ticket_send_details: this.db.mail_send_to,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
  }

  get_allocate_user() {
    let data = {
      doc_name: String(this.db.mail_send_to.name),
    };
    this.db.set_allocate_assign(data).subscribe((res: any) => {
      if (res && res.message) {
        // let allocate = JSON.parse(res.message._assign)
        // console.log(allocate)
        this.zone.run(() => {
          this.allocate_agent = res.message.allocated_to;
        });
        // console.log(this.allocate_agent)
      }
    });
  }

  set_allocate_mb(allocate) {
    let data = {
      doctype: 'HD Ticket',
      name: this.db.mail_send_to.name,
      user: localStorage['customerRefId'],
      allocated_to: allocate,
    };
    this.db.set_allocate_member(data).subscribe((res) => {
      // console.log(res);
      if (res && res.message && res.message.status == 'Success') {
        this.get_allocate_user();
      }
    });
    this.db.allocate_agent = false;
  }

  transformDateToDays(dateString: string): string {
    const givenDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - givenDate.getTime()); // Difference in milliseconds
    const daysDiff = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
    return `${daysDiff} Days`;
  }

  check_priority = (status) => {
    if (status == 'Low') {
      return 'arrow-down-outline'
    } else {
      return 'arrow-up-outline'
    }
  }

  async openFeedback(type){
    const modal = await this.modalCtrl.create({
      component: TicketFeedbackComponent,
      cssClass: 'ticket-feedback',
      componentProps: {
        ticket_send_details: this.ticket_send_details,
        type: type
      }
    })
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data,'data');
    if(data){
      this.db.inset_docs({ data: data }).subscribe((res) => {
        // console.log(res)
        if ((res && res.message && res.message.status && res.message.status == 'Success') || (res.status && res.status == 'Success')) {
          this.get_doc_detail();
          this.db.sendSuccessMessage('Ticket Updated');
        } else {
          var d = JSON.parse(res._server_messages);
          var d1 = JSON.parse(d);
          this.db.sendErrorMessage(this.stripHtmlTags(d1.message));
        }
      });
    }
  }

  stripHtmlTags(htmlString: string): string {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  }

  // scrollto() {
  //   setTimeout(() => {
  //   if (this.content.scrollToBottom) {
  //     this.content.scrollToBottom();
  //   }
  // }, 400)
  // console.log("scrolled")
  // }
}

import { Component, Input, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import {
  AlertController,
  ModalController,
  LoadingController
} from '@ionic/angular';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {
  // db.user_list : any = []
  page_no = 1
  no_products = false;
  selected__ = false;
  skeleton:any = true;
  user_filter : any
  filtered_datas : any
  search_txt : any;
  buttonLoader = false;
  tab: any = []
  // tab = [{ name: 'Assigned Users', active: true }, { name: 'Add new users' }]
  // newAddedUsers:any = [];

  @Input() order_id:any;
  @Input() user_list:any;
  @Input() description:any;
  @Input() doctype:any;
  @Input() share_with:any;
  @Input() shareMore:any;
  @Input() name_list:any;

  @Input() notInsert:any;

  selectedUser:any = [];

  // activeTab = this.tab[0].name
  activeTab: any;

  constructor(public db : DbService,public modalCtrl: ModalController) { }

  ngOnInit() {
   console.log(this.user_list)
   if(this.notInsert){
    this.tab = [{ name: 'Add new users',active: true }]
    this.get_user_list();
   }else{
    this.tab = [{ name: 'Assigned Users', active: true }, { name: 'Add new users' }]
   }
   this.activeTab = this.tab[0].name
  }

  ionViewWillEnter(){
    this.getSelectedValues();
  }

  getSelectedValues(){
    let selectedUser = JSON.stringify(this.user_list)
    this.selectedUser = JSON.parse(selectedUser)

    this.selectedUser.length == 0 ? this.skeleton = false : '';

    for(let i = 0; i < this.selectedUser.length; i++){
      this.selectedUser[i]['selected'] = true;
      this.skeleton = (i == (this.selectedUser.length - 1)) ? false : true;
    }
  }

  handleClick(val, index) {
    this.activeTab = val.name
    for (let i = 0; i < this.tab.length; i++) {
      if (i == index) {
        this.tab[i].active = true;
      } else {
        this.tab[i].active = false;
      }
    }

    if(this.tab[0].name != this.activeTab){
      this.skeleton = true;
      this.page_no = 1;
      this.no_products = false;
      this.get_user_list();
    }else{
      // this.getSelectedValues();
    }
  }

  load_search(term) {
    this.search_txt = term.target.value;
    this.page_no = 1;
    this.no_products = false;
    this.get_user_list();
  }

  get_user_list(){
    let data = {
      doctype : "User",
      fields: ["email","full_name",'user_image',"gender"],
      page_no : this.page_no,
      page_size : 20,
      filters : { 
        email : 
        ['Like' , '%' + (this.search_txt ? this.search_txt : '') + '%' ]
      }
    }
    this.db.get_list(data).subscribe(res =>{
      this.skeleton = false;
      // console.log(res.message)
      if(res && res.message && res.message.length != 0){
        if(this.page_no == 1){
          this.db.user_list = res.message
        }else{
          this.db.user_list  = [...this.db.user_list,...res.message]
        }
        this.check_active(res.message)
      }else{
        this.no_products = true;
        this.page_no == 1 ? this.db.user_list = [] : null;
      }
    },error=>{
      this.skeleton = false;
      this.db.alert('Something went wrong try again later');
    })
  }

  check_active(data){
    let check_select = [];
    if(this.selectedUser){
      this.selectedUser.map(res_user => {
        res_user['selected'] = true;
        check_select = data.filter(res => {return res_user.email_id == res.email})
        check_select.map((res:any) => {
          res['selected'] = true;
        })
      })
    }

  }

  clear_txt(){
    this.search_txt = '';
    this.page_no = 1;
    this.no_products = false;
    this.get_user_list();
    this.get_user_list()
  }

  load_more(event){
    if(!this.no_products){
      let value = event.target.offsetHeight + event.target.scrollTop + 1;
      value = value.toFixed();
      if(value >= event.target.scrollHeight){
        this.page_no += 1;
        this.get_user_list()
      }
    }
  }

  get_data(data, index){
    console.log(data);

    if(this.notInsert){
      if(this.db.user_list && this.db.user_list.length != 0){
        this.db.user_list.map((res, i) => {
          if(i == index){
            res['selected'] = true;
          }else{
            res['selected'] = false;
          }
        })
      }
    }else{
      data['selected'] = data['selected'] ? false : true;
    }

    data['email_id'] = data['email_id'] ? data['email_id'] : data['email'];
    data['user_name'] = data['full_name'] ? data['full_name'] : data['user_name'];
    
    data['selected'] ? this.selectedUser.push(data) : this.selectedUser.splice(index,1)
    
    // if(this.user_list.length != 0){
    //   let find = this.user_list.find((res:any)=>{ return res.email_id ==  data.email_id})
    //   if(find){
    //     this.user_list.map((res:any)=>{  
    //       if(res.email_id ==  data.email_id){
    //         res['selected'] = data['selected']
    //       }
    //     })
    //   }else{
    //     this.user_list.push(data)
    //   }
    // }else{
    //   this.user_list.push(data)
    // }
    // console.log(this.user_list)

  }

  async add_filter(){
      let user_filter:any = [];
      user_filter = this.selectedUser.filter((res:any)=> (res['selected'] == true))
      // user_filter = this.user_list.filter((res:any)=> (res['selected'] == true))
      if(this.notInsert){
        this.modalCtrl.dismiss(user_filter);
      }else{
        this.assigned_to(user_filter);
      }
  }



  assigned_to(list){
    this.buttonLoader = true
    let selected_emails:any = []
    list.map(res =>{selected_emails.push(res.email_id)})
    let data: any = {
      // assign_to: selected_emails,
      doctype: this.doctype ? this.doctype : localStorage['docType'],
      // doctype: localStorage['docType'],
      // name: this.order_id,
      descriptions: this.description
    }

    if(this.shareMore){
      data.name_list = this.name_list
    }else{
      data.name = this.order_id
    }

    if(this.share_with){
      data.share = 1
      data.share_with = selected_emails
      data.assign_to = []
    }else{
      data.share = 0
      data.assign_to = selected_emails
      data.share_with = []
    }

    // console.log(data)
    this.db.assigned_to(data).subscribe(async res =>{
      this.buttonLoader = false;
      if(res && res.status == 'Failed'){
        var d = JSON.parse(res._server_messages);
        var d1 = JSON.parse(d);
        this.db.alert(d1.message);
      }else{
        this.db.selected_mail = list;
        // list.map(res=>{ this.db.selected_mail.push({allocated_to : res.email, email: res.email,user_name: res.full_name, user_image: res.user_image}) })
        this.modalCtrl.dismiss("Success");
        // selected_emails.map(res=>{ this.db.selected_mail.push({allocated_to : res}) })
      }
    },error=>{
      this.buttonLoader = false;
      this.db.alert('Something went wrong try again later');
    })    
  }

}

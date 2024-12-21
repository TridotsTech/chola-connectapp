import { Location } from '@angular/common';
import { Component, OnInit, Input, Output,  EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
// import { CustomizeFormPage } from 'src/app/pages/customize-form/customize-form.page';
// import { SettingsPage } from 'src/app/pages/settings/settings.page';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-sidemenu-header',
  templateUrl: './sidemenu-header.component.html',
  styleUrls: ['./sidemenu-header.component.scss'],
})
export class SidemenuHeaderComponent implements OnInit {

 @Input() heading;
 @Input() route_link;
 @Input() back_route_icon;
 @Input() logo;
 @Input() doc_type: any;
 @Input() kanban: any;
 @Output() toggleKanban: any = new EventEmitter();
 @Output() toggleKanban_task: any = new EventEmitter();
 enable_search_data  =false;
 permission_details: any = [];
 search_txt: any;
  constructor(public db : DbService,public modalcntrl : ModalController,private router: Router,private location: Location) { }

  ngOnInit() {
    this.get_values();
  }

  async next_doc(name) {
    // this.loader = true;
    // // let loader = await this.loadingCtrl.create({ message: 'Please Wait...'});
    // // await loader.present();

    // let data = {
    //   "doctype": this.db.selected_list.page,
    //   "value": this.sale_order_id,
    //   "filters": [],
    //   "prev": name
    // }
    // this.db.next_doc(data).subscribe(res => {
    //   if (res && res.status == "Failed") {
    //     // this.order_detail = undefined;
    //     var d = JSON.parse(res._server_messages);
    //     var d1 = JSON.parse(d);
    //     this.db.alert(d1.message);
    //     this.loader = false;
    //     // this.check_permissions(res.message,loader,doctype_name);
    //   } else {
    //     // if(res && res.status && res.status == 'Success')
    //     this.loader = false;
    //     this.sale_order_id = res.message;
    //     this.content.scrollToTop(400);
    //     this.get_order_details(this.db.selected_list.page, res.message, 'next_detail');
    //     //  loader.dismiss(); 
    //   }
    // }, (error: any) => {
    //   // console.log(error);
    //   // loader.dismiss(); 
    //   this.db.alert('Something went wrong try again later');
    // })

  }

  async open_customize(){
    // const modalcontrol = await this.modalcntrl.create({
    //   component: SettingsPage,
    //   cssClass: this.db.ismobile ? 'add-worker-popup' : 'web_site_form',
    //   enterAnimation: this.db.enterAnimation,
    //   leaveAnimation:this.db.leaveAnimation,
    // });
    // await modalcontrol.present();
  }

  get_values(){
    let data = JSON.stringify(this.db.permission_details);
    this.permission_details = JSON.parse(data);

    // this.permission_details = this.db.permission_details
  }
  
  clear_txt(){
    this.search_txt = '';
    this.get_values();
    // this.permission_details = this.db.permission_details;
  }

  load_search(term){
    if(this.search_txt){
      this.search_txt = term.target.value;
      let data:any = [];
      data = JSON.stringify(this.db.permission_details);
      data = JSON.parse(data);
      this.permission_details = data.filter(res=>{
        res.page = res.page.replace(/\s/g, '');
        this.search_txt = this.search_txt.replace(/\s/g, '');
        return res.page.toLowerCase().includes(this.search_txt.toLowerCase())
      })
      // this.permission_details = this.filterItems(this.search_txt);
      // console.log(this.filterItems(this.search_txt));
    }else{
      this.get_values()
    }
  }

  page_no = 0
  onEnterPressed(){
    if(this.search_txt){
      console.log(this.search_txt,"this.search_txt")
      let obj = {
        start: this.page_no,
        limit:100,
        text: this.search_txt
      }

      this.global_search(obj)
    }
    
  }

  global_search(data){
    // this.db.global_search(data).subscribe(res=>{
    //   if(res){
    //     console.log(res,"res")
    //   }
    // })
  }

  enable_search(){
    this.enable_search_data = true
    // this.db.get_permission_details()
  }

  navigate_url(url){

    if(this.db.path && !this.db.path.includes('/report') && !this.db.path.includes('/job-applicant-list')){
      let currentUrl = this.router.url;
      let urls = currentUrl.split('/');
      if(urls && urls.length == 4){
        currentUrl = urls[1] + '/' + urls[2]; 
      }
      this.location.replaceState(currentUrl);
      this.db.detail_route_bread = "";
      this.db.enable_material = false;
      this.db.enable_detail = false;
      let route = url.toLowerCase()
      if(route && (route != 'timesheet' && route != 'tickets')){
        this.db.full_width = false;
      }
      if(route && route.includes(' ')){
        route = route.replace(' ', '-')
      }
      // console.log(route,'navigate_url')
  //  || route == 'task'
      if(route && (route == 'timesheet')){
        this.db.breadCrumb.next(route)
      }
  
      if(route == 'tickets'){
        this.db.hd_ticket_show = false;
        this.db.enable_detail = false;
        this.db.enable_material = false;
        this.db.profile_side_menu = false;
        route = 'hd-ticket'
        this.db.breadCrumb.next(route)
      }
  
      if(url != 'Dashboard Overview'){
        if(route == 'lead'){
          route = 'Lead'
        }
        this.router.navigateByUrl('/list/' + route)
      }

      if(url == 'Select Project'){
        this.router.navigateByUrl('/bugsheet-overview')
      }
    }

    this.db.clearFilterAccess = true;
    this.db.clearSearchFilterInList.next('Success')

  }

  route_home(){
    this.router.navigateByUrl('/dashboard');
    this.db.detail_route_bread = "";
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import $ from "jquery";
import { LoadingController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-side-tabs',
  templateUrl: './side-tabs.component.html',
  styleUrls: ['./side-tabs.component.scss'],
})
export class SideTabsComponent implements OnInit {

  @Input() type;
  is_active = false;
  showmore1 = false;
  is_active1 = false;
  currentRoute:any;
  side_tab_dashboard:any = [];
  tabSection = [
    {'name':'Dashboard','icon':'/assets/dashboard/Dashboard.svg', 'activeIcon':'/assets/dashboard/Dashboard-active.svg','is_active':true},
    {'name':'Employee','icon':'/assets/dashboard/Employee.svg', 'activeIcon':'/assets/dashboard/Employee-active.svg'},
    {'name':'Project','icon':'/assets/dashboard/Project.svg', 'activeIcon':'/assets/dashboard/Project-active.svg'},
    // {'name':'Report','icon':'/assets/dashboard/Report.svg', 'activeIcon':'/assets/dashboard/Report-active.svg'},
  ]

  DashboardArray = ['Dashboard', 'Employee Attendance Tool', 'Attendance', 'Employee Checkin']
  EmployeeArray = ['Employee', 'Employee Advance', 'Expense Claim','Employee Grievance','Salary Slip','Leave Application','Holiday List', 'Job Applicant']
  ProjectArray = ['Project', 'Task', 'Timesheet','Issue', 'Report', 'Bug Sheet']
  ReportArry = []
  enableMultipleLogin = false;

  constructor(public db: DbService, public router: Router, public loadingCtrl: LoadingController, public location:Location) { }

  ngOnInit() {
    
    if(this.db.side_tab_dashboard && this.db.side_tab_dashboard.length != 0){
      this.getTabs(this.tabSection[0]);
    }

    // this.currentRoute = this.router.url;
    // console.log(this.currentRoute)

    this.db.checkMobileMenu();
    // console.log(this.db.path)
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.scrolltoview(this.db.path)
      }, 5500);
    }

    this.db.triggerSidemenu.subscribe(res=>{
      if(res && res == 'loadMenu' && this.db.path){
        let doc = this.db.side_tab_dashboard.find((res:any,i)=>{ return (this.db.path.includes(res.route)) })
        if(doc && doc.page){
          doc = doc.page;

          let dashboard = this.DashboardArray.find(res=>{ return res ==  doc})
          if(dashboard){
            this.getTabs(this.tabSection[0]);
            return 1;
          }
          
          dashboard = this.EmployeeArray.find(res=>{ return res ==  doc})
          if(dashboard){
            this.getTabs(this.tabSection[1]);
            return 1;
          }

          dashboard = this.ProjectArray.find(res=>{ return res ==  doc})
          if(dashboard){
            this.getTabs(this.tabSection[2]);
            return 1;
          }

          dashboard = this.ReportArry.find(res=>{ return res ==  doc})
          if(dashboard){
            this.getTabs(this.tabSection[3]);
            return 1;
          }else{
            this.getTabs(this.tabSection[0]);
          }

        }
        // this.getTabs(this.tabSection[0]);
      }else{
        this.getTabs(this.tabSection[0]);
      }
    })
    // console.log(this.db.side_tab_dashboard)
  }


  getTabs(item:any){
    this.side_tab_dashboard = [];
    let array:any = [];

    this.tabSection.map((res)=>{
      res['is_active'] =  res.name == item.name ? true : false;
    })

    if(item.name == this.tabSection[0].name){
     array = this.DashboardArray
    }else if(item.name == this.tabSection[1].name){
      array = this.EmployeeArray
    }else if(item.name == this.tabSection[2].name){
      array = this.ProjectArray
    }else if(item.name == this.tabSection[3].name){
      array = this.ReportArry
    }

    this.db.side_tab_dashboard.map((res:any,i)=>{
        if(array.length != 0){
         let get_obj = array.find((doc:any)=>{ return res.page == doc})
         get_obj ? this.side_tab_dashboard.push(res) : null;
        }
    })
  }
 

  // enter_fn(data){
  //   this.zone.run(() => {
  //     data = true;
  //   });
  // }

  // leave_fn(data){
  //   this.zone.run(() => {
  //     data = false;
  //   });
  // }

  profile_info = {
    // profile_menu : this.db.login_role !='Recruiter' ? [
    //   {menu_name:'Dashboard','redirect_url':'/dashboard','active_icon':'/assets/icon/profile/dashboard_w.svg','icon':'/assets/icon/profile/dashboard_blu.svg'},
    //   {menu_name:'Opportunity','redirect_url':'/home','active_icon':'/assets/icon/profile/opportunity_w.svg','icon':'/assets/icon/profile/opportunity_blu.svg'},
    //   {menu_name:'Learning','redirect_url':'/learning','active_icon':'/assets/icon/profile/learning_w.svg','icon':'/assets/icon/profile/learning_blu.svg'},
    //   {menu_name:'Settings','redirect_url':'/edit-profile/objective','active_icon':'/assets/icon/profile/settings_w.svg','icon':'/assets/icon/profile/settings_blu.svg'},
    // ] :
    // [
    //   {menu_name:'Dashboard','redirect_url':'/dashboard','active_icon':'/assets/icon/profile/dashboard_w.svg','icon':'/assets/icon/profile/dashboard_blu.svg'},
    //   {menu_name:'Jobs','redirect_url':'/job/all-jobs','active_icon':'/assets/icon/profile/opportunity_w.svg','icon':'/assets/icon/profile/opportunity_blu.svg'},
    //   {menu_name:'Talent','redirect_url':'/recruit-talent/talent','active_icon':'/assets/icon/profile/r_talent_w.svg','icon':'/assets/icon/profile/r_talent_blu.svg'},
    //   {menu_name:'Settings','redirect_url':'/edit-profile/personal-data','active_icon':'/assets/icon/profile/settings_w.svg','icon':'/assets/icon/profile/settings_blu.svg'},
    // ],

    menu: [
      { menu_name: 'Help & Support', 'redirect_url': '', 'active_icon': '/assets/icon/profile/dashboard-w.svg', 'icon': '/assets/icon/profile/help.svg' },
      { menu_name: 'Privacy Policy', 'redirect_url': 'p/privacy-policy', 'active_icon': '/assets/icon/profile/ticket-w.svg', 'icon': '/assets/icon/profile/privacy_policy.svg' },
      { menu_name: 'Terms and Conditions', 'redirect_url': 'p/terms-and-conditions', 'active_icon': '/assets/icon/profile/Document-w.svg', 'icon': '/assets/icon/profile/terms.svg' },
      { menu_name: 'Contact Us', 'redirect_url': 'p/contact-us', 'active_icon': '/assets/icon/profile/refer-w.svg', 'icon': '/assets/icon/profile/contact-us.svg' },
    ]

  }

  back(): void {
    // this.router.navigate("..");
  }


  check_icon(array, index) {
    array.map((res, i) => {
      if (i == index) {
        res['is_active'] = true;
      } else {
        res['is_active'] = false;
      }
    })
  }

  // changeEvent(item,mouseEvent){

  //   if(mouseEvent == 'enter'){
  //     setTimeout(()=>{
  //       item['is_active'] = true;
  //     },10);
  //   }else if(mouseEvent == 'leave'){
  //       item['is_active'] = false;
  //   }
  // }


  get_change_color(item, index) {
    item['is_active'] = false;
    //   this.db.menu.map((res,i)=>{
    //   if(i == index){
    //     res['is_active'] = false;
    //   }else{
    //     res['is_active'] = false;
    //   }
    // })

    //  if(this.db.path != item.redirect_url){
    //   // let id = '#'+ item.menu_name + 'd'
    //   let id = '#'+ index + 'd';
    //   //  let div = $(id).find('svg path').attr('stroke','red');
    //   // if(id && (id)[0] && (id)[0]['shadowRoot']){
    //     let div = $('svg path', $(id)[0]['shadowRoot']).attr('stroke','#2155B9');
    //   // }
    //  }

  }

  get_change_color1(item, index) {
    item['is_active'] = true;
    //   this.db.menu.map((res,i)=>{
    //   if(i == index){
    //     res['is_active'] = true;
    //   }else{
    //     res['is_active'] = false;
    //   }
    // })
    // if(this.db.path != item.redirect_url){
    //   // let id = '#'+ item.menu_name + 'd';
    //   let id = '#'+ index + 'd';
    //   // if(id && (id)[0] && (id)[0]['shadowRoot']){
    //   let div = $('div svg path', $(id)[0]['shadowRoot']).attr('stroke','#fff');
    //   // }
    // }

  }

  get_change_color2() {
    this.is_active = true;
    let id = '#' + 15 + 'd';
    let div = $('div svg path', $(id)[0]['shadowRoot']).attr('stroke', '#017EE5');
  }

  mouse_leave_color() {
    this.is_active = false;
    let id = '#' + 15 + 'd';
    let div = $('div svg path', $(id)[0]['shadowRoot']).attr('stroke', '#2155B9');
  }

  get_change_color3() {
    this.is_active1 = true;
    let id = '#' + 15 + 'f';
    let div = $('div svg path', $(id)[0]['shadowRoot']).attr('stroke', '#fff');
  }

  mouse_leave_color1() {
    this.is_active1 = false;
    let id = '#' + 15 + 'f';
    let div = $('div svg path', $(id)[0]['shadowRoot']).attr('stroke', '#2155B9');
  }

  get_active(data, index) {
    this.db.dashboard_values.map((res, i) => {
      if (index == i) {
        res['is_active'] = true
      } else {
        res['is_active'] = false
      }
    })
  }

  scrolltoview(eve) {
    // console.log(eve)
    let scrollDiv = 'scroll' + eve
    const element1 = document.getElementById(scrollDiv);
    element1 ? element1.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }) : null
  }

  var_false(item) {
    // this.db.profile_side_menu = false;
    //  && item.page != 'Task'
    if(item.page != 'Timesheet' && item.page != 'HD Ticket'){
      this.db.enable_detail = false;
      this.db.enabled_hidden_fields = false;
      this.db.show_detail_datas = false;
      this.db.show_form_details = false;
      this.db.enable_material = false;
      this.db.hd_ticket_show = false;
      this.db.full_width = false;
      this.db.detail_route_bread = ""
      delete localStorage['selected_project_name']
      delete localStorage['selected_project_id']
      if(localStorage['docType'] == 'HD Ticket'){
        this.db.get_notification_list()
      }
      this.location.replaceState(item.route);
    }else if(item.page == 'Timesheet'){

      // this.db.filtersValue = {};
      this.db.detail_route_bread = '';
      this.location.replaceState(item.route);
      setTimeout(()=>{
        this.router.navigateByUrl(item.route);
        this.db.breadCrumb.next(item.route)
      },800)
      // this.db.breadCrumb.next('timesheet');
      // this.db.filtersValue = {};
      // this.db.detailId = undefined;
      // this.db.timeSheetDetails = undefined;
      // this.db.full_width = false;
    }else if(item.page == 'HD Ticket'){
      this.db.hd_ticket_show = false;
      this.db.enable_detail = false;
      this.db.enable_material = false;
      this.db.profile_side_menu = false;
      setTimeout(()=>{
        this.router.navigateByUrl(item.route);
        this.db.breadCrumb.next(item.route)
      },800)
    }
    // else if(item.page == 'Task'){
    //   this.db.detail_route_bread = '';
    //   this.location.replaceState(item.route);
    //   setTimeout(()=>{
    //     this.router.navigateByUrl(item.route);
    //     this.db.breadCrumb.next(item.route)
    //   },800)
    // }
    this.db.seperateJobSection = false;
    this.db.rightSideDetailSection = false;

    let elements: NodeListOf<Element> = document.querySelectorAll(this.db.randomClassNameCommonGrid);
    if (elements.length) {
      elements.forEach(element => element.remove());
      // console.log(`${elements.length} elements removed.`);
    } else {
      // console.log('No elements found to remove.');
    }
    // console.log('Remaining elements:', document.querySelectorAll(this.db.randomClassNameCommonGrid).length);

    let inputs = document.getElementById(this.db.commonGridNavigationInput)
    if (inputs) {
      inputs.remove();
    }
  }


}

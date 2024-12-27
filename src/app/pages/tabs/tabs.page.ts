import {
  Component,
  OnInit,
  OnDestroy, 
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  AlertController,
  AnimationController,
  IonFab,
  MenuController,
  ModalController,
  Platform,
  PopoverController,
} from '@ionic/angular';
import { Router, NavigationExtras, RouterOutlet, ActivationStart } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  titleMode: any = 'hide';
  position: any = 'center';
  @ViewChild('fablist') fabs_list: IonFab | any;

  @ViewChild(RouterOutlet) outlet: RouterOutlet | any;

  // employeePopUp:any = [
  //   {label:'Expense Claim', icon:'/assets/dashboard/ExpenseClaim-active.svg', route:'/forms/expense-claim'},
  //   {label:'Employee Advance', icon:'/assets/dashboard/EmployeeAdvance-active.svg', route:'forms/employee-advance'},
  //   {label:'Leave Application', icon:'/assets/dashboard/LeaveApplication-active.svg', route:'/forms/leave-application'},
  // ];

  employeePopUp:any = [
    // {label:'Expense Claim', doctype:'Expense Claim', icon:'/assets/Employee-Home/ExpenseClaim.svg', route:'/forms/expense-claim'},
    // {label:'Employee Advance', doctype:'Employee Advance', icon:'/assets/Employee-Home/EmployeeAdvance.svg', route:'forms/employee-advance'},
    {label:'Leave Application', doctype:'Leave Application', icon:'/assets/Employee-Home/LeaveApplication.svg', route:'/forms/leave-application'},
    {label:'Leave Request', doctype:'Leave Request', icon:'/assets/Employee-Home/CompensatoryLeaveRequest.svg', route:'/leave-application'},
  ];

  hrEmployeePopUp:any = [
    // {label:'Expense Claim', doctype:'Expense Claim', icon:'/assets/Employee-Home/ExpenseClaim.svg', route:'/forms/expense-claim'},
    // {label:'Employee Advance', doctype:'Employee Advance', icon:'/assets/Employee-Home/EmployeeAdvance.svg', route:'forms/employee-advance'},
    {label:'Leave Application', doctype:'Leave Application', icon:'/assets/Employee-Home/LeaveApplication.svg', route:'/forms/leave-application'},
    {label:'Leave Request', doctype:'Compensatory Leave Request', icon:'/assets/Employee-Home/CompensatoryLeaveRequest.svg', route:'/leave-application'},
    // {label:'Salary Slip', icon:'/assets/Employee-Home/SalarySlip.svg', route:'/forms/leave-application'},
  ];

  // @ViewChild('outlet', { static: true }) outlet: RouterOutlet | any;

  constructor(public db: DbService, private router: Router, private viewContainerRef: ViewContainerRef, private modalCtrl: ModalController) { 
    // this.router.events.subscribe((e:any) => {
    //   if (e instanceof ActivationStart && e.snapshot.outlet === "administration")
    //     console.log('e',e);
    //     this.viewContainerRef.detach();
    // });
  }

  ngOnInit() {

  }


  ionViewWillEnter() {
    this.db.hasClass1 = false;
  }


  enabled_fab() {
    this.db.hasClass1 = !this.db.hasClass1;
  }


  fab() {
    // let val: any;
    this.fabs_list.close();
    // val = document.getElementById('fab-list');
    // val.click();
    this.db.hasClass1 = false;
  }

  close_fab() {
    // console.log('1234');
    // this.viewContainerRef.detach();
    if (this.db.hasClass1) {
      this.fab();
    }
  }

  test_navigate() {
    this.fab();
    let item = '/forms/lead'
    this.router.navigateByUrl(item);
  }

  test_navigate1(link: any) {
    this.fab();
    this.router.navigateByUrl(link);
  }

  onClick(data){
    // console.log(data)
    // console.log(this.db.path)
  }

  navigateList(link){
    // const navigationExtras: NavigationExtras = {
    //   runGuardsAndResolvers: 'paramsOrQueryParamsChange'
    // };
    // this.router.navigate(link, navigationExtras);
    this.router.navigate(link, { runGuardsAndResolvers: 'paramsOrQueryParamsChange' } as NavigationExtras);
  }

  navigateTo(route: any) {
    // console.log('route URL',this.router.url);
    // console.log('route',route);
    route.title == 'Add' ? null : this.close_fab()
    if (this.router.url === route.route) {
      // console.log("Already on the same route, no need to navigate again.");
      return;
    }

    this.router.navigateByUrl(route);
  }


  get_home_icon(value) {
    let img = '';
    let data = '';
    if (value && value.includes(' ')) {
      value = value.replace(/ /g, '');
      data = '/assets/popup/' + value + '.svg';
    } else if (value) {
      data = '/assets/popup/' + value + '.svg';
    } else {
      data = img;
    }

    return data;
  }

}

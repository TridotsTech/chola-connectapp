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

  employeePopUp:any = [
    {label:'Leave Withdrawal', doctype:'Leave Withdrawal', icon:'/assets/Employee-Home/leave withdrawal.svg', route:'/leave-withdrawal/New'},
    {label:'Leave Request', doctype:'Leave Request', icon:'/assets/Employee-Home/leaverequest.svg', route:'/leave-application'},
  ];

  hrEmployeePopUp:any = [
    {label:'Leave Withdrawal', doctype:'Leave Withdrawal', icon:'/assets/Employee-Home/leave withdrawal.svg', route:'/leave-withdrawal/New'},
    {label:'Leave Request', doctype:'Compensatory Leave Request', icon:'/assets/Employee-Home/leaverequest.svg', route:'/leave-application'},
  ];

  constructor(public db: DbService, private router: Router, private viewContainerRef: ViewContainerRef, private modalCtrl: ModalController) { 
    
  }

  ngOnInit() {

  }


  ionViewWillEnter() {
    this.db.hasClass1 = false;
    if(this.db.path == '/')
      this.db.path = '/tabs/dashboard'
  }

  enabled_fab() {
    this.db.hasClass1 = !this.db.hasClass1;
  }

  fab() {
    this.fabs_list.close();
    this.db.hasClass1 = false;
  }

  close_fab() {
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
   
  }

  navigateList(link){
    this.router.navigate(link, { runGuardsAndResolvers: 'paramsOrQueryParamsChange' } as NavigationExtras);
  }

  navigateTo(route: any) {
  
    route.title == 'Add' ? null : this.close_fab()
    if (this.router.url === route.route) {
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

import { Component, OnInit, ChangeDetectorRef, SimpleChanges, Input, EventEmitter, ElementRef, Renderer2, Output, HostListener, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { CheckinMultipleComponent } from '../../checkin-multiple/checkin-multiple.component';

@Component({
  selector: 'app-mobile-attendance',
  templateUrl: './mobile-attendance.component.html',
  styleUrls: ['./mobile-attendance.component.scss','../orders/orders.component.scss'],
})
export class MobileAttendanceComponent implements OnInit {
  @Input() list_data: any;
  @Input() attendance_dashboard: any;
  @Input() doc_type: any;
  @Input() showCalendar: any;
  @Input() search_data: any;
  @Input() search_filter: any;
  @Input() highlightedDates: any;
  @Input() show_attendance: any;
  @Output() getDateFromCalendars = new EventEmitter()
  @Output() getFilters = new EventEmitter()
  @Output() getCalendarDate = new EventEmitter()
  @Output() show_att_cal = new EventEmitter()
  @Output() loadMore = new EventEmitter()

  options = [{ name: "Today", route: "today" }, { name: "Overview", route: "overview" }];
  options1 = [{ name: "Calendar", route: "calendar" }, { name: "List", route: "list" }];
  viewType: any;
  view: any;
  show_attendance1 = true;


  ngOnChanges(changes:SimpleChanges) {
    if (changes && changes['highlightedDates'] && changes['highlightedDates'].currentValue) {
      this.highlightedDates = changes['highlightedDates'].currentValue;
      this.cdr.detectChanges();
    }
  }

  constructor(private ngZone: NgZone,public db:DbService, public cdr:ChangeDetectorRef, private modalCtrl:ModalController, private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit() {
    this.db.tab_buttons(this.options, this.options[0].route, 'route');
    this.viewType = this.options[0].route

    this.db.tab_buttons(this.options1, this.options1[0].route, 'route');
    this.view = this.options1[0].route
  }

  get_count_color(data) {
    if (data == 'Total Working Days') {
      return '#5461FF'
    } else if (data == 'Check In') {
      return '#009A3E'
    } else {
      return '#E02323'
    }
  }

  transform_att_date(value: any) {
    const date = new Date(value);
    const day = ('0' + date.getDate()).slice(-2);
    const dayOfWeek = date.toLocaleString('en-us', { weekday: 'short' });
    const month = date.toLocaleString('en-us', { month: 'short' });
    const year = date.getFullYear();

    return `${day} -${dayOfWeek} / ${month} - ${year}`;
  }

  converHours(data) {
    data = String(data)
    const [time, modifier] = data.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes ? minutes : '00'} Hr`;
  }

  converTime(data) {
    // Split the input string by ':'
    data = String(data)
    let [hours, minutes] = data.split(':');

    // Convert hours to a number
    hours = parseInt(hours);

    // Determine AM or PM suffix
    let suffix = hours >= 12 ? 'PM' : 'AM';

    // Adjust hours for 12-hour format
    hours = (hours % 12) || 12;

    // Add leading zero to minutes if necessary
    if (minutes && minutes.length < 2) {
      minutes = '0' + String(minutes);
    }

    // Construct the new time format
    return `${hours}:${minutes ? minutes : '00'} ${suffix}`
  }

  menu_name(eve: any) {
    this.viewType = eve.route
    this.db.tab_buttons(this.options1, this.options1[0].route, 'route');
    this.view = this.options1[0].route
  }

  menu_name1(eve: any) {
    this.view = eve.route;
    this.ngZone.run(() => {
      // this.getCalendarDate.emit(eve);
      // this.highlightedDates = this.highlightedDates; // Ensure view updates on change
    });
  }

  attendance_dashboard_icon = [
    {
      icon: '/assets/attendance-ess/calendar-tick.svg',
    },
    {
      icon: '/assets/attendance-ess/check-in.svg',
    },
    {
      icon: '/assets/attendance-ess/check-out.svg',
    },
  ]

  async do_to_details(item){
    // const modal = await this.modalCtrl.create({
    //   component: CheckinMultipleComponent,
    //   cssClass: 'add-worker-popup',
    //   componentProps: {
    //     detail: item,
    //     popup: true,
    //     showChekinout:true
    //   },
    // });
    // await modal.present();
    // const val = await modal.onWillDismiss();
  }

  // @HostListener('document:click', ['$event'])
  // handleGlobalClick(event: Event) {
  //   const target:any = event.target as HTMLElement;
  //   console.log(target.mode)
  //   if (target.mode && target.mode == 'ios') {
  //     this.handleButtonClick();
  //   }
  // }

  // swipeStartX: any;
  // swipeEndX: any;
  // swipeThreshold:any = 50; // Minimum distance in pixels to be considered a swipe

  // @HostListener('document:touchstart', ['$event'])
  // onTouchStart(event: TouchEvent) {
  //   this.swipeStartX = event.touches[0].clientX;
  // }

  // @HostListener('document:touchmove', ['$event'])
  // onTouchMove(event: TouchEvent) {
  //   if (this.swipeStartX !== undefined) {
  //     this.swipeEndX = event.touches[0].clientX;
  //   }
  // }

  // @HostListener('document:touchend', ['$event'])
  // onTouchEnd(event: TouchEvent) {
  //   if (this.swipeStartX !== undefined && this.swipeEndX !== undefined) {
  //     const deltaX = this.swipeEndX - this.swipeStartX;

  //     // Determine if it's a horizontal swipe and meets the threshold
  //     if (Math.abs(deltaX) > this.swipeThreshold) {
  //       if (deltaX > 0) {
  //         this.handleButtonClick();
  //       } else {
  //         this.handleButtonClick();
  //       }
  //     }

  //     // Reset swipe variables
  //     this.swipeStartX = undefined;
  //     this.swipeEndX = undefined;
  //   }
  // }

  // handleButtonClick() {
  //   const hostElement = document.querySelector('.calendar_att1 ion-datetime');
    
  //   if (hostElement) {
  //     // Access the shadow root
  //     const shadowRoot = hostElement.shadowRoot;
  
  //     if (shadowRoot) {
  //       // Query the ion-label element inside the shadow DOM
  //       const ionLabel:any = shadowRoot.querySelector('ion-label');
  
  //       if (ionLabel) {
  //         // Get the text content of the ion-label
  //         setTimeout(()=>{
  //           const labelText = ionLabel.textContent.trim();
  //           const parts = labelText.split(' ');
  //           const month = parts[0]; // "June"
  //           const year = parts[1];
  //           let index = this.db.monthLists.findIndex((res)=>{ return res.label == month})
  //           let event = {
  //             detail:{
  //               value:year + '-' + (index + 1)
  //             }
  //           }
  //           this.getCalendarDate.emit(event);

  //         },1000)
  //       } else {
  //         console.log('ion-label element not found inside shadow root.');
  //       }
  //     } else {
  //       console.log('Shadow root not found.');
  //     }
  //   } else {
  //     console.log('Host element containing shadow root not found.');
  //   }
  // }

}

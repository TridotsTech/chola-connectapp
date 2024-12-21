import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, OnInit, Output, Input, ViewChild, ElementRef } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { FiltersComponent } from '../categories/filters/filters.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tabs-button',
  templateUrl: './tabs-button.component.html',
  styleUrls: ['./tabs-button.component.scss'],
})
export class TabsButtonComponent implements OnInit {
  @ViewChild('tabList') tabList: ElementRef | any;
  @Output() menu_name = new EventEmitter<any>();
  @Output() lead_tabs = new EventEmitter<any>();
  @Input() overflow: any
  @Input() tabs_array: any;
  @Input() nobackground: any;
  @Input() change_color_none: any;
  @Input() type: any;
  @Input() border_none: any;
  @Input() sticky: any;
  @Input() padding: any;
  @Input() bg_white: any;
  @Input() scroll_unique: any;
  @Input() enable_br: any;
  @Input() no_next_btn: any;
  @Input() Lead_detail: any;
  @Input() Lead_seg: any;
  @Input() employee_detail_tab: any;
  @Input() removeActiveLine: any;
  @Input() no_mb: any;
  @Input() no_initial_active: any;
  @Input() bg_color: any;
  @Input() bg_custom: any;

  activeTabIndex: any = 0;
  scrolling = false;

  constructor(public route: Router, public db: DbService, private modalCtrl: ModalController) { }

  ngOnInit() {
    // console.log(this.Lead_detail)
    // console.log(this.bg_white);

    //  console.log(this.tabs_array)
    if (this.tabs_array && this.tabs_array.length > 0 && !this.no_initial_active) {
      this.tabs_array[0].isActive = true;
    }


    setTimeout(() => {
      if (this.tabs_array && this.tabs_array.length > 0) {
        this.tabs_array.map((t: any, i: any) => {
          if (t.isActive && (this.tabList && this.tabList.nativeElement && this.tabList.nativeElement.children && this.tabList.nativeElement.children[i])) {
            const element = this.tabList ? this.tabList.nativeElement.children[i] : null;
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }
          }
          // t.isActive = true
        })
      }
    }, 1000)

  }


  check_active(tabs_array: any, index: any, tab: any) {
    if (tabs_array && !this.change_color_none) {
      tabs_array.map((t: any, i: any) => {
        if (i == index) {
          t.isActive = true
        }
        else {
          t.isActive = false
        }
      })
    }
    if (tab) {
      // console.log(tab)
      this.menu_name.emit(tab);
      this.lead_tabs.emit(tab);
      // let check = document.getElementById(index + 1 +'scroll') as HTMLInputElement;
      // check.scrollIntoView({ behavior: 'smooth',block :'center' , inline  :'center' })

      const element = this.tabList.nativeElement.children[index];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }
    //  this.route.navigateByUrl('Profile-candidate/'+tab)
  }


  // navigateTabs(direction){
  //   console.log(direction)
  //   if (direction == 'prev') {  
  //     // d.scrollLeft -= 250;
  //       this.tabList.nativeElement.scrollLeft -= 100;
  //   } else if (direction == 'next') {
  //     // d.scrollLeft += 250;
  //       this.tabList.nativeElement.scrollLeft += 100;
  //   }

  //   let prevBtn:any = document.getElementById('prev') 
  //   let nextBtn:any = document.getElementById('next')


  //   if (this.tabList.nativeElement.offsetWidth + this.tabList.nativeElement.scrollLeft == this.tabList.nativeElement.scrollWidth - 1) {
  //     if(prevBtn || nextBtn){
  //       prevBtn.classList.remove('hidden');
  //       nextBtn.classList.add('hidden');
  //     }
  //   }else{
  //     prevBtn.classList.add('hidden');
  //     nextBtn.classList.remove('hidden');
  //   }

  // }

  navigateTabs(direction) {
    // console.log(direction);
    const scrollAmount = 100;

    if (direction == 'prev') {
      this.tabList.nativeElement.scrollTo({
        left: this.tabList.nativeElement.scrollLeft - scrollAmount,
        behavior: 'smooth'
      });
    } else if (direction == 'next') {
      this.tabList.nativeElement.scrollTo({
        left: this.tabList.nativeElement.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }

    let prevBtn: any = document.getElementById('prev');
    let nextBtn: any = document.getElementById('next');

    if (this.tabList.nativeElement.offsetWidth + this.tabList.nativeElement.scrollLeft == this.tabList.nativeElement.scrollWidth - 1) {
      if (prevBtn || nextBtn) {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden');
      }
    } else {
      prevBtn.classList.add('hidden');
      nextBtn.classList.remove('hidden');
    }
  }


  navigateTabs1(direction: any) {
    // console.log(direction)
    let slider_child_id = document.getElementById('tabList')
    let dummy_ = document.querySelector('.dummy_')
    // console.log(dummy_?.clientWidth)
    let dummy_width = dummy_?.clientWidth

    if (slider_child_id) {
      let slider_div = slider_child_id;
      let slider_width = slider_child_id.clientWidth
      if (direction == 'next') {
        slider_div.scrollBy({ top: 0, left: dummy_width, behavior: 'smooth' });
      } else {
        slider_div.scrollBy({ top: 0, left: -250, behavior: 'smooth' });
      }
    }
  }

  // navigateTabs(direction: any) {
  //   console.log(direction)
  //   // if (!this.scrolling && this.tabList && this.tabList.nativeElement) {
  //   //   const tabListElement = this.tabList.nativeElement;
  //   //   const tabWidth = tabListElement.children[0].offsetWidth; // Assuming all tabs have the same width

  //   //   if (direction === 'prev' && this.activeTabIndex > 0) {
  //   //     this.activeTabIndex--;
  //   //   } else if (direction === 'next' && this.activeTabIndex < this.tabs_array.length - 1) {
  //   //     this.activeTabIndex++;
  //   //   }

  //   //   this.scrolling = true;
  //   //   const targetTab = tabListElement.children[this.activeTabIndex];

  //   //   setTimeout(() => {
  //   //     targetTab.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //   //     this.scrolling = false;
  //   //   }, 0);
  //   // }

  // }



}

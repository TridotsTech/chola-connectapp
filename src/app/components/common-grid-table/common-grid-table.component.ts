import { Component, OnInit, Input, Output, EventEmitter, ViewChild, NgZone, ElementRef, HostListener, OnDestroy, ViewChildren } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-common-grid-table',
  templateUrl: './common-grid-table.component.html',
  styleUrls: ['./common-grid-table.component.scss'],
})
export class CommonGridTableComponent implements OnInit, OnDestroy {
  @Input() list_data: any;
  @Input() doctype: any;
  @Input() headerData: any;
  @Input() detailPage: any;
  @Input() detailPopup: any;
  @Input() enableStatusFilter: any;
  @Input() rightDetail: any;
  @Input() listView: any;
  @Input() height: any;
  @Output() load_popup = new EventEmitter();
  @Output() go_to_detail = new EventEmitter();
  @Output() menu_name = new EventEmitter();
  @Output() leaveConfirm = new EventEmitter();
  skeleton = true;
  allCheckTrue = false;
  @ViewChild('prioritySelect') prioritySelect: NgSelectComponent | any;
  @ViewChild('tableScroll') tableScroll: ElementRef | any;

  isMouseDown = false;
  startX = 0;
  startY = 0;
  scrollLeft = 0;
  scrollTop = 0;
  tableCount: any = 0;
  active: any = 0;
  // tableEndCount: any = 0;
  constructor(public db: DbService, private ngzone: NgZone) { }

  ngOnInit() {
    // console.log(this.headerData,'headerData')
    // console.log(this.list_data, 'list_data')
    this.skeleton = true
    setTimeout(() => {
      this.skeleton = false;
    }, 600)

    this.active = 0;

    if (this.headerData && this.headerData.length != 0) {
      // this.headerData.map((res: any, index) => {
      //   if (res && res.prop) {
      //     if (res.prop == 'milestone_tasks' || res.prop == 'percent_complete' || res.prop == 'total_milestone_count' || res.prop == '_user_tags' || res.prop == 'task_count' || res.prop == 'events_days_difference' || res.prop == 'assign_to') {
      //       this.headerData.splice(index, 1)
      //     }
      //   }
      // })

      for(let i=0; i<=this.headerData.length; i++){
        if(this.headerData[i] && this.headerData[i].prop){
          console.log('this.headerData[i].prop',this.headerData[i].prop)
          if (this.headerData[i].prop == 'milestone_tasks' || this.headerData[i].prop == 'percent_complete' || this.headerData[i].prop == 'total_milestone_count' || this.headerData[i].prop == '_user_tags' || this.headerData[i].prop == 'task_count' || this.headerData[i].prop == 'events_days_difference' || this.headerData[i].prop == 'assign_to') {
            this.headerData.splice(i, 1)
          }
        }
      }
      // this.tableEndCount = this.headerData.length;
      // console.log(this.headerData.length, 'headerData.length')
    }

    


    setTimeout(() => {
      this.db.randomClassNameCommonGrid = `.navigate`
      let array: any = document.querySelector(this.db.randomClassNameCommonGrid);
      Array.from(array.children).map((res: any) => {
        Array.from(res.children).map((resA: any) => {
          this.tableCount = this.tableCount + 1;
          resA.setAttribute("id", this.tableCount)
          resA.addEventListener("click", () => this.changetabIndex(Number(resA.id)));
          resA.addEventListener("change", () => this.keyDown(Number(resA.id)));
          let selectBox = document.getElementById('1');
          if (selectBox) {
            this.active = 1;
            selectBox.classList.add('isSelected')
          }
        });
      });

      this.db.commonGridNavigationInput = 'inputs'
      let inputs = document.getElementById(this.db.commonGridNavigationInput)
      if (inputs) {
        inputs.focus();
      }

    }, 2000);
  }

  handleBlur(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    
    // Check if there is another input with focusable intent
    const focusedElement = document.activeElement as HTMLElement;
    if (!focusedElement || focusedElement.tagName !== 'INPUT') {
      input.focus(); // Return focus to the current input if no other input is focused
    }
  }
  

  changetabIndex(id) {
    this.removeClass(this.active);
    this.active = id;
    this.active_item(this.active);
  }

  keyDown(eve){
    console.log(eve)
  }


  enablePriority(data) {
    data['showPriority'] = true;
    setTimeout(() => {
      this.prioritySelect.open();
    }, 50);
  }

  priorityList = [
    { name: "Low" },
    { name: "Medium" },
    { name: "High" },
  ]

  goToDetail(event, data, index) {
    event.stopPropagation();
    this.db.rightSideDetailSection = false;
    if (this.detailPopup) {
      this.load_popup.emit(data)
    } else if (this.detailPage) {
      this.go_to_detail.emit({ item: data, index: index })
    }
  }

  rightSectionDetail(event, data, index) {
    event.stopPropagation();
    if (this.rightDetail) {
      this.db.rightSideDetailSection = true;
      this.go_to_detail.emit({ item: data, index: index })
    } else {
      this.db.rightSideDetailSection = false;
      // this.go_to_detail.emit({ item: data, index: index })
    }
  }

  selectItem(data, type, item) {
    let datas: any = {
      doctype: this.doctype,
      name: item.name
    };
    datas[type] = data.name
    item['showPriority'] = false;
    this.insertDocument(datas);
  }

  insertDocument(datas) {
    this.db.inset_docs({ data: datas }).subscribe(res => {
      // console.log(res,'res')
    })
  }

  check_priority = (status) => {
    if (status == 'Low') {
      return 'arrow-down-outline'
    } else {
      return 'arrow-up-outline'
    }
  }

  checkSingleBox(data) {
    data['isChecked'] = data['isChecked'] ? false : true;

    // console.log(data['isChecked'],'Checked')
  }

  checkAllBox() {
    this.ngzone.run(() => {
      if (this.list_data && this.list_data.data && this.list_data.data.length != 0) {
        for (let i = 0; i <= this.list_data.data.length; i++) {
          this.list_data.data[i]['isChecked'] = this.list_data.data[i]['isChecked'] ? false : true;
          if (this.list_data.data[i]['isChecked']) {
            this.allCheckTrue = true;
          } else {
            this.allCheckTrue = false;
          }
        }
      }
    })
  }



  check_label_r_modified(key, value) {
    // console.log(key,value)
    // return key == 'modified' ? this.db.getTimecal(value) : value;
    if (key == 'modified') {
      return this.db.getTimecal(value)
    } else if ((key.includes('amount') || key.includes('rate') || key.includes('total') || key.includes('pay') || key.includes('paid')) && !key.includes('day') && !key.includes('hour')) {
      if (!key.includes('.')) {
        return '₹' + value + '.00';
      } else {
        return '₹' + value;
      }
    } else {
      return value;
    }
  }

  textEndCheck(key) {
    if ((key.includes('amount') || key.includes('rate') || key.includes('total') || key.includes('pay') || key.includes('paid')) && !key.includes('day') && !key.includes('hour')) {
      return true;
    } else {
      return false;
    }
  }

  leave_confirm(event: MouseEvent, data, type, index) {
    event.stopPropagation()
    let val = {}
    val['data'] = data
    val['type'] = type
    val['index'] = index
    this.leaveConfirm.emit(val)
  }

  changeTextFormat(text) {
    if (text && !text.name) {
      if (text == 'name') {
        text = 'Id'
        return text
      } else if (text.includes('_')) {
        return text.replace(/_/g, ' ');
      } else {
        return text;
      }
    } else {
      if (text.name == 'name') {
        text.name = 'Id'
      } else {
        return text.name;
      }
    }
  }


  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  get_style(data: any): any {

    if (isNaN(data)) {

      if (this.db.app_name == 'Go1 Project') {
        switch (data.toLowerCase()) {
          case 'open': {
            return 'proj_td_open';
          }
          case 'working': {
            return 'proj_td_working';
          }
          case 'completed': {
            return 'proj_td_completed';
          }
          case 'pending review': {
            // return 'pending_review';
            return 'proj_td_pending_review'
          }
          case 'overdue': {
            return 'proj_td_overdue';
          }
          default: {
            return 'default_td';
          }
        }
      }


    }
  }

  onMouseDown(event: MouseEvent, tableScroll: HTMLElement): void {
    event.stopPropagation();
    this.isMouseDown = true;
    this.startX = event.pageX - tableScroll.offsetLeft;
    this.startY = event.pageY - tableScroll.offsetTop;
    this.scrollLeft = tableScroll.scrollLeft;
    this.scrollTop = tableScroll.scrollTop;

    // Change cursor to grabbing to indicate the user is dragging
    tableScroll.style.cursor = 'grabbing';
    tableScroll.classList.add('no-select');
  }

  onMouseMove(event: MouseEvent, tableScroll: HTMLElement): void {
    event.stopPropagation();
    if (!this.isMouseDown) return;
    event.preventDefault();

    const x = event.pageX - tableScroll.offsetLeft;
    const y = event.pageY - tableScroll.offsetTop;
    const walkX = (x - this.startX) * 2; // Adjust multiplier for horizontal sensitivity
    const walkY = (y - this.startY) * 2; // Adjust multiplier for vertical sensitivity

    // Apply the calculated scroll position for both X and Y directions
    tableScroll.scrollLeft = this.scrollLeft - walkX;
    tableScroll.scrollTop = this.scrollTop - walkY;
  }

  onMouseUp(event: MouseEvent, tableScroll: HTMLElement): void {
    event.stopPropagation();
    this.isMouseDown = false;
    // Change cursor back to default after mouseup
    tableScroll.style.cursor = 'grab';
    tableScroll.classList.add('no-select');
  }

  // Add mouse wheel scrolling functionality for both X and Y directions
  onWheel(event: WheelEvent, tableScroll: HTMLElement) {
    event.stopPropagation();
    // Determine the direction of the scroll (horizontal and vertical)
    const scrollX = event.deltaX || 0; // Horizontal scroll
    const scrollY = event.deltaY || 0; // Vertical scroll

    // Adjust scrolling based on the wheel movement
    tableScroll.scrollLeft += scrollX;
    tableScroll.scrollTop += scrollY;

    // Prevent the page from scrolling when scrolling horizontally or vertically inside the container
    event.preventDefault();
  }
  
  active_item(index) {
    let element = document.getElementById(index);
    if (element) {
      element.classList.add('isSelected');
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      // element.scrollBy({ top: 0, left: 250, behavior: 'smooth' });
    }
  }

  removeClass(index) {
    let element = document.getElementById(index);
    if (element) {
      element.classList.remove('isSelected');
    }
  }

  ngOnDestroy() {
    console.log('Items destroyed');
    
    let elements: NodeListOf<Element> = document.querySelectorAll(this.db.randomClassNameCommonGrid);
    
    if (elements.length) {
      elements.forEach(element => element.remove());
      // console.log(`${elements.length} elements removed.`);
    }
  
    // Verify all elements are gone

    let inputs = document.getElementById(this.db.commonGridNavigationInput)
      if (inputs) {
        inputs.remove();
      }
  }
  
  shiftFocusDown() {
    // console.log("DOWN")
    let current_active = this.active;
    if (this.active + this.headerData.length <= this.tableCount) {
      this.removeClass(this.active);
      this.active = current_active + this.headerData.length;
      this.active_item(this.active);
    }
  }
  
  shiftFocusUp() {
    let current_active = this.active;
    // console.log("UP");
    if (this.active > this.headerData.length) {
      this.removeClass(this.active);
      this.active = current_active - this.headerData.length;
      this.active_item(this.active);
    }
  }
  
  shiftFocusLeft() {
    let current_active = this.active;
    // console.log("LEFT");
    if (this.active > 1) {
      this.removeClass(this.active);
      this.active = current_active - 1;
      this.active_item(this.active);
    }
  }
  
  shiftFocusRight() {
    let current_active = this.active;
    // console.log("RIGHT");
    if (this.active + 1 <= this.tableCount) {
      this.removeClass(this.active);
      this.active = current_active + 1;
      this.active_item(this.active);
    }
  }
  

}

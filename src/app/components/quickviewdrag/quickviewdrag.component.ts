import { Component, OnInit } from '@angular/core';
import { CdkDragStart, CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-quickviewdrag',
  templateUrl: './quickviewdrag.component.html',
  styleUrls: ['./quickviewdrag.component.scss'],
  // imports: [CdkDropList, CdkDrag],
})
export class QuickviewdragComponent  implements OnInit {

  listValues:any;
  dragStartTimeout: any;
  holdDuration = 3000; // 3 seconds

  constructor(public db: DbService) { }

  ngOnInit() {
   let data = this.db.dashboard_values;
   data = JSON.stringify(data)
   let listValues = JSON.parse(data);
   listValues.map((res)=>{
    this.db.get_home_icon1(res.page,res)
   })
   this.listValues = listValues;
  }

  drop(event: any) {
    moveItemInArray(this.listValues, event.previousIndex, event.currentIndex);
  }

  save(){
    this.db.dashboard_values = this.listValues
    let data = JSON.stringify(this.db.dashboard_values)
    localStorage['QuickView'] = data
    this.db.close_modal()
  }

  onDragStart(event: CdkDragStart): void {
    // console.log('12334')
    // this.dragStartTimeout = setTimeout(() => {
    //   const dragElement = event.source.getRootElement();
    //   dragElement.classList.add('move-on-hold');
    // }, this.holdDuration);
  }

 

}

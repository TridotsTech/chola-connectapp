import { Component, Input, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss'],
})
export class SkeletonLoaderComponent  implements OnInit {
  @Input() type:any;
  @Input() index:any;
  @Input() filter_len:any;
  @Input() list_len:any = [];
  @Input() list_len_count:any;
  constructor(public db:DbService) { }

  ngOnInit() {
    if(this.list_len_count){
      this.list_len.length = this.list_len_count
    }

    // console.log(this.type,"SkeletonLoaderComponent type")

  }

}

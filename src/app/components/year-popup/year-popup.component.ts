import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-year-popup',
  templateUrl: './year-popup.component.html',
  styleUrls: ['./year-popup.component.scss'],
})
export class YearPopupComponent  implements OnInit {

  yearList:any = [];
  yearLists:any = [];
  is_loaded = false;
  search_txt = '';

  @Input() selectedYear:any;
  @Input() showMonth:any;
  @Input() selectedMonth:any;

  @ViewChild('tabList') tabList: ElementRef | any;


  
  constructor(public db:DbService, public modalCtrl:ModalController) { }

  ngOnInit() {
     if(this.showMonth){
     this.is_loaded = true;
     let selectedMonth = this.selectedMonth ? this.db.monthLists[this.selectedMonth - 1] : this.db.monthLists[0];
     this.db.monthLists.map((res)=>{
      res['isActive'] = (selectedMonth.name == res.name) ? true : false
     })
    }else{
      const currentYear = new Date().getFullYear();
      const endYear = this.db.employee_img.date_of_joining ? new Date(this.db.employee_img.date_of_joining).getFullYear() : 1980;

      for (let year = currentYear; year >= endYear; year--) {
        this.yearList.push({name:year,isActive: (this.selectedYear == year) ? true : false})
      }
      this.yearLists = this.yearList
      this.is_loaded = true;

        setTimeout(()=>{
          this.yearLists.map((res,i)=>{ 
           let str = res.name.toString()
           if(str == this.selectedYear){
            const element = this.tabList.nativeElement.children[i];
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }
           }
          })
        },1500)
    }
    
  }

  clearText(){
    this.search_txt = '';
    this.yearLists = this.yearList
    this.db.monthLists = this.db.monthLists
  }

  load_search(term: any) {
    if(this.showMonth){
      if(term.target.value){
        this.search_txt = term.target.value;
        this.db.monthLists = this.db.monthLists.filter((res,i)=>{ return res.label.toString().includes(this.search_txt)})
        // console.log(this.yearLists)
      }else{
        this.db.monthLists = this.db.monthLists
      }
    }else{
      if(term.target.value){
        this.search_txt = term.target.value;
        this.yearLists = this.yearLists.filter((res,i)=>{ return res.name.toString().includes(this.search_txt)})
        // console.log(this.yearLists)
      }else{
        this.yearLists = this.yearList
      }
    }
  
  }

  add(item,index){
    this.modalCtrl.dismiss(item)
  }

}

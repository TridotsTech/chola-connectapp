import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-freeze-column',
  templateUrl: './freeze-column.component.html',
  styleUrls: ['./freeze-column.component.scss'],
})
export class FreezeColumnComponent  implements OnInit {

  @Input() columns:any;
  @Input() selectValue:any;
  
  constructor(public modalCtrl:ModalController, public db:DbService) { }

  widthValues:any = [{ value:100 }, { value:120 }, {value:140}, {value:160}]
  enterWidth:any;

  ngOnInit() {
    console.log(this.columns,'columns')
    console.log(this.selectValue,'selectValue')
    if(this.selectValue){
     let data = this.columns.findIndex(res=>{ return this.selectValue.prop == res.prop});
     this.select(this.columns[data], data, true);

     let i = 0;

     if(this.selectValue.width){
     this.widthValues.map((res)=>{ 
       if(res.value == this.selectValue.width){
        res.isSelected = true;
        i++
       }
      })
     }

     if(i == 0){
      this.enterWidth = (this.selectValue && this.selectValue.width) ? this.selectValue.width : undefined;
     }

    }else{
      this.columns[0].selected = true;
    }
  }

  select(data,index, type){
    this.columns.map((res,i)=>{
      if(i == index){
        res.selected = (type ? true : (res.selected ? false : true));
      }else{
        res.selected = false
      }
    })
  }

  selectedWidth(item){
   this.enterWidth = undefined;
   this.widthValues.map((res)=>{
     if(res.value == item.value){
      res.isSelected = res.isSelected ? false : true
     }else{
      res.isSelected = false
     }
   })
  }

  widthInput(eve){
    let data = (eve && eve.target && eve.target.value) ? eve.target.value : 0;
    if(data){
      this.widthValues.map((res)=>{ res.isSelected = false })
    }
  }

  save(){
    let data:any = {};
    data = this.columns.find(res=>{ return res.selected})
    if(!data){
      data = {}
      data.name = 'nullValue'
    }else{
     let findWidth = this.widthValues.find((res)=>{ return res.isSelected })
     data.width = (findWidth && findWidth.value) ? findWidth.value : this.enterWidth
    }
    this.modalCtrl.dismiss(data)
  }

}

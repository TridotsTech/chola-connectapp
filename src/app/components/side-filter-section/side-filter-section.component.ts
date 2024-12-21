import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-side-filter-section',
  templateUrl: './side-filter-section.component.html',
  styleUrls: ['./side-filter-section.component.scss'],
})
export class SideFilterSectionComponent  implements OnInit {
@Input() search_filter: any;
@Output() filterList = new EventEmitter();
list_values: any = [];
search_data: any;
  constructor(public db: DbService) { }

  ngOnInit() {
    console.log(this.search_filter,'search_filter')

    for(let i=0; i<=this.search_filter.length; i++){
      if(this.search_filter && this.search_filter[i] && this.search_filter[i].options){
        // console.log(this.search_filter[i],'this.search_filter[i]')

        if (this.search_filter[i].options.includes('\n')) {
          let options = this.search_filter[i].options.split('\n')
          let array = [{ label: 'All', name: 'All' }];
          options.map((res) => {
            array.push({ label: res, name: res })
          })
          array[0]['isSelected'] = true;
          this.search_filter[i].values = array;

        }else{
          this.getLabelByValues(this.search_filter[i])
        }
      }
    }
  }

  formatName(name){
    if(name.includes('_')){
      name.replaceAll('_', ' ')
    }

    return name
  }

  getLabelByValues(values){
      let val: any = {};
      let data = {
        doctype: values.options,
        page_no: 1,
        page_length: 20,
        search_text: "",
        filter_name: "",
        filter_value: ""
      }
      this.db.label_values(data).subscribe(res => {
        if(res && res.message && res.message.length != 0){
          val = {}
          val = {label: 'All',name: 'All',isSelected: true}
          res.message.splice(0, 0, val)
          // console.log(res.message)
          values['values'] = res.message;
        }else{
          values['values'] = [];
        }
      })
  }

  sendTypeValue(eve,datas){
    let finalData: any = {}
    datas['values'] = eve.detail.value
    finalData[datas.fieldname] = eve.detail.value
    
    this.search_data = {...this.search_data,...finalData}

    let finalValue = {
      data: this.search_data,
      status: 'success'
    }

    this.filterList.emit(finalValue)
  }

  sendFinalValues(values,label,i){
    let finalData: any = {}
    if(label && label.values && label.values.length != 0){
      label.values.map((res: any,index: any) => {
        if(i == index){
          label.values[index]['isSelected'] = true;
        }else{
          label.values[index]['isSelected'] = false;
        }
      })
    }

    if(values.name != 'All'){
      finalData[label.fieldname] = values.name
    }else{
      delete finalData[label.fieldname]
      delete this.search_data[label.fieldname]
    }


    this.search_data = {...this.search_data,...finalData}

    console.log(this.search_data)

    let finalValue = {
      data: this.search_data,
      status: 'success'
    }

    this.filterList.emit(finalValue)
    
  }

  clearText(data){
    data['values'] = ''
    this.search_data = {}

    let finalValue = {
      data: this.search_data,
      status: 'success'
    }

    this.filterList.emit(finalValue)
  }

}

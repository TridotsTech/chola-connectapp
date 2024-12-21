import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  search_txt = '';
  permission_details: any = [];
  constructor(public db:DbService,private router:Router, public location: Location) { }

  ngOnInit() {
   this.get_values();
   let data = {
      doctype: localStorage['docType']
   }
  }

  get_values(){
    let data = JSON.stringify(this.db.permission_details);
    this.permission_details = JSON.parse(data);

    // this.permission_details = this.db.permission_details
  }

  router_(route){
    this.router.navigateByUrl(route);
  }
  
  clear_txt(){
    this.search_txt = '';
    this.get_values();
    // this.permission_details = this.db.permission_details;
  }

  load_search(term){
    if(this.search_txt){
      this.search_txt = term.target.value;
      let data:any = [];
      data = JSON.stringify(this.db.permission_details);
      data = JSON.parse(data);
      this.permission_details = data.filter(res=>{
        res.page = res.page.replace(/\s/g, '');
        this.search_txt = this.search_txt.replace(/\s/g, '');
        return res.page.toLowerCase().includes(this.search_txt.toLowerCase())
      })
      // this.permission_details = this.filterItems(this.search_txt);
      // console.log(this.filterItems(this.search_txt));
    }else{
      this.get_values()
    }
  }

  back_route(){
    this.location.back()
  }
  

}

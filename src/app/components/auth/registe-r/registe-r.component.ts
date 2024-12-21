import {
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { DbService } from 'src/app/services/db.service';

import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-registe-r',
  templateUrl: './registe-r.component.html',
  styleUrls: ['./registe-r.component.scss'],
})
export class RegisteRComponent implements OnInit {

  // @Output() scrollToTop = new EventEmitter;

  constructor(public modalCtrl: ModalController,public db:DbService,private formBuilder:FormBuilder,private router:Router) {
    this.db.ismobile = this.db.checkmobile()
  }

  
  ngOnInit() {
    
    // if(localStorage.otp_mobile){
    //  this.register_data.phone =  true;
    //  localStorage.otp_mobile  = true;
    //  this.verified_number = true
    // }
  }



  check(){
  
  }

}

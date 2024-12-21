import { HttpClient } from '@angular/common/http';
import {
  Component,
  HostListener,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { DbService } from 'src/app/services/db.service';

import {
  AlertController,
  ModalController,
  Platform,
} from '@ionic/angular';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['../registe-r/registe-r.component.scss', './log-in.component.scss'],
})
export class LogInComponent implements OnInit {

  // fbLogin: FacebookLoginPlugin;
  user = null;
  token = null;

  // login_data: any = { };
  country_list: any = [];

  @ViewChild('prefixVal') prefixVal: any;

  pwd_policy_msg: any;

  checks: any;

  constructor(private http: HttpClient, public db: DbService, private modalCtrl: ModalController, private alertCtrl: AlertController, private platform: Platform, private router: Router, private formbuilder: FormBuilder, private ngzone: NgZone) {
  }


  ngOnInit() {
    this.db.ismobile = this.db.checkmobile();
  }

  @HostListener('window:resize', ['$event'])
  private func() {
    this.db.ismobile = this.db.checkmobile();
  }


  clear_otp() {
    localStorage['otp_mobile'] = undefined
  }


}

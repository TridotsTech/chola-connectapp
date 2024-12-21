import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.page.html',
  styleUrls: ['./page-not-found.page.scss'],
})
export class PageNotFoundPage implements OnInit {

  constructor(public db: DbService,public router: Router) { }

  ngOnInit() {
    this.db.side_menu_show = false;
  }

  route_dash(){
    this.router.navigateByUrl(this.db.ismobile ? '/tabs/dashboard' : '/dashboard')
  }

}

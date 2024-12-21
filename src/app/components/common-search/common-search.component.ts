import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Platform } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-common-search',
  templateUrl: './common-search.component.html',
  styleUrls: ['./common-search.component.scss'],
})
export class CommonSearchComponent implements OnInit, OnDestroy {
  favEmployee = false;
  search_value: any;
  @Input() placeholder: any;
  @Input() noFilter: any;
  @Input() showSort: any;
  @Input() noSort: any;
  @Input() search_filter: any;
  @Input() favoriteFilter: any;
  @Input() funnelFilter: any;
  @Input() def_search_value: any;

  @Output() search_txt_value: any = new EventEmitter();
  @Output() open_filter: any = new EventEmitter();
  @Output() call_clear_txt: any = new EventEmitter();
  @Output() tab_filter = new EventEmitter();
  @Output() sendFavorite = new EventEmitter();
  @Output() sendFunnelFilter = new EventEmitter();

  constructor(private platform: Platform, public db: DbService) {}

  ngOnDestroy(): void {
    if (
      localStorage['project_filter'] &&
      JSON.parse(localStorage['project_filter'])
    ) {
      localStorage.removeItem('project_filter');
    }
    
    this.db.clearFilter.next('destroy')
  }

  ngOnInit() {
    this.platform.ready().then((res) => {
      if (
        (this.db.ismobile ||
          res == 'ios' ||
          res == 'ipad' ||
          res == 'iphone' ||
          res == 'mobile' ||
          res == 'tablet') &&
        res != 'dom'
      ) {
        Keyboard.addListener('keyboardDidShow', () => {
          console.log('Keyboard is shown');
          this.db.centerFabShow = false;
        });

        Keyboard.addListener('keyboardDidHide', () => {
          console.log('Keyboard is hidden');
          this.db.centerFabShow = true;
        });
      }
    });

    if (this.def_search_value) {
      if (
        localStorage['project_filter'] &&
        JSON.parse(localStorage['project_filter'])
      ) {
        let val = JSON.parse(localStorage['project_filter']);
        let project_name = '';

        if (val && val.project_name && val.project_name.length > 1) {
          let plits = String(val.project_name[1]).split('%').join('');
          project_name = plits;
        }
        this.search_value = project_name;
      }
    }

    this.db.clearFilter.subscribe((res) => {
      // console.log(res,"res")
      if (res) {
        this.search_value = '';
        if (
          localStorage['project_filter'] &&
          JSON.parse(localStorage['project_filter'])
        ) {
          localStorage.removeItem('project_filter');
        }
      }
    });

    // console.log(this.noFilter,'this.noFilter');
  }


  search_text_send(data) {
    if (
      localStorage['project_filter'] &&
      JSON.parse(localStorage['project_filter'])
    ) {
      localStorage.removeItem('project_filter');
    }
    this.search_value = data.target.value;
    this.search_txt_value.emit(data);
  }

  clear_txt() {
    if (
      localStorage['project_filter'] &&
      JSON.parse(localStorage['project_filter'])
    ) {
      localStorage.removeItem('project_filter');
    }
    this.search_value = '';
    this.call_clear_txt.emit({ target: { value: '' } });
  }

  onInputFocus(event: any) {
    // this.db.centerFabShow = false;
  }

  onInputBlur(event: any) {
    // this.db.centerFabShow = true;
  }

  sort: any;
  sort_by() {
    if (
      localStorage['project_filter'] &&
      JSON.parse(localStorage['project_filter'])
    ) {
      localStorage.removeItem('project_filter');
    }
    let val = {};
    if (this.sort && this.sort == 'creation ASC') {
      this.sort = 'creation DESC';
    } else {
      this.sort = 'creation ASC';
    }

    val['sort_by'] = this.sort;
    this.tab_filter.emit(val);
  }

  likedEmployee() {
    if (
      localStorage['project_filter'] &&
      JSON.parse(localStorage['project_filter'])
    ) {
      localStorage.removeItem('project_filter');
    }
    this.favEmployee = !this.favEmployee;

    this.sendFavorite.emit(this.favEmployee);
  }
}

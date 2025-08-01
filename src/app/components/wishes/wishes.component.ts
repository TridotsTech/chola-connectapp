import { Component, OnInit } from '@angular/core';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-wishes',
  templateUrl: './wishes.component.html',
  styleUrls: ['./wishes.component.scss'],
})
export class WishesComponent implements OnInit {

  activeTab: string = 'birthday';
  wishesData: any = {
    birthday: [],
    anniversaries: [],
    'new-joiners': []
  };
  loading: boolean = false;

  constructor(public db: DbService) { }

  ngOnInit() {
    this.loadWishes('birthday');
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    this.loadWishes(tab);
  }

  loadWishes(flag: string) {
    this.loading = true;
    
    // Check if data already exists for this tab
    if (this.wishesData[flag] && this.wishesData[flag].length > 0) {
      this.loading = false;
      return;
    }

    const data = {
      flag: flag
    };

    this.db.get_wishes(data).subscribe((res: any) => {
      this.loading = false;
      if (res && res.message) {
        if(flag == 'new-joiners'){
          this.wishesData = res.message['new_joiners'] || [];
        }else{
          this.wishesData = res.message[flag] || [];
        }
        console.log(this.wishesData)
      } else {
        this.wishesData[flag] = [];
      }
    }, error => {
      this.loading = false;
      console.error('Error loading wishes:', error);
      this.wishesData[flag] = [];
    });
  }

  getWishIcon(flag: string): string {
    switch(flag) {
      case 'birthday':
        return '🎂';
      case 'anniversaries':
        return '🎊';
      case 'new-joiners':
        return '👋';
      default:
        return '🎉';
    }
  }

  getDisplayName(): string {
    switch(this.activeTab) {
      case 'birthday':
        return 'Birthdays';
      case 'anniversaries':
        return 'Anniversaries';
      case 'new-joiners':
        return 'New Joiners';
      default:
        return 'Wishes';
    }
  }

  getCurrentData(): any[] {
    return this.wishesData[this.activeTab] || [];
  }
}
import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  
  viewType: 'calendar' | 'list' = 'calendar';
  list_data: any = {};
  skeleton = false;
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  
  options = [
    { name: 'Calendar', value: 'calendar' },
    { name: 'Holiday', value: 'holiday' },
    { name: 'Week off', value: 'weekoff' }
  ];
  
  holiday_type = 'Calendar';
  highlightedDates: any[] = [];

  constructor(public db: DbService) {
    this.loadData();
  }

  ngOnInit() {
    this.db.detail_route_bread = '';
  }

  loadData() {
    this.skeleton = true;
    // Simulate API call
    setTimeout(() => {
      this.list_data = {
        cards: [
          { label: 'Total Holidays', count: 25 },
          { label: 'Working Days', count: 240 },
          { label: 'Government Holidays', count: 12 }
        ],
        data: [
          {
            date: '2024-01-01',
            description: 'New Year\'s Day',
            type: 'Government Holiday'
          },
          {
            date: '2024-01-26',
            description: 'Republic Day',
            type: 'Government Holiday'
          },
          {
            date: '2024-03-08',
            description: 'Holi',
            type: 'Government Holiday'
          },
          {
            date: '2024-08-15',
            description: 'Independence Day',
            type: 'Government Holiday'
          },
          {
            date: '2024-10-02',
            description: 'Gandhi Jayanti',
            type: 'Government Holiday'
          },
          {
            date: '2024-12-25',
            description: 'Christmas Day',
            type: 'Government Holiday'
          }
        ]
      };
      
      // Prepare highlighted dates for calendar
      this.highlightedDates = this.list_data.data.map((holiday: any) => ({
        date: holiday.date,
        title: holiday.description,
        color: '#ff6b6b'
      }));
      
      this.skeleton = false;
    }, 1000);
  }

  toggleView(type: 'calendar' | 'list') {
    this.viewType = type;
  }

  menu_name(item: any) {
    this.holiday_type = item.name;
    this.loadData(); // Reload data based on filter
  }

  searchTxtValue(searchText: string) {
    // Implement search functionality
    console.log('Search:', searchText);
  }

  clear_txt() {
    // Clear search
    this.loadData();
  }

  changeMonthCal(event: any) {
    this.currentMonth = event.month;
    this.currentYear = event.year;
    this.loadData();
  }

  menu_name_month(event: any) {
    this.currentMonth = event;
    this.loadData();
  }

  checkDateFormat(date: string, type: string) {
    const dateObj = new Date(date);
    if (type === 'date') {
      return dateObj.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  }
}
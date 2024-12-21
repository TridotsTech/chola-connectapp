import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HolidayListPage } from './holiday-list.page';

describe('HolidayListPage', () => {
  let component: HolidayListPage;
  let fixture: ComponentFixture<HolidayListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HolidayListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

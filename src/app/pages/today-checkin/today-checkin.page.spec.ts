import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodayCheckinPage } from './today-checkin.page';

describe('TodayCheckinPage', () => {
  let component: TodayCheckinPage;
  let fixture: ComponentFixture<TodayCheckinPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TodayCheckinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

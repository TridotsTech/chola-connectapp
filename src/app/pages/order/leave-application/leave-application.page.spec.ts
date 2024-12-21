import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveApplicationPage } from './leave-application.page';

describe('LeaveApplicationPage', () => {
  let component: LeaveApplicationPage;
  let fixture: ComponentFixture<LeaveApplicationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LeaveApplicationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

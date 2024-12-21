import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveApplicationDetailPage } from './leave-application-detail.page';

describe('LeaveApplicationDetailPage', () => {
  let component: LeaveApplicationDetailPage;
  let fixture: ComponentFixture<LeaveApplicationDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LeaveApplicationDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

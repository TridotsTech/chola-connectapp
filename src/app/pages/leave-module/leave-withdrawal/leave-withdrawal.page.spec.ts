import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveWithdrawalPage } from './leave-withdrawal.page';

describe('LeaveWithdrawalPage', () => {
  let component: LeaveWithdrawalPage;
  let fixture: ComponentFixture<LeaveWithdrawalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LeaveWithdrawalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

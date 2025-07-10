import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeReferralPage } from './employee-referral.page';

describe('EmployeeReferralPage', () => {
  let component: EmployeeReferralPage;
  let fixture: ComponentFixture<EmployeeReferralPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmployeeReferralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

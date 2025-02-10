import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalaryslipPage } from './salaryslip.page';

describe('SalaryslipPage', () => {
  let component: SalaryslipPage;
  let fixture: ComponentFixture<SalaryslipPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SalaryslipPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpTransferPage } from './emp-transfer.page';

describe('EmpTransferPage', () => {
  let component: EmpTransferPage;
  let fixture: ComponentFixture<EmpTransferPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmpTransferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

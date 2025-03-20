import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpTransferDetailPage } from './emp-transfer-detail.page';

describe('EmpTransferDetailPage', () => {
  let component: EmpTransferDetailPage;
  let fixture: ComponentFixture<EmpTransferDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmpTransferDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

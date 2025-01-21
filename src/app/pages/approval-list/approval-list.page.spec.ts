import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovalListPage } from './approval-list.page';

describe('ApprovalListPage', () => {
  let component: ApprovalListPage;
  let fixture: ComponentFixture<ApprovalListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ApprovalListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

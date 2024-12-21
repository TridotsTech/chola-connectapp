import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesOrderDetailsPage } from './sales-order-details.page';

describe('SalesOrderDetailsPage', () => {
  let component: SalesOrderDetailsPage;
  let fixture: ComponentFixture<SalesOrderDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SalesOrderDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

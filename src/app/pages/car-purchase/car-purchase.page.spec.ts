import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarPurchasePage } from './car-purchase.page';

describe('CarPurchasePage', () => {
  let component: CarPurchasePage;
  let fixture: ComponentFixture<CarPurchasePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CarPurchasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

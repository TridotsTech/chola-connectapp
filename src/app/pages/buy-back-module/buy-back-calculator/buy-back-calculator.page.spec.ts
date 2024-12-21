import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuyBackCalculatorPage } from './buy-back-calculator.page';

describe('BuyBackCalculatorPage', () => {
  let component: BuyBackCalculatorPage;
  let fixture: ComponentFixture<BuyBackCalculatorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BuyBackCalculatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

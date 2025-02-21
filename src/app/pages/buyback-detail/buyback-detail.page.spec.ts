import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuybackDetailPage } from './buyback-detail.page';

describe('BuybackDetailPage', () => {
  let component: BuybackDetailPage;
  let fixture: ComponentFixture<BuybackDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BuybackDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

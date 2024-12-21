import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemPopupPage } from './item-popup.page';

describe('ItemPopupPage', () => {
  let component: ItemPopupPage;
  let fixture: ComponentFixture<ItemPopupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

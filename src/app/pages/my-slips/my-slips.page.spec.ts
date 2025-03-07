import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MySlipsPage } from './my-slips.page';

describe('MySlipsPage', () => {
  let component: MySlipsPage;
  let fixture: ComponentFixture<MySlipsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MySlipsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

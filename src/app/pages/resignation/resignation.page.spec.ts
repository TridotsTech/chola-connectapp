import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResignationPage } from './resignation.page';

describe('ResignationPage', () => {
  let component: ResignationPage;
  let fixture: ComponentFixture<ResignationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ResignationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

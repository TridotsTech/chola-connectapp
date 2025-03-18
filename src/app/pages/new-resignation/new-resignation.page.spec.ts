import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewResignationPage } from './new-resignation.page';

describe('NewResignationPage', () => {
  let component: NewResignationPage;
  let fixture: ComponentFixture<NewResignationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewResignationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

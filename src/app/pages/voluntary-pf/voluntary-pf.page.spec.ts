import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoluntaryPfPage } from './voluntary-pf.page';

describe('VoluntaryPfPage', () => {
  let component: VoluntaryPfPage;
  let fixture: ComponentFixture<VoluntaryPfPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VoluntaryPfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

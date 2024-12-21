import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageSettingsPage } from './page-settings.page';

describe('PageSettingsPage', () => {
  let component: PageSettingsPage;
  let fixture: ComponentFixture<PageSettingsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PageSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

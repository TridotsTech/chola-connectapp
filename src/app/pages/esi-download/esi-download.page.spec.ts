import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EsiDownloadPage } from './esi-download.page';

describe('EsiDownloadPage', () => {
  let component: EsiDownloadPage;
  let fixture: ComponentFixture<EsiDownloadPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EsiDownloadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

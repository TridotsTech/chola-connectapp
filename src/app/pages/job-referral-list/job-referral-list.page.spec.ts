import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobReferralListPage } from './job-referral-list.page';

describe('JobReferralListPage', () => {
  let component: JobReferralListPage;
  let fixture: ComponentFixture<JobReferralListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JobReferralListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

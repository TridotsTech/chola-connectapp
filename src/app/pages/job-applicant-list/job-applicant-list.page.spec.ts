import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobApplicantListPage } from './job-applicant-list.page';

describe('JobApplicantListPage', () => {
  let component: JobApplicantListPage;
  let fixture: ComponentFixture<JobApplicantListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JobApplicantListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

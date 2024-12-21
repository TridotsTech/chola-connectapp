import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeAttendanceToolPage } from './employee-attendance-tool.page';

describe('EmployeeAttendanceToolPage', () => {
  let component: EmployeeAttendanceToolPage;
  let fixture: ComponentFixture<EmployeeAttendanceToolPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmployeeAttendanceToolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

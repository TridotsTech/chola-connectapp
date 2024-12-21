import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeAttendanceToolPage } from './employee-attendance-tool.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeAttendanceToolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeAttendanceToolPageRoutingModule {}

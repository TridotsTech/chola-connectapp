import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpTransferPage } from './emp-transfer.page';

const routes: Routes = [
  {
    path: '',
    component: EmpTransferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpTransferPageRoutingModule {}

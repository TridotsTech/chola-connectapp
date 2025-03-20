import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpTransferDetailPage } from './emp-transfer-detail.page';

const routes: Routes = [
  {
    path: '',
    component: EmpTransferDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpTransferDetailPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuybackDetailPage } from './buyback-detail.page';

const routes: Routes = [
  {
    path: '',
    component: BuybackDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuybackDetailPageRoutingModule {}

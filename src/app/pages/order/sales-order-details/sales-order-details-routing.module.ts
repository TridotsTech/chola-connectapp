import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesOrderDetailsPage } from './sales-order-details.page';

const routes: Routes = [
  {
    path: '',
    component: SalesOrderDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesOrderDetailsPageRoutingModule {}

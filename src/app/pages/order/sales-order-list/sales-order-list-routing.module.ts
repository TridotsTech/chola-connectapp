import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesOrderListPage } from './sales-order-list.page';

const routes: Routes = [
  {
    path: '',
    component: SalesOrderListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesOrderListPageRoutingModule {}

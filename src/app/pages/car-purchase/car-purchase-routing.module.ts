import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarPurchasePage } from './car-purchase.page';

const routes: Routes = [
  {
    path: '',
    component: CarPurchasePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarPurchasePageRoutingModule {}

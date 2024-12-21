import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyBackCalculatorPage } from './buy-back-calculator.page';

const routes: Routes = [
  {
    path: '',
    component: BuyBackCalculatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyBackCalculatorPageRoutingModule {}

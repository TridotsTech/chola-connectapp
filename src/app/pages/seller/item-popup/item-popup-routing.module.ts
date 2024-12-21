import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemPopupPage } from './item-popup.page';

const routes: Routes = [
  {
    path: '',
    component: ItemPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemPopupPageRoutingModule {}

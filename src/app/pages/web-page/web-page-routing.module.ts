import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebPagePage } from './web-page.page';

const routes: Routes = [
  {
    path: '',
    component: WebPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebPagePageRoutingModule {}

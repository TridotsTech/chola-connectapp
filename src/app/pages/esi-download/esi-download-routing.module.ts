import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EsiDownloadPage } from './esi-download.page';

const routes: Routes = [
  {
    path: '',
    component: EsiDownloadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EsiDownloadPageRoutingModule {}

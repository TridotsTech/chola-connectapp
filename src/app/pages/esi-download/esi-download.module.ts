import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EsiDownloadPageRoutingModule } from './esi-download-routing.module';

import { EsiDownloadPage } from './esi-download.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EsiDownloadPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EsiDownloadPage]
})
export class EsiDownloadPageModule {}

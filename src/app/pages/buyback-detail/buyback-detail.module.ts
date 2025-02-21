import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuybackDetailPageRoutingModule } from './buyback-detail-routing.module';

import { BuybackDetailPage } from './buyback-detail.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuybackDetailPageRoutingModule,
    ComponentsModule
  ],
  declarations: [BuybackDetailPage]
})
export class BuybackDetailPageModule {}

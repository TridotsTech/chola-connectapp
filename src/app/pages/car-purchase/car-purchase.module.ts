import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarPurchasePageRoutingModule } from './car-purchase-routing.module';

import { CarPurchasePage } from './car-purchase.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarPurchasePageRoutingModule,
    ComponentsModule
  ],
  declarations: [CarPurchasePage]
})
export class CarPurchasePageModule {}

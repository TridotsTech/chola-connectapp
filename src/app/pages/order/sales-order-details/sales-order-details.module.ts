import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesOrderDetailsPageRoutingModule } from './sales-order-details-routing.module';

import { SalesOrderDetailsPage } from './sales-order-details.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SalesOrderDetailsPageRoutingModule
  ],
  declarations: [SalesOrderDetailsPage]
})
export class SalesOrderDetailsPageModule {}

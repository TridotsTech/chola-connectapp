import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyBackCalculatorPageRoutingModule } from './buy-back-calculator-routing.module';

import { BuyBackCalculatorPage } from './buy-back-calculator.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyBackCalculatorPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [BuyBackCalculatorPage]
})
export class BuyBackCalculatorPageModule {}

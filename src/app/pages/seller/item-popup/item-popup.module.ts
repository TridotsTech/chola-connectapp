import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemPopupPageRoutingModule } from './item-popup-routing.module';

import { ItemPopupPage } from './item-popup.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemPopupPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  declarations: [ItemPopupPage]
})
export class ItemPopupPageModule {}

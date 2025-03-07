import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpTransferPageRoutingModule } from './emp-transfer-routing.module';

import { EmpTransferPage } from './emp-transfer.page';

import { ComponentsModule } from 'src/app/components/ComponentsModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpTransferPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EmpTransferPage]
})
export class EmpTransferPageModule {}

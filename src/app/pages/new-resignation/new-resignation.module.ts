import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewResignationPageRoutingModule } from './new-resignation-routing.module';

import { NewResignationPage } from './new-resignation.page';

import { ComponentsModule } from 'src/app/components/ComponentsModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewResignationPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [NewResignationPage]
})
export class NewResignationPageModule {}

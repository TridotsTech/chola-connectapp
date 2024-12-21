import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageSettingsPageRoutingModule } from './page-settings-routing.module';

import { PageSettingsPage } from './page-settings.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageSettingsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PageSettingsPage]
})
export class PageSettingsPageModule {}

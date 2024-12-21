import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NavigationLinkPageRoutingModule } from './navigation-link-routing.module';

import { NavigationLinkPage } from './navigation-link.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    NavigationLinkPageRoutingModule
  ],
  declarations: [NavigationLinkPage]
})
export class NavigationLinkPageModule {}

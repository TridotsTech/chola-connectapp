import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WebPagePageRoutingModule } from './web-page-routing.module';
import { WebPagePage } from './web-page.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    WebPagePageRoutingModule
  ],
  declarations: [WebPagePage]
})
export class WebPagePageModule {}

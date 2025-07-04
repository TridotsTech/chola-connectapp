import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WebPagePageRoutingModule } from './web-page-routing.module';
import { WebPagePage } from './web-page.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    WebPagePageRoutingModule
  ],
  declarations: [WebPagePage]
})
export class WebPagePageModule {}

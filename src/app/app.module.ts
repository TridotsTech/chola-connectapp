import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/ComponentsModule';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
// import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LightgalleryModule } from 'lightgallery/angular';
import { NgApexchartsModule } from "ng-apexcharts";
// import { Keyboard } from '@capacitor/keyboard';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';

import { RevoGridModule } from '@revolist/angular-datagrid';
// import { FrappeDataTableModule } from 'frappe-datatable';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
// import { FrappeChartsModule } from 'ngx-frappe-chart';
// import { IonCalendarModule } from '@heliomarpm/ion-calendar';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, QuillModule.forRoot(), IonicModule.forRoot({mode:'md'}), IonicStorageModule.forRoot(), AppRoutingModule, ComponentsModule, HttpClientModule, NgSelectModule, LightgalleryModule, RevoGridModule, 
    NgMultiSelectDropDownModule.forRoot(),
    // FrappeDataTableModule
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    // IonCalendarModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, NgApexchartsModule,
  // {
  //   provide: Keyboard,
  //   useFactory: () => import('@capacitor/keyboard')
  // },
   Geolocation, SocialSharing,DatePipe,AppVersion,FileOpener,File,LocationAccuracy],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
})
export class AppModule { }

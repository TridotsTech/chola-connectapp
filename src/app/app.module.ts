import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Core Components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/ComponentsModule';
import { ForceUpdatePopupComponent } from './components/force-update-popup/force-update-popup.component';

// Third Party Modules
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { LightgalleryModule } from 'lightgallery/angular';
import { NgApexchartsModule } from "ng-apexcharts";
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

// Native Plugins
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@NgModule({
  declarations: [
    AppComponent,
    ForceUpdatePopupComponent
  ],
  imports: [
    // Angular Core
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    
    // Ionic
    IonicModule.forRoot({ mode: 'md' }),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    ComponentsModule,
    
    // Third Party
    QuillModule.forRoot(),
    NgSelectModule,
    LightgalleryModule,
    NgMultiSelectDropDownModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NgApexchartsModule,
    Geolocation,
    SocialSharing,
    DatePipe,
    AppVersion,
    FileOpener,
    File,
    LocationAccuracy,
    InAppBrowser
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }

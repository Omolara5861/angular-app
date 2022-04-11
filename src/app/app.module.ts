import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LinksDataBrokerServiceToken, LinksPageModule } from 'links-lib';
import { LocalLinksDataBrokerService } from './services/local-links-data-broker/local-links-data-broker.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, LinksPageModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  // provide the data-broker implementation
  {provide:LinksDataBrokerServiceToken , useClass:LocalLinksDataBrokerService}],
  bootstrap: [AppComponent],
})
export class AppModule {}

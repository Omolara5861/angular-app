import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomPageRoutingModule } from './custom-routing.module';

import { CustomPage } from './custom.page';
import { ListsPageModule } from 'links-lib';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomPageRoutingModule,
    ListsPageModule
  ],
  declarations: [CustomPage]
})
export class CustomPageModule {}

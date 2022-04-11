import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController } from '@ionic/angular';
import { ImplLinksDataBroker, Link, LinksDataBrokerConfig, LinksDataBrokerEvent } from 'links-lib';
import {ID} from 'app-base-lib';

import * as CONFIG from '../../config/app-config';
import { CRUD } from 'app-base-lib';
import { ListDataBrokerLoadOneOptions } from 'app-base-lib';
import { ListDataBrokerResult } from 'app-base-lib';
import { ListDataBrokerLoadOptions } from 'app-base-lib';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class LocalLinksDataBrokerService extends ImplLinksDataBroker{

  constructor( http: HttpClient ,  iab: InAppBrowser, toastCtrl: ToastController,
     loadingCtrl: LoadingController ) {
    super(http,iab,toastCtrl,loadingCtrl,{perPage:CONFIG.paginationOptions.perPage,append:true});
  }

  getConfig(): LinksDataBrokerConfig {
    return {
        ui:{
          pages:{
            links:
          }
        }
    };
  }

  async onNewReconcileTime(newLastReconcileTime: Date): Promise<void> {
    localStorage.setItem( '--links-last-reconcile-time' , Date.now().toString());
  }

  async onCRUD(crudType: CRUD, link?: Link): Promise<Link>{

    let links = await this.getStore();

    switch(crudType){
      case CRUD.CREATE:
        links.push(link);

        link.id = Date.now();
        break;
      case CRUD.DELETE:
        links = links.filter( _link => _link.id !== link.id);
        break;
      case CRUD.UPDATE:
        links = links.map( _link => _link.id === link.id ? link:_link);
        break;
    }

    await this.saveStore(links);

    return link;
  }

  async on(ev: LinksDataBrokerEvent): Promise<any>{
  }

  async isPaginationEnabled(): Promise<boolean> {
    return true;
  }
  async isRefreshEnabled(): Promise<boolean> {
    return true;
  }

  async canCRUD(crudType: CRUD): Promise<boolean>{
    return true;
  }

  /**
   * @param options the options that can be used to fetch the data
   * @returns an object that contains the data
   */
  async fetchOne(options: ListDataBrokerLoadOneOptions): Promise<ListDataBrokerResult<Link>>{

    const links = await this.getStore();

    return {
      data:links.find( link => link.id === options.id )
    };
  }
  /**
   * @param options the options that can be used to fetch the data
   * @returns an object that contains the array of data
   */
  async fetch(options: ListDataBrokerLoadOptions): Promise<ListDataBrokerResult<Link[]>>{

    let links = await this.getStore();

    // apply pagination
    links = links.slice( ( options.page - 1 ) * options.perPage , options.page * options.perPage );

    return {
      data: links
    };
  }

  private async getStore(): Promise<Link[]>{

    const storeValue = localStorage.getItem( '--links-array' );

    return storeValue ? JSON.parse(storeValue) : [];
  }

  private async saveStore(links: Link[]): Promise<any>{
    localStorage.setItem( '--links-array' , JSON.stringify(links) );
  }

}

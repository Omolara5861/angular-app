import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActionSheetController, AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { ImplLinksDataBroker, Link, LinksDataBrokerConfig,
  LinksDataBrokerEvent, URL_META_API_LAYER_CONFIG,
   URL_META_RAPID_API_CONFIG } from 'ionic-ng-links-ui';

import * as CONFIG from '../../config/app-config';
import { CRUD } from 'app-base-lib';
import { ListDataBrokerLoadOneOptions } from 'app-base-lib';
import { ListDataBrokerResult } from 'app-base-lib';
import { ListDataBrokerLoadOptions } from 'app-base-lib';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { PAGE_SECTION_POSITION } from 'vicky-ionic-ng-lib';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { timer } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalLinksDataBrokerService extends ImplLinksDataBroker{

  constructor( platform: Platform, clipboard: Clipboard,
    actionSheetCtrl: ActionSheetController,alertCtrl: AlertController, http: HttpClient ,
    iab: InAppBrowser, toastCtrl: ToastController,loadingCtrl: LoadingController ) {
    super(platform as any, clipboard as any, http as any,
      iab, actionSheetCtrl as any, alertCtrl as any, toastCtrl as any,
       loadingCtrl as any,{perPage:CONFIG.paginationOptions.perPage,append:false});
  }

  async onLastReconcileTimeUpdateNeeded(...links: Link[]): Promise<Link[]> {

    let storeLinks = await this.getStore();

    storeLinks = storeLinks.map( _link => {
      const newLink = links.find( link=>link.id === _link.id );
      return newLink || _link;
    });

    await this.saveStore(storeLinks);

    return links.map( _link => {
      const link = {..._link};
      link.lastReconcileTime = new Date();
      return link;
    } );
  }

  getConfig(): LinksDataBrokerConfig {
    const config: LinksDataBrokerConfig = {
      pagination:{
        perPage: 10,
      },
      ui:{
        general: {
          pagination:{
            enabled:true,
          },
          swipeRefresh:{
            enabled:true,
          },
          spinner: {
            type: 'bubbles'
          },
          toast: {
            duration: 5000,
            position: 'top',
            btnText: 'Okay'
          },
          buttons: {
            core: {
              sectionPosition: PAGE_SECTION_POSITION.IN_CONTENT
            }
          },
          browser: {
            target: 'system'
          }
        },
        pages:{
          links:{
            title:{
              label:'Your Links'
            },
            reconciliation:{
              intervalSecs:10 * 60,
            },
            behavior:{
              parts:{
                copyToClipboard: {
                  messages: {
                    failure: 'Links Copied to Clipboard',
                    success: 'Failed to Copy Link to Clipboard'
                  }
                }
              }
            }
          },
          linksDetailEditor:{

            behavior:{
              parts:{
                urlInfoFetch: {
                  messages: {
                    failure: 'Url Info failed to fetch',
                    success: 'Url Info  fetched'
                  }
                }
              }
            },

            crud:{
              create:{
                input:{
                  validation:{
                    requiredValidationMsg:{
                      message: 'This field is required'
                    },
                    patternValidationMsg:{
                      message: 'Url format is not correct'
                    },
                  }
                }
              }
            },
            title:{
              label:'Add Link'
            },
            buttons:{
              main:{
                backLabel:'back',
                confirmLabel: 'proceed',
                nextLabel: 'next'
              }
            }
          }
        }
      },
      thirdParty: {
        api: {
          urlMeta: false ? {
            key: 'CiXFC31LtTC2rtO5ArNp4rJchw6WKeKI',
            service: 'api-layer',
            url: 'https://api.apilayer.com/meta_tags',
          } as URL_META_API_LAYER_CONFIG : {
            service: 'rapid-api',
            url: 'https://site-metadata.p.rapidapi.com/metadata/',
            apiHost: 'site-metadata.p.rapidapi.com',
            key: 'a398cf8e51mshcdf0d3353264488p1835e8jsnaf1369c53f2b'
          } as URL_META_RAPID_API_CONFIG
        }
      }
    };

    return config;
  }
  //Sir give me some mins

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
  async fetch(options: ListDataBrokerLoadOptions<Link>
    ): Promise<ListDataBrokerResult<Link[]>>{

    console.log('localLinksDataBroker.fetch() : ',options);

    let links = await this.getStore();

    // apply pagination
    links = links.slice( ( options.page - 1 ) * options.perPage , options.page * options.perPage );

    const result = {
      data: links
    };

    console.log('localLinksDataBroker.fetch() result : ',result);

    return result;
  }

  private async getStore(): Promise<Link[]>{

    // simulate delay
    await timer(3000).pipe(first()).toPromise();

    const storeValue = localStorage.getItem( '--links-array' );

    const result = (storeValue ? JSON.parse(storeValue) as Array<Link> : []).reverse();
    console.log('localLinksDataBroker.getStore()',result);
    return result;


  }

  private async saveStore(links: Link[]): Promise<any>{
    localStorage.setItem( '--links-array' , JSON.stringify(links) );
  }

}

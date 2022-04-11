import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'links',
    pathMatch: 'full'
  },
  {
    path: 'custom',
    loadChildren: () => import('./custom/custom.module').then( m => m.CustomPageModule)
  },
  {
    path: 'links',
    loadChildren: () => import('links-lib').then( m => m.LinksPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

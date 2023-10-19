import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { path: 'dashboard', loadChildren: () => import('./dasboard/dasboard.module').then(m => m.DasboardModule) },
  { path: 'jobs', loadChildren: () => import('../app/jobs/jobs.module').then(m => m.JobsModule) },
  { path: 'carrer', loadChildren: () => import('../app/carrer/carrer.module').then(m => m.CarrerModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

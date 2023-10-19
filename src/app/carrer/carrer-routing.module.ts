import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplyJobComponent } from './apply-job/apply-job.component';
import { CarrerComponent } from './carrer.component';

const routes: Routes = [
  { path: ':id', component: CarrerComponent },
  { path: 'apply-job', component: ApplyJobComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // add SharedModule to imports
  exports: [RouterModule]
})
export class CarrerRoutingModule { }

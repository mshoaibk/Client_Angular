import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanySetupComponent } from './company-setup.component';

const routes: Routes = [{ path: '', component: CompanySetupComponent },
  { path: ':id', component: CompanySetupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanySetupRoutingModule { }

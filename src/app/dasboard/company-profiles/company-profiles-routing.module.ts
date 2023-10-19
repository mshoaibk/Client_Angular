import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyProfilesComponent } from './company-profiles.component';

const routes: Routes = [{ path: '', component: CompanyProfilesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyProfilesRoutingModule { }

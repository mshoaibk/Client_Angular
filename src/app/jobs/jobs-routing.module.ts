import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobsComponent } from './jobs.component';
import { ApplyJobComponent } from './components/apply-job/apply-job.component'

const routes: Routes = [{ path: '', component: JobsComponent },
{ path: 'apply-job', component: ApplyJobComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }

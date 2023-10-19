import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationDetailsComponent } from './components/application-details/application-details.component';
import { PostJobComponent } from './components/post-job/post-job.component';
import { JobApplicationComponent } from './job-application.component';

const routes: Routes = [{ path: '', component: JobApplicationComponent },
{path: 'post-job',component:PostJobComponent },
{path: ':id',component:ApplicationDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobApplicationRoutingModule { }

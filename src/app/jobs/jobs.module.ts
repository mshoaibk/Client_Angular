import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import { ApplyJobComponent } from './components/apply-job/apply-job.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    JobsComponent,
    ApplyJobComponent
  ],
  imports: [
    CommonModule,
    JobsRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class JobsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobApplicationRoutingModule } from './job-application-routing.module';
import { JobApplicationComponent } from './job-application.component';
import { PostJobComponent } from './components/post-job/post-job.component';
import { QuillModule } from 'ngx-quill';
import { ApplicationDetailsComponent } from './components/application-details/application-details.component'
import { SharedModule } from '../../shared/shared.module';
import { EditPostJobComponent } from '../../../app/common/edit-post-job/edit-post-job.component';

@NgModule({
  declarations: [
    JobApplicationComponent,
    PostJobComponent,
    ApplicationDetailsComponent,
    EditPostJobComponent
  ],
  imports: [
    CommonModule, FormsModule, SharedModule,
    JobApplicationRoutingModule,QuillModule.forRoot()
  ],
  entryComponents: [EditPostJobComponent]
})
export class JobApplicationModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SupportRoutingModule } from './support-routing.module';
import { SupportComponent } from './support.component';


@NgModule({
  declarations: [
    SupportComponent
  ],
  imports: [
    CommonModule,QuillModule,FormsModule,
    SupportRoutingModule
  ]
})
export class SupportModule { }

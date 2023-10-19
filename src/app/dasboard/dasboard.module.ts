import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DasboardRoutingModule } from './dasboard-routing.module';
import { DasboardComponent } from './dasboard.component';
import { AdminIndexComponent } from './admin-index/admin-index.component';

//import { AddAnnouncementComponent } from './add-announcement/add-announcement.component';
//import { SharedModule } from '../shared/shared.module';
//import { FormsModule } from '@angular/forms';
//import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    DasboardComponent,
    AdminIndexComponent
    //AddAnnouncementComponent
  ],
  imports: [
    CommonModule,
    DasboardRoutingModule, //SharedModule, FormsModule, QuillModule.forRoot()
  ]
})
export class DasboardModule { }

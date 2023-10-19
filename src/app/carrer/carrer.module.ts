import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrerRoutingModule } from './carrer-routing.module';
import { CarrerComponent } from './carrer.component';
import { ApplyJobComponent } from './apply-job/apply-job.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CarrerComponent,
    ApplyJobComponent,
  ],
  imports: [
    CommonModule,
    CarrerRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class CarrerModule { }


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { CompanyProfilesRoutingModule } from './company-profiles-routing.module';
import { CompanyProfilesComponent } from './company-profiles.component';
import { CompanyAnnouncementComponent } from './company-announcement/company-announcement.component';
import { AddAnnouncementComponent } from '../../common/add-announcement/add-announcement.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  declarations: [
    CompanyProfilesComponent,
    CompanyAnnouncementComponent,
    AddAnnouncementComponent,
  ],
  imports: [
    CommonModule,
    CompanyProfilesRoutingModule,NgxIntlTelInputModule,
    SharedModule,
    FormsModule, QuillModule.forRoot()
  ],
  entryComponents: [AddAnnouncementComponent]
})
export class CompanyProfilesModule { }

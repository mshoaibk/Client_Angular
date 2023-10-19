import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuillConfigModule } from 'ngx-quill/config';
import { QuillModule } from 'ngx-quill';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangePasswordComponent } from './common/change-password/change-password.component';
import { EmployeeSalaryHistoryComponent } from './common/employee-salary-history/employee-salary-history.component';
import { AddWeeklyHolidayComponent } from './common/add-weekly-holiday/add-weekly-holiday.component';
import { AddYearlyHolidaysComponent } from './common/add-yearly-holidays/add-yearly-holidays.component';
import { AddRolesComponent } from './common/add-roles/add-roles.component';
import { GeanrateChatComponent } from './common/geanrate-chat/geanrate-chat.component';
import { AddTicketComponent } from './common/add-ticket/add-ticket.component';
@NgModule({
  declarations: [
    AppComponent,
    ChangePasswordComponent,
    EmployeeSalaryHistoryComponent,
    AddWeeklyHolidayComponent,
    AddYearlyHolidaysComponent,
    AddRolesComponent,
    GeanrateChatComponent,
    AddTicketComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, NgxSpinnerModule, HttpClientModule, RouterModule, FormsModule,
    ReactiveFormsModule, QuillConfigModule, BrowserAnimationsModule, QuillModule.forRoot(), ToastrModule.forRoot({
      closeButton: true,
      timeOut: 3000, // 3 seconds
      progressBar: true,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

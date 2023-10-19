import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DasboardComponent } from './dasboard.component';
import { AdminIndexComponent } from './admin-index/admin-index.component';
import { CompanyAnnouncementComponent } from '../dasboard/company-profiles/company-announcement/company-announcement.component';
import { LeavesComponent } from './attendence-system/components/leaves/leaves.component';

const routes: Routes = [{
  path: '', component: DasboardComponent,
  children: [
    {
      path: '',
      component: AdminIndexComponent
    },
    { path: 'attendance-system', loadChildren: () => import('./attendence-system/attendence-system.module').then(m => m.AttendenceSystemModule) },
    { path: 'employees', loadChildren: () => import('./employees/employees.module').then(m => m.EmployeesModule) },
    { path: 'company-profile', loadChildren: () => import('./company-profiles/company-profiles.module').then(m => m.CompanyProfilesModule) },
    { path: 'jobs-applications', loadChildren: () => import('./job-application/job-application.module').then(m => m.JobApplicationModule) },
    { path: 'salary', loadChildren: () => import('./salary/salary.module').then(m => m.SalaryModule) },
    { path: 'company-announcement', component: CompanyAnnouncementComponent },
    { path: 'leave', component: LeavesComponent },
    { path: 'company-setup', loadChildren: () => import('./company-setup/company-setup.module').then(m => m.CompanySetupModule) },
    { path: 'support', loadChildren: () => import('./support/support.module').then(m => m.SupportModule) },
    { path: 'chat', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule) },
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DasboardRoutingModule { }

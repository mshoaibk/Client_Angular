import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanySetupRoutingModule } from './company-setup-routing.module';
import { CompanySetupComponent } from './company-setup.component';
import { SetupOfficeComponent } from './components/setup-office/setup-office.component';
import { SetupDepartmentComponent } from './components/setup-department/setup-department.component';
import { SetupTeamComponent } from './components/setup-team/setup-team.component';
import { SetupPositionComponent } from './components/setup-position/setup-position.component';
import { SetupEmploymentTypeComponent } from './components/setup-employment-type/setup-employment-type.component';
import { SetupTotalLeavesComponent } from './components/setup-total-leaves/setup-total-leaves.component';
import { SetupShiftTypeComponent } from './components/setup-shift-type/setup-shift-type.component';
import { SetupRolesComponent } from './components/setup-roles/setup-roles.component';
import { PositionHierarchyManagementComponent } from './components/position-hierarchy-management/position-hierarchy-management.component';
import { OfficeLocationNamePipe } from './components/setup-office/office-location-name.pipe';

@NgModule({
  declarations: [
    CompanySetupComponent,
    SetupOfficeComponent,
    SetupDepartmentComponent,
    SetupTeamComponent,
    SetupPositionComponent,
    SetupEmploymentTypeComponent,
    SetupTotalLeavesComponent,
    SetupShiftTypeComponent,
    SetupRolesComponent,
    PositionHierarchyManagementComponent,OfficeLocationNamePipe
    
  ],
  entryComponents: [],
  imports: [
    CommonModule, FormsModule,
    CompanySetupRoutingModule
  ],
  providers: [DatePipe]
})
export class CompanySetupModule { }

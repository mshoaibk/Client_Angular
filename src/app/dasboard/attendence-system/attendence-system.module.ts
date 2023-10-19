import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule , ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AttendenceSystemRoutingModule } from './attendence-system-routing.module';
import { AttendenceSystemComponent } from './attendence-system.component';
import { AttendanceDetailComponent } from './components/attendance-detail/attendance-detail.component';
import { EmployeeAttendanceComponent } from './components/employee-attendance/employee-attendance.component';
import { EmployeeLeaveComponent } from './components/employee-leave/employee-leave.component';
import { EmployeeAttendanceHistoryComponent } from '../../common/employee-attendance-history/employee-attendance-history.component';
import { EmployeeLeaveHistoryComponent } from '../../common/employee-leave-history/employee-leave-history.component';
import { AddAttendanceComponent } from '../../common/add-attendance/add-attendance.component';
import { LeavesComponent } from './components/leaves/leaves.component';
import { WeeklyLeavesComponent } from './components/weekly-leaves/weekly-leaves.component';
import { YearlyLeavesComponent } from './components/yearly-leaves/yearly-leaves.component';

@NgModule({
  declarations: [
    AttendenceSystemComponent,
    AttendanceDetailComponent,
    EmployeeAttendanceComponent,
    EmployeeLeaveComponent,
    EmployeeAttendanceHistoryComponent,
    EmployeeLeaveHistoryComponent,
    AddAttendanceComponent,
    LeavesComponent,
    WeeklyLeavesComponent,
    YearlyLeavesComponent,
  ],
  entryComponents: [EmployeeAttendanceHistoryComponent, EmployeeLeaveHistoryComponent, AddAttendanceComponent],
  imports: [
    CommonModule, FormsModule,
    AttendenceSystemRoutingModule,ReactiveFormsModule
   
  ],
  providers: [DatePipe]
})
export class AttendenceSystemModule { }

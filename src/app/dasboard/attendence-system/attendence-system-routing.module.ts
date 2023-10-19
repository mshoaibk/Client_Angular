import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendenceSystemComponent } from './attendence-system.component';
import { AttendanceDetailComponent } from './components/attendance-detail/attendance-detail.component';
import { LeavesComponent } from './components/leaves/leaves.component';


const routes: Routes = [{ path: '', component: AttendenceSystemComponent },
{path: ':id', component: AttendanceDetailComponent },
{path: 'manage-leave', component: LeavesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendenceSystemRoutingModule { }

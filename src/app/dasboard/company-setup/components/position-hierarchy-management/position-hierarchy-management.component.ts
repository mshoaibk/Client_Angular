import { Component, EventEmitter, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserContextService } from '../../../../services/user-context.service';
import { AddEmployeeService } from '../../../employees/components/add-employee/add-employee.service';
import { PositionHierarchyManagementService } from './position-hierarchy-management.service';

@Component({
  selector: 'app-position-hierarchy-management',
  templateUrl: './position-hierarchy-management.component.html',
  styleUrls: ['./position-hierarchy-management.component.scss']
})
export class PositionHierarchyManagementComponent {
  @Output() updateevent: EventEmitter<any> = new EventEmitter();
  listLookup: any = {};
  constructor(private spinnerService: NgxSpinnerService, private userContextService: UserContextService,
    private positionHierarchyManagementService: PositionHierarchyManagementService,
  ) {
    this.GetPositionHierarchy();
  }
  
  GetPositionHierarchy() {
    this.spinnerService.show();
    this.positionHierarchyManagementService.GetPositionHierarchy(this.userContextService.user$._value.companyID).subscribe(data => {
      this.listLookup = data.lst;
      this.spinnerService.hide();
    });
  }

  UpdatePositionHierarchy() {
    this.spinnerService.show();
    this.positionHierarchyManagementService.UpdatePositionHierarchy(this.listLookup).subscribe(data => {
      this.listLookup = data.lst;
      this.GetPositionHierarchy();
      this.spinnerService.hide();
    });
  }
}

import { Component, ComponentFactoryResolver, EventEmitter, Injector, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../../../services/user-context.service';
import { AddEmployeeService } from '../../../employees/components/add-employee/add-employee.service';
import { SetupTotalLeavesService } from './setup-total-leaves.service';
import { DeleteConfirmationComponent } from '../../../../common/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-setup-total-leaves',
  templateUrl: './setup-total-leaves.component.html',
  styleUrls: ['./setup-total-leaves.component.scss']
})
export class SetupTotalLeavesComponent {
  totalLeavesRequestModel: any = {};
  searchTotalLeavesModel: any = {};
  totalLeavesList: any;
  isValid: boolean = true;
  @Output() updateevent: EventEmitter<any> = new EventEmitter();
  @ViewChild('deleteContainer', { read: ViewContainerRef }) dialogDeleteContainer?: ViewContainerRef;
  config_pgTotalLeaveSetupList = {
    id: "pg_TotalLeavesSetupList",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };

  constructor(private setupTotalLeavesService: SetupTotalLeavesService, private userContextService: UserContextService, private injector: Injector,
    private spinnerService: NgxSpinnerService, private componentFactoryResolver: ComponentFactoryResolver, private addEmployeeService: AddEmployeeService,
    private toastrService: ToastrService) {
    this.SetTotalLeavesSetup();
    this.SetSearchTotalLeavesModel();
  }

  ngOnInit(): void {
    this.GetTotalLeavesList();
  }
  switchViewTab(){
    
  }
  SetTotalLeavesSetup() {
    this.totalLeavesRequestModel.totalLeavesId = 0;
    this.totalLeavesRequestModel.totalLeaves = '';
    this.totalLeavesRequestModel.companyId = this.userContextService.user$._value.companyID;
  }

  SetSearchTotalLeavesModel() {
    this.searchTotalLeavesModel.searchTotalLeave = '';
    this.searchTotalLeavesModel.pageIndex = this.config_pgTotalLeaveSetupList.currentPage - 1;
    this.searchTotalLeavesModel.pageSize = this.config_pgTotalLeaveSetupList.itemsPerPage;
    this.searchTotalLeavesModel.companyId = this.userContextService.user$._value.companyID;
  }

  GetTotalLeavesList() {

  }

  editabeMode(dept: any) {
    dept.editableMode = true;
  }

  AddTotalLeaves() {

  }

  saveChanges(totalLeave: any): void {
    totalLeave.editableMode = false;
    this.totalLeavesRequestModel.totalLeaves = totalLeave.totalLeaves;
    this.totalLeavesRequestModel.totalLeavesId = totalLeave.totalLeavesId;
    this.AddTotalLeaves();
  }

  cancelEdit(): void {
    this.GetTotalLeavesList();
  }

  deleteConfirmationPopup(id: any) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(DeleteConfirmationComponent);
    const data: any =
    {
      Id: id
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogDeleteContainer?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((id: any) => {
      popupRef.destroy();
      if (id) {
        this.DeleteDepartmentSetup(id)
      }
    });
  }

  DeleteDepartmentSetup(id: any) {
    if (id) {
      let model = {
        id: id
      }
      this.spinnerService.show();
      this.setupTotalLeavesService.DeleteDepartmentSetup(model).subscribe(data => {
        if (data.status) {
          this.toastrService.success("Record has been deleted.");
          this.GetTotalLeavesList();
        }
        this.spinnerService.hide();
      });
    }
  }
}

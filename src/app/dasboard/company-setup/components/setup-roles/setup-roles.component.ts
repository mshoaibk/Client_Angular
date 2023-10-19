import { Component, ComponentFactoryResolver, EventEmitter, Injector, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AddRolesComponent } from '../../../../common/add-roles/add-roles.component';
import { UserContextService } from '../../../../services/user-context.service';
import { SetupRolesService } from './setup-roles.service';
import { DeleteConfirmationComponent } from 'src/app/common/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-setup-roles',
  templateUrl: './setup-roles.component.html',
  styleUrls: ['./setup-roles.component.scss']
})
export class SetupRolesComponent {
  @Output() updateevent: EventEmitter<any> = new EventEmitter();
  @ViewChild('deleteContainer', { read: ViewContainerRef }) dialogDeleteContainer?: ViewContainerRef;
  @ViewChild('assignRolePopupContainer', { read: ViewContainerRef }) dialogRoleContainer?: ViewContainerRef;
  lstRoles: any = [];

  constructor(private userContextService: UserContextService, private injector: Injector, private setupRolesService: SetupRolesService,
    private spinnerService: NgxSpinnerService, private componentFactoryResolver: ComponentFactoryResolver,
    private toastrService: ToastrService) {
    this.GetRole();
  }

  AssignRolePopup() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(AddRolesComponent);
    const data: any =
    {
      Id: ''
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogRoleContainer?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((id: any) => {
      popupRef.destroy();
      this.GetRole();
    });
  }

  GetRole() {
    let model = {
      companyId: this.userContextService.user$._value.companyID
    }
    this.setupRolesService.GetRoles(model).subscribe(data => {
      if (data.status) {
        this.lstRoles = data.lstRoles;
      }
      this.spinnerService.hide();
    });
  }

  EditPopup(lst:any) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(AddRolesComponent);
    const data: any =
    {
      Id: lst.roleId,
      positionId: lst.positionId,
      teamId: lst.teamId,
      departmentId: lst.departmentId,
      officeId: lst.officeId
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogRoleContainer?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((id: any) => {
      popupRef.destroy();
      this.GetRole();
    });
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
        this.deleteEmployeeSetupRoles(id)
      }
    });
  }

  deleteEmployeeSetupRoles(id: any) {
    if (id) {
      this.spinnerService.show();
      this.setupRolesService.deleteEmployeeSetupRoles(id).subscribe(data => {
        if (data.status) {
          this.toastrService.success("Record has been deleted.");
          this.GetRole();
        }
        this.spinnerService.hide();
      });
    }
  }
}

import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConstantsService } from '../../services/constants.service';
import { UserContextService } from '../../services/user-context.service';
import { AddRolesService } from './add-roles.service';

@Component({
  selector: 'app-add-roles',
  templateUrl: './add-roles.component.html',
  styleUrls: ['./add-roles.component.scss']
})
export class AddRolesComponent {
  @Output() closed = new EventEmitter();
  listLookup: any = {};
  roleRqst: any = {};
  listDepartment: any = [];
  listTeam: any = [];
  positionList: any = [];
  modulePermissions: ModulePermission[] = modulePermissions;
  modulePermissionsFromDb: ModulePermission[] = modulePermissions;
  roleId: number = 0;
  officeName: string = '';
  departmentName: string = '';
  teamName: string = '';
  positionName: string = '';
  isValid: boolean = true;

  constructor(private toastrService: ToastrService, private spinnerService: NgxSpinnerService, private Constants: ConstantsService,
    private userContextService: UserContextService, private addRolesService: AddRolesService, @Inject('data') public data: any) {
    this.roleId = this.data.Id ? this.data.Id : 0;
    if (this.roleId > 0) {
      this.roleRqst.team = this.data.teamId ? this.data.teamId : '0';
      this.roleRqst.position = this.data.positionId ? this.data.positionId : '0';
      this.roleRqst.department = this.data.departmentId ? this.data.departmentId : '0';
      this.roleRqst.office = this.data.officeId ? this.data.officeId : '0';
      this.GetRole();
    }
    else {
      this.InitilizeForm();
      this.GetSetupLookUpData();
    }
  }

  InitilizeForm() {
    this.roleRqst.team = '0';
    this.roleRqst.position = '0';
    this.roleRqst.department = '0';
    this.roleRqst.office = '0';
    this.modulePermissions = [
      { moduleId: 101, moduleName: 'Employee Dashboard', read: false, write: false, isExpand: false, readDisable: false, writeDisable: true, subModules: [] },
      {
        moduleId: 102,
        moduleName: 'Job Applications',
        read: false,
        write: false,
        isExpand: false,
        readDisable: true,
        writeDisable: true,
        subModules: [{ moduleId: 103, moduleName: 'View Job Applications', read: false, write: false, isExpand: false, readDisable: false, writeDisable: true, subModules: [] },
        { moduleId: 104, moduleName: 'Post Job Applications', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
        { moduleId: 105, moduleName: 'Edit Job Applications', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
        { moduleId: 106, moduleName: 'Delete Job Applications', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] }]
      },
      {
        moduleId: 107,
        moduleName: 'Employee Management',
        read: false,
        write: false,
        isExpand: false,
        readDisable: true,
        writeDisable: true,
        subModules: [{ moduleId: 108, moduleName: 'View Employees', read: false, write: false, isExpand: false, readDisable: false, writeDisable: true, subModules: [] },
        { moduleId: 109, moduleName: 'Add Employees', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
        { moduleId: 110, moduleName: 'Edit Employees', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
        { moduleId: 111, moduleName: 'Delete Employees', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] }]
      },
      {
        moduleId: 112,
        moduleName: 'Bank Detail',
        read: false,
        write: false,
        isExpand: false,
        readDisable: true,
        writeDisable: true,
        subModules: [{ moduleId: 113, moduleName: 'View Bank Detail', read: false, write: false, isExpand: false, readDisable: false, writeDisable: true, subModules: [] },
        { moduleId: 114, moduleName: 'Add Bank Detail', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
        { moduleId: 115, moduleName: 'Edit Bank Detail', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
        { moduleId: 116, moduleName: 'Delete Bank Detail', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] }]
      },
      {
        moduleId: 117,
        moduleName: 'Salaries',
        read: false,
        write: false,
        isExpand: false,
        readDisable: true,
        writeDisable: true,
        subModules: [{ moduleId: 118, moduleName: 'View Salary', read: false, write: false, isExpand: false, readDisable: false, writeDisable: true, subModules: [] },
        { moduleId: 119, moduleName: 'Add Salary', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
        { moduleId: 120, moduleName: 'Edit Salary', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
        { moduleId: 121, moduleName: 'Delete Salary', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] }]
      },
      {
        moduleId: 6,
        moduleName: 'PayRoll',
        read: false,
        write: false,
        isExpand: false,
        readDisable: true,
        writeDisable: true,
        subModules: [{ moduleId: 123, moduleName: 'View PayRoll', read: false, write: false, readDisable: false, writeDisable: true, isExpand: false, subModules: [] },
        { moduleId: 124, moduleName: 'Write PayRoll', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] }]
      },
      {
        moduleId: 125,
        moduleName: 'Leave Management',
        read: false,
        write: false,
        isExpand: false,
        readDisable: true,
        writeDisable: true,
        subModules: [{ moduleId: 126, moduleName: 'View Leave Management', read: false, write: false, readDisable: false, writeDisable: true, isExpand: false, subModules: [] },
        { moduleId: 127, moduleName: 'Add Leaves', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
        { moduleId: 128, moduleName: 'Edit Leaves', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
        { moduleId: 129, moduleName: 'Delete Leaves', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] }]
      },
      {
        moduleId: 130,
        moduleName: 'Attendacne Management',
        read: false,
        write: false,
        isExpand: false,
        readDisable: true,
        writeDisable: true,
        subModules: [{ moduleId: 131, moduleName: 'View Attendacne Management', read: false, write: false, readDisable: false, writeDisable: true, isExpand: false, subModules: [] },
        { moduleId: 132, moduleName: 'Add Attendacne', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
        { moduleId: 133, moduleName: 'Edit Attendacne', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
        { moduleId: 134, moduleName: 'Delete Attendacne', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] }]
      },
      {
        moduleId: 135,
        moduleName: 'Announcement',
        read: false,
        write: false,
        isExpand: false,
        readDisable: true,
        writeDisable: true,
        subModules: [{ moduleId: 136, moduleName: 'View Announcement', read: false, write: false, isExpand: false, readDisable: false, writeDisable: true, subModules: [] },
        { moduleId: 137, moduleName: 'Add Announcement', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
        { moduleId: 138, moduleName: 'Edit Announcement', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
        { moduleId: 139, moduleName: 'Delete Announcement', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] }]
      }
    ];
  }

  GetSetupLookUpData() {
    this.spinnerService.show();
    let model: any = {
      companyId: this.userContextService.user$._value.companyID,
      requiredDataList: ['office', 'et']
    }
    this.addRolesService.GetSetupLookUpData(model).subscribe(data => {
      if (data.status) {
        this.listLookup = data.lookUpList;
      }
      this.spinnerService.hide();
    });
  }

  OnOfficeSelectionChange(event: any) {
    const selectedValue = event.target.value;
    this.roleRqst.department = 0;
    const companyId = this.userContextService.user$._value.companyID;
    this.addRolesService.GetDepartmentByOfficeLocation(companyId, selectedValue).subscribe(data => {
      if (data.status) {
        this.listDepartment = data.lookUpList;
      }
      this.spinnerService.hide();
    });
  }

  OnDepartmentSelectionChange(event: any) {
    const selectedValue = event.target.value;
    this.roleRqst.team = 0;
    const companyId = this.userContextService.user$._value.companyID;
    this.addRolesService.GetTeamByDepartment(companyId, selectedValue).subscribe(data => {
      if (data.status) {
        this.listTeam = data.lookUpList;
      }
      this.spinnerService.hide();
    });
  }

  OnTeamSelectionChange(event: any) {
    this.roleRqst.position = 0;
    const selectedValue = event.target.value;
    const companyId = this.userContextService.user$._value.companyID;
    this.GetPositionByTeam(companyId, selectedValue);
  }

  GetPositionByTeam(companyId: any, selectedValue: any) {
    this.addRolesService.GetPositionByTeam(companyId, selectedValue).subscribe(data => {
      if (data.status) {
        this.positionList = data.lookUpList;
      }
      this.spinnerService.hide();
    });
  }

  closeModal() {
    this.closed.emit();
  }

  SaveRole() {
    if (!this.Validate()) {
      return;
    }
    let model = {
      roleId: this.roleId,
      officeId: this.roleRqst.office,
      department: this.roleRqst.department,
      team: this.roleRqst.team,
      position: this.roleRqst.position,
      createdBy: this.userContextService.user$._value.id,
      modulePermissions: this.modulePermissions,
      companyId: this.userContextService.user$._value.companyID
    }
    this.addRolesService.SaveRole(model).subscribe(data => {
      if (data.status) {
        this.toastrService.success(data.msg);
      }
      else {
        this.toastrService.error(data.msg);
      }
      this.closed.emit();
      this.spinnerService.hide();
    });
  }

  Validate() {
    this.isValid = true;
    if (!this.roleRqst.office || this.roleRqst.office == '0') {
      this.toastrService.error("Please select office.");
      return false;
    }
    else if (!this.roleRqst.department || this.roleRqst.department == '0') {
      this.toastrService.error("Please select department.");
      return false;
    }
    else if (!this.roleRqst.team || this.roleRqst.team=='0') {
      this.toastrService.error("Please select team.");
      return false;
    }
    else if (!this.roleRqst.position || this.roleRqst.position=='0') {
      this.toastrService.error("Please select position.");
    }
    return true;
  }

  GetRole() {
    this.addRolesService.GetRolesById(this.roleId, this.roleRqst.office, this.roleRqst.department, this.roleRqst.team, this.roleRqst.position, this.userContextService.user$._value.companyID).subscribe(data => {
      if (data.status) {
        this.modulePermissionsFromDb = data.lstRoles.modulePermissions;
        for (let obj of this.modulePermissions) {
          if (obj.subModules.length == 0) {
            let modelReq: any;
            modelReq = this.modulePermissionsFromDb.find(x => x.moduleId === obj.moduleId);
            obj.read = modelReq.read;
            obj.write = modelReq.write;
          }
          if (obj.subModules.length > 0) {
            for (let objSub of obj.subModules) {
              let modelReq: any;
              modelReq = this.modulePermissionsFromDb.find(x => x.moduleId === objSub.moduleId);
              objSub.read = modelReq.read;
              objSub.write = modelReq.write;
            }
          }
        }

        this.officeName = data.lstRoles.officeName;
        this.departmentName = data.lstRoles.departmentName;
        this.teamName = data.lstRoles.teamName;
        this.positionName = data.lstRoles.positionName;
      }
      this.spinnerService.hide();
    });
  }

  ModuleCheckChange(event: any, modulePermissions: ModulePermission) {
    if (event.target.checked) {
      if (modulePermissions.subModules.length > 0) {
        for (let subModule of modulePermissions.subModules) {
          subModule.read = !subModule.readDisable ? true : false;
          subModule.write = !subModule.writeDisable ? true : false;
        }
      }
      else {
        modulePermissions.read = !modulePermissions.readDisable ? true : false;
        modulePermissions.write = !modulePermissions.writeDisable ? true : false;
      }
    }
    else {
      if (modulePermissions.subModules.length > 0) {
        for (let subModule of modulePermissions.subModules) {
          subModule.read = false;
          subModule.write = false;
        }
      }
      else {
        modulePermissions.read = false;
        modulePermissions.write = false;
      }
    }
  }
}


export interface ModulePermission {
  moduleId:number
  moduleName: string;
  read: boolean;
  write: boolean;
  isExpand: boolean;
  readDisable: boolean;
  writeDisable: boolean;
  subModules: ModulePermission[]
}

export const modulePermissions: ModulePermission[] = [
  { moduleId: 101, moduleName: 'Employee Dashboard', read: false, write: false, isExpand: false, readDisable: false, writeDisable:true, subModules: [] },
  {
    moduleId: 102,
    moduleName: 'Job Applications',
    read: false,
    write: false,
    isExpand: false,
    readDisable: true,
    writeDisable: true,
    subModules: [{ moduleId: 103, moduleName: 'View Job Applications', read: false, write: false, isExpand: false, readDisable: false, writeDisable: true, subModules:[] },
      { moduleId: 104, moduleName: 'Post Job Applications', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
      { moduleId: 105, moduleName: 'Edit Job Applications', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
      { moduleId: 106, moduleName: 'Delete Job Applications', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] }]
  },
  {
    moduleId: 107,
    moduleName: 'Employee Management',
    read: false,
    write: false,
    isExpand: false,
    readDisable: true,
    writeDisable: true,
    subModules: [{ moduleId: 108, moduleName: 'View Employees', read: false, write: false, isExpand: false, readDisable: false, writeDisable: true, subModules: [] },
      { moduleId: 109, moduleName: 'Add Employees', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
      { moduleId: 110, moduleName: 'Edit Employees', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
      { moduleId: 111, moduleName: 'Delete Employees', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] }]
  },
  {
    moduleId: 112,
    moduleName: 'Bank Detail',
    read: false,
    write: false,
    isExpand: false,
    readDisable: true,
    writeDisable: true,
    subModules: [{ moduleId: 113, moduleName: 'View Bank Detail', read: false, write: false, isExpand: false, readDisable: false, writeDisable: true, subModules: [] },
      { moduleId: 114, moduleName: 'Add Bank Detail', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
      { moduleId: 115, moduleName: 'Edit Bank Detail', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
      { moduleId: 116, moduleName: 'Delete Bank Detail', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] }]
  },
  {
    moduleId: 117,
    moduleName: 'Salaries',
    read: false,
    write: false,
    isExpand: false,
    readDisable: true,
    writeDisable: true,
    subModules: [{ moduleId: 118, moduleName: 'View Salary', read: false, write: false, isExpand: false, readDisable: false, writeDisable: true, subModules: [] },
      { moduleId: 119, moduleName: 'Add Salary', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
      { moduleId: 120, moduleName: 'Edit Salary', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
      { moduleId: 121, moduleName: 'Delete Salary', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] }]
  },
  {
    moduleId: 6,
    moduleName: 'PayRoll',
    read: false,
    write: false,
    isExpand: false,
    readDisable: true,
    writeDisable: true,
    subModules: [{ moduleId: 123, moduleName: 'View PayRoll', read: false, write: false, readDisable: false, writeDisable: true, isExpand: false, subModules: [] },
      { moduleId: 124, moduleName: 'Write PayRoll', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] }]
  },
  {
    moduleId: 125,
    moduleName: 'Leave Management',
    read: false,
    write: false,
    isExpand: false,
    readDisable: true,
    writeDisable: true,
    subModules: [{ moduleId: 126, moduleName: 'View Leave Management', read: false, write: false, readDisable: false, writeDisable: true, isExpand: false, subModules: [] },
      { moduleId: 127, moduleName: 'Add Leaves', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
      { moduleId: 128, moduleName: 'Edit Leaves', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
      { moduleId: 129, moduleName: 'Delete Leaves', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] }]
  },
  {
    moduleId: 130,
    moduleName: 'Attendacne Management',
    read: false,
    write: false,
    isExpand: false,
    readDisable: true,
    writeDisable: true,
    subModules: [{ moduleId: 131, moduleName: 'View Attendacne Management', read: false, write: false, readDisable: false, writeDisable: true, isExpand: false, subModules: [] },
      { moduleId: 132, moduleName: 'Add Attendacne', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
      { moduleId: 133, moduleName: 'Edit Attendacne', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
      { moduleId: 134, moduleName: 'Delete Attendacne', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] }]
  },
  {
    moduleId: 135,
    moduleName: 'Announcement',
    read: false,
    write: false,
    isExpand: false,
    readDisable: true,
    writeDisable:true,
    subModules: [{ moduleId: 136, moduleName: 'View Announcement', read: false, write: false, isExpand: false, readDisable: false, writeDisable: true, subModules: [] },
      { moduleId: 137, moduleName: 'Add Announcement', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
      { moduleId: 138, moduleName: 'Edit Announcement', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] },
      { moduleId: 139, moduleName: 'Delete Announcement', read: false, write: false, isExpand: false, readDisable: true, writeDisable: false, subModules: [] }]
  }
];

import { Component, ComponentFactoryResolver, EventEmitter, Inject, Injector, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { UserContextService } from '../../services/user-context.service';
import { EditEmployeeService } from '../edit-employee/edit-employee.service';
import { WebcamComponent } from '../../../app/common/webcam/webcam.component';
import { UploadFileComponent } from '../upload-file/upload-file.component';
import { AddEmployeeService } from '../../dasboard/employees/components/add-employee/add-employee.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { ConstantsService } from '../../services/constants.service';
import { strings } from '@material/dialog';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent {
  acceptFiles=['.jpg', '.jpeg', '.png', '.gif', '.bmp']
  tabNumber: number = 1;
  @Output() closed = new EventEmitter();
  employeeRegisterRqst: any = {};
  @ViewChild('dialogContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;
  captureImage = '';
  response: any = { dbPath: '' };
  placeholderLabel = "Upload Employee Picture";
  uplodedFileUrl: string = '';
  @ViewChild('dialogFileUploadContainer', { read: ViewContainerRef }) dialogImageContainer?: ViewContainerRef;
  listLookup: any = {};
  listDepartment: any = [];
  listTeam: any = [];
  positionList: any = [];
  supervisorList: any = [];
  dummyImage: boolean = true;
  fileUpload: File = new File([], 'default-filename'); // Initialize the FileUpload variable
  teamMemberList: any = [];
  searchTerm: string = '';
  isDropdownOpen: boolean = false;
  searchTermSupervisor: string = '';
  isDropdownOpenSupervisor: boolean = false;
  employeeSalary: any = {};

  constructor(private editEmployeeService: EditEmployeeService, private addEmployeeService: AddEmployeeService, private Constants: ConstantsService,
    private toastrService: ToastrService, private spinnerService: NgxSpinnerService, private httpclient: HttpClient,
    private userContextService: UserContextService,
    private componentFactoryResolver: ComponentFactoryResolver,
    @Inject('data') public data: any, private injector: Injector) {
    this.ShowCompleteEmployeeDetail();
  }
  closeEditEmployeeJob() {
    this.closed.emit('');
  }

  ShowCompleteEmployeeDetail() {
    let model = {
      "employeeID": this.data.employeeId
    };
    this.spinnerService.show();
    this.editEmployeeService.ShowCompleteEmployeeDetail(model).subscribe(data => {
      if (data.status) {
        this.employeeRegisterRqst = data.employeeDetail;
        if (this.employeeRegisterRqst) {
          this.employeeRegisterRqst.position = this.employeeRegisterRqst.positionId ? this.employeeRegisterRqst.positionId.toString() : '0';
          this.employeeRegisterRqst.team = this.employeeRegisterRqst.teamId ? this.employeeRegisterRqst.teamId.toString() : '';
          this.employeeRegisterRqst.department = this.employeeRegisterRqst.departmentId ? this.employeeRegisterRqst.departmentId.toString() : '';
          this.employeeRegisterRqst.office = this.employeeRegisterRqst.officeId ? this.employeeRegisterRqst.officeId.toString() : '';
          this.employeeRegisterRqst.supervisor = this.employeeRegisterRqst.supervisorId ? this.employeeRegisterRqst.supervisorId.toString() : '0';
          this.employeeRegisterRqst.probationPeriod =  this.employeeRegisterRqst.probationPeriod ? this.employeeRegisterRqst.probationPeriod.toString() : '0';
          this.employeeRegisterRqst.numberOfLeavesAllowed =  this.employeeRegisterRqst.numberOfLeavesAllowed ? this.employeeRegisterRqst.numberOfLeavesAllowed.toString() : '0';
          this.employeeRegisterRqst.shiftId =  this.employeeRegisterRqst.shiftId ? this.employeeRegisterRqst.shiftId.toString() : '0';
          this.employeeRegisterRqst.employmentType =  this.employeeRegisterRqst.employmentType ? this.employeeRegisterRqst.employmentType.toString() : '0';
          this.employeeSalary = this.employeeRegisterRqst.getEmployeeSalariesList;
        }
        this.createImgPath();
        this.GetSetupLookUpData();
        this.OnPositionChange('','direct')
      }
      this.spinnerService.hide();
    });
  }

  validatePersonalInformation() {
    if (!this.employeeRegisterRqst.fullName) {
      this.toastrService.error('Enter a Full Name.', 'error');
      return false;
    }
    else if (!this.employeeRegisterRqst.email) {
      this.toastrService.error('Enter an employee email.', 'error');
      return false;
    }
    else if (!this.employeeRegisterRqst.gender) {
      this.toastrService.error('Enter an employee gender.', 'error');
      return false;
    }
    this.tabNumber = 2;
    return true;
  }

  validateHRInformation() {
    if (!this.employeeRegisterRqst.workType) {
      this.toastrService.error('Enter a work type.', 'error');
      return false;
    }
    if (!this.employeeRegisterRqst.employmentType) {
      this.toastrService.error('Enter a employment Type.', 'error');
      return false;
    }
    if (!this.employeeRegisterRqst.position || this.employeeRegisterRqst.position == '0') {
      this.toastrService.error('Enter a position.', 'error');
      return false;
    }
    if (!this.employeeRegisterRqst.team || this.employeeRegisterRqst.team == '0') {
      this.toastrService.error('Enter a team.', 'error');
      return false;
    }
    if (!this.employeeRegisterRqst.department || this.employeeRegisterRqst.department == '0') {
      this.toastrService.error('Enter a department.', 'error');
      return false;
    }
    if (!this.employeeRegisterRqst.office || this.employeeRegisterRqst.office == '0') {
      this.toastrService.error('Enter a office.', 'error');
      return false;
    }
    this.tabNumber = 3;
    return true;
  }

  tabSwitch(tabIndex: any) {
    if (this.tabNumber == 1 && (tabIndex == 2 || tabIndex == 3) && this.validatePersonalInformation()) {
      this.tabNumber = tabIndex;
    }
    else if (this.tabNumber == 2 && (tabIndex == 1 || tabIndex == 3) && this.validateHRInformation()) {
      this.tabNumber = tabIndex;
    }
    else if (this.tabNumber == 3) {
      this.tabNumber = tabIndex;
    }
  }

  editEmployee() {
    if (this.validatePersonalInformation() && this.validateHRInformation()) {
      this.employeeRegisterRqst.companyID = this.userContextService.user$._value.companyID;
      this.employeeRegisterRqst.action = 'update';
      this.employeeRegisterRqst.supervisedBy = this.getSelectedSupervisorsString();
      this.employeeRegisterRqst.teamMember = this.getSelectedTeamMemberString();
      const formData = new FormData();
      for (const key of Object.keys(this.employeeRegisterRqst)) {
        const value = this.employeeRegisterRqst[key];
        formData.append(key, value);
      }

      for (const key of Object.keys(this.employeeSalary)) {
        const value = this.employeeSalary[key];
        formData.append(key, value);
      }

      formData.append("employeePhoto", this.fileUpload)
      this.spinnerService.show();
      this.httpclient.post(this.Constants.urlSaveEmployee, formData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe(event => {
        if (event.type === HttpEventType.Response) {
          this.toastrService.success("Employee Detail Updated", 'Success');
          this.closed.emit(true);
        }
        this.spinnerService.hide();
      });
    }
  }

  openWebcam(): void {
    // Create an instance of the dialog component
    const factory = this.componentFactoryResolver.resolveComponentFactory(WebcamComponent);
    const componentRef = this.dialogContainer?.createComponent(factory);
    const dialogComponent: any = componentRef?.instance;

    // Pass data to the dialog component
    dialogComponent.data = { name: 'John', age: 30 };

    // Subscribe to the closeDialog event to get the data back from the dialog component
    dialogComponent.closeDialog.subscribe((captureImg: any) => {
      if (captureImg) {
        this.captureImage = captureImg;
        this.employeeRegisterRqst.employeePhotoName = this.captureImage;
        this.employeeRegisterRqst.photoType = 'webcamurl';
        this.dummyImage = false;
        this.uplodedFileUrl = this.employeeRegisterRqst.employeePhotoName;
      }
      componentRef?.destroy();
    });
  }

  resetPicture() {
    this.response.dbPath = '';
    this.captureImage = '';
    this.employeeRegisterRqst.employeePhoto = '';
    this.employeeRegisterRqst.photoType = '';
  }

  createImgPath() {
    if (this.employeeRegisterRqst) {
      if (this.employeeRegisterRqst.photoType && this.employeeRegisterRqst.photoType == 'webcamurl') {
        this.uplodedFileUrl = this.employeeRegisterRqst.employeePhoto;
      }
      else {
        this.uplodedFileUrl = this.employeeRegisterRqst.employeePhoto ? environment.ApiUrl + '/' + this.employeeRegisterRqst.employeePhoto : '';
      }
    }
    this.uplodedFileUrl = this.uplodedFileUrl ? this.uplodedFileUrl : 'assets/images/projz/avatar.png';
    this.dummyImage = false;
  }

  openFileUploadModal(event:any) {
    this.fileUpload = event?.target?.files[0] || new File([], 'default-filename');
    this.uplodedFileUrl = URL.createObjectURL(event.target.files[0]);
    this.dummyImage = false;
    this.employeeRegisterRqst.photoType = 'uploadedurl';
  }

  removeUploadedFile() {
    this.employeeRegisterRqst.employeePhoto = '';
    this.uplodedFileUrl = '';
    this.response.dbPath = '';
    this.captureImage = '';
    this.employeeRegisterRqst.photoType = '';
  }

  showPreview() {
    if (this.employeeRegisterRqst.employeePhoto) {
      window.open(environment.ApiUrl + '/' + this.employeeRegisterRqst.employeePhoto, '_blank');
    }
  }

  OnOfficeSelectionChange(event: any) {
    if (event)
      this.employeeRegisterRqst.department = 0;
    const companyId = this.userContextService.user$._value.companyID;
    this.addEmployeeService.GetDepartmentByOfficeLocation(companyId, event ? event.target.value : this.employeeRegisterRqst.office).subscribe(data => {
      if (data.status) {
        this.listDepartment = data.lookUpList;
      }
      this.spinnerService.hide();
      this.OnDepartmentSelectionChange('');
    });
  }

  OnDepartmentSelectionChange(event: any) {
    if (event)
      this.employeeRegisterRqst.team = 0;
    const companyId = this.userContextService.user$._value.companyID;
    this.addEmployeeService.GetTeamByDepartment(companyId, event ? event.target.value : this.employeeRegisterRqst.department).subscribe(data => {
      if (data.status) {
        this.listTeam = data.lookUpList;
      }
      this.spinnerService.hide();
      this.OnTeamSelectionChange('');
    });
  }

  OnTeamSelectionChange(event: any) {
    if (event)
      this.employeeRegisterRqst.position = 0;
    const companyId = this.userContextService.user$._value.companyID;
    this.GetPositionByTeam(companyId, event ? event.target.value : this.employeeRegisterRqst.team);
    this.GetSupervisorByTeam(companyId, event ? event.target.value : this.employeeRegisterRqst.team);
  }

  GetPositionByTeam(companyId: any, selectedValue: any) {
    this.addEmployeeService.GetPositionByTeam(companyId, selectedValue).subscribe(data => {
      if (data.status) {
        this.positionList = data.lookUpList;
      }
      this.spinnerService.hide();
    });
  }

  GetSupervisorByTeam(companyId: any, selectedValue: any) {
    //this.addEmployeeService.GetSupervisorByTeam(companyId, selectedValue).subscribe(data => {
    //  if (data.status) {
    //    this.supervisorList = data.lookUpList;
    //  }
    //  this.spinnerService.hide();
    //});
  }

  GetSetupLookUpData() {
    this.spinnerService.show();
    let model: any = {
      companyId: this.userContextService.user$._value.companyID,
      requiredDataList: ['office','et','shift']
    }
    this.addEmployeeService.GetSetupLookUpData(model).subscribe(data => {
      if (data.status) {
        this.listLookup = data.lookUpList;
      }
      this.spinnerService.hide();
      this.OnOfficeSelectionChange('')
    });
  }

  OnPositionChange(event: any, param: any) {
    var selectedValue: any;
    if (param != 'direct') {
      selectedValue = event.target.value;
    }
    else {
      selectedValue = this.employeeRegisterRqst.position;
    }
    const companyId = this.userContextService.user$._value.companyID;
    let model = {
      positionId: selectedValue,
      companyId: companyId
    }
    this.spinnerService.show();
    this.addEmployeeService.GetPositionHierarchyEmployees(model.companyId, model.positionId).subscribe(data => {
      this.spinnerService.hide();
      if (data.status) {
        this.supervisorList = data.lookUpList.supervisorDDLResponse;
        let supervisorListModel: any[] = this.supervisorList;
        supervisorListModel.some(m => {
          if (this.employeeRegisterRqst.supervisorDDLResponse.includes(m.supervisorId)) {
            // Update a property in the model based on the condition
            m.selected = true;
            return true; // Stop iteration since the condition is met
          }
          return false;
        });

        this.teamMemberList = data.lookUpList.teamMemberDDLResponse;
        let teamMemberListModel: any[] = this.teamMemberList;

        teamMemberListModel.some(m => {
          if (this.employeeRegisterRqst.teamMemberDDLResponse.includes(m.teamMemberId)) {
            // Update a property in the model based on the condition
            m.selected = true;
            return true; // Stop iteration since the condition is met
          }
          return false;
        });
      }
    });
  }

  get filteredTeamMemberList() {
    let model: any[] = this.teamMemberList;
    model = model.filter(member =>
      member.teamMemberName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    return model;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  get filteredSupervisorList() {
    let model: any[] = this.supervisorList;
    model = model.filter(member =>
      member.supervisorName.toLowerCase().includes(this.searchTermSupervisor.toLowerCase())
    );
    return model;
  }

  toggleDropdownSupervisor() {
    this.isDropdownOpenSupervisor = !this.isDropdownOpenSupervisor;
  }

  getSelectedMembersText() {
    let model: any[] = this.teamMemberList;
    const selectedMembers = model.filter(member => member.selected);
    return selectedMembers.length > 0 ? selectedMembers.map(member => member.teamMemberName).join(', ') : 'Choose Team Members';
  }

  getSelectedSupervisorText() {
    let model: any[] = this.supervisorList;
    const selectedMembers = model.filter(member => member.selected);
    return selectedMembers.length > 0 ? selectedMembers.map(member => member.supervisorName).join(', ') : 'Choose Supervisor';
  }

  getSelectedSupervisorsString() {
    let model: any[] = this.supervisorList;
    const selectedSupervisors = model
      .filter(member => member.selected)
      .map(member => member.supervisorId);

    return selectedSupervisors.join(', ');
  }

  getSelectedTeamMemberString() {
    let model: any[] = this.teamMemberList;
    const selectedMembers = model
      .filter(member => member.selected)
      .map(member => member.teamMemberId);

    return selectedMembers.join(', ');
  }
}

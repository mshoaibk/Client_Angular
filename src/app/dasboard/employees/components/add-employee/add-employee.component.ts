import { Component, ComponentFactoryResolver, ViewContainerRef, Injector, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../../../services/user-context.service';
import { AddEmployeeService } from '../add-employee/add-employee.service';
import { WebcamComponent } from '../../../../common/webcam/webcam.component';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { ConstantsService, Methods } from '../../../../services/constants.service';
import { UploadFileComponent } from '../../../../common/upload-file/upload-file.component';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { ShiftSetupService } from 'src/app/dasboard/company-setup/components/setup-shift-type/shift-setup.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {
  url: string = ''
  acceptFiles = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
  tabNumber: number = 1;
  employeeRegisterRqst: any = {};
  @ViewChild('dialogContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;
  captureImage = '';
  response: any = { dbPath: '' };
  placeholderLabel = "Upload Employee Picture";
  defaultPassword = false;
  employeeSalary: any = {};
  isValid: boolean = true;
  uplodedFileUrl: string = '';
  dummyImgage: boolean = true;
  @ViewChild('dialogFileUploadContainer', { read: ViewContainerRef }) dialogImageContainer?: ViewContainerRef;
  listLookup: any = {};
  listDepartment: any = [];
  listTeam: any = [];
  positionList: any = [];
  shiftList: any = [];
  supervisorList: any = [];
  dummyImage: boolean = true;
  fileUpload: File = new File([], 'default-filename'); // Initialize the FileUpload variable
  otherSupervisor: boolean = false;
  teamMemberList: any = [];
  searchTerm: string = '';
  isDropdownOpen: boolean = false;
  searchTermSupervisor: string = '';
  isDropdownOpenSupervisor: boolean = false;

  constructor(private addEmployeeService: AddEmployeeService, private currentRoute: Router, private httpclient: HttpClient,
    private toastrService: ToastrService, private spinnerService: NgxSpinnerService, private Constants: ConstantsService,
    private userContextService: UserContextService, private componentFactoryResolver: ComponentFactoryResolver,private shiftService:ShiftSetupService
    ,private injector: Injector) {
    this.resetEmployeeForm();
    this.GetSetupLookUpData();
   this.GetShiftList()
  }

  resetEmployeeForm() {
    this.employeeRegisterRqst.fullName = '';
    this.employeeRegisterRqst.email = '';
    this.employeeRegisterRqst.password = '';
    this.employeeRegisterRqst.gender = '';
    this.employeeRegisterRqst.qualification = '';
    this.employeeRegisterRqst.experience = '';
    this.employeeRegisterRqst.phoneNumber = '';
    this.employeeRegisterRqst.employmentType = '';
    this.employeeRegisterRqst.team = '0';
    this.employeeRegisterRqst.position = '0';
    this.employeeRegisterRqst.department = '0';
    this.employeeRegisterRqst.office = '0';
    this.employeeRegisterRqst.supervisedBy = '';
    this.employeeRegisterRqst.teamMember = '';
    const currentDate = new Date();
    this.employeeRegisterRqst.hireDate = this.formatDate(currentDate);
    this.employeeRegisterRqst.probationPeriod = '1 month';
    this.employeeRegisterRqst.contractEnd = this.formatDate(currentDate);
    this.employeeRegisterRqst.paidVacation = '24 days';
    this.employeeRegisterRqst.workingSchedule = 'Freelancer - working hours on invoice';
    this.employeeSalary.payType = '';
    this.employeeSalary.currency = '';
    this.employeeSalary.monthlyPay = 0;
    this.employeeSalary.hourlyPay = 0;
    this.employeeSalary.hoursWorked = 0;
    this.employeeSalary.dailyPay = 0;
    this.employeeSalary.weeklyPay = 0;
    this.employeeSalary.weeksWorked = 0;
    this.employeeSalary.appliedTaxPercentage = 0 ;
    this.employeeRegisterRqst.action = 'save';
    this.employeeRegisterRqst.workType = '';
    this.employeeRegisterRqst.ShiftId = 0 ;
    this.employeeRegisterRqst.NumberOfLeavesAllowed = 0; 
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    return `${year}-${month}-${day}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  validatePersonalInformation() {
    this.isValid = true;
    let emptyFieldsCount = 0; // Track the number of empty fields
    if (!this.employeeRegisterRqst.fullName) {
      emptyFieldsCount++;
    }
    if (!this.employeeRegisterRqst.email) {
      emptyFieldsCount++;
    }
    if (!this.employeeRegisterRqst.password) {
      emptyFieldsCount++;
    }
    if (!this.employeeRegisterRqst.gender) {
      emptyFieldsCount++;
    }
    if (!this.employeeRegisterRqst.phoneNumber) {
      emptyFieldsCount++;
    }

    if (emptyFieldsCount >= 2) {
      this.isValid = false;
      this.toastrService.error('Please enter the required fields.');
      return false;
    }

    else if (!this.employeeRegisterRqst.fullName) {
      this.isValid = false;
      this.toastrService.error('Enter a Full Name.');
      return false;
    }
    else if (!Methods.validateFullName(this.employeeRegisterRqst.fullName)) {
      this.isValid = false;
      this.toastrService.error('Please enter a valid full name with alphabets only.');
      return false;
    }
    else if (!this.employeeRegisterRqst.email) {
      this.isValid = false;
      this.toastrService.error('Enter an employee email.');
      return false;
    }
    else if (!Methods.isValidEmail(this.employeeRegisterRqst.email)) {
      this.isValid = false;
      this.toastrService.error('Please enter a valid email.');
      return false;
    }
    else if (!this.employeeRegisterRqst.password) {
      this.isValid = false;
      this.toastrService.error('Please enter a password.');
      return false;
    }
    else if (!this.employeeRegisterRqst.gender) {
      this.isValid = false;
      this.toastrService.error('Enter an employee gender.');
      return false;
    }
    else if (!this.employeeRegisterRqst.phoneNumber) {
      this.isValid = false;
      this.toastrService.error('Enter an employee phonenumber.');
      return false;
    }
    this.spinnerService.show();
    let model = {
      email: this.employeeRegisterRqst.email,
      phoneNumber: this.employeeRegisterRqst.phoneNumber
    }
    let flag = true;
    this.addEmployeeService.CheckEmployeeRegisterValidation(model).subscribe(data => {
      this.spinnerService.hide();
      if (!data.status) {
        this.toastrService.error(data.msg);
        flag = false;
      }
      else {
        this.tabNumber = 2;
      }
    });
    return flag;
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
    if (!this.employeeRegisterRqst.ShiftId || this.employeeRegisterRqst.ShiftId == '0') {
      this.toastrService.error('Select a Shift.', 'error');
      return false;
    }
    if (!this.employeeRegisterRqst.NumberOfLeavesAllowed || this.employeeRegisterRqst.NumberOfLeavesAllowed == '0') {
      this.toastrService.error('Enter a Number Of Leaves Allowed.', 'error');
      return false;
    }
    this.tabNumber = 3;
    return true;
  }

  tabSwitch(tabIndex: any) {
    if (this.tabNumber == 1 && (tabIndex == 2 || tabIndex == 3) && this.validatePersonalInformation()) {
      //if (this.tabNumber == 1 && (tabIndex == 2 || tabIndex == 3)) {
      this.tabNumber = tabIndex;
    }
    else if (this.tabNumber == 2 && (tabIndex == 1 || tabIndex == 3) && this.validateHRInformation()) {
      //else if (this.tabNumber == 2 && (tabIndex == 1 || tabIndex == 3)) {
      this.tabNumber = tabIndex;
    }
    else if (this.tabNumber == 3) {
      this.tabNumber = tabIndex;
    }
  }

  registerUsers() {
    this.spinnerService.show();
    this.addEmployeeService.registerUsers(this.employeeRegisterRqst).subscribe(data => {
      this.spinnerService.hide();
      if (data.status) {
        this.SaveEmployee();
      }
    });
  }

  SaveEmployee() {
    this.employeeRegisterRqst.companyID = this.userContextService.user$._value.companyID;
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
        this.toastrService.success("Employee Added successfully.", 'Success');
        this.resetEmployeeForm();
        this.currentRoute.navigate(['/dashboard/employees']);
      }
      this.spinnerService.hide();
    });
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

  generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.employeeRegisterRqst.password = password;
  }

  clearPassword() {
    this.employeeRegisterRqst.password = '';
  }

  openFileUploadModal(event: any) {
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
    this.dummyImage = true
  }

  showPreview() {
    if (this.employeeRegisterRqst.employeePhoto) {
      window.open(environment.ApiUrl + '/' + this.employeeRegisterRqst.employeePhoto, '_blank');
    }
  }

  GetSetupLookUpData() {
    this.spinnerService.show();
    let model: any = {
      companyId: this.userContextService.user$._value.companyID,
      requiredDataList: ['office', 'et']
    }
    this.addEmployeeService.GetSetupLookUpData(model).subscribe(data => {
      if (data.status) {
        this.listLookup = data.lookUpList;
      }
      this.spinnerService.hide();
    });
  }
  GetShiftList() {
    this.spinnerService.show();
    let model: any = {
     
      searchShift: "",
      pageIndex:1,
      pageSize:-1,
      companyId: this.userContextService.user$._value.companyID,
    }
    this.shiftService.GetShiftList(model).subscribe(data => {
      if (data.status) {
        this.shiftList = data.shiftList;
      }
      this.spinnerService.hide();
    });
  }

  OnOfficeSelectionChange(event: any) {
    const selectedValue = event.target.value;
    this.employeeRegisterRqst.department = 0;
    const companyId = this.userContextService.user$._value.companyID;
    this.addEmployeeService.GetDepartmentByOfficeLocation(companyId, selectedValue).subscribe(data => {
      if (data.status) {
        this.listDepartment = data.lookUpList;
      }
      this.spinnerService.hide();
    });
  }

  OnDepartmentSelectionChange(event: any) {
    const selectedValue = event.target.value;
    this.employeeRegisterRqst.team = 0;
    const companyId = this.userContextService.user$._value.companyID;
    this.addEmployeeService.GetTeamByDepartment(companyId, selectedValue).subscribe(data => {
      if (data.status) {
        this.listTeam = data.lookUpList;
      }
      this.spinnerService.hide();
    });
  }

  OnTeamSelectionChange(event: any) {
    this.employeeRegisterRqst.position = 0;
    const selectedValue = event.target.value;
    const companyId = this.userContextService.user$._value.companyID;
    this.otherSupervisor = false;
    this.GetPositionByTeam(companyId, selectedValue);
    //this.GetSupervisorByTeam(companyId, selectedValue);
  }

  GetPositionByTeam(companyId: any, selectedValue: any) {
    this.addEmployeeService.GetPositionByTeam(companyId, selectedValue).subscribe(data => {
      if (data.status) {
        this.positionList = data.lookUpList;
      }
      this.spinnerService.hide();
    });
  }

  OnPositionChange(event: any) {
    const selectedValue = event.target.value;
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
        this.teamMemberList = data.lookUpList.teamMemberDDLResponse;
      }
    });
  }

  get filteredTeamMemberList() {
    let model:any[] = this.teamMemberList;
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

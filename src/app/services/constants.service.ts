import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() { }
  // Login API URLs
  public readonly urlLogin = environment.ApiUrl + '/api/ApplicationUsers/Login';
  public readonly urlRegisterCompany = environment.ApiUrl + '/api/ApplicationUsers/RegisterCompany';
  public readonly urlRegisterEmployee = environment.ApiUrl + '/api/ApplicationUsers/RegisterEmployee';
  public readonly urlShowUserInfo = environment.ApiUrl + '/api/ApplicationUsers/ShowUserInfo';
  public readonly urlUpdateCompanyRegisteration = environment.ApiUrl + '/api/ApplicationUsers/UpdateCompanyRegisteration';
  public readonly urlDeleteUserInfo = environment.ApiUrl + '/api/ApplicationUsers/DeleteUserInfo';
  public readonly urlUpdatePassword = environment.ApiUrl + '/api/ApplicationUsers/UpdatePassword';
  // Post Job URLs
  public readonly urlSavePostJob = environment.ApiUrl + '/api/PostJob/SavePostJob';
  public readonly urlGetPostedJob = environment.ApiUrl + '/api/PostJob/GetPostedJob';
  public readonly urlDeletePostedJob = environment.ApiUrl + '/api/PostJob/DeletePostedJob';
  public readonly urlOnChangeJobActivationStatus = environment.ApiUrl + '/api/PostJob/OnChangeJobActivationStatus';
  public readonly urlGetCarrerByComapny = environment.ApiUrl + '/api/PostJob/GetCarrerByComapny';
  //Register Company Detail URLs
  public readonly urlRegisterCompanyDetail = environment.ApiUrl + '/api/CompanyRegistration/RegisterCompanyDetail';
  public readonly urlGetCompanyDetail = environment.ApiUrl + '/api/CompanyRegistration/GetCompanyDetail';
  public readonly urlDeleteCompanyDetail = environment.ApiUrl + '/api/CompanyRegistration/DeleteCompanyDetail';
  public readonly urlOnChangeCompanyStatus = environment.ApiUrl + '/api/CompanyRegistration/OnChangeCompanyStatus';
  public readonly urlChangeUserInfoStatus = environment.ApiUrl + '/api/ApplicationUsers/ChangeUserInfoStatus';
  public readonly urlGetCompaniesName = environment.ApiUrl + '/api/CompanyRegistration/GetCompaniesName';
  public readonly urlSaveCompanyAnnouncement = environment.ApiUrl + '/api/CompanyRegistration/SaveCompanyAnnouncement';
  public readonly urlGetCompanyAnnouncementList = environment.ApiUrl + '/api/CompanyRegistration/GetCompanyAnnouncementList';
  public readonly urlDeleteCompanyAnnouncement = environment.ApiUrl + '/api/CompanyRegistration/DeleteCompanyAnnouncement';
  //Employees Module URLs
  public readonly urlCheckEmployeeRegisterValidation = environment.ApiUrl + '/api/Employee/CheckEmployeeRegisterValidation';
  public readonly urlSaveEmployee = environment.ApiUrl + '/api/Employee/SaveEmployee';
  public readonly urlGetEmployeeList = environment.ApiUrl + '/api/Employee/GetEmployeeList';
  public readonly urlDeleteEmployeeDetail = environment.ApiUrl + '/api/Employee/DeleteEmployeeDetail';
  public readonly urlOnChangeEmployeeStatus = environment.ApiUrl + '/api/Employee/OnChangeEmployeeStatus';
  public readonly urlGetEmployeeBasicDetailForCompany = environment.ApiUrl + '/api/Employee/GetEmployeeBasicDetailForCompany';
  public readonly urlShowCompleteEmployeeDetail = environment.ApiUrl + '/api/Employee/ShowCompleteEmployeeDetail';
  public readonly urlSaveEmployeeSalary = environment.ApiUrl + '/api/Employee/SaveEmployeeSalary';
  public readonly urlGenarateEmployeeSalary = environment.ApiUrl + '/api/Employee/GenarateEmployeeSalary';
  public readonly urlGetEmployeeSalaryById = environment.ApiUrl + '/api/Employee/GetEmployeeSalaryById';
  public readonly urlSaveEmployeeSalarySlip = environment.ApiUrl + '/api/Employee/SaveEmployeeSalarySlip';
  public readonly urlGetEmployeeSalaryByEmployeeIdSlip = environment.ApiUrl + '/api/Employee/GetEmployeeSalaryByEmployeeIdSlip';
  public readonly urlChangeSalarySlipDownloadStatus = environment.ApiUrl + '/api/Employee/ChangeSalarySlipDownloadStatus';
  public readonly urlSaveEmployeeBankDetail = environment.ApiUrl + '/api/Employee/SaveEmployeeBankDetail';
  public readonly urlGetEmployeeBankDetail = environment.ApiUrl + '/api/Employee/GetEmployeeBankDetail';
  public readonly urlGetEmployeeSalaries = environment.ApiUrl + '/api/Employee/GetEmployeeSalaries';
  public readonly urlDeleteEmployeeSalaries = environment.ApiUrl + '/api/Employee/DeleteEmployeeSalary';
  public readonly urlSalaryPay = environment.ApiUrl + '/api/Employee/SalaryPay';
  public readonly urlUpdateSalaryAllowances = environment.ApiUrl + '/api/Employee/UpdateSalaryAllowances';
  public readonly urlFillEmployeeDDLByCompany = environment.ApiUrl + '/api/Employee/FillEmployeeDDLByCompany';
  public readonly urlCheckGetEmployeeSalaryById = environment.ApiUrl + '/api/Employee/CheckGetEmployeeSalaryById';
  public readonly urlCheckGetEmployeeSalariesList = environment.ApiUrl + '/api/Employee/FillEmployeeDDLForSalaries';
  public readonly urlShowEmployeeSalarySlipList = environment.ApiUrl + '/api/Employee/GetEmployeeSalarySlipList';
  //Dashboard Module URLs
  public readonly urlGetAdminDashboardData = environment.ApiUrl + '/api/Dashboard/GetAdminDashboardData';
  public readonly urlGetCompanyDashboardData = environment.ApiUrl + '/api/Dashboard/GetCompanyDashboardData';
  public readonly urlGetCompanyDashboardCount = environment.ApiUrl + '/api/Dashboard/GetCompanyDashboardCount';
  //Upload File Url
  public readonly urlUpload = environment.ApiUrl + '/api/UploadFile/Upload';
  public readonly urlUploadResume = environment.ApiUrl + '/api/UploadFile/UploadResume';
  //Company Dashboard Module
  public readonly urlGetCompanyProfile = environment.ApiUrl + '/api/CompanyRegistration/GetCompanyProfile';
  public readonly urlGetCounties = 'assets/countries.json';
  //Candidate Apply For Job
  public readonly urlShowAppliedApplication = environment.ApiUrl + '/api/JobApplication/ShowAppliedApplication';
  public readonly urlShowCandidatesApplication = environment.ApiUrl + '/api/JobApplication/ShowCandidatesApplication';
  public readonly urlUpdateCandidatesApplication = environment.ApiUrl + '/api/JobApplication/UpdateCandidatesApplication';
  public readonly urlDownload = environment.ApiUrl + '/api/UploadFile/Download';
  public readonly urlApplyJob = environment.ApiUrl + '/api/JobApplication/ApplyJob';
  public readonly urlGetPostedJobById = environment.ApiUrl + '/api/JobApplication/GetPostedJobById';
  //Employee Attendence Record
  public readonly urlGetEmployeeLeaveRequest = environment.ApiUrl + '/api/EmployeeAttendance/GetEmployeeLeaveRequest';
  public readonly urlGetEmployeeAttendanceRecord = environment.ApiUrl + '/api/EmployeeAttendance/GetEmployeeAttendanceRecord';
  public readonly urlGetAttendanceCalendarView = environment.ApiUrl + '/api/EmployeeAttendance/GetAttendanceCalendarView';
  public readonly urlGetEmployeeLeaveCalendarView = environment.ApiUrl + '/api/EmployeeAttendance/GetEmployeeLeaveCalendarView';
  public readonly urlGetEmployeeAttendanceRecordByEmployeeId = environment.ApiUrl + '/api/EmployeeAttendance/GetEmployeeAttendanceRecordByEmployeeId';
  public readonly urlGetEmployeeLeaveRecordByEmployeeId = environment.ApiUrl + '/api/EmployeeAttendance/GetEmployeeLeaveRecordByEmployeeId';
  public readonly urlupdateEmployeeLeaveStatus = environment.ApiUrl + '/api/EmployeeAttendance/UpdateEmployeeLeaveStatus';
  public readonly urlDeleteAttendanceLeaveRecord = environment.ApiUrl + '/api/EmployeeAttendance/DeleteAttendanceLeaveRecord';
  public readonly urlAddAttendance = environment.ApiUrl + '/api/EmployeeAttendance/AddAttendance';
  public readonly urlAddLeaveRequest = environment.ApiUrl + '/api/EmployeeAttendance/AddLeaveRequest';
  public readonly urlCheckAlreadyAddedAttendance = environment.ApiUrl + '/api/EmployeeAttendance/CheckAlreadyAddedAttendance';
  //Employee Yearly Holidays Leaves
  public readonly urlSaveYearlyHolidays = environment.ApiUrl + '/api/EmployeeAttendance/SaveYearlyHolidays';
  public readonly urlGetYearlyHolidays = environment.ApiUrl + '/api/EmployeeAttendance/GetYearlyHolidays';
  public readonly urlDeleteYearlyHolidays = environment.ApiUrl + '/api/EmployeeAttendance/DeleteYearlyHolidays';
  //Company Setup Api Url
  public readonly urlCreateOffice = environment.ApiUrl + '/api/CompanySetup/CreateOffice';
  public readonly urlGetOfficeLocationList = environment.ApiUrl + '/api/CompanySetup/GetOfficeLocationList';
  public readonly urlDeleteOfficeSetup = environment.ApiUrl + '/api/CompanySetup/DeleteOfficeSetup';
  public readonly urlSaveLocation = environment.ApiUrl + '/api/CompanySetup/SaveLocation';
  public readonly urlGetLocation = environment.ApiUrl + '/api/CompanySetup/GetLocation';
  public readonly urlCreateDepartment = environment.ApiUrl + '/api/CompanySetup/CreateDepartment';
  public readonly urlGetDepartmentList = environment.ApiUrl + '/api/CompanySetup/GetDepartmentList';
  public readonly urlDeleteDepartmentSetup = environment.ApiUrl + '/api/CompanySetup/DeleteDepartmentSetup';
  public readonly urlCreateTeam = environment.ApiUrl + '/api/CompanySetup/CreateTeam';
  public readonly urlGetTeamList = environment.ApiUrl + '/api/CompanySetup/GetTeamList';
  public readonly urlDeleteTeamSetup = environment.ApiUrl + '/api/CompanySetup/DeleteTeamSetup';
  public readonly urlCreatePosition = environment.ApiUrl + '/api/CompanySetup/CreatePosition';
  public readonly urlGetPositionList = environment.ApiUrl + '/api/CompanySetup/GetPositionList';
  public readonly urlDeletePositionSetup = environment.ApiUrl + '/api/CompanySetup/DeletePositionSetup';
  public readonly urlGetSetupLookUpData = environment.ApiUrl + '/api/CompanySetup/GetSetupLookUpData';
  public readonly urlGetDepartmentByOfficeLocation = environment.ApiUrl + '/api/CompanySetup/GetDepartmentByOfficeLocation';
  public readonly urlGetTeamByDepartment = environment.ApiUrl + '/api/CompanySetup/GetTeamByDepartment';
  public readonly urlGetPositionByTeam = environment.ApiUrl + '/api/CompanySetup/GetPositionByTeam';
  public readonly urlGetPositionHierarchyEmployees = environment.ApiUrl + '/api/CompanySetup/GetPositionHierarchyEmployees';
  public readonly urlCreateEmploymentTypeSetup = environment.ApiUrl + '/api/CompanySetup/CreateEmploymentTypeSetup';
  public readonly urlGetEmploymentTypeList = environment.ApiUrl + '/api/CompanySetup/GetEmploymentTypeList';
  public readonly urlDeleteEmploymentTypeSetup = environment.ApiUrl + '/api/CompanySetup/DeleteEmploymentTypeSetup';
  public readonly urlCreateShift = environment.ApiUrl + '/api/CompanySetup/CreateShift';
  public readonly urlGetShiftList = environment.ApiUrl + '/api/CompanySetup/GetShiftList';
  public readonly urlDeleteShiftList = environment.ApiUrl + '/api/CompanySetup/DeleteShift';
  public readonly urlSaveWeekly = environment.ApiUrl + '/api/EmployeeAttendance/SaveWeeklyHolidays';
  public readonly urlGetWeeklyHolidaysByCompId = environment.ApiUrl + '/api/EmployeeAttendance/GetWeeklyHolidays';
  public readonly urlDeleteWeeklyHoliday = environment.ApiUrl + '/api/EmployeeAttendance/DeleteWeeklyHoliday';
  public readonly urlSaveRole = environment.ApiUrl + '/api/CompanySetup/SaveRole';
  public readonly urlGetRolesById = environment.ApiUrl + '/api/CompanySetup/GetRolesById';
  public readonly urlGetRoles = environment.ApiUrl + '/api/CompanySetup/GetRoles';
  public readonly urldeleteEmployeeSetupRoles = environment.ApiUrl + '/api/CompanySetup/DeleteEmployeeSetupRoles';
  public readonly urlGetPositionHierarchy = environment.ApiUrl + '/api/CompanySetup/GetPositionHierarchy';
  public readonly urlUpdatePositionHierarchy = environment.ApiUrl + '/api/CompanySetup/UpdatePositionHierarchy';
}

export class Methods {
  static isValidEmail(email: string = ''): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  static validateFullName(name: string = '') {
    const pattern = /^[a-zA-Z ]+$/;
    return pattern.test(name);
  }

  static EncryptTo64(model: any = {}) {
    return btoa(model);
  }


  static validateFileFormat(file: File, allowedFormats: any = []): boolean {
    const fileExt = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    return allowedFormats.includes(fileExt);
  }
}

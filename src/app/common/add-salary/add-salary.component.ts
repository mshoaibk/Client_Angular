import { Component, EventEmitter, Inject, Injector, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { UserContextService } from '../../services/user-context.service';
import { AddSalaryService } from '../add-salary/add-salary.service';

@Component({
  selector: 'app-add-salary',
  templateUrl: './add-salary.component.html',
  styleUrls: ['./add-salary.component.scss']
})
export class AddSalaryComponent {
  urlPhote:string="http://hrtemple.somee.com/api_service/"
  years = [   {"yearname": "2023", "id": 1},
  {"yearname": "2024", "id": 2},
  {"yearname": "2025", "id": 3},
  {"yearname": "2026", "id": 4},
  {"yearname": "2027", "id": 5},
  {"yearname": "2028", "id": 6},
  {"yearname": "2029", "id": 7},
  {"yearname": "2030", "id": 8},
  ];
  months=[{"monthname": "January", "id": 1},
  {"monthname": "February", "id": 2},
  {"monthname": "March", "id": 3},
  {"monthname": "April", "id": 4},
  {"monthname": "May", "id": 5},
  {"monthname": "June", "id": 6},
  {"monthname": "July", "id": 7},
  {"monthname": "August", "id": 8},
  {"monthname": "September", "id": 9},
  {"monthname": "October", "id": 10},
  {"monthname": "November", "id": 11},
  {"monthname": "December", "id": 12}]
  employeeSalary: any = {};
  employeeDDLList: any = [];
  @Output() closed = new EventEmitter();
  selectedEmployeeInfo: any = {};
  selectedEmployeeIds: string[] = [];
  selectAll:boolean = false;
  monthstxt:any;
  yearstxt:any;
  searchEmployeesRqst: any = {};
  listLookup: any = {};
  employeeSalarylist:any=[]
  isValid: boolean = true;
  constructor(private addSalaryService: AddSalaryService,
    private toastrService: ToastrService, private spinnerService: NgxSpinnerService,
    private userContextService: UserContextService,
    @Inject('data') public data: any, private injector: Injector) {
      this.searchEmployeesRqst.employmentType = 'monthly';
    if (data.salaryObj && data.salaryObj.action && data.salaryObj.action == 'update') {
      this.employeeSalary = data.salaryObj;
    }
    else {
      this.setSalaryForm();
    }
    this.monthstxt=0
    this.yearstxt=0
  }
ngOnInit(){
  this.getEmployeeSalaries()
  this.GetSetupLookUpData();
}
createImgPath(employeePhoto: any, photoType: any) {
  if (!employeePhoto)
    return 'assets/images/projz/avatar.png';
  if (photoType == null)
    return environment.ApiUrl + '/' + employeePhoto;
  else
    return employeePhoto;
}
getEmployeeSalaries() {
    
  let model = {
    "companyId": this.userContextService.user$._value.companyID,
    "payType":this.searchEmployeesRqst.employmentType,
    
  };
  console.log("modl",model)
  this.spinnerService.show();
  this.addSalaryService.GetEmployeeSalariesList(model).subscribe(data => {
    this.employeeSalarylist = data.list;
      console.log("salariesList",this.employeeSalarylist)
    // console.log("salariesList",data)
    this.spinnerService.hide();
  });
}
GetSetupLookUpData() {
  this.spinnerService.show();
  let model: any = {
    companyId: this.userContextService.user$._value.companyID,
    requiredDataList: ['office', 'department', 'team', 'position','et']
  }
  this.addSalaryService.GetSetupLookUpData(model).subscribe(data => {
  
    if (data.status) {
      this.listLookup = data.lookUpList;
      console.log("setupllooksalaries",this.listLookup)
    }
    this.spinnerService.hide();
  });
}

// 
  setSalaryForm() {
    this.employeeSalary.payType = '';
    this.employeeSalary.currency = '';
    this.employeeSalary.monthlyPay = 0;
    this.employeeSalary.hourlyPay = 0;
    this.employeeSalary.hoursWorked = 0;
    this.employeeSalary.dailyPay = 0;
    this.employeeSalary.weeklyPay = 0;
    this.employeeSalary.weeksWorked = 0;
    this.employeeSalary.createdBy = this.userContextService.user$._value.id;
    this.employeeSalary.employeeID = this.data.salaryObj.Id;
    this.employeeSalary.action = 'save';
    if (this.data.salaryObj.openfrom && this.data.salaryObj.openfrom == 'add-salary') {
      this.fillEmployeeDDLByCompany();
    }
  }

  fillEmployeeDDLByCompany() {
    this.spinnerService.show();
    this.addSalaryService.fillEmployeeDDLByCompany(this.userContextService.user$._value.companyID,'salary').subscribe(data => {
      if (data.status) {
        this.employeeSalary.employeeID = 0;
        this.employeeDDLList = data.employeeDDLlist;
        console.log("ddddd", this.employeeDDLList)
      }
      this.spinnerService.hide();
    });
  }

  closeSalaryForm() {
    this.closed.emit(false);
  }

  saveEmployeeSalary() {
    if (!this.Validate()) {
      return;
    }
    // debugger
const employeData = {
  "companyId": this.userContextService.user$._value.companyID,
  "employeeIds": this.selectedEmployeeIds,
  "searchedYear":this.yearstxt,
  "searchedMonth":this.monthstxt,

}
      this.spinnerService.show();
  this.addSalaryService.GenarateEmployeeSalary(employeData).subscribe(data => {
    console.log("hello",data)
        if (data.status) {
          this.toastrService.success("Salary Generated Successfully.", 'Success');
          this.closed.emit(true);
        }
        this.spinnerService.hide();
        // this.closeSalaryForm()
      });
  }
  isSelected(employeeId: string): boolean {
    return this.selectedEmployeeIds.includes(employeeId);
  }

  Validate() {
    this.isValid = false;
    if (!this.monthstxt || this.monthstxt==0 ) {
      this.toastrService.error("Please select Month.");
      
      return false;
    }
    else if (!this.yearstxt || this.yearstxt == 0) {
      this.toastrService.error("Please select Year.");
      return false;
    }
    else if (this.selectedEmployeeIds.length==0) {
      this.toastrService.error("Please select Employee.");
      return false;
    }
 
    return true;
  }
  
  employeeSelection() {
    this.spinnerService.show();
    this.addSalaryService.CheckGetEmployeeSalaryById(this.employeeSalary.employeeID).subscribe(data => {
      if (data.status) {
        this.selectedEmployeeInfo = data.employeeSalaryDetail;
      }
      this.spinnerService.hide();
    });
  }
  
  // SelectAll() {
  //   // this.selectAll =!this.selectAll;
  //   if (this.selectAll) {
  //     this.selectAll==true
  //     this.selectedEmployeeIds = [];
  //     console.log("if call")
  //     // this.employeeSalarylist.employeeId
  //   } else {
  //     this.selectedEmployeeIds = this.employeeDDLList.map((emp : any) => emp.employeeId);
  //     console.log("else call")

  //   }
  // }
  allSelect(){
    if(this.selectAll==true){
      this.selectedEmployeeIds = this.employeeSalarylist.map((emp : any) => emp.employeeId);
      // this.selectedEmployeeIds = this.employeeSalarylist.employeeId
    }else{
      this.selectAll==false
      this.selectedEmployeeIds = [];
    }
  }
  onCheckboxChange(employeeId: string): void {
    const index = this.selectedEmployeeIds.indexOf(employeeId);
    if (index === -1) {
      this.selectedEmployeeIds.push(employeeId);
    } else {
      this.selectedEmployeeIds.splice(index, 1);
    }
  }
  
}

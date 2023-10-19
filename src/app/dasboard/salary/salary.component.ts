import { Component, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../services/user-context.service';
import { SalaryService } from './salary.service';
import { AddSalaryComponent } from '../../common/add-salary/add-salary.component';
import { environment } from '../../../environments/environment';
import { identity, observable } from 'rxjs';
import { AddEmployeeService } from '../employees/components/add-employee/add-employee.service';
import { EmployeeSalaryHistoryComponent } from 'src/app/common/employee-salary-history/employee-salary-history.component';
import { DeleteConfirmationComponent } from 'src/app/common/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent {
  alreadyPaid:boolean=false
  isPay:boolean=true
  searchEmployeesRqst: any = {};
  // employeeSalarylist: any = [];
  employeeSalarySliplist: any = [];
  SelectedPageSize: number = 10;
  @ViewChild('salaryContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;
  @ViewChild('salaryDeleteContainer', { read: ViewContainerRef }) dialogContainerDelete?: ViewContainerRef;

  userInfo: any = {};
  config_pgEmployeeList = {
    id: "pg_EmployeeList",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
    
  };
  listLookup: any = {};
  isEditableModel: boolean = false;
  constructor(private salaryService: SalaryService, private componentFactoryResolver: ComponentFactoryResolver,
    private toastrService: ToastrService, private spinnerService: NgxSpinnerService, private addEmployeeService: AddEmployeeService,
    private userContextService: UserContextService, private injector: Injector) {
    this.searchEmployeesRqst.location = '';
    this.searchEmployeesRqst.employeeName = '';
    this.searchEmployeesRqst.employmentType = '';
    this.searchEmployeesRqst.department = '';
    this.searchEmployeesRqst.position = '';
    this.searchEmployeesRqst.employeeName = '';
  }

  ngOnInit(): void {
    this.GetSetupLookUpData();
    // this.getEmployeeSalaries();
    this.showEmployeeSalarySlipList()
  }

  // getEmployeeSalaries() {
    
  //   let model = {
  //     "companyID": this.userContextService.user$._value.companyID,
  //     "location": this.searchEmployeesRqst.location,
  //     "employmentType": this.searchEmployeesRqst.employmentType,
  //     "department": this.searchEmployeesRqst.department,
  //     "position": this.searchEmployeesRqst.position,
  //     "fullName": this.searchEmployeesRqst.employeeName,
  //     "pageIndex": this.config_pgEmployeeList.currentPage - 1,
  //     "pageSize": this.config_pgEmployeeList.itemsPerPage,
  //   };
  //   this.spinnerService.show();
  //   this.salaryService.GetEmployeeSalaries(model).subscribe(data => {
  //     if (data.status) {
  //       this.employeeSalarylist = data.employeeSalarylist;
  //       console.log("salary",this.employeeSalarylist)
  //       this.config_pgEmployeeList.totalItems = data.totalRecords;
  //     }
  //     this.spinnerService.hide();
  //   });
  // }
  delEmployeeSalary(employeeSalarySlipID:number){
    const factory = this.componentFactoryResolver.resolveComponentFactory(DeleteConfirmationComponent);
    const data: any =
    {
      Id: employeeSalarySlipID
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogContainerDelete?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((employeeSalarySlipID: any) => {
      popupRef.destroy();
      if (employeeSalarySlipID) {
        this.deleteSalaryById(employeeSalarySlipID)
      }
    });

  }
  deleteSalaryById(employeeSalarySlipID:any){
    this.spinnerService.show();
    this.salaryService.DeleteEmployeeSalaries(employeeSalarySlipID).subscribe(data => {
      if (data.status) {
        this.toastrService.success("Job has been Deleted");
        this.showEmployeeSalarySlipList()
      }
      this.spinnerService.hide();
    });
  }

  setEmployeeSalaryPopup(action: string = '', model: any = {}) {
    model.action = action;
    model.openfrom = action == 'save' ? 'add-salary' : '';
    const data: any =
    {
      salaryObj: model
    };

    const factory = this.componentFactoryResolver.resolveComponentFactory(AddSalaryComponent);
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });


    const popupRef = factory.create(popupInjector);
    this.dialogContainer?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((status: any) => {
      popupRef.destroy();
      if (status){
        this.showEmployeeSalarySlipList();
      }
      
    });
  }
  
  createImgPath(employeePhoto: any) {
   if(!employeePhoto){
    return 'assets/images/projz/avatar.png';
   }else{
    return environment.ApiUrl + '/' + employeePhoto;
   }
  }

  GetSetupLookUpData() {
    this.spinnerService.show();
    let model: any = {
      companyId: this.userContextService.user$._value.companyID,
      requiredDataList: ['office', 'department', 'team', 'position','et']
    }
    this.addEmployeeService.GetSetupLookUpData(model).subscribe(data => {
    
      if (data.status) {
        this.listLookup = data.lookUpList;
        console.log("setupllook",this.listLookup)
      }
      this.spinnerService.hide();
    });
  }
  openSalaryHistoryPopup(emp:any){
    const factory = this.componentFactoryResolver.resolveComponentFactory(EmployeeSalaryHistoryComponent);
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: emp }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogContainer?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((status: any) => {
      popupRef.destroy();
      
    });
  }
  generatePdf(){
    const documentDefinition = { content: '<html><p>This is a sample PDF printed with pdfMake</p></html>'};
    // pdfMake.createPdf(documentDefinition).download();
  }
  paySalary(employeeSalarySlipID:number){
    this.spinnerService.show();
    
    this.salaryService.SalaryPay(employeeSalarySlipID).subscribe(data => {
      console.log("paySalary",data)
      if (data=true) {
        this.showEmployeeSalarySlipList()
      }

      this.spinnerService.hide();
    });
  }

  showEmployeeSalarySlipList(){
    let model = {
      "companyID": this.userContextService.user$._value.companyID,
      "fullName": this.searchEmployeesRqst.employeeName,
      "pageIndex": this.config_pgEmployeeList.currentPage - 1,
      "pageSize": this.config_pgEmployeeList.itemsPerPage,
    };
    this.spinnerService.show();
    this.salaryService.showEmployeeSalarySlipList(model).subscribe(data => {
      if (data.salarySlipList) {
        this.employeeSalarySliplist = data.salarySlipList;
        console.log("EmployeeSalarySlipList",this.employeeSalarySliplist)
        if(this.employeeSalarySliplist.isPaid=true){
          this.alreadyPaid = true
          this.isPay=false
        }
        this.config_pgEmployeeList.totalItems = data.totalRecords;
      }
      this.spinnerService.hide();
    });
  }
  editabeMode(dept: any) {
    dept.editableMode = true;
  }
  saveChanges(salary: any): void {
    salary.editableMode = false;
    this.isEditableModel = true;
    let model={
      Allowances : salary.allowances,
      EmployeeSalarySlipID :salary.employeeSalarySlipID
};
this.spinnerService.show();
this.salaryService.UpdateSalaryAllowances(model).subscribe(data => {
  console.log("UpdateSalaryAllowances",data)
  // if (data.salarySlipList) {
  //   this.employeeSalarySliplist = data.salarySlipList;
  //   console.log("EmployeeSalarySlipList",this.employeeSalarySliplist)
  //   this.config_pgEmployeeList.totalItems = data.totalRecords;
  // }
  this.toastrService.success("Allowence Updated");
  this.showEmployeeSalarySlipList();
  this.spinnerService.hide();
});
  }

  cancelEdit(): void {
    this.showEmployeeSalarySlipList();
  }
}

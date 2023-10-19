import { Component, ComponentFactoryResolver, EventEmitter, Injector, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../../../services/user-context.service';
import { DepartmentSetupService } from './department-setup.service';
import { DeleteConfirmationComponent } from '../../../../common/delete-confirmation/delete-confirmation.component';
import { AddEmployeeService } from '../../../employees/components/add-employee/add-employee.service';

@Component({
  selector: 'app-setup-department',
  templateUrl: './setup-department.component.html',
  styleUrls: ['./setup-department.component.scss']
})
export class SetupDepartmentComponent {
  filteredOptions: any[] = [];
  selectedOptions: any[] = [];
  showSelectedSkill: boolean = false
  option1: any = 'it';
  option2: any = 'finance';
  option3: any = 'sales';
  options = ['other'];
  ItemShowft: boolean = true;
  ItemShowpt: boolean = true;
  ItemShowint: boolean = true
  isTableShow:boolean=false
  departmentSetup: any[] = [];
  isValid: boolean = true;
  departmentList: any;
  SearchDepartmentModel: any = {};
  @Output()updateevent:EventEmitter<any>=new EventEmitter()
  @ViewChild('deleteContainer', { read: ViewContainerRef }) dialogDeleteContainer?: ViewContainerRef;
  config_pgDepartmentSetupList = {
    id: "pg_DepartmentSetupList",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  listLookup: any = {};
  officeLocationId: number = 0;
  departmentName: string = '';
  isEditableModel: boolean = false;

  constructor(private departmentSetupService: DepartmentSetupService, private userContextService: UserContextService, private injector: Injector,
    private spinnerService: NgxSpinnerService, private componentFactoryResolver: ComponentFactoryResolver, private addEmployeeService: AddEmployeeService,
    private toastrService: ToastrService,) {
    this.setSearchDepartmentModel();
    this.GetSetupLookUpData();
  }

  ngOnInit(): void {
    this.GetDepartmentList();
    this.GetSetupLookUpData()
  }

 //
 removeOption(option: any) {
  this.selectedOptions = this.selectedOptions.filter(o => o !== option);
  console.log(this.selectedOptions)
  if (this.selectedOptions.length <= 0) {
    this.showSelectedSkill = false
  }
  if (option === this.option1) {
    this.ItemShowft = true
  } else if (option === this.option2) {
    this.ItemShowpt = true
  } else if (option === this.option3) {
    this.ItemShowint = true
  }
}

filterOptions() {
  if (this.departmentName) {
    this.filteredOptions = this.options.filter(option =>
      option.toLowerCase().includes(this.departmentName)
    );
  } else {
    this.filteredOptions = [];
  }
}

addOption(option: any = '') {
  
  if (option === this.option1) {
    this.showSelectedSkill = true
    this.ItemShowft = false
  } else if (option === this.option2) {
    this.showSelectedSkill = true
    this.ItemShowpt = false
  } else if (option === this.option3) {
    this.showSelectedSkill = true
    this.ItemShowint = false
  }
  
  if (option && !this.selectedOptions.includes(option)) {
    this.selectedOptions.push(option);
    // this.departmentName=''
    
  }
  else if(this.departmentName && !this.selectedOptions.includes(this.departmentName)) {
    this.selectedOptions.push(this.departmentName)
    this.departmentName=''
  }
  else{
    this.toastrService.error('Already Exist');
  }
  
  
  this.filteredOptions = [];
}

  switchViewTab() {
    this.addDepartment();
  }

  setSearchDepartmentModel() {
    this.SearchDepartmentModel.searchDepartmentName = '';
    this.SearchDepartmentModel.pageIndex = this.config_pgDepartmentSetupList.currentPage - 1;
    this.SearchDepartmentModel.pageSize = this.config_pgDepartmentSetupList.itemsPerPage;
    this.SearchDepartmentModel.companyId = this.userContextService.user$._value.companyID;
  }

  addDepartment() {
    // let model: any[] = [];
    // model = this.selectedOptions;
    // this.departmentSetup.departmentName = model;
    this.FillModel();
    this.validateDepartmentSetup()
    if (this.isValid == true) {
      this.saveDepartmentIntoDatabase();
    }
  }

  saveDepartmentIntoDatabase() {
    this.departmentSetupService.departmentSetup(this.departmentSetup).subscribe(data => {
      this.spinnerService.hide();
      if (data.status) {
        this.toastrService.success(data.msg, '');
        if (this.isValid == true && !this.isEditableModel) {
          this.updateevent.emit('t')
        }
        this.isEditableModel = false;
        this.GetDepartmentList();
      }
      else {
        this.toastrService.error(data.msg, 'Error');
      }
    });
  }

  FillModel() {
    this.departmentSetup = [];
    for (let dep of this.selectedOptions) {
      this.departmentSetup.push({ departmentId: 0, departmentName: dep, companyId: this.userContextService.user$._value.companyID, officeLocationId: this.officeLocationId })
    }
  }

  validateDepartmentSetup() {
    this.isValid = true;
    if (this.officeLocationId === 0) {
      this.isValid = false;
      this.toastrService.error('Please Select Office Location!');
    }
    else if (!this.selectedOptions || this.selectedOptions.length==0) {
      this.isValid = false;
      this.toastrService.error('Please Enter Department Name!');
    } else {
      this.isValid = true;
    }
    return this.isValid;
  }

  GetDepartmentList() {
    this.spinnerService.show();
    this.departmentSetupService.GetDepartmentList(this.SearchDepartmentModel).subscribe(data => {
      console.log("depart",data)
      if(data.departmentList.length>=1){
        this.isTableShow=true
      }else{
        this.isTableShow=false
      }
      this.spinnerService.hide();
      if (data.status) {
        this.departmentList = data.departmentList;
      }
      else {
        this.toastrService.error("Some error occured!", 'Error');
      }
    });

  }

  editabeMode(dept: any) {
    dept.editableMode = true;
  }

  saveChanges(dept: any): void {
    dept.editableMode = false;
    this.isEditableModel = true;
    this.departmentSetup = [];
    this.departmentSetup.push({ departmentId: dept.departmentId, departmentName: dept.departmentName, companyId: this.userContextService.user$._value.companyID, officeLocationId: dept.officeLocationId })
    this.saveDepartmentIntoDatabase();
  }

  cancelEdit(): void {
    this.GetDepartmentList();
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
      this.departmentSetupService.DeleteDepartmentSetup(model).subscribe(data => {
        if (data.status) {
          this.toastrService.success("Record has been deleted.");
          this.GetDepartmentList();
        }
        this.spinnerService.hide();
      });
    }
  }

  GetSetupLookUpData() {
    this.spinnerService.show();
    let model: any = {
      companyId: this.userContextService.user$._value.companyID,
      requiredDataList: ['office']
    }
    this.addEmployeeService.GetSetupLookUpData(model).subscribe(data => {
      if (data.status) {
        this.listLookup = data.lookUpList;
        console.log(this.listLookup)
      }
      this.spinnerService.hide();
    });
  }
}

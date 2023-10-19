import { Component, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef, EventEmitter, Output } from '@angular/core';
import { PositionSetupService } from './position-setup.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../../../services/user-context.service';
import { DeleteConfirmationComponent } from '../../../../common/delete-confirmation/delete-confirmation.component';
import { AddEmployeeService } from '../../../employees/components/add-employee/add-employee.service';

@Component({
  selector: 'app-setup-position',
  templateUrl: './setup-position.component.html',
  styleUrls: ['./setup-position.component.scss']
})
export class SetupPositionComponent {
  filteredOptions: any[] = [];
  selectedOptions: any[] = [];
  showSelectedSkill: boolean = false
  option1: any = 'Creatives';
  option2: any = 'Alpha';
  option3: any = 'Squad';
  options = ['other'];
  ItemShowft: boolean = true;
  ItemShowpt: boolean = true;
  ItemShowint: boolean = true
  isTableShow: boolean = false
  positionSaveRequest: any[] = [];
  isValid: boolean = true;
  positionList: any = [];
  searchPositionGetRequest: any = {};
  @ViewChild('deleteContainer', { read: ViewContainerRef }) dialogDeleteContainer?: ViewContainerRef;
  config_pgPositionSetupList = {
    id: "pg_PositionList",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  listLookup: any = {};
  listDepartment: any = [];
  listTeam: any = [];
  @Output() updateevent: EventEmitter<any> = new EventEmitter();
  officeLocationId: number = 0;
  departmentId: number = 0;
  teamId: number = 0;
  positionName: string = '';
  isEditableModel: boolean = false;

  constructor(private positionSetupService: PositionSetupService, private userContextService: UserContextService, private injector: Injector,
    private spinnerService: NgxSpinnerService, private componentFactoryResolver: ComponentFactoryResolver, private addEmployeeService: AddEmployeeService,
    private toastrService: ToastrService) {
    this.setSearchPositionModel();
  }

  ngOnInit(): void {
    this.GetPositionList();
    this.GetSetupLookUpData();
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
    if (this.positionName) {
      this.filteredOptions = this.options.filter(option =>
        option.toLowerCase().includes(this.positionName)
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
    if (option) {
      this.selectedOptions.push(option);
    }
    if (this.positionName) {
      this.selectedOptions.push(this.positionName);
      this.positionName = ''

    }
    this.filteredOptions = [];
  }

  setSearchPositionModel() {
    this.searchPositionGetRequest.searchPositionName = '';
    this.searchPositionGetRequest.pageIndex = this.config_pgPositionSetupList.currentPage - 1;
    this.searchPositionGetRequest.pageSize = this.config_pgPositionSetupList.itemsPerPage;
    this.searchPositionGetRequest.companyId = this.userContextService.user$._value.companyID;
  }

  addPosition() {
    this.FillModel();
    this.validatePositionSetup()
    if (this.isValid == true) {
      this.savePositionIntoDatabase();
    }
  }

  savePositionIntoDatabase() {
    this.spinnerService.show();
    this.positionSetupService.CreatePosition(this.positionSaveRequest).subscribe(data => {
      this.spinnerService.hide();
      if (data.status) {
        if (this.isValid == true && !this.isEditableModel) {
          this.updateevent.emit('e')
        }
        this.isEditableModel = false;
        this.toastrService.success(data.msg, '');
        this.GetPositionList();
      }
      else {
        this.toastrService.error(data.msg, 'Error');
      }
    });
  }

  FillModel() {
    this.positionSaveRequest = [];
    for (let dep of this.selectedOptions) {
      this.positionSaveRequest.push({ positionId: 0, positionName: dep, companyId: this.userContextService.user$._value.companyID, departmentId: Number(this.departmentId), teamId: Number(this.teamId) })
    }
  }

  validatePositionSetup() {
    this.isValid = true;
    if (!this.selectedOptions || this.selectedOptions.length == 0) {
      this.isValid = false;
      this.toastrService.error('Please Enter Position!');
    } else if (!this.teamId) {
      this.isValid = false;
      this.toastrService.error('Please Select Team!');
    } else if (!this.departmentId) {
      this.isValid = false;
      this.toastrService.error('Please Select Department!');
    } else if (!this.officeLocationId) {
      this.isValid = false;
      this.toastrService.error('Please Select Location!');
    }
    else {
      this.isValid = true;
    }
    return this.isValid;
  }

  GetPositionList() {
    this.spinnerService.show();
    this.positionSetupService.GetPositionList(this.searchPositionGetRequest).subscribe(data => {
      if (data.positionList.length >= 1) {
        this.isTableShow = true
      }
      else {
        this.isTableShow = false
      }
      this.spinnerService.hide();
      if (data.status) {
        this.positionList = data.positionList;
      }
      else {
        this.toastrService.error("Some error occured!", 'Error');
      }
    });

  }

  editabeMode(positionObj: any) {
    positionObj.editableMode = true;
  }

  saveChanges(positionObj: any): void {
    positionObj.editableMode = false;
    this.isEditableModel = true;
    this.positionSaveRequest = [];
    this.positionSaveRequest.push({ positionId: positionObj.positionId, positionName: positionObj.positionName, companyId: this.userContextService.user$._value.companyID, departmentId: 0, teamId: 0 })
    this.savePositionIntoDatabase();

  }

  cancelEdit(): void {
    this.GetPositionList;
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
        this.DeleteTeamSetup(id)
      }
    });
  }

  DeleteTeamSetup(id: any) {
    if (id) {
      let model = {
        id: id
      }
      this.spinnerService.show();
      this.positionSetupService.DeletePositionSetup(model).subscribe(data => {
        if (data.status) {
          this.toastrService.success("Record has been deleted.");
          this.GetPositionList();
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
      }
      this.spinnerService.hide();
    });
  }

  OnOfficeSelectionChange(event: any) {
    const selectedValue = event.target.value;
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
    const companyId = this.userContextService.user$._value.companyID;
    this.addEmployeeService.GetTeamByDepartment(companyId, selectedValue).subscribe(data => {
      if (data.status) {
        this.listTeam = data.lookUpList;
      }
      this.spinnerService.hide();
    });
  }
}

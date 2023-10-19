import { Component, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef, EventEmitter, Output } from '@angular/core';
import { TeamSetupService } from './team-setup.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../../../services/user-context.service';
import { DeleteConfirmationComponent } from '../../../../common/delete-confirmation/delete-confirmation.component';
import { AddEmployeeService } from '../../../employees/components/add-employee/add-employee.service';

@Component({
  selector: 'app-setup-team',
  templateUrl: './setup-team.component.html',
  styleUrls: ['./setup-team.component.scss']
})
export class SetupTeamComponent {
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
  teamSaveRequest: any[] = [];
  isValid: boolean = true;
  teamList: any = [];
  searchTeamGetRequest: any = {};
  @ViewChild('deleteContainer', { read: ViewContainerRef }) dialogDeleteContainer?: ViewContainerRef;
  config_pgTeamSetupList = {
    id: "pg_TeamSetupList",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  listLookup: any = {};
  listDepartment: any = [];
  @Output() updateevent: EventEmitter<any> = new EventEmitter();
  teamName: string = '';
  teamId: number = 0;
  officeId: number = 0;
  departmentId: number = 0;
  isEditableModel: boolean = false;

  constructor(private teamSetupService: TeamSetupService, private userContextService: UserContextService, private injector: Injector,
    private spinnerService: NgxSpinnerService, private componentFactoryResolver: ComponentFactoryResolver, private addEmployeeService: AddEmployeeService,
    private toastrService: ToastrService) {
    this.setSearchTeamModel();
    this.GetSetupLookUpData();

  }

  ngOnInit(): void {
    this.GetTeamList();
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
    if (this.teamName) {
      this.filteredOptions = this.options.filter(option =>
        option.toLowerCase().includes(this.teamName)
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
    if (this.teamName) {
      this.selectedOptions.push(this.teamName);
      this.teamName = '';
    }
    this.filteredOptions = [];
  }

  setSearchTeamModel() {
    this.searchTeamGetRequest.searchTeamName = '';
    this.searchTeamGetRequest.pageIndex = this.config_pgTeamSetupList.currentPage - 1;
    this.searchTeamGetRequest.pageSize = this.config_pgTeamSetupList.itemsPerPage;
    this.searchTeamGetRequest.companyId = this.userContextService.user$._value.companyID;
  }

  addTeam() {
    this.FillModel();
    this.validateTeamSetup()
    if (this.isValid == true) {
      this.saveTeamIntoDatabase();
    }
  }

  saveTeamIntoDatabase() {
    this.spinnerService.show();
    this.teamSetupService.CreateTeam(this.teamSaveRequest).subscribe(data => {
      this.spinnerService.hide();
      if (data.status) {
        this.toastrService.success(data.msg, '');
        if (this.isValid == true && !this.isEditableModel) {
          this.updateevent.emit('p')
        }
        this.isEditableModel = false;
        this.GetTeamList();
      }
      else {
        this.toastrService.error(data.msg, 'Error');
      }
    });
  }

  FillModel() {
    this.teamSaveRequest = [];
    for (let dep of this.selectedOptions) {
      this.teamSaveRequest.push({ teamId: 0, teamName: dep, companyId: this.userContextService.user$._value.companyID, departmentId: Number(this.departmentId), officeId: Number(this.officeId) })
    }
  }

  validateTeamSetup() {
    this.isValid = true;
    if (this.officeId == 0) {
      this.isValid = false;
      this.toastrService.error('Please Select Office Location!');
    }
    else if (this.departmentId == 0) {
      this.isValid = false;
      this.toastrService.error('Please Select Department!');
    }
    else if (!this.selectedOptions || this.selectedOptions.length == 0) {
      this.isValid = false;
      this.toastrService.error('Please Enter TeamName!');
    } else {
      this.isValid = true;
    }
    return this.isValid;
  }

  GetTeamList() {
    this.spinnerService.show();
    this.teamSetupService.GetTeamList(this.searchTeamGetRequest).subscribe(data => {
      console.log(data.teamList)
      if (data.teamList.length >= 1) {
        this.isTableShow = true
      } else {
        this.isTableShow = false
      }
      this.spinnerService.hide();
      if (data.status) {
        this.teamList = data.teamList;
      }
      else {
        this.toastrService.error("Some error occured!", 'Error');
      }
    });

  }

  editabeMode(teamObj: any) {
    teamObj.editableMode = true;
  }

  saveChanges(teamObj: any): void {
    teamObj.editableMode = false;
    this.isEditableModel = true;
    this.teamSaveRequest = [];
    this.teamSaveRequest.push({ teamId: teamObj.teamId, teamName: teamObj.teamName, companyId: this.userContextService.user$._value.companyID, departmentId: teamObj.departmentId, officeId: teamObj.officeId })
    this.saveTeamIntoDatabase();
  }

  cancelEdit(): void {
    this.GetTeamList();
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
      this.teamSetupService.DeleteTeamSetup(model).subscribe(data => {
        if (data.status) {
          this.toastrService.success("Record has been deleted.");
          this.GetTeamList();
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
}

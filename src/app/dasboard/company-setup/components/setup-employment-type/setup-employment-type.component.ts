import {
  Component, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef,
  EventEmitter, Output
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationComponent } from 'src/app/common/delete-confirmation/delete-confirmation.component';
import { UserContextService } from 'src/app/services/user-context.service';
import { SetupEmploymentTypeService } from './setup-employment-type.service';

@Component({
  selector: 'app-setup-employment-type',
  templateUrl: './setup-employment-type.component.html',
  styleUrls: ['./setup-employment-type.component.scss']
})
export class SetupEmploymentTypeComponent {
  currentSelected: {} = {};
  filteredOptions: any[] = [];
  inputValue = '';
  options = ['other'];
  selectedOptions: any[] = [];
  employmentTypeRequest:any = {};
  isValid: boolean = true;
  employmentTypeResponse: any;
  employmentTypeModel: any = {};
  showSelectedSkill: boolean = false
  option1: any = 'full Time';
  option2: any = 'part Time';
  option3: any = 'intern';
  ItemShowft: boolean = true;
  ItemShowpt: boolean = true;
  ItemShowint: boolean = true;
  @ViewChild('deleteContainer', { read: ViewContainerRef }) dialogDeleteContainer?: ViewContainerRef;
  config_pgOfficeSetupList = {
    id: "pg_OfficeSetupList",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0

  };
  @Output() updateevent: EventEmitter<any> = new EventEmitter();
  employmentType: string = '';

  constructor(private employmentTypeservices: SetupEmploymentTypeService, private userContextService: UserContextService, private injector: Injector,
    private spinnerService: NgxSpinnerService, private componentFactoryResolver: ComponentFactoryResolver,
    private toastrService: ToastrService) {
    this.addEmploymentSetup();
    this.setSearchEmploymentLocationModel();

  }

  ngOnInit(): void {
    this.GetEmploymentTypeList();
  }
  switchViewTab(){
    if(this.isValid == true){
      // this.updateevent.emit('p')
    }
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
    if (this.employmentTypeRequest.employmentType) {
      this.filteredOptions = this.options.filter(option =>
        option.toLowerCase().includes(this.employmentTypeRequest.employmentType)
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
      
    }
    else if(this.employmentType && !this.selectedOptions.includes(this.employmentType)) {
      this.selectedOptions.push(this.employmentType);
      this.employmentType=''
    }
    else{
      this.toastrService.error('Already Exist');
    }
    // if (option) {
    //   this.selectedOptions.push(option);
    // }
    // if (this.employmentType) {
    //   this.selectedOptions.push(this.employmentType);
    //   this.employmentType=''

    // }
    this.filteredOptions = [];
  }

  setSearchEmploymentLocationModel() {
    this.employmentTypeModel.searchEmploymentType = '';
    this.employmentTypeModel.pageIndex = this.config_pgOfficeSetupList.currentPage - 1;
    this.employmentTypeModel.pageSize = this.config_pgOfficeSetupList.itemsPerPage;
    this.employmentTypeModel.companyId = this.userContextService.user$._value.companyID;
  }

  addEmploymentSetup() {
    this.employmentTypeRequest.employmentType = [];
    this.employmentTypeRequest.companyId = this.userContextService.user$._value.companyID;
    this.employmentTypeRequest.employmentTypeId = 0;
  }

  addEmploymentType() {
    // this.addOption('');
    let model: any[] = [];
    model = this.selectedOptions;
    this.employmentTypeRequest.employmentType = model;

    this.validateEmploymentTypeSetup()
    if (this.isValid == true) {
      this.spinnerService.show();
      this.employmentTypeservices.CreateEmploymentTypeSetup(this.employmentTypeRequest).subscribe(data => {
        console.log("ddddd",data)
        this.spinnerService.hide();
        if (data.status) {

          this.toastrService.success(data.msg, '');
          this.addEmploymentSetup();
          this.GetEmploymentTypeList();
          this.selectedOptions=[]
        }
        else {
          this.toastrService.error(data.msg, 'Error');
        }
      });
    }
  }

  validateEmploymentTypeSetup() {
    this.isValid = true;
    if (!this.employmentTypeRequest.employmentType || this.employmentTypeRequest.employmentType <=0) {
      this.isValid = false;
      this.toastrService.error('Please Enter Employment Type!');
    } else {
      this.isValid = true;
    }
    return this.isValid;
  }

  GetEmploymentTypeList() {
    this.spinnerService.show();
    this.employmentTypeservices.GetEmploymentTypeList(this.employmentTypeModel).subscribe(data => {
      console.log("pppp",data)
      this.spinnerService.hide();
      if (data.status) {
        this.employmentTypeResponse = data.employmentTypeList;
      }
      else {
        this.toastrService.error("Some error occured!", 'Error');
      }
    });

  }

  editabeMode(t: any) {
    t.editableMode = true;
  }

  saveChanges(obj: any): void {
    obj.editableMode = false;
    this.employmentTypeRequest.employmentType = obj.employmentType;
    this.employmentTypeRequest.employmentTypeId = obj.employmentTypeId;
    this.addEmploymentType();
  }

  cancelEdit(): void {
    this.GetEmploymentTypeList();
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
        this.deleteEmploymentTypeSetup(id)
      }
    });
  }

  deleteEmploymentTypeSetup(id: any) {
    if (id) {
      let model = {
        id: id
      }
      this.spinnerService.show();
      this.employmentTypeservices.DeleteEmploymentTypeSetup(model).subscribe(data => {
        if (data.status) {
          this.toastrService.success("Record has been deleted.");
          this.GetEmploymentTypeList();
        }
        this.spinnerService.hide();
      });
    }
  }
}

import { Component, ComponentFactoryResolver, EventEmitter, Injector, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from 'src/app/services/user-context.service';
import { SetupEmploymentTypeService } from '../setup-employment-type/setup-employment-type.service';
import { ShiftSetupService } from './shift-setup.service';
import { formatDate } from '@angular/common';
import { DeleteConfirmationComponent } from '../../../../common/delete-confirmation/delete-confirmation.component';
@Component({
  selector: 'app-setup-shift-type',
  templateUrl: './setup-shift-type.component.html',
  styleUrls: ['./setup-shift-type.component.scss']
})
export class SetupShiftTypeComponent {
  config_pgDepartmentSetupList = {
    id: "pg_DepartmentSetupList",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  shiftRoutine: number = 0;
  shiftModel: any = {};
  shiftSetup: any[] = []
  employmentTypeResponse: any;
  isValid: boolean = true;
  selectedOptions: any[] = [];
  showSelectedSkill: boolean = false
  employmentTypeRequest: any = {};
  employmentType: string = '';
  isEditableModel: boolean = false;
  SearchShiftModel: any = {};
  isTableShow: boolean = false
  shiftList: any
  companyID: number = 0
  shiftID: number = 0
  @Output() updateevent: EventEmitter<any> = new EventEmitter();
  hourFrom: any;
  hourTo: any;
  @ViewChild('deleteContainer', { read: ViewContainerRef }) dialogDeleteContainer?: ViewContainerRef;

  constructor(private shiftSetupServices: ShiftSetupService, private userContextService: UserContextService, private injector: Injector,
    private spinnerService: NgxSpinnerService, private componentFactoryResolver: ComponentFactoryResolver,
    private toastrService: ToastrService) {
    this.setShiftModel();
    this.setSearchShiftModel();
  }

  ngOnInit(): void {
    this.GetShiftSetupList();
  }

  setShiftModel() {
    this.shiftModel.shiftName = '0';
    this.shiftModel.hourFrom = '';
    this.shiftModel.hourTo = '';
    this.shiftModel.companyId = this.userContextService.user$._value.companyID;
    this.shiftModel.shiftId = 0;
  }

  editabeMode(obj: any) {
    obj.editableMode = true;
  }

  saveChanges(obj: any) {
    if(this.validateTimeFormat(obj.hourFrom)){
      obj.editableMode = false;
      this.isEditableModel = true;
      this.shiftModel = obj;
      this.saveShiftIntoDatabase();
    }
    else{
      this.toastrService.error('Enter Right Format 12:00 PM');
    }
    
  }
  validateTimeFormat(time: any){
    const pattern = /^(0?[1-9]|1[0-2]):[0-5][0-9] [AP]M$/; // pattern for valid time input
    const isValid = pattern.test(time); // check if input matches pattern
    if (!isValid) {
      return false;
    }
    return true;
  }

  cancelEdit() {
    this.GetShiftSetupList();
  }

  deleteConfirmationPopup(id: any) {
    //popup code
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
        this.DeleteShiftSetup(id);
      }
    });
    // end popup
  }

  DeleteShiftSetup(id: any) {
    if (id) {
      this.spinnerService.show();
      this.shiftSetupServices.DeleteShift(id).subscribe(data => {
        if (data.status) {
          this.toastrService.success("Record has been deleted.");
          this.GetShiftSetupList();
        }
        this.spinnerService.hide();
      });
    }
  }

  addShiftType() {
    // this.FillModel();
    this.validateShiftSetup()
    if (this.isValid == true) {
      this.saveShiftIntoDatabase();
    }
  }

  saveShiftIntoDatabase() {
    this.spinnerService.show();
    this.shiftSetupServices.shiftSetup(this.shiftModel).subscribe(data => {
      this.spinnerService.hide();
      if (data.status) {
        this.toastrService.success(data.msg, '');
        this.isEditableModel = false;
        this.setShiftModel();
        this.GetShiftSetupList();
      }
      else {
        this.toastrService.error(data.msg, 'Error');
      }
    });
  }

  setSearchShiftModel() {
    this.SearchShiftModel.searchShift = '';
    this.SearchShiftModel.pageIndex = this.config_pgDepartmentSetupList.currentPage - 1;
    this.SearchShiftModel.pageSize = this.config_pgDepartmentSetupList.itemsPerPage;
    this.SearchShiftModel.companyId = this.userContextService.user$._value.companyID;
  }

  GetShiftSetupList() {
    this.spinnerService.show();
    this.shiftSetupServices.GetShiftList(this.SearchShiftModel).subscribe(data => {
      this.spinnerService.hide();
      if (data.status) {
        this.shiftList = data['shiftList'];
        console.log(this.shiftList)
      }
      else {
        this.toastrService.error("Some error occured!", 'Error',
          {
            timeOut: 3000
          });
      }
    });

  }

  validateShiftSetup() {
    this.isValid = true;
    if (this.shiftModel.shiftName === 0) {
      this.isValid = false;
      this.toastrService.error('Please select shift.!');
    }
    else if (!this.shiftModel.hourFrom) {
      this.isValid = false;
      this.toastrService.error('Please enter the hour from.!');
    }
    else if (!this.shiftModel.hourTo) {
      this.isValid = false;
      this.toastrService.error('Please enter the hour to.!');
    }
    return this.isValid;
  }

  convertToAMPM(time: string): string {
    // Parsing the time string as a Date object
    const date = new Date(`1970-01-01T${time}`);
    // Formatting the date as AM/PM using the formatDate function
    const formattedTime = formatDate(date, 'hh:mm a', 'en-US');
    return formattedTime;
  }

  switchViewTab() {
    if (this.isValid == true) {
      // this.updateevent.emit('p')
    }
  }
  
  // onTimeInputChange(): void {
  //   // this.isValid = this.validateTimeFormat(this.shiftList.hourFrom);
  // }
}

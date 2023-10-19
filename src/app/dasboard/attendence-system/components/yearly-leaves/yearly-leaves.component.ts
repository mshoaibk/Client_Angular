import { Component, ComponentFactoryResolver, Injector, ViewContainerRef,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AddYearlyHolidaysComponent } from 'src/app/common/add-yearly-holidays/add-yearly-holidays.component';
import { AddYearlyHolidaysService } from 'src/app/common/add-yearly-holidays/add-yearly-holidays.service';
import { DeleteConfirmationComponent } from 'src/app/common/delete-confirmation/delete-confirmation.component';
import { UserContextService } from 'src/app/services/user-context.service';
@Component({
  selector: 'app-yearly-leaves',
  templateUrl: './yearly-leaves.component.html',
  styleUrls: ['./yearly-leaves.component.scss']
})
export class YearlyLeavesComponent {
  config_pgDepartmentSetupList = {
    id: "pg_DepartmentSetupList",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  isValid: boolean = true;
  SearchyearlyHolidayModel:any={};
  yearlyHolidayModel:any={};
  yearlyHolidayModelList:any[]=[];
  isEditableModel: boolean = false;
  daysDifference: number | null = null;
  @ViewChild('deleteContainer', { read: ViewContainerRef }) dialogDeleteContainer?: ViewContainerRef;
  @ViewChild('dialogAddYearlyContainer', { read: ViewContainerRef }) dialogAddYearlyContainer?: ViewContainerRef;

  constructor(private formBuilder: FormBuilder,private userContextService: UserContextService,
    private spinnerService: NgxSpinnerService,private toastrService: ToastrService,private service:AddYearlyHolidaysService, private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector) {
    this.setYearlyHolidayModel();
    this.setSearchYearlyHolidayModel()
  }

  ngOnInit(): void {
    this.GetYearlyHolidaysList();
  }
  OpenModelPopup() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(AddYearlyHolidaysComponent);
      const data: any = {};
      const popupInjector = Injector.create({
        providers: [{ provide: 'data', useValue: data }],
        parent: this.injector,
      });
      const popupRef = factory.create(popupInjector);
      this.dialogAddYearlyContainer?.insert(popupRef.hostView);
      popupRef.instance.closed.subscribe((employeeSalaryID: any) => {
      this.GetYearlyHolidaysList();
        popupRef.destroy();
      });
 
}

  setSearchYearlyHolidayModel(){
    this.SearchyearlyHolidayModel.searchYearlyHolidays = '';
    this.SearchyearlyHolidayModel.pageIndex = this.config_pgDepartmentSetupList.currentPage - 1;
    this.SearchyearlyHolidayModel.pageSize = this.config_pgDepartmentSetupList.itemsPerPage;
    this.SearchyearlyHolidayModel.companyId = this.userContextService.user$._value.companyID;
  }
  setYearlyHolidayModel(){
    this.yearlyHolidayModel.yearlyHolidaysId= 0; 
    this.yearlyHolidayModel.fromDate= new Date();
    this.yearlyHolidayModel.toDate= new Date();
    this.yearlyHolidayModel.yearlyHolidaysName="";
    this.yearlyHolidayModel.numberOfDays=0;
    this.yearlyHolidayModel.companyId=this.userContextService.user$._value.companyID;
  }
  setYearlyHolidayModelForSave(obj:any){
    this.yearlyHolidayModel.yearlyHolidaysId= obj.yearlyHolidaysId;
    this.yearlyHolidayModel.fromDate= obj.fromDate;
    this.yearlyHolidayModel.toDate= obj.toDate;
    this.yearlyHolidayModel.yearlyHolidaysName=obj.yearlyHolidaysName;
    this.yearlyHolidayModel.numberOfDays=this.daysDifference;
    this.yearlyHolidayModel.companyId=this.userContextService.user$._value.companyID;
  }
  //get data for list
  GetYearlyHolidaysList() {
    this.spinnerService.show();
    this.service.GetYearlyHolidays(this.SearchyearlyHolidayModel).subscribe(data => {
      this.spinnerService.hide();
      if (data.status) {
        console.log(data);
        this.yearlyHolidayModelList = data['holidaysList'];
        console.log("ssssssaa",this.yearlyHolidayModelList);

      }
      else {
        this.toastrService.error("Some error occured!", 'Error',
          {
            timeOut: 3000
          });
      }
    });

  }
  editabeMode(obj: any) {
    obj.editableMode = true;
  }
  saveChanges(obj: any) {
    obj.editableMode = false;
    this.isEditableModel = true;
    this.setYearlyHolidayModelForSave(obj) ;
    this.saveYearlyHoliday();
  }

  saveYearlyHoliday(){
    //check for validations
      this.calculateDays();
      this.service.SaveYearlyHolidays(this.yearlyHolidayModel).subscribe(res=>{
        if(res.status ==true){
          console.log(res.msg);
          this.toastrService.success(res.msg);
         this.setYearlyHolidayModel();
         this.GetYearlyHolidaysList();
         
        }
        else{
          this.toastrService.error(res.msg);
        }
        
      });
    
    


  }
  calculateDays() {
    const from = new Date(this.yearlyHolidayModel.fromDate);
    const to = new Date(this.yearlyHolidayModel.toDate);

    if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
      const timeDifference = to.getTime() - from.getTime();
      const dayDifference = timeDifference / (1000 * 3600 * 24);
      this.daysDifference = Math.abs(Math.floor(dayDifference));
      this.yearlyHolidayModel.numberOfDays = this.daysDifference;
    } else {
      // Invalid dates, clear the result
      this.daysDifference = null;
    }
  }
  cancelEdit() {
    this.GetYearlyHolidaysList();
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
       this.DeleteYearlyHolidays(id);
      }
    });
 
  }
  DeleteYearlyHolidays(id:any){
    if (id) {
      this.spinnerService.show();
      this.service.DeleteYearlyHolidays(id).subscribe(data => {
        if (data.status) {
          this.toastrService.success("Record has been deleted.");
          this.GetYearlyHolidaysList();
        }
        this.spinnerService.hide();
      });
    }

  }

  DeleteShiftSetup(id: any) {
    if (id) {
      this.spinnerService.show();
      this.service.DeleteYearlyHolidays(id).subscribe(data => {
        if (data.status) {
          this.toastrService.success("Record has been deleted.");
          this.GetYearlyHolidaysList();
        }
        this.spinnerService.hide();
      });
    }

  }
}

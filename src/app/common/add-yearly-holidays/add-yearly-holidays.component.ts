import { Component, ComponentFactoryResolver, Inject, Injector,Output,EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { EditCompanyProfileService } from '../edit-company-profile/edit-company-profile.service';
import { ToastrService } from 'ngx-toastr';
import { ConstantsService } from 'src/app/services/constants.service';
import { HttpClient } from '@angular/common/http';
import { AddYearlyHolidaysService } from './add-yearly-holidays.service';
import { UserContextService } from 'src/app/services/user-context.service';

@Component({
  selector: 'app-add-yearly-holidays',
  templateUrl: './add-yearly-holidays.component.html',
  styleUrls: ['./add-yearly-holidays.component.scss']
})
export class AddYearlyHolidaysComponent {
yearlyHolidayModel :any = {};
daysDifference: number | null = null;
@Output() closed = new EventEmitter();
constructor(private spinnerService: NgxSpinnerService, private editCompanyProfileService: EditCompanyProfileService,
  private toastrService: ToastrService, @Inject('data') public data: any, private injector: Injector,
  private componentFactoryResolver: ComponentFactoryResolver, private Constants: ConstantsService, private httpclient: HttpClient,private service:AddYearlyHolidaysService,private userContextService: UserContextService){
    this.setYearlyHolidayModel();
  }

  setYearlyHolidayModel(){
    this.yearlyHolidayModel.fromDate= new Date();
    this.yearlyHolidayModel.toDate= new Date();
    this.yearlyHolidayModel.yearlyHolidaysName="";
    this.yearlyHolidayModel.numberOfDays=0;
    this.yearlyHolidayModel.companyId=this.userContextService.user$._value.companyID;
  }
  saveYearlyHoliday(){
    //check for validations

    if(this.yearlyHolidayModelIsValid()){

      this.calculateDays();
      this.service.SaveYearlyHolidays(this.yearlyHolidayModel).subscribe(res=>{
        if(res.status ==true){
          console.log(res.msg);
          this.toastrService.success(res.msg);
         this.setYearlyHolidayModel();
         this.closed.emit(true);
        }
        else{
          this.toastrService.error(res.msg);
        }
        
      });
    }
    


  }
  yearlyHolidayModelIsValid(){
    if(this.yearlyHolidayModel.fromDate== new Date()){
      this.toastrService.error("Please enter from date");
      return false;
    }
    // else if for other conditions . . .
    if(this.yearlyHolidayModel.toDate== new Date()){
      this.toastrService.error("Please enter to date");
      return false;
    }
    if(this.yearlyHolidayModel.yearlyHolidaysName==""){
      this.toastrService.error("Name field cant be empty");
      return false;
    }
    return true;

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
  CLoseYearlyModal(){
    this.closed.emit(true);
  }
}

import { Component, EventEmitter, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { WeeklyLeavesService } from '../../dasboard/attendence-system/components/weekly-leaves/weekly-leaves.service';
import { UserContextService } from '../../services/user-context.service';
import { AddWeeklyHolidayService } from './add-weekly-holiday.service';

@Component({
  selector: 'app-add-weekly-holiday',
  templateUrl: './add-weekly-holiday.component.html',
  styleUrls: ['./add-weekly-holiday.component.scss']
})
export class AddWeeklyHolidayComponent {
  days: { holidays: string, checked: boolean }[] = [
    { holidays: 'Monday', checked: false },
    { holidays: 'Tuesday', checked: false },
    { holidays: 'Wednesday', checked: false },
    { holidays: 'Thursday', checked: false },
    { holidays: 'Friday', checked: false },
    { holidays: 'Saturday',checked: false },
    { holidays: 'Sunday', checked: false }
  ];
  @Output() closed = new EventEmitter();

  constructor(private toastrService: ToastrService, private spinnerService: NgxSpinnerService, private addWeeklyHolidayService: AddWeeklyHolidayService,
    private userContextService: UserContextService, private weeklyLeavesService: WeeklyLeavesService) {
    this.GetWeeklyHolidaysByCompId();
  }

  SaveWeekly() {
    if (this.days.filter(x => x.checked).length === 0) {
      this.toastrService.error("Please select day.");
    }
    else {
      let model = {
        weeklyholidaysId: 0,
        companyId: this.userContextService.user$._value.companyID,
        holidays: this.days.filter(x => x.checked)
      }
      this.spinnerService.show();
      this.addWeeklyHolidayService.SaveWeekly(model).subscribe(data => {
        if (data.status) {
          this.toastrService.success("Weekly holidays Added Successfully.", 'Success');
          this.closed.emit(true);
        }
        this.spinnerService.hide();
      });
    }
  }

  toggleDayChecked(index: number) {
    this.days[index].checked = !this.days[index].checked;
  }

  ClosePopup() {
    this.closed.emit(true);
  }

  GetWeeklyHolidaysByCompId() {
    this.spinnerService.show();
    this.weeklyLeavesService.GetWeeklyHolidaysByCompId(this.userContextService.user$._value.companyID).subscribe(data => {
      if (data.status) {
        let listModel:any[] = data.holidaysList.result;
        //for (let p of this.days) {
        //  if (p.holidays=='')
        //}
        this.days.forEach(day => {
          day.checked = listModel.some(item => item.holidays === day.holidays);
        });
      }
      this.spinnerService.hide();
    });
  }
}

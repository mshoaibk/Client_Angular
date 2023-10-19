import { DatePipe } from '@angular/common';
import { Component, ComponentFactoryResolver, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AttendanceDetailService } from '../attendance-detail/attendance-detail.service';
import { ConfirmPopupComponent } from '../../../../common/confirm-popup/confirm-popup.component';
import { AddAttendanceComponent } from '../../../../common/add-attendance/add-attendance.component';

@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.component.html',
  styleUrls: ['./attendance-detail.component.scss']
})
export class AttendanceDetailComponent {
  monthValue: number = 0;
  yearValue: number = 0;
  dayValue: number = 0;
  public weekDaysName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public weeks: Array<Array<any>> = [];
  years: number[] = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];
  showCalendarView: any[] = [];
  showLeaveRequestCalendarView: any[] = [];
  employeeId: any = '';
  employeeName: any = '';
  joiningDate: any = '';
  currentDay: number = 0;
  @ViewChild('attendanceContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;
  @ViewChild('deletePopup', { read: ViewContainerRef }) deletePopup?: ViewContainerRef;


  constructor(private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector,
    private route: ActivatedRoute, private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService, private attendanceDetailService: AttendanceDetailService,
    private sanitizer: DomSanitizer, private datePipe: DatePipe) {
    this.route.params.subscribe(params => {
      let empDetail: any = {};
      empDetail = JSON.parse(atob(params['id']));
      this.employeeId = empDetail['employeeId'];
      this.employeeName = empDetail['employeeName'];
    });
  }

  ngOnInit(): void {
    this.monthValue = new Date().getMonth() + 1;
    this.yearValue = new Date().getFullYear();
    this.currentDay = new Date().getDate();
    this.getAttendanceCalendarView();
  }

  onChangeDateFilter(event: any, type: any) {
    var date: Date = new Date();
    const passNumber: number = Number(event.target.value);
    if (type == 'y') {
      date = new Date(passNumber, date.getMonth(), 1);
    }
    else {
      date = new Date(date.getFullYear(), passNumber - 1, 1);
    }
    this.getAttendanceCalendarView();
  }

  getAttendanceCalendarView() {
    let model = {
      "employeeId": this.employeeId,
      "searchedMonth": this.monthValue,
      "searchedYear": this.yearValue
    };
    this.spinnerService.show();
    this.attendanceDetailService.GetAttendanceCalendarView(model).subscribe(data => {
      if (data.status && data.showCalendarView) {
        console.log("attendence",data.showCalendarView.calendarDay)
        this.showCalendarView = data.showCalendarView.calendarDay;
        this.employeeName = data.showCalendarView.employeeName;
        this.joiningDate = data.showCalendarView.joiningDate;
        const yearJoin: any = this.datePipe.transform(this.joiningDate, 'yyyy');
        // Loop through the range and add each year to the array
        for (let year = yearJoin; year <= 2050; year++) {
          this.years.push(year);
        }
        this.dayValue = new Date().getDate();
      }
      this.spinnerService.hide();
    });
  }

  checkAttendanceTime(day: any) {
    let model: any = this.showCalendarView.filter((event) => event.attendanceDateNum === day &&
      event.attendanceYear == this.yearValue && event.attendanceMonth == this.monthValue);
    const firstOrDefault = model.find(() => true);
    if (firstOrDefault && firstOrDefault.checkedIn && !firstOrDefault.checkedOut) {
      return firstOrDefault.checkedIn;
    }
    else if (firstOrDefault && firstOrDefault.checkedIn && firstOrDefault.checkedOut) {
      return firstOrDefault.checkedIn + '-' + firstOrDefault.checkedOut;
    }
    return '';
  }

  checkFullDay(day: any) {
    let model: any = this.showLeaveRequestCalendarView.filter((event) => event.leaveStartDateNum === day &&
      event.leaveStartYear == this.yearValue && event.leaveStartMonth == this.monthValue);
    const firstOrDefault = model.find(() => true);
    if (firstOrDefault && firstOrDefault.leaveDuration == 'full-day') {
      const dateStringStart = firstOrDefault.leaveStartDate;
      const dateStart = new Date(dateStringStart);
      const formattedDateStart = dateStart.toLocaleDateString();

      const dateStringEnd = firstOrDefault.leaveEndDate;
      const dateEnd = new Date(dateStringEnd);
      const formattedDateEnd = dateEnd.toLocaleDateString();
      return 'Full Day (' + formattedDateStart + '-' + formattedDateEnd + ')';
    }
    return '';
  }

  checkHalfDay(day: any) {
    let model: any = this.showLeaveRequestCalendarView.filter((event) => event.leaveStartDateNum === day &&
      event.leaveStartYear == this.yearValue && event.leaveStartMonth == this.monthValue);
    const firstOrDefault = model.find(() => true);
    if (firstOrDefault && firstOrDefault.leaveDuration == 'half-day') {
      return 'Half Day (' + firstOrDefault.leaveTimeFrom + '-' + firstOrDefault.leaveTimeTo + ')';
    }
    return '';
  }

  checkShortLeave(day: any) {
    let model: any = this.showLeaveRequestCalendarView.filter((event) => event.leaveStartDateNum === day &&
      event.leaveStartYear == this.yearValue && event.leaveStartMonth == this.monthValue);
    const firstOrDefault = model.find(() => true);
    if (firstOrDefault && firstOrDefault.leaveDuration == 'short-leave') {
      return 'Short Leave (' + firstOrDefault.leaveTimeFrom + '-' + firstOrDefault.leaveTimeTo + ')';
    }
    return '';
  }

  CheckDate(day: string): boolean {
    if (day) {
      const selectedDate = new Date(2023, this.monthValue - 1, Number(day));
      const currentDate = new Date();
      if (currentDate.getTime() > selectedDate.getTime()) {
        return true;
      }
    }
    return false;
  }

  deleteAttendancePopup(day: number) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(ConfirmPopupComponent);
    const data: any =
    {
      header: 'Delete',
      msg: 'Are you sure you want to delete?',
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.deletePopup?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((status: any) => {
      popupRef.destroy();
      if (status) {
        this.deleteAttendanceLeaveRecord(day);
      }
    });
  }

  deleteAttendanceLeaveRecord(day: number) {
    let model = {
      id: day ? day : null
    }
    if (model.id) {
      this.spinnerService.show();
      this.attendanceDetailService.DeleteAttendanceLeaveRecord(model).subscribe(data => {
        if (data.status) {
          this.toastrService.success("Record has been deleted.");
          this.getAttendanceCalendarView();
        }
        this.spinnerService.hide();
      });
    }
  }

  addAttendancePopup(day: any) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(AddAttendanceComponent);
    let model: any = this.showCalendarView.filter((event) => event.attendanceDateNum === day);
    const firstOrDefault = model.find(() => true);
    const data: any =
    {
      day: day,
      year: this.yearValue,
      month: this.monthValue,
      attendanceModel: firstOrDefault,
      leaveModel: null,
      employeeId: this.employeeId
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogContainer?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((status: any) => {
      popupRef.destroy();
      if (status) {
        this.getAttendanceCalendarView();
      }
    });
  }

}

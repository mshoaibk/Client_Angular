import { formatDate } from '@angular/common';
import { Component, EventEmitter, Inject, Injector, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../services/user-context.service';
import { AddAttendanceService } from './add-attendance.service';

@Component({
  selector: 'app-add-attendance',
  templateUrl: './add-attendance.component.html',
  styleUrls: ['./add-attendance.component.scss']
})
export class AddAttendanceComponent {
  tabNumber: number = 1;
  attendanceModel: any = {};
  leaveType: string = 'full-day';
  checkedIn: string = '';
  checkedOut: string = '';
  leaveTimeFrom: string = '';
  leaveTimeTo: string = '';
  @Output() closed = new EventEmitter();
  isDisableAttendaceSave: boolean = false;

  constructor(@Inject('data') public data: any, private injector: Injector, private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService, private addAttendanceService: AddAttendanceService,
    private userContextService: UserContextService) {
    this.setBasicAttendanceModel();
    if (this.data && this.data.day && this.data.day.employeeAttendanceID)
      this.setUpdateAttendanceModel();
    else
      this.setAttendanceModel();
  }

  setBasicAttendanceModel() {
    this.attendanceModel.companyID = this.userContextService.user$._value.companyID;
    this.attendanceModel.employeeId = this.data.employeeId;
    const day: number = this.data.day.attendanceDateNum;
    const month: number = this.data.month;
    const year: number = this.data.year;
    const selectedDate = new Date(year, month - 1, day);
    this.attendanceModel.attendanceDate = selectedDate;
    if (new Date().getTime() < selectedDate.getTime()) {
      this.isDisableAttendaceSave = true;
    }
    this.attendanceModel.action = 'save';
  }

  setUpdateAttendanceModel() {
    this.attendanceModel.checkedIn = this.data.day.checkedIn;
    this.attendanceModel.checkedOut = this.data.day.checkedOut;
    this.attendanceModel.action = 'update';
    this.attendanceModel.employeeAttendanceID = this.data.day.employeeAttendanceID;
  }

  setAttendanceModel() {
    this.attendanceModel.checkedIn = this.checkedIn ? this.checkedIn : null;
    this.attendanceModel.checkedOut = this.checkedOut ? this.checkedOut : null;
    this.attendanceModel.approvalStatus = 'Approved';
    this.attendanceModel.comment = 'Attendace added.';
    this.attendanceModel.attendanceStatus = 'Present';
  }

  setLeaveModel(settingType: any = 'tabchange') {
    this.attendanceModel.checkedIn = this.leaveType == 'full-day' ? null : this.leaveTimeFrom;
    this.attendanceModel.checkedOut = this.leaveType == 'full-day' ? null : this.leaveTimeTo;
    if (settingType == 'tabchange') {
      this.attendanceModel.leaveDuration = 'full-day';
      this.attendanceModel.leaveType = 'Vacation';
      this.attendanceModel.comment = '';
    }
    const formattedDate = new Date(this.attendanceModel.attendanceDate).toLocaleDateString('en-CA');
    this.attendanceModel.leaveStartDate = formattedDate;
    this.attendanceModel.approvalStatus = 'Pending';
    this.attendanceModel.attendanceStatus = this.attendanceModel.leaveDuration;
  }

  closeAttendanceForm() {
    this.closed.emit(false);
  }

  addAttendance(tab: number = 1) {
    if (tab == 1) {
      this.setAttendanceModel();
      if (!this.validateForm()) {
        return;
      }
    }
    else {
      this.setLeaveModel('saving');
      if (!this.validateLeaveForm()) {
        return;
      }
    }
    this.AddAttendanceSystem();
  }

  validateForm() {
    if (!this.attendanceModel.attendanceDate) {
      this.toastrService.error('Date is not filled.');
      return false;
    }
    else if (!this.attendanceModel.checkedIn) {
      this.toastrService.error('Enter Checked In time.');
      return false;
    }
    else if (this.attendanceModel.checkedIn && !this.validateTime(this.attendanceModel.checkedIn)) {
      this.toastrService.error('Please enter the time in the correct format: 09:00 AM.');
      return false;
    }
    else if (this.attendanceModel.checkedOut && !this.validateTime(this.attendanceModel.checkedOut)) {
      this.toastrService.error('Please enter the time in the correct format: 04:00 AM.');
      return false;
    }
    return true;
  }

  validateTime(time: any) {
    const pattern = /^(0?[1-9]|1[0-2]):[0-5][0-9] [AP]M$/; // pattern for valid time input
    const isValid = pattern.test(time); // check if input matches pattern
    if (!isValid) {
      return false;
    }
    return true;
  }

  validateLeaveForm() {
    if (!this.attendanceModel.leaveDuration) {
      this.toastrService.error('Select leave duration.');
      return false;
    }
    else if (!this.attendanceModel.leaveType) {
      this.toastrService.error('Select leave type.');
      return false;
    }
    else if (this.attendanceModel.leaveDuration == 'full-day' && this.attendanceModel.leaveStartDate > this.attendanceModel.leaveEndDate) {
      this.toastrService.error('Start date cannot be greater than end date');
      return false;
    }
    else if (['half-day', 'short-leave'].includes(this.attendanceModel.leaveDuration) && !this.attendanceModel.checkedIn) {
      this.toastrService.error('Enter a time from.');
      return false;
    }
    else if (['half-day', 'short-leave'].includes(this.attendanceModel.leaveDuration) && !this.attendanceModel.checkedOut) {
      this.toastrService.error('Enter a time to.');
      return false;
    }
    else if (['half-day', 'short-leave'].includes(this.attendanceModel.leaveDuration) && !this.validateTime(this.attendanceModel.checkedIn)) {
      this.toastrService.error('Please enter the time in the correct format: 02:00 PM.');
      return false;
    }
    else if (['half-day', 'short-leave'].includes(this.attendanceModel.leaveDuration) && !this.validateTime(this.attendanceModel.checkedOut)) {
      this.toastrService.error('Please enter the time in the correct format: 06:00 PM.');
      return false;
    }
    return true;
  }

  tabChangeEvent(tabNum: number) {
    this.tabNumber = tabNum;
    if (tabNum == 1) {
      if (this.data && this.data.day && this.data.day.action === 'update')
        this.setUpdateAttendanceModel();
      else
        this.setAttendanceModel();
    }
    else {
      this.setLeaveModel('tabchange');
    }
  }

  convertToAMPM(time: string): string {
    // Parsing the time string as a Date object
    const date = new Date(`1970-01-01T${time}`);
    // Formatting the date as AM/PM using the formatDate function
    const formattedTime = formatDate(date, 'hh:mm a', 'en-US');
    return formattedTime;
  }

  AddAttendanceSystem() {
    this.spinnerService.show();
    //this.attendanceModel.attendanceDate = new Date(Date.parse(this.attendanceModel.attendanceDate));
    this.addAttendanceService.AddAttendance(this.attendanceModel).subscribe(data => {
      if (data.status) {
        this.toastrService.success("Attendance Added successfully.", 'Success');
        this.closed.emit(true);
      }
      this.spinnerService.hide();
    });
  }
}

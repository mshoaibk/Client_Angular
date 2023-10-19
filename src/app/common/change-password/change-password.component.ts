import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../services/user-context.service';
import { ChangePasswordService } from '../change-password/change-password.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  changePassword: any = {};
  @Output() closed = new EventEmitter();
  showCurrentPassword: boolean = false;
  showChangedPassword: boolean = false;
  showReenterPassword: boolean = false;
  showMismacthError : boolean = false;

  constructor(private spinnerService: NgxSpinnerService, private toastrService: ToastrService, @Inject('data') public data: any,
    private changePasswordService: ChangePasswordService, private userContextService: UserContextService) {

  }

  closeProfile() {
    this.closed.emit();
  }

  togglePasswordVisibility(pwdParam: any = 'current') {
    if (pwdParam == 'current')
      this.showCurrentPassword = !this.showCurrentPassword;
      if (pwdParam == 'changed')
      this.showChangedPassword = !this.showChangedPassword;

      if(pwdParam == 'reenter')
      this.showReenterPassword = !this.showReenterPassword;
  }

  UpdatePassword() {
    debugger;
    if(this.changePassword.newPassword == this.changePassword.reEnterNewPassword){
      let model = {
        userId: this.userContextService.user$._value.id,
        currentPasswordInput: this.changePassword.currentPassword,
        newPasswordInput: this.changePassword.newPassword
      }
      this.changePasswordService.UpdatePassword(model).subscribe(data => {
        if (data.status) {
          this.toastrService.success(data.message);
          this.closed.emit();
        }
        else {
          this.toastrService.error(data.message);
        }
        this.spinnerService.hide();
      });
      this.spinnerService.hide();
    } else{
      this.showMismacthError = true;
    }
    
  }
}

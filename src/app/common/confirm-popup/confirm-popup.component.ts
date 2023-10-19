import { Component, EventEmitter, Inject, Injector, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../services/user-context.service';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent {
  @Output() closed = new EventEmitter();

  constructor(@Inject('data') public data: any, private injector: Injector, private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService,private userContextService: UserContextService) {
  }

  closePopup() {
    this.closed.emit(false);
  }

  confirmed() {
    this.closed.emit(true);
  }
}

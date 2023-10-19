import { Component, EventEmitter, Inject, Injector, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent {
  @Output() closed = new EventEmitter();

  constructor(@Inject('data') public data: any, private injector: Injector) {
  }

  ClosePopup(param: boolean) {
    if (!param)
      this.closed.emit();
    else
      this.closed.emit(this.data.Id);
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadFileComponent } from '../common/upload-file/upload-file.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteConfirmationComponent } from '../../app/common/delete-confirmation/delete-confirmation.component';
import { FilterPipe } from '../custom-pipes/filter.pipe';

@NgModule({
  declarations: [UploadFileComponent, DeleteConfirmationComponent, FilterPipe],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
  ],
  exports: [NgxPaginationModule, FilterPipe],
  entryComponents: [DeleteConfirmationComponent, UploadFileComponent]
})
export class SharedModule { }

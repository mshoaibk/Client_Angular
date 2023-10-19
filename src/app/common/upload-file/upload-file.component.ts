import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injector, Input } from '@angular/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ConstantsService, Methods } from '../../services/constants.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  progress: number = 0;
  fileName: string = '';
  pathImage: any = '';
  uploadFrom: string = '';
  fileAllowed: string[] = [];
  @Output() closed = new EventEmitter();
  acceptFormats: string = "image/*"; // Default value
  formData: any;

  constructor(private http: HttpClient, private Constants: ConstantsService, private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService, @Inject('data') public data: any, private injector: Injector) {
    if (this.data) {
      this.uploadFrom = this.data.uploadFrom;
      this.fileAllowed = this.data.fileAllowed;
      this.acceptFormats = this.data.acceptFormats;
    }
  }

  ngOnInit(): void {
  }

  uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    if (!Methods.validateFileFormat(fileToUpload, this.fileAllowed)) {
      if (this.uploadFrom == 'resume')
        this.toastrService.error('Invalid file format. Only PDF and Word files are allowed..');
      else if (this.uploadFrom == 'company_logo')
        this.toastrService.error('Invalid file format. Only Images are allowed..');
      return;
    }
    else {
      this.formData = new FormData();
      this.fileName = fileToUpload.name;
      this.formData.append('file', fileToUpload, fileToUpload.name);
      
    }
  }

  closeUpload() {
    this.closed.emit();
  }

  saveUploadedFiles() {
    if (!this.formData) {
      this.toastrService.error('Please select or upload a valid file.');
      return;
    }
    this.spinnerService.show();
    let url = this.Constants.urlUpload;
    if (this.uploadFrom == 'resume') {
      url = this.Constants.urlUploadResume;
    }
    this.http.post(url, this.formData, { reportProgress: true, observe: 'events' })
      .subscribe({
        next: (event: any) => {
          this.spinnerService.hide();
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round(100 * event.loaded / event.total);
          else if (event.type === HttpEventType.Response) {
            this.pathImage = environment.ApiUrl + "/" + event.body.dbPath;
            let model = {
              filePath: event.body.dbPath,
              fileName: this.fileName,
              completeFilePath: this.pathImage
            }
            this.closed.emit(model);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.spinnerService.hide(); console.log(err)
        }
      });
  }
}

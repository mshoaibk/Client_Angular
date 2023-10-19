import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, ComponentFactoryResolver, EventEmitter, Inject, Injector, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ConstantsService } from '../../services/constants.service';
import { UserContextService } from '../../services/user-context.service';
import { UploadFileComponent } from '../upload-file/upload-file.component';
import { AddAnnouncementService } from './add-announcement.service';

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrls: ['./add-announcement.component.scss']
})
export class AddAnnouncementComponent {
  announcementModel: any = {};
  descriptionBody: any;
  @Output() closed = new EventEmitter();
  today: string = '';
  uplodedFileUrl: string = '';
  @ViewChild('dialogFileUploadContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;
  dummyImage: boolean = true;
  fileUpload: File = new File([], 'default-filename'); // Initialize the FileUpload variable
  acceptFiles = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']

  constructor(private addAnnouncementService: AddAnnouncementService, @Inject('data') public data: any, private injector: Injector,
    private toastrService: ToastrService, private spinnerService: NgxSpinnerService, private httpclient: HttpClient, private Constants: ConstantsService,
    private userContextService: UserContextService, private componentFactoryResolver: ComponentFactoryResolver) {
    if (this.data.getCompanyAnnouncement && this.data.getCompanyAnnouncement.action == 'update') {
      this.announcementModel = this.data.getCompanyAnnouncement;
      this.descriptionBody = this.data.getCompanyAnnouncement.description ? this.data.getCompanyAnnouncement.description : '';
      this.announcementModel.eventDate = this.data.getCompanyAnnouncement.eventDate ? new Date(this.data.getCompanyAnnouncement.eventDate) : '';
      this.announcementModel.eventDate = this.announcementModel.eventDate.toISOString().split('T')[0];
      this.uplodedFileUrl = this.data.getCompanyAnnouncement.featurePhoto ? environment.ApiUrl + '/' + this.data.getCompanyAnnouncement.featurePhoto : 'assets/images/projz/avatar.png';
    }
    else {
      this.setAnnouncementModel();
    }
  }

  OnDescriptionContentChanged(content: any) {
    this.announcementModel.description = content.html;
  }

  closeForm() {
    this.closed.emit(false);
  }

  setAnnouncementModel() {
    this.announcementModel.featureImage = '';
    this.announcementModel.eventTitle = '';
    this.announcementModel.eventDate = '';
    this.announcementModel.eventTime = '';
    this.announcementModel.description = '';
    this.announcementModel.companyId = this.userContextService.user$._value.companyID;
    this.uplodedFileUrl = 'assets/images/projz/avatar.png';
  }

  SaveCompanyAnnouncement() {
    if (this.validateAnnouncement()) {
      const formData = new FormData();
      for (const key of Object.keys(this.announcementModel)) {
        const value = this.announcementModel[key];
        formData.append(key, value);
      }
      formData.append("announcementFeaturePhoto", this.fileUpload)
      this.spinnerService.show();
      this.httpclient.post(this.Constants.urlSaveCompanyAnnouncement, formData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          //this.progress = Math.round((100 * event.loaded) / event.total);
        }

        if (event.type === HttpEventType.Response) {
          this.toastrService.success("Announcement Added successfully.", 'Success');
          this.closed.emit(true);
        }
        this.spinnerService.hide();
      });

    }
  }

  validateAnnouncement() {
    if (!this.announcementModel.eventTitle) {
      this.toastrService.error('Enter event title.');
      return false;
    }
    if (this.announcementModel.eventTime && !this.validateTime()) {
      this.toastrService.error('Enter time is not in a valid format.');
      return false;
    }
    return true;

  }

  validateTime() {
    // const pattern = /^(0?[1-9]|1[0-2]):[0-5][0-9] [AP]M$/; // pattern for valid time input
    const pattern = /((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/; // pattern for valid time input
    const isValid = pattern.test(this.announcementModel.eventTime); // check if input matches pattern
    if (!isValid) {
      return false;
    }
    return true;
  }

  removeUploadedPhoto() {
    this.announcementModel.featureImage = '';
    this.uplodedFileUrl = 'assets/images/projz/avatar.png';
  }

  showPreview() {
    if (this.announcementModel.featureImage) {
      window.open(environment.ApiUrl + '/' + this.announcementModel.featureImage, '_blank');
    }
  }

  openFileUploadModal(event: any) {
    this.fileUpload = event?.target?.files[0] || new File([], 'default-filename');
    this.uplodedFileUrl = URL.createObjectURL(event.target.files[0]);
    this.dummyImage = false;
  }
}

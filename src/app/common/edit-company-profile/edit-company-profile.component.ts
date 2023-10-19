import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Inject, ComponentFactoryResolver, ViewContainerRef, Injector,ViewChild, Input, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ConstantsService } from '../../services/constants.service';
import { EditCompanyProfileService } from '../edit-company-profile/edit-company-profile.service';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { UploadFileComponent } from '../upload-file/upload-file.component';

@Component({
  selector: 'app-edit-company-profile',
  templateUrl: './edit-company-profile.component.html',
  styleUrls: ['./edit-company-profile.component.scss']
})
export class EditCompanyProfileComponent {
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  TooltipLabel = { Name : "name",
  Iso2 : "iso2"};
  preferredCountries: CountryISO[] = [CountryISO.Qatar];
  acceptFiles=['.jpg', '.jpeg', '.png', '.gif', '.bmp']
  profileEditRqst: any = {};
  response: any = { dbPath: '' };
  placeholderLabel = "Upload Company Logo";
  @Output() closed = new EventEmitter();
  uplodedFileUrl: string = '';
  @ViewChild('dialogFileUploadContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;
  fileUpload: File = new File([], 'default-filename'); // Initialize the FileUpload variable
  dummyImage: boolean = true;

  constructor(private spinnerService: NgxSpinnerService, private editCompanyProfileService: EditCompanyProfileService,
    private toastrService: ToastrService, @Inject('data') public data: any, private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver, private Constants: ConstantsService, private httpclient: HttpClient) {
    if (this.data)
      this.profileEditRqst = this.data;
    if (this.profileEditRqst && this.profileEditRqst.companyLogo)
      {
        this.uplodedFileUrl = environment.ApiUrl + "/" + this.profileEditRqst.companyLogo;
        this.fileUpload = this.profileEditRqst.companyLogo;
      }
    else {
      this.uplodedFileUrl = 'assets/images/projz/avatar.png';
    }
  }

  closeProfile() {
    this.closed.emit();
  }

  showPreview() {
    if (this.profileEditRqst.companyLogo) {
      window.open(environment.ApiUrl + '/' + this.profileEditRqst.companyLogo, '_blank');
    }
  }

  updateProfileData() {
    this.UpdateCompanyRegisteration();
  }

  UpdateCompanyRegisteration() {
    this.spinnerService.show();
    let model = {
      id: this.profileEditRqst.userID,
      userName: this.profileEditRqst.emailAddress,
      password: this.profileEditRqst.password,
      email: this.profileEditRqst.emailAddress
    }
    this.editCompanyProfileService.UpdateCompanyRegisteration(model).subscribe(data => {
      if (data.status) {
        this.toastrService.success("Updated Successfully");
      }
      this.spinnerService.hide();
      this.UpdateCompanyProfile();
    });
    this.spinnerService.hide();

  }

  UpdateCompanyProfile() {
    let model:any = {
      "companyID": this.profileEditRqst.companyID,
      "companyName": this.profileEditRqst.companyName,
      "companyLogo": this.profileEditRqst.companyLogo,
      "owner": '',
      "industry": this.profileEditRqst.industry,
      "streetAddress": '',
      "city": '',
      "state": '',
      "country": '',
      "zipCode": '',
      "emailAddress": this.profileEditRqst.emailAddress,
      "phoneNumber": this.profileEditRqst.phoneNumber.internationalNumber,
      "description": this.profileEditRqst.description,
      "isDeleted": false,
      "createdBy": '',
      "noOfEmployees": this.profileEditRqst.noOfEmployees,
      "website": this.profileEditRqst.website,
      "linkedIn": this.profileEditRqst.linkedIn,
      "Status": 'p',
      "action": 'update'
    };
    const formData = new FormData();
    for (const key of Object.keys(model)) {
      const value = model[key];
      formData.append(key, value);
    }
    formData.append("companyLogo", this.fileUpload)
    this.spinnerService.show();
    this.httpclient.post(this.Constants.urlRegisterCompanyDetail, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        //this.progress = Math.round((100 * event.loaded) / event.total);
      }
      if (event.type === HttpEventType.Response) {
        this.toastrService.success("Profile Updated.", 'Success');
      }
      this.closeProfile();
      this.spinnerService.hide();
    });

  }

  removeUploadedPhoto() {
    this.profileEditRqst.companyLogo = '';
    this.uplodedFileUrl = 'assets/images/projz/avatar.png';
  }

  openFileUploadModal(event:any) {
    this.fileUpload = event?.target?.files[0] || new File([], 'default-filename');
    this.uplodedFileUrl = URL.createObjectURL(event.target.files[0]);
    this.dummyImage = false;
  }
}

import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, Injector, ViewChild } from '@angular/core';
// import {SearchCountryField,TooltipLabel,CountryISO} from 'ngx-intl-tel-input';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { SignUpService } from '../sign-up/sign-up.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ConstantsService, Methods } from '../../services/constants.service';
import { UploadFileComponent } from '../../common/upload-file/upload-file.component';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  TooltipLabel = { Name : "name",
  Iso2 : "iso2"};
  preferredCountries: CountryISO[] = [CountryISO.Qatar];
  currentStep = 1;
  progress = 0;
  progresss = 0;
  showPrevious: boolean = false
  acceptFiles = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
  url = '../../../assets/icons/company logo.png';
  totalSteps: number = 3;
  steps: string[] = ['1', '2', '3'];
  activedStep: number = 0
  companyRegisterRqst: any = {};
  response: any = { dbPath: '' };
  placeholderLabel = "Upload Company Logo";
  isValid: boolean = true;
  uplodedFileUrl: string = '';
  dummyImage: boolean = true;
  fileUpload: File = new File([], 'default-filename'); // Initialize the FileUpload variable
  @ViewChild('dialogFileUploadContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;

  constructor(private spinnerService: NgxSpinnerService, private signupCompanyService: SignUpService, private httpclient: HttpClient,
    private toastrService: ToastrService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector, private Constants: ConstantsService) {
    this.setCompanyRegistrationObject();
  }

  ngOnInit(): void {
    this.companyRegisterRqst.phoneNumber = {
      number: '',
      internationalNumber: '',
      nationalNumber: '',
      countryCode: 'QA',
      dialCode: '+974',
    }
  }
  ngAfterViewInit() {
    // this.phoneCode()
    // this.companyRegisterRqst.phoneNumber.patchValue({
    //   number : '+97431422391' ,
    //   internationalNumber: '+974 3142 2391',
    //   nationalNumber: '3142 2391',
    //   countryCode: 'QA',
    //   dialCode: '+974',
    // })
  }

  nextStep(){
    this.isValid = true;
    if (this.companyRegisterRqst.companyName && this.companyRegisterRqst.industry && this.companyRegisterRqst.noOfEmployees && this.companyRegisterRqst.phoneNumber) {
      this.activedStep = this.activedStep + 1;
      this.nextSteper()
      this.showPrevious = true



    }

    else if (!this.companyRegisterRqst.companyName || !this.companyRegisterRqst.industry || !this.companyRegisterRqst.noOfEmployees || !this.companyRegisterRqst.phoneNumber) {
      this.isValid = false;
      this.toastrService.error('Please enter the required fields.');
    }
    return this.isValid;

  }
  nextSteps() {
    this.isValid = true;
    if (this.companyRegisterRqst.emailAddress && this.companyRegisterRqst.password) {
      this.activedStep = this.activedStep + 1;
      this.nextSteper()

    }

    else if (!this.companyRegisterRqst.emailAddress || !this.companyRegisterRqst.password) {
      this.isValid = false;
      this.toastrService.error('Please enter the required fields.');
    }
    return this.isValid;
  }

  registerUsers() {
    if (this.validateCompanyDetail()) {
      this.spinnerService.show();
      this.signupCompanyService.registerUsers(this.companyRegisterRqst).subscribe(data => {
        this.spinnerService.hide();
        if (data.status && data.status.toLowerCase() == 'success') {
          this.saveCompanyDetail();
        }
        else {
          this.toastrService.error(data.message, '');
        }
      });
    }
  }

  saveCompanyDetail() {
    const model: any = {
      "companyID": this.companyRegisterRqst.companyID,
      "companyName": this.companyRegisterRqst.companyName,
      "companyLogo": this.companyRegisterRqst.companyLogo,
      "owner": '',
      "industry": this.companyRegisterRqst.industry,
      "streetAddress": '',
      "city": '',
      "state": '',
      "country": '',
      "zipCode": '',
      "emailAddress": this.companyRegisterRqst.emailAddress,
      "phoneNumber": this.companyRegisterRqst.phoneNumber && this.companyRegisterRqst.phoneNumber.internationalNumber
        ? this.companyRegisterRqst.phoneNumber.internationalNumber:'',
      "description": this.companyRegisterRqst.description,
      "isDeleted": false,
      "createdBy": '',
      "noOfEmployees": this.companyRegisterRqst.noOfEmployees,
      "companyAddress": this.companyRegisterRqst.companyAddress,
      "website": this.companyRegisterRqst.website,
      "linkedIn": this.companyRegisterRqst.linkedIn,
      "registerDate": this.companyRegisterRqst.registerDate,
      "Status": 'p',
      "action": 'save'
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
        this.toastrService.success("Company Registered successfully.", 'Success');
        this.router.navigate(['/auth/login']);
      }
      this.setCompanyRegistrationObject();
      this.spinnerService.hide();
    });
  }

  setCompanyRegistrationObject() {
    this.companyRegisterRqst.companyID = 0;
    this.companyRegisterRqst.companyName = '';
    this.companyRegisterRqst.industry = '';
    this.companyRegisterRqst.phoneNumber = '';
    this.companyRegisterRqst.description = '';
    this.companyRegisterRqst.noOfEmployees = '';
    this.companyRegisterRqst.website = '';
    this.companyRegisterRqst.linkedIn = '';
    this.companyRegisterRqst.emailAddress = '';
    this.companyRegisterRqst.password = '';
    this.companyRegisterRqst.companyAddress = '';
    this.companyRegisterRqst.registerDate = new Date().toISOString().substring(0, 10);
    this.companyRegisterRqst.companyLogo = '';
  }

  uploadFinished = (event: any) => {
    this.response = event;
    this.companyRegisterRqst.companyLogo = this.response.dbPath;
  }

  validateCompanyDetail() {
    this.isValid = true;
    let emptyFieldsCount = 0; // Track the number of empty fields
    if (!this.companyRegisterRqst.companyName) {
      emptyFieldsCount++;
    }
    if (!this.companyRegisterRqst.industry) {
      emptyFieldsCount++;
    }
    if (!this.companyRegisterRqst.noOfEmployees) {
      emptyFieldsCount++;
    }
    if (!this.companyRegisterRqst.emailAddress) {
      emptyFieldsCount++;
    }
    if (!this.companyRegisterRqst.password) {
      emptyFieldsCount++;
    }
    if (!this.companyRegisterRqst.phoneNumber) {
      emptyFieldsCount++;
    }

    if (emptyFieldsCount >= 2) {
      this.isValid = false;
      this.toastrService.error('Please enter the required fields.');
    }
    else if (!this.companyRegisterRqst.companyName) {
      this.isValid = false;
      this.toastrService.error('Enter the company name.');
    }
    else if (!this.companyRegisterRqst.industry) {
      this.isValid = false;
      this.toastrService.error('Select the industry.');
    }
    else if (!this.companyRegisterRqst.noOfEmployees) {
      this.isValid = false;
      this.toastrService.error('Select the no of employees.');
    }
    else if (!this.companyRegisterRqst.emailAddress) {
      this.isValid = false;
      this.toastrService.error('Enter the email address.');
    }
    else if (!this.companyRegisterRqst.password) {
      this.isValid = false;
      this.toastrService.error('Enter the password.');
    }
    else if (!this.companyRegisterRqst.phoneNumber) {
      this.isValid = false;
      this.toastrService.error('Enter the phone number.');
    }
    else if (!Methods.isValidEmail(this.companyRegisterRqst.emailAddress)) {
      this.isValid = false;
      this.toastrService.error('Enter the valid email address.');
    }
    return this.isValid;
  }

  openFileUploadModal(event: any) {
    this.fileUpload = event?.target?.files[0] || new File([], 'default-filename');
    this.uplodedFileUrl = URL.createObjectURL(event.target.files[0]);
    this.dummyImage = false;
  }

  removeUploadedFile() {
    this.companyRegisterRqst.companyLogo = '';
    this.uplodedFileUrl = '';
    this.dummyImage = true
  }



  // stepper
  prevSteper() {
    if (this.currentStep > 1) {
      this.currentStep--;
      if (this.currentStep === 1) {
        this.progress = 0;
      } else if (this.currentStep === 1) {
        this.progress = 0;
      } else if (this.currentStep === 2) {
        this.progresss = 0;
      }
      this.activedStep = this.activedStep - 1;

    }
    if (this.activedStep === 0) {
      this.showPrevious = false
    }
  }

  nextSteper() {
    if (this.currentStep < 3) {
      this.currentStep++;
      this.updateProgress();
    }
  }

  updateProgress() {
    if (this.currentStep === 1) {
      this.progress = 0;
    } else if (this.currentStep === 2) {
      this.progress = 100;
    } else if (this.currentStep === 3) {
      this.progresss = 100;
    }
  }
}


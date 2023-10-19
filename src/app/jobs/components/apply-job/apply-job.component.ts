import { HttpClient} from '@angular/common/http';
import { Component, ComponentFactoryResolver, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AddEmployeeService } from '../../../dasboard/employees/components/add-employee/add-employee.service';
import { Methods } from '../../../services/constants.service';
import { ApplyJobService } from '../apply-job/apply-job.service'
import { ConstantsService } from '../../../services/constants.service';
import { UploadFileComponent } from '../../../common/upload-file/upload-file.component';

@Component({
  selector: 'app-apply-job',
  templateUrl: './apply-job.component.html',
  styleUrls: ['./apply-job.component.scss']
})
export class ApplyJobComponent implements OnInit {
  postJobId: any = 0;
  companyId: any = 0;
  candidateJobApplication: any = {};
  response: any = { dbPath: '' };
  isValid: boolean = true;
  isValidUploadFormat: boolean = true;
  uplodedFileName: string = '';
  uplodedFileUrl: string = '';
  @ViewChild('dialogFileUploadContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;

  constructor(private activatedRouter: ActivatedRoute, private applyJobService: ApplyJobService,
    private spinnerService: NgxSpinnerService, private addEmployeeService: AddEmployeeService,
    private toastrService: ToastrService, private Constants: ConstantsService, private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector) {
    this.SetCandidateJobApplication();
    this.activatedRouter.queryParams.subscribe(params => {
      let postjob: any = {};
      postjob = JSON.parse(atob(params['postjob']));
      this.candidateJobApplication.postJobId = postjob && postjob.postJobId ? postjob.postJobId : 0;
      this.candidateJobApplication.companyId = postjob && postjob.companyId ? postjob.companyId : 0;
    });
  }

  ngOnInit(): void {

  }

  SetCandidateJobApplication() {
    this.candidateJobApplication.fullName = '';
    this.candidateJobApplication.phoneNumber = '';
    this.candidateJobApplication.email = '';
    this.isValidUploadFormat = false;
    this.candidateJobApplication.resumeFile = '';
    this.uplodedFileName = '';
    this.uplodedFileUrl = '';
  }

  applyJob() {
    if (this.validateApplyJob()) {
      this.spinnerService.show();
      this.validateEmailAndPhoneNum();
    }        
  }

  validateEmailAndPhoneNum() {
    let model = {
      email: this.candidateJobApplication.email,
      phoneNumber: this.candidateJobApplication.phoneNumber
    }
    this.addEmployeeService.CheckEmployeeRegisterValidation(model).subscribe(data => {
      this.spinnerService.hide();
      if (!data.status) {
        this.toastrService.error(data.msg);
        return;
      }
      this.applyForJob();
    });
  }

  applyForJob() {
    this.spinnerService.show();
    this.applyJobService.applyJob(this.candidateJobApplication).subscribe(data => {
      this.spinnerService.hide();
      if (data.status) {
        this.toastrService.success("Job applied successfully!", '');
        this.router.navigate(['/jobs']);
      }
      else {
        this.toastrService.error("Some error occured!", 'Error');
      }
    });
  }

  validateApplyJob() {
    this.isValid = true;
    let emptyFieldsCount = 0; // Track the number of empty fields
    if (!this.candidateJobApplication.fullName) {
      emptyFieldsCount++;
    }
    if (!this.candidateJobApplication.phoneNumber) {
      emptyFieldsCount++;
    }
    if (!this.candidateJobApplication.email) {
      emptyFieldsCount++;
    }
    if (!this.candidateJobApplication.resumeFile) {
      emptyFieldsCount++;
    }

    if (emptyFieldsCount >= 2) {
      this.isValid = false;
      this.toastrService.error('Please enter the required fields.');
      return false;
    }

    else if (!this.candidateJobApplication.fullName) {
      this.isValid = false;
      this.toastrService.error('Enter a Full Name.');
      return false;
    }
    else if (!this.candidateJobApplication.email) {
      this.isValid = false;
      this.toastrService.error('Enter a email.');
      return false;
    }
    else if (!Methods.isValidEmail(this.candidateJobApplication.email)) {
      this.isValid = false;
      this.toastrService.error('Please enter a valid email.');
      return false;
    }
    else if (!this.candidateJobApplication.phoneNumber) {
      this.isValid = false;
      this.toastrService.error('Enter an employee phonenumber.');
      return false;
    }
    else if (!this.candidateJobApplication.resumeFile) {
      this.isValid = false;
      this.toastrService.error('Upload a resume file.');
      return false;
    }
    else if (!this.isValidUploadFormat) {
      this.isValid = false;
      this.toastrService.error('Invalid file format. Only PDF and Word files are allowed..');
      return false;
    }

    return this.isValid;
  }

  openFileUploadModal() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(UploadFileComponent);
    const data: any =
    {
      heading:'Upload Resume',uploadFrom: 'resume', fileAllowed: ['.pdf', '.doc', '.docx'], acceptFormats: "application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogContainer?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((uploaded: any) => {
      if (uploaded) {
        this.isValidUploadFormat = true;
        this.candidateJobApplication.resumeFile = uploaded.filePath;
        this.uplodedFileUrl = uploaded.completeFilePath;
        this.uplodedFileName = uploaded.fileName;
      }
      popupRef?.destroy();
    });
  }

  removeUploadedFile() {
    this.isValidUploadFormat = false;
    this.candidateJobApplication.resumeFile = '';
    this.uplodedFileName = '';
    this.uplodedFileUrl = '';
  }
}

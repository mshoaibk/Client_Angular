import { Component, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../services/user-context.service';
import { JobApplicationService } from '../job-application/job-application.service'
import { PostJobService } from './components/post-job/post-job.service';
import { EditPostJobComponent } from '../../common/edit-post-job/edit-post-job.component';
import { DeleteConfirmationComponent } from '../../common/delete-confirmation/delete-confirmation.component';
import { AddEmployeeService } from '../employees/components/add-employee/add-employee.service';

@Component({
  selector: 'app-job-application',
  templateUrl: './job-application.component.html',
  styleUrls: ['./job-application.component.scss']
})
export class JobApplicationComponent {
  searchJobRqst: any = {};
  showApplicationslist: any = [];
  SelectedPageSize: number = 10;
  config_pgShowJob = {
    id: "pg_showJob",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  countries: any = [];
  deparments:any=[]
  selectedCountry: string = '';
  selectedDepartment:string=''
  showList: boolean = false;
  @ViewChild('postJobEditContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;
  @ViewChild('postJobDeleteContainer', { read: ViewContainerRef }) dialogContainerDelete?: ViewContainerRef;
  listLookup: any = {};


  constructor(private jobApplicationService: JobApplicationService ,private addEmployeeService: AddEmployeeService,
    private toastrService: ToastrService, private spinnerService: NgxSpinnerService,
    private userContextService: UserContextService, private postJobService: PostJobService,
    private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector  ) {
    this.searchJobRqst.companyId = 0;
    this.searchJobRqst.jobTitle = '';
    this.searchJobRqst.jobLocation = '';
    this.searchJobRqst.jobType = '';
    this.searchJobRqst.deparment='';
    this.searchJobRqst.position=''
  }

  ngOnInit(): void {
    this.showAppliedApplication();
    this.getCountries();
    this.GetSetupLookUpData()
  }

  showAppliedApplication() {
    let model = {
      "companyId": this.userContextService.user$._value.companyID,
      "jobTitle": this.searchJobRqst.jobTitle,
      "location": this.searchJobRqst.jobLocation,
      "department": this.searchJobRqst.deparment,
      "position": this.searchJobRqst.position,
      "jobType": this.searchJobRqst.jobType,
      "pageIndex": this.config_pgShowJob.currentPage - 1,
      "pageSize": this.config_pgShowJob.itemsPerPage,
    };
    this.spinnerService.show();
    this.jobApplicationService.showAppliedApplication(model).subscribe(data => {
      if (data.status) {
        this.showApplicationslist = data.showAppliedApplications;
        console.log("dataaaa",this.showApplicationslist)
        this.config_pgShowJob.totalItems = data.totalRecords;
      }
      this.spinnerService.hide();
    });
  }
  
  GetSetupLookUpData() {
    this.spinnerService.show();
    let model: any = {
      companyId: this.userContextService.user$._value.companyID,
      requiredDataList: ['office', 'department', 'team', 'position','et']
    }
    this.addEmployeeService.GetSetupLookUpData(model).subscribe(data => {
      if (data.status) {
        this.listLookup = data.lookUpList;
      }
      this.spinnerService.hide();
    });
  }

  //selected Page number record 
  onPageChanged(page: any) {
    // set selected page as a current page
    this.config_pgShowJob.currentPage = page;
    this.showAppliedApplication();
  }

  getCountries() {
    this.postJobService.getCountries().subscribe((data: any[]) => {
      this.countries = data;
    });
  }

  onSelect(country: any) {
    this.selectedCountry = country.name;
    this.searchJobRqst.jobLocation = this.selectedCountry;
    this.showList = false;
  }

  editPostJobPopup(postJobId:number) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(EditPostJobComponent);
    const data: any =
    {
      postJobId: postJobId
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogContainer?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((editPostedJobs: any) => {
      popupRef.destroy();
      if (editPostedJobs) {
        this.showAppliedApplication();
      }
    });
  }

  deletePostedJobs(postJobId: number) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(DeleteConfirmationComponent);
    const data: any =
    {
      Id: postJobId
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogContainerDelete?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((postedJobsId: any) => {
      popupRef.destroy();
      if (postedJobsId) {
        this.deleteJobById(postedJobsId)
      }
    });
  }

  deleteJobById(postJobId: any) {
    this.spinnerService.show();
    this.jobApplicationService.DeletePostedJob(postJobId).subscribe(data => {
      if (data.status) {
        this.toastrService.success("Job has been Deleted");
        this.showAppliedApplication();
      }
      this.spinnerService.hide();
    });
  }

  onBlur() {
    setTimeout(() => {
      this.showList = false;
    }, 100);
  }
}

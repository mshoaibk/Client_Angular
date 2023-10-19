import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../../../services/user-context.service';
import { ApplicationDetailsService } from '../../components/application-details/application-details.service';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.scss']
})
export class ApplicationDetailsComponent {
  postJobId: number = 0;
  showCandidateApplicationslist: any = [];
  jobTitle: string = '';
  SelectedPageSize: number = 10;
  config_pgShowJob = {
    id: "pg_showJob",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };

  constructor(private route: ActivatedRoute, private applicationDetailsService: ApplicationDetailsService,
    private toastrService: ToastrService, private spinnerService: NgxSpinnerService,
    private userContextService: UserContextService,private currentRoute: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.postJobId = params['id'];
      this.ShowCandidatesApplication();
    });
  }

  ShowCandidatesApplication() {
    let model = {
      "postedJobId": this.postJobId,
      "pageIndex": this.config_pgShowJob.currentPage - 1,
      "pageSize": this.config_pgShowJob.itemsPerPage,
    };
    this.spinnerService.show();
    this.applicationDetailsService.ShowCandidatesApplication(model).subscribe(data => {
      if (data.status) {
        this.showCandidateApplicationslist = data.showAppliedApplications;
        this.config_pgShowJob.totalItems = data.totalRecords;
        this.jobTitle = data.jobTitle;
        console.log("sssss",this.jobTitle )
      }
      this.spinnerService.hide();
    });
  }

  //selected Page number record 
  onPageChanged(page: any) {
    // set selected page as a current page
    this.config_pgShowJob.currentPage = page;
    this.ShowCandidatesApplication();
  }

  UpdateCandidatesApplication(applications:any) {
    let model = {
      "candidateJobApplicationId": applications.candidateJobApplicationId,
      "statuses": applications.status
    };
    this.spinnerService.show();
    this.applicationDetailsService.UpdateCandidatesApplication(model).subscribe(data => {
      if (data.status) {
        this.ShowCandidatesApplication();
      }
      this.spinnerService.hide();
    });
  }

  download(filename: string) {
    this.applicationDetailsService.downloadFile(filename);
  }
  gobackToEmployees() {
    this.currentRoute.navigate(['/dashboard/jobs-applications'])
  }
}

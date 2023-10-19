import { Component, OnInit } from '@angular/core';
import { JobsService } from './jobs.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common.service';
import { Methods } from '../services/constants.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  selectedCountry: string = '';
  showList: boolean = false;
  countries: any = [];
  searchJobRqst: any = {};
  postedJoblist: any = [];
  selectedJob: any;
  config_pgShowJob = {
    id: "pg_showJob",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  constructor(private jobsService: JobsService, private spinnerService: NgxSpinnerService, private commonService: CommonService) { 
    this.clearField();
    this.getCountries();
    this.findJob();
  }

  ngOnInit(): void {
  }
  clearField() {
    this.searchJobRqst.jobTitle=''
  }

  getCountries() {
    this.jobsService.getCountries().subscribe((data: any[]) => {
      this.countries = data;
    });
  }

  onSelect(country: any) {
    this.selectedCountry = country.name;
    this.showList = false;
  }

  onCloseList(e: Event) {
    this.showList = false;
  }

  findJob() {
    let model = {
      "companyName": "",
      "jobTitle": this.searchJobRqst.jobTitle,
      "jobLocation": this.selectedCountry,
      "pageIndex": this.config_pgShowJob.currentPage - 1,
      "pageSize": this.config_pgShowJob.itemsPerPage,
    };
    this.spinnerService.show();
    this.jobsService.GetPostedJob(model).subscribe(data => {
      if (data.status) {
        this.postedJoblist = data.postedJobList;
        this.selectedJob = this.postedJoblist && this.postedJoblist.length > 0 ? this.postedJoblist[0] : {};
        this.config_pgShowJob.totalItems = data.totalRecords;
      }
      this.spinnerService.hide();
    });
  }

  onJobClick(job: any) {
    this.selectedJob = job;
  }

  ApplyJob() {
    let organModel = {
      postJobId: this.selectedJob.postJobId,
      companyId: this.selectedJob.companyId
    }
    let modelString = JSON.stringify(organModel);
    let encodedModel = Methods.EncryptTo64(modelString);
    window.location.href = 'jobs/apply-job?postjob=' + encodedModel;
  }

  onBlur() {
    setTimeout(() => {
      this.showList = false;
    }, 100);
  }
}

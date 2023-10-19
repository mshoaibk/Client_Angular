import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common.service';
import { Methods } from '../services/constants.service';
import { CarrerService } from './carrer.service';

@Component({
  selector: 'app-carrer',
  templateUrl: './carrer.component.html',
  styleUrls: ['./carrer.component.scss']
})
export class CarrerComponent {
  selectedCountry: string = '';
  showList: boolean = false;
  countries: any = [];
  searchJobRqst: any = {};
  postedJoblist: any = [];
  selectedJob: any = {};
  config_pgShowJob = {
    id: "pg_showJob",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  companyId: any = 0;

  constructor(private jobsService: CarrerService, private spinnerService: NgxSpinnerService,
    private commonService: CommonService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.companyId = params['id'];
    });
    this.companyId = atob(this.companyId);
    this.clearField();
    this.getCountries();
    this.findJob();
  }

  ngOnInit(): void {
  }
  clearField() {
    this.searchJobRqst.jobTitle = ''
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

  onBlur() {
    setTimeout(() => {
      this.showList = false;
    }, 100);
  }

  onCloseList(e: Event) {
    this.showList = false;
  }

  findJob() {
    let model = {
      "companyId": Number(this.companyId),
      "jobTitle": this.searchJobRqst.jobTitle,
      "jobLocation": this.selectedCountry,
      "pageIndex": this.config_pgShowJob.currentPage - 1,
      "pageSize": this.config_pgShowJob.itemsPerPage,
    };
    let modelString = JSON.stringify(model);
    let encodedModel = Methods.EncryptTo64(modelString);
    this.spinnerService.show();
    this.jobsService.GetCarrerByComapny(encodedModel).subscribe(data => {
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
    window.location.href = 'carrer/apply-job?postjob=' + encodedModel;
  }
}

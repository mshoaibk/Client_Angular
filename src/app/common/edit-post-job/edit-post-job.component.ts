import { Component, EventEmitter, Inject, Injector, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EditPostJobService } from '../edit-post-job/edit-post-job.service'

@Component({
  selector: 'app-edit-post-job',
  templateUrl: './edit-post-job.component.html',
  styleUrls: ['./edit-post-job.component.scss']
})
export class EditPostJobComponent {
  @Output() closed = new EventEmitter();
  tabNumber: number = 1;
  jobComposeRqst: any = {};
  descriptionBody: any;
  jobBenefit: string[] = [];
  countries: any = [];
  selectedCountry: string = '';
  showList: boolean = false;
  options = ['Angular', 'React', 'Vue', 'Ember', 'Backbone'];
  filteredOptions: any[] = [];
  selectedOptions: any[] = [];
  inputValue = '';

  constructor(private spinnerService: NgxSpinnerService, private editCompanyProfileService: EditPostJobService,
    private toastrService: ToastrService, @Inject('data') public data: any, private injector: Injector) {
    this.getCountries();
    this.getPostedJobById(data.postJobId);
  }

  getPostedJobById(postJobId:any) {
    this.spinnerService.show();
    this.editCompanyProfileService.GetPostedJobById(postJobId).subscribe(data => {
      if (data.status) {
        this.jobComposeRqst = data.postedJobResult;
        this.selectedCountry = this.jobComposeRqst.selectedCountry;
        this.jobComposeRqst.country = this.selectedCountry;
        this.descriptionBody = this.jobComposeRqst.description;
        this.fillJobBenefits();
        this.fillRequiredSkill();
      }
      this.spinnerService.hide();
    });
  }

  fillRequiredSkill() {
    let requiredSkills: any = {
      postJobRequiredSkillsId: null,
      PostJobId: null,
      CompanayId: null,
      requiredSkill: null
    }
    requiredSkills = this.jobComposeRqst.requiredSkills ? JSON.parse(JSON.stringify(this.jobComposeRqst.requiredSkills)) : requiredSkills;
    this.jobComposeRqst.requiredSkill = [];
    if (!requiredSkills || requiredSkills.length == 0) {
      this.jobComposeRqst.requiredSkill=[];
    }
    else {
      for (let skill of requiredSkills) {
        this.selectedOptions.push(skill.requiredSkill);
        this.jobComposeRqst.requiredSkill.push(skill.requiredSkill);
      }
    }
  }

  fillJobBenefits() {
    let jobBenefits: any = {
      PostJobBenefitId: null,
      PostJobId: null,
      BenefitId: null,
      BenefitTitle: null,
      CreatedBy: null,
      CreatedDate: null,
      ModifiedBy: null,
      ModifiedDate: null
    }
    jobBenefits = this.jobComposeRqst.jobBenefit ? JSON.parse(JSON.stringify(this.jobComposeRqst.jobBenefit)) : jobBenefits;
    this.jobComposeRqst.jobBenefit = [];
    if (!jobBenefits || jobBenefits.length == 0) {
      this.jobComposeRqst.jobBenefit.push('medical');
    }
    else {
      for (let _benefit of jobBenefits) {
        this.jobComposeRqst.jobBenefit.push(_benefit.benefitTitle);
      }
    }
  }

  editPostedJob() {
    this.spinnerService.show();
    this.editCompanyProfileService.EditPostedJob(this.jobComposeRqst).subscribe(data => {
      if (data.status) {
        this.toastrService.success("Job Updated Successfully.", 'Success');
        this.closed.emit(true);
      }
      this.spinnerService.hide();
    });
  }

  getCountries() {
    this.editCompanyProfileService.getCountries().subscribe((data: any[]) => {
      this.countries = data;
    });
  }

  onSelect(country: any) {
    this.selectedCountry = country.name;
    this.jobComposeRqst.country = this.selectedCountry;
    this.showList = false;
  }

  onBlur() {
    setTimeout(() => {
      this.showList = false;
    }, 100);
  }

  OnDescriptionContentChanged(content: any) {
    this.jobComposeRqst.description = content.html;
  }

  addOption(option: any = '') {
    let skills = option ? option : this.inputValue;
    this.selectedOptions.push(skills);
    this.jobComposeRqst.requiredSkill = [];
    this.jobComposeRqst.requiredSkill = this.selectedOptions;
    this.inputValue = '';
    this.filteredOptions = [];
  }

  filterOptions() {
    if (this.inputValue) {
      this.filteredOptions = this.options.filter(option =>
        option.toLowerCase().includes(this.inputValue.toLowerCase())
      );
    } else {
      this.filteredOptions = [];
    }
  }

  removeOption(option: any) {
    this.selectedOptions = this.selectedOptions.filter(o => o !== option);
    this.jobComposeRqst.requiredSkill = [];
    this.jobComposeRqst.requiredSkill = this.selectedOptions;
  }

  validateBasicDetail() {
    if (!this.jobComposeRqst.jobTitle) {
      this.toastrService.error('Enter a Job Title.', 'error');
      return false;
    }
    else if (!this.jobComposeRqst.country) {
      this.toastrService.error('Select a Country.', 'error');
      return false;
    }
    else if (!this.jobComposeRqst.jobTypeLoc) {
      this.toastrService.error('Enter a Job Type.', 'error');
      return false;
    }
    else if (!this.jobComposeRqst.noOfHiring) {
      this.toastrService.error('Enter a Number of Hiring.', 'error');
      return false;
    }
    else if (!this.jobComposeRqst.noOfExperience) {
      this.toastrService.error('Enter a Number of Experience.', 'error');
      return false;
    }
    else if (!this.jobComposeRqst.experienceLevel) {
      this.toastrService.error('Enter a Experience Level.', 'error');
      return false;
    }
    this.tabNumber = 2;
    return true;
  }

  validateBenefits() {
    if (!this.jobComposeRqst.jobType) {
      this.toastrService.error('Select a Type of Job is it.', 'error');
      return false;
    }
    else if (!this.selectedOptions || this.selectedOptions.length == 0) {
      this.toastrService.error('Add a required skills.', 'error');
      return false;
    }
    this.tabNumber = 3;
    return true;
  }

  tabSwitch(tabIndex: any) {
    if (this.tabNumber == 1 && (tabIndex == 2 || tabIndex == 3 || tabIndex == 4) && this.validateBasicDetail()) {
      this.tabNumber = tabIndex;
    }
    else if (this.tabNumber == 2 && (tabIndex == 1 || tabIndex == 3 || tabIndex == 4) && this.validateBenefits()) {
      this.tabNumber = tabIndex;
    }
    else if (this.tabNumber == 3 || this.tabNumber == 4) {
      this.tabNumber = tabIndex;
    }
  }

  closeEditPostJob() {
    this.closed.emit(false);
  }
}

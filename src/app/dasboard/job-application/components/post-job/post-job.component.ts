import { Component } from '@angular/core';
import { PostJobService } from '../post-job/post-job.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../../../services/user-context.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss']
})
export class PostJobComponent {
  jobComposeRqst: any = {};
  descriptionBody: any;
  keyRespBody: any;
  jobBenefit: string[] = [];
  countries: any = [];
  selectedCountry: string = '';
  isValid: boolean = true;
  showList: boolean = false;
  options = ['Angular', 'React', 'Vue', 'Ember', 'Backbone'];
  filteredOptions: any[] = [];
  selectedOptions: any[] = [];
  inputValue = '';
  currentStep = 1;
  progress = 0;
  progresss = 0;
  activedStep: number = 0
  showPrevious: boolean = false
  constructor(private postJobService: PostJobService, private router: Router,
    private toastrService: ToastrService, private spinnerService: NgxSpinnerService,
    private userContextService: UserContextService) {
    this.getCountries();
    this.resetPostJobForm();
  }

  onInputBlur() {
    // Code to handle the click outside event
    // For example, you can hide the list when the input loses focus
    this.showList = false;
  }


  getCountries() {
    this.postJobService.getCountries().subscribe((data: any[]) => {
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

  OnKeyRespContentChanged(content: any) {
    this.jobComposeRqst.keyResponsibilities = content.html;
  }

  resetPostJobForm() {
    this.jobComposeRqst.jobTypeLoc = '';
    this.jobComposeRqst.experienceLevel = '';
    this.jobComposeRqst.jobType = '';
    this.jobComposeRqst.currency = '';
    this.jobComposeRqst.jobBenefit = [];
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

  addOption(option: any = '') {
    let skills = option ? option : this.inputValue;
    this.selectedOptions.push(skills);
    this.jobComposeRqst.requiredSkill = [];
    this.jobComposeRqst.requiredSkill = this.selectedOptions;
    this.inputValue = '';
    this.filteredOptions = [];
  }

  removeOption(option: any) {
    this.selectedOptions = this.selectedOptions.filter(o => o !== option);
  }

  validateBasicDetail() {
    this.isValid = false;
    if (!this.jobComposeRqst.companyName) {
      this.toastrService.error('Enter a Company Name.');
      return false;
    }
    if (!this.jobComposeRqst.jobTitle) {
      this.toastrService.error('Enter a Job Title.');
      return false;
    }
    if (!this.jobComposeRqst.jobLocation) {
      this.toastrService.error('Enter a Job Location.');
      return false;
    }
    // else if (!this.jobComposeRqst.country) {
    //   this.toastrService.error('Select a Country.', '');
    //   return false;
    // }
    else if (!this.jobComposeRqst.jobTypeLoc) {
      this.toastrService.error('Enter a Job Type.');
      return false;
    }
    else if (!this.jobComposeRqst.noOfHiring) {
      this.toastrService.error('Enter a Number of Hiring.',);
      return false;
    }
    else if (!this.jobComposeRqst.qualification) {
      this.toastrService.error('Enter your Qualification.');
      return false;
    }
    else if (!this.jobComposeRqst.noOfExperience) {
      this.toastrService.error('Enter a Number of Experience.');
      return false;
    }
    // else if (!this.jobComposeRqst.experienceLevel) {
    //   this.toastrService.error('Enter a Experience Level.');
    //   return false;
    // }
    
    this.nextSteper()
    this.isValid = true;
    this.showPrevious=true
    return true;
   
  }

  validateBenefits() {
    this.isValid = false;
    if (!this.jobComposeRqst.currency) {
      this.toastrService.error('Enter desired Currency.');
      return false;
    }
    else if (!this.jobComposeRqst.amount ) {
      this.toastrService.error('Enter desired Amount.');
      return false;
    }
    else if (!this.jobComposeRqst.salaryRangeFrom ) {
      this.toastrService.error('Enter salary Range From.');
      return false;
    }
    else if (!this.jobComposeRqst.salaryRangeTo ) {
      this.toastrService.error('Enter salary Range To.');
      return false;
    }
    this.nextSteper()
    return true;
  }
  PostJob() {
    if (!this.validateBasicDetail || !this.validateBenefits()) {
    }
    else {
      this.spinnerService.show();
      this.jobComposeRqst.action = 'save';
      this.postJobService.SavePostJob(this.jobComposeRqst).subscribe(data => {
        if (data.status) {
          this.router.navigate(['/dashboard/jobs-applications']);
          this.toastrService.success("Job Posted Successfully", 'Success');
        }
        this.spinnerService.hide();
      });
    }
  }
  // stepper work start
  // stepper
prevSteper() {
  if (this.currentStep > 1) {
    this.currentStep-- ;
    if (this.currentStep === 1) {
      this.progress = 0;
    } else if (this.currentStep === 1) {
      this.progress = 0;
    } else if (this.currentStep === 2) {
      this.progresss = 0;
    }
    this.activedStep= this.activedStep-1;
  }
  if(this.activedStep===0){
    this.showPrevious=false
  }
}

nextSteper() {
  if (this.currentStep < 3) {
    this.activedStep++
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
  // stepper work end
}

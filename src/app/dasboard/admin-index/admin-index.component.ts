import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../services/user-context.service';
import { AdminIndexService } from '../admin-index/admin-index.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.scss']
})
export class AdminIndexComponent {
  
  companyUserID: any = '';
  companyID: number = 0;
  companyProfile: any = {};
  companyDasboardCount: any = {};

  constructor(private userContextService: UserContextService, private spinnerService: NgxSpinnerService,
    private adminIndexService: AdminIndexService, private router: Router) {
    if (this.userContextService && this.userContextService.user$ && this.userContextService.user$._value) {
      this.companyUserID = this.userContextService.user$._value.id;
      this.companyID = this.userContextService.user$._value.companyID;
    }
    this.GetCompanyProfile();
    this.GetCompanyDashboardCount();
  }










  @ViewChild('pieChartCanvas', { static: true }) pieChartCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.drawDonutChart();
  }

  private drawDonutChart(): void {
    const canvas = this.pieChartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
  
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }
  
    const data = [95, 2, 3]; 
    const colors = ['#2CC73B', '#4A7CFC', '#FF3541']; 
    const innerRadius = 70; 
  
    const total = data.reduce((sum, value) => sum + value, 0);
    let startAngle = 0;
  
    data.forEach((value, index) => {
      const sliceAngle = (value / total) * Math.PI * 2;
      ctx.fillStyle = colors[index];
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, startAngle, startAngle + sliceAngle);
      ctx.arc(canvas.width / 2, canvas.height / 2, innerRadius, startAngle + sliceAngle, startAngle, true); // Counter-clockwise arc for the inner circle
      ctx.lineTo(canvas.width / 2, canvas.height / 2);
      ctx.fill();
      startAngle += sliceAngle;
    });
  }
  










  GetCompanyProfile() {
    this.spinnerService.show();
    this.adminIndexService.getCompanyProfile(this.companyUserID).subscribe(data => {
      if (data.status) {
        this.companyProfile = data.companyList;
      }
      this.spinnerService.hide();
    });
  }

  navigateToPage(page: any) {
    this.router.navigate([page]);
  }

  GetCompanyDashboardCount() {
    this.spinnerService.show();
    this.adminIndexService.GetCompanyDashboardCount(this.companyID, 'dashboardcount').subscribe(data => {
      if (data.status) {
        this.companyDasboardCount = data.dashboardCount;
      }
      this.spinnerService.hide();
    });
  }

  createImgPath(imgPath: string) {
    if (imgPath)
      return environment.ApiUrl + '/' + imgPath;
    return 'assets/images/projz/avatar.png';
  }
}

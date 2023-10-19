import { Component } from '@angular/core';

@Component({
  selector: 'app-company-setup',
  templateUrl: './company-setup.component.html',
  styleUrls: ['./company-setup.component.scss']
})
export class CompanySetupComponent {
  showView: string = 'o';
  switchViewTab(param: any = 'o'){this.showView = param;}
  updateDepartment(item :string){this.showView = item;}
  updateTeam(item :string){this.showView = item;}
  updatePosition(item :string){this.showView = item;}
  updateEmployment(item :string){this.showView = item;}
  updateOnboard(item :string){this.showView = item;}
  updateProbation(item: string) { this.showView = item; }
  updateLeaves(item: string) { this.showView = item; }
  updateShifts(item: string) { this.showView = item; }
  updateRoles(item: string) { this.showView = item; }
  updateHierarchy(item: string) { this.showView = item; }
}

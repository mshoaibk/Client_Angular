import { Component } from '@angular/core';
import { UserContextService } from './services/user-context.service';
import { environment } from '../environments/environment';
import { RouteStateService } from '../app/services/route-state.service';
import { SessionService } from '../app/services/session.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HrmsAdminFrontend';
  typeSelected: string = 'ball-fussion';
  isLogedIn: boolean = false;
  users: any = {};
  companyLogo: string = '';
  companyName: string = '';
  chatSupport:boolean=true
  constructor(private userContextService: UserContextService, private routeStateService: RouteStateService,
    private sessionService: SessionService, private router: Router) {
    this.users = this.userContextService.user$._value;
    this.userContextService.user$.subscribe((data: any) => {
      if (!data) {
        this.isLogedIn = false;
      } else {
        this.companyName = this.userContextService.user$._value.companyName;
        this.companyLogo = this.userContextService.user$._value.companyLogo;
        this.isLogedIn = true;
      }
    })
  }

  createImgPath() {
    if (this.companyLogo)
      return environment.ApiUrl + '/' + this.companyLogo;
    return 'assets/images/projz/avatar.png';
  }

  logout() {
    this.routeStateService.removeAll();
    this.userContextService.logout();
    this.sessionService.removeItem('active-menu');
    this.router.navigate(['']);
  }
}

import { Component, HostListener } from '@angular/core';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { RouteStateService } from '../services/route-state.service';
import { SessionService } from '../services/session.service';
import { UserContextService } from '../services/user-context.service';
import * as signalR from '@microsoft/signalr';
import { SignalRService } from '../services/SignalRService';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.scss']
})
export class DasboardComponent {
  private hubConnection: signalR.HubConnection;
  public collapsed = false;
  base = '';
  splitVal: any = [];
  companyName: string = '';
  companyId: string = '';
  companyLogo: string = '';
  isDropdownOpen = false;
  constructor(
    private router: Router,
    private routeStateService: RouteStateService,
    private sessionService: SessionService,
    private userContextService: UserContextService,
    private signalRService: SignalRService,
  ) {
    //SignalR
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:44398/chatHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();


    // this.router.events.subscribe((event: Event) => {
    //   if (event instanceof NavigationStart) {
    //     this.splitVal = event.url.split('/');
    //   }
    // });
    this.companyName = this.userContextService.user$._value.companyName;
    this.companyLogo = this.userContextService.user$._value.companyLogo;
    this.companyId = this.userContextService.user$._value.companyID;
  }
  storeIdInLocalStorage(id: string): void {
    localStorage.setItem('SinalRuserId', id.toString());
    localStorage.removeItem('userId');
    console.log('SinalRuserId:' + id.toString())
  }
  async ngOnInit(): Promise<void> {
    // Call the API service function when the app component initializes

    try {
      await this.startSignalRConnection();
      this.signalRService.openNewPage(this.companyId.toString(), this.companyName.toString());
      console.log("joinPrivateChat is called");
    } catch (error) {
      console.error('Error starting SignalR connection:', error);
      // Handle connection startup errors here
    }
  }
  async startSignalRConnection(): Promise<void> {

    if (this.hubConnection.state === 'Disconnected') {
      await this.hubConnection
        .start()
        .then(() => {
          console.log('SignalR connection started successfully.');
          // Implement any logic you need after a successful connection
        })
        .catch((error) => {
          console.error('Error starting SignalR connection:', error);
          throw error; // Propagate the error
        });
    } else {
      console.warn('SignalR connection is already in a connected or connecting state.');
    }
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.signalRService.leavePage(this.companyId.toString(), this.companyName.toString());
    console.log("page is closed");
  }

  logout() {
    debugger
    localStorage.removeItem('SinalRuserId'); // please remove signalR id when logout 
    this.routeStateService.removeAll();
    this.userContextService.logout();
    this.sessionService.removeItem('active-menu');
    this.router.navigate(['']);
  }

  createImgPath() {
    if (this.companyLogo)
      return environment.ApiUrl + '/' + this.companyLogo;
    return '';
  }

  isActive(value: string) {
    if (window.location.href.split('/').includes(value)) {
      return true
    } else {
      return false
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}

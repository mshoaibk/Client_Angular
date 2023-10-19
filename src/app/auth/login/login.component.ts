import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { RouteStateService } from 'src/app/services/route-state.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { ToastrService } from 'ngx-toastr';
import * as signalR from '@microsoft/signalr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  typeSelected: string = 'ball-fussion';
  private hubConnection: signalR.HubConnection;
  constructor(private commonService: CommonService, private constantsService: ConstantsService, private userContextService: UserContextService, private routeStateService: RouteStateService, private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:44398/chatHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();
  }

  async ngOnInit(): Promise<void> {
    // Call the API service function when the app component initializes

    try {
      await this.startSignalRConnection()
    }
    catch (error) {
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
  onClickLogin() {
    let userModel = {
      Email: this.email,
      Password: this.password,
      Role: 'Company'
    }
    this.spinnerService.show();
    let url = this.constantsService.urlLogin;
    this.commonService.post(url, userModel).subscribe((data: any) => {
      this.spinnerService.hide();
      let userData: any = data;
      if (userData && userData.status) {
        userData.user.userRole = userData.userRole;
        userData.user.companyID = userData.companyID ? userData.companyID : 0;
        userData.user.companyName = userData.companyName ? userData.companyName : '';
        userData.user.companyLogo = userData.companyLogo ? userData.companyLogo : '';
        this.userContextService.setUser(userData.user);
        this.routeStateService.add("Dashboard", '/dashboard', null, true);
        return;
      }
      this.toastrService.error(userData.message, 'Not Authenticated');
      return;
    });
  }
}

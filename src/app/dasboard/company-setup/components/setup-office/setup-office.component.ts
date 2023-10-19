import { Component, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { OfficeSetupService } from 'src/app/dasboard/company-setup/components/setup-office/office-setup.service';
import { UserContextService } from '../../../../services/user-context.service';
import { DeleteConfirmationComponent } from '../../../../common/delete-confirmation/delete-confirmation.component';
import { AddEmployeeService } from '../../../employees/components/add-employee/add-employee.service';

@Component({
  selector: 'app-setup-office',
  templateUrl: './setup-office.component.html',
  styleUrls: ['./setup-office.component.scss']
})
export class SetupOfficeComponent {
  officeLocationRequest: any = {};
  isTableShow: boolean = false
  isValid: boolean = true;
  officeLocationResponse: any;
  mapLocationList: any[] = [];
  markers : any= []
  locations: any = [];
  SearchOfficeLocationModel: any = {}; showView: string = 'o';
  @Output() updateevent: EventEmitter<any> = new EventEmitter()
  @ViewChild('deleteContainer', { read: ViewContainerRef }) dialogDeleteContainer?: ViewContainerRef;
  config_pgOfficeSetupList = {
    id: "pg_OfficeSetupList",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  listLookup: any = {};
  officeId: number = 0;
  @ViewChild('mapContainer', { static: true }) gmap!: ElementRef;
  locationList: any = [];
  map: google.maps.Map;
  searchInput: string = '';
  latitude = 37.090240;
  longitude = -95.712891;
  markersLoc: google.maps.Marker[] = [];
  idCounter = -1;
  range : number

  constructor(private OfficeSetupservices: OfficeSetupService, private userContextService: UserContextService, private injector: Injector,
    private spinnerService: NgxSpinnerService, private componentFactoryResolver: ComponentFactoryResolver, private addEmployeeService: AddEmployeeService,
    private toastrService: ToastrService) {
      this.range = 0
    this.addOfficeSetup();
    this.GetSetupLookUpData();
    this.setSearchOfficeLocationModel();
    this.map = {} as google.maps.Map;
  }
  ngOnInit(): void {
    this.GetOfficeLocationList();
    this.mapInitializer();
  }
  mapInitializer(): void {
    const initialPosition = new google.maps.LatLng(this.latitude, this.longitude);
    this.map = new google.maps.Map(this.gmap.nativeElement, {
      center: initialPosition,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    const marker = new google.maps.Marker({
      position: initialPosition,
      map: this.map,
      draggable: true,
      icon: '<i class="fa-solid fa-location-pin" style="color: #de0d0d;"></i>'
    });
    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete') as HTMLInputElement
    );
    autocomplete.addListener('place_changed', () => {
      const setNewMarker = new google.maps.Marker({
        map: this.map,
        draggable: true,
      });
      const place = autocomplete.getPlace();
      if (!place.geometry) return;
      this.map.panTo(place.geometry.location);
      setNewMarker.setPosition(place.geometry.location);
      console.log('========>',setNewMarker)
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();

      // this.markersLoc.push(setNewMarker)
      // console.log(this.markersLoc)

      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(this.latitude, this.longitude);
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const locationName = results[0].formatted_address;
          
          // marker :setNewMarker,
          this.mapLocationList.push({ officeLocationName: locationName, latitude: this.latitude.toString(), longitude: this.longitude.toString(), companyId: this.userContextService.user$._value.companyID, officeId: this.idCounter,marker :setNewMarker })
        console.log('===>',this.mapLocationList )
        } else {
          console.error('Reverse geocoding failed:', status);
        }
        this.idCounter--;
      });
    });
  }
  removeMarker(marker: any) {
    if (marker) {
   marker.setMap(null);
    }
  }
  setSearchOfficeLocationModel() {
    this.SearchOfficeLocationModel.searchOfficeLocationName = '';
    this.SearchOfficeLocationModel.pageIndex = this.config_pgOfficeSetupList.currentPage - 1;
    this.SearchOfficeLocationModel.pageSize = this.config_pgOfficeSetupList.itemsPerPage;
    this.SearchOfficeLocationModel.companyId = this.userContextService.user$._value.companyID;
  }
  addOfficeSetup() {
    this.officeLocationRequest.officeLocationName = '';
    this.officeLocationRequest.companyId = this.userContextService.user$._value.companyID;
    this.officeLocationRequest.officeId = 0;
  }
  addOffice() {
    
    this.validateofficeSetup()
    if (this.isValid == true) {
      this.spinnerService.show();
      for (const item of this.mapLocationList) {
        delete item.marker;
      }
      this.OfficeSetupservices.officeSetup(this.mapLocationList).subscribe(data => {
        this.spinnerService.hide();
        if (data.status) {
          this.toastrService.success(data.msg, '');
          if (this.isValid == true) {
            this.updateevent.emit('d')
          }
        }
        else {
          this.toastrService.error(data.msg, 'Error');
        }
      });
    }
  }

  validateofficeSetup() {
    if (!this.mapLocationList || this.mapLocationList.length <= 0) {
      this.isValid = false;
      this.toastrService.error('Please Enter Office Location!');
    } else {
      this.isValid = true;
    }
    return this.isValid;
  }

  GetOfficeLocationList() {
    this.spinnerService.show();
    this.OfficeSetupservices.GetOfficeLocationList(this.SearchOfficeLocationModel).subscribe(data => {
      if (data.officeList.length >= 1) {
        this.isTableShow = true
      } else {
        this.isTableShow = false
      }
      this.spinnerService.hide();
      if (data.status) {
        this.officeLocationResponse = data.officeList;
        this.mapLocationList = data.officeList;
        console.log("bbbbb",this.mapLocationList)
        this.mapLocationList.map((data) => {
          this.locations.push({
            latitude: data.latitude, longitude: data.longitude
          })
        })
        this.locations.forEach((coord: any) => {
          const marker = new google.maps.Marker({
            position: { lat: parseFloat(coord.latitude), lng: parseFloat(coord.longitude) },
            map: this.map,
          });
        });
      }
      else {
        this.toastrService.error("Some error occured!", 'Error');
      }
    });
  }
  editabeMode(office: any) {
    office.editableMode = true;
  }
  saveChanges(office: any): void {
    office.editableMode = false;
    this.officeLocationRequest.officeLocationName = office.officeLocationName;
    this.officeLocationRequest.officeId = office.officeId;
    this.addOffice();
  }
  cancelEdit(): void {
    this.GetOfficeLocationList();
  }
  deleteConfirmationPopup(id: any,marker:any) {
    // const geocoder = new google.maps.Geocoder();
    // const cityToConvert = '5 Fifth Rd, D Block Block D Satellite Town, Rawalpindi, Punjab 46300, Pakistan'; 

    // geocoder.geocode({ address: cityToConvert }, (results, status) => {
    //   if (status === 'OK' && results[0]) {
    //     const location = results[0].geometry.location;
    //     const latitude = location.lat();
    //     const longitude = location.lng();
    //     const locationName = results[0].formatted_address;

    //     console.log('City Name:', cityToConvert);
    //     console.log('Latitude:', latitude);
    //     console.log('Longitude:', longitude);

    //     // this.mapLocationList.push({
    //     //   officeLocationName: locationName,
    //     //   latitude: latitude.toString(),
    //     //   longitude: longitude.toString(),
    //     //   companyId: this.userContextService.user$._value.companyID,
    //     //   officeId: 0
    //     // });
    //   } else {
    //     console.error('Reverse geocoding failed:', status);
    //   }
    // });
    const factory = this.componentFactoryResolver.resolveComponentFactory(DeleteConfirmationComponent);
    const data: any =
    {
      Id: id
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogDeleteContainer?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((id: any) => {
      
      popupRef.destroy();
      if (id) {
        this.deleteOfficeSetup(id,marker)
      }
    });
  }

  deleteOfficeSetup(id: any,marker:any) {
    if (typeof id === 'number' && id !== -1 && id !== 0) {
      let model = {
        id: id,
      }    
      this.spinnerService.show();
      // this.removeMarker(marker);  
      // this.mapLocationList=this.mapLocationList.filter(x=>x.officeId!=id)
      // console.log('listttttttttttt', this.mapLocationList)
      // this.GetOfficeLocationList();
      // this.toastrService.success("Record has been deleted.");
      this.OfficeSetupservices.DeleteOfficeSetup(model).subscribe(data => {
        console.log("sssss",data)
        if (data.status) {
          this.toastrService.success("Record has been deleted.");
          this.GetOfficeLocationList();
        }
        this.spinnerService.hide();
      });
    }
    else{
      this.removeMarker(marker);      
      this.mapLocationList=this.mapLocationList.filter(x=>x.officeId!=id)
    }
  }

  switchViewTab(param: any = 'o') {
    this.addOffice();
  }

  saveLocationToDatabase() {
    if (this.officeId <= 0) {
      this.toastrService.error("Please select location");
      return;
    }
    let model = {
      latitude: this.latitude.toString(),
      longitude: this.longitude.toString(),
      companyId: this.userContextService.user$._value.companyID,
      officeId: this.officeId
    }
    this.spinnerService.show();
    this.OfficeSetupservices.saveLocation(model).subscribe(data => {
      this.spinnerService.hide();
      if (data.status) {
        this.toastrService.success(data.msg, '');
      }
      else {
        this.toastrService.error(data.msg, 'Error');
      }
    });
  }
  GetSetupLookUpData() {
    this.spinnerService.show();
    let model: any = {
      companyId: this.userContextService.user$._value.companyID,
      requiredDataList: ['office']
    }
    this.addEmployeeService.GetSetupLookUpData(model).subscribe(data => {
      if (data.status) {
        this.listLookup = data.lookUpList;
      }
      this.spinnerService.hide();
    });
  }
  OnOfficeSelectionChange(event: any) {
    let model = {
      companyId: this.userContextService.user$._value.companyID,
      officeId: event.target.value
    }
    this.OfficeSetupservices.GetLocation(model).subscribe(data => {
      if (data.status) {
        this.locationList = data.locationList;
        if (this.locationList.length > 0) {
          const firstLocation = this.locationList[0];
          if (firstLocation && firstLocation.latitude && firstLocation.longitude) {
            this.latitude = Number(firstLocation.latitude);
            this.longitude = Number(firstLocation.longitude);
            this.map = {} as google.maps.Map;
            this.mapInitializer();
          }
        }
      }
      this.spinnerService.hide();
    });
  }
}


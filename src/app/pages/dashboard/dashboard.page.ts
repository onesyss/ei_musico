import { Component,OnInit,ViewChild,ElementRef } from '@angular/core';
import { MenuController , NavController} from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';

declare var google:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit{


  map:any;
  infoWindows:any = [];
  markers:any;

ngOnInit() {}

  @ViewChild('map',{read:ElementRef,static:false}) mapRef:ElementRef;

  constructor(private menu: MenuController, private authService: AuthService,public geolocation:Geolocation,private alertService: AlertService,public navCtrl: NavController,private statusBar: StatusBar) { 
    this.menu.enable(true);

    // let status bar overlay webview
    this.statusBar.overlaysWebView(true);

    // set status bar to white
    this.statusBar.styleLightContent();

  }

  ionViewDidEnter(){
    this.showMap();
  }

  search(form: NgForm){
    this.authService.search(form.value.search,form.value.latitude, form.value.longitude).subscribe(
      data => {

          this.markers = data;
          if(data == null || data== 0){
            this.alertService.presentToast("Não foi encontrado professores de acordo com sua pesquisa nas proximidades.");
          }else{
            this.showMap();
          }
          console.log(data);   
      },
      error => {
        
        this.alertService.presentToast(error);
        console.log(error);
      
      }
    );
  }

  addMarkersToMap(markers){

    for (let marker of markers){
          let position = new google.maps.LatLng(marker.latitude,marker.longitude);
          let mapMarker = new google.maps.Marker({
            position: position,
            title:marker.nome,
            icon: {
              url:'data:image/png;base64,' + marker.avatar, 
              scaledSize: new google.maps.Size(30, 30)
          },
            instrumento:marker.instrumento,
            avatar:marker.avatar,
            usuario_inst:marker.ususario_inst
          });
          
          mapMarker.setMap(this.map);
          this.addInfoWindowToMarker(mapMarker);
    }
  }
 

  addInfoWindowToMarker(marker){

    let infoWindowContent = '<div id="content">'+
                              '<img src="data:image/png;base64,' + marker.avatar + '" width="32" style="border-radius:100px">' +
                              '<h5 id="firstHeading" class="firstHeading">' + marker.title + '</h5>' +
                              '<p><b>área de interesse:</b> ' + marker.instrumento + '</p>' +
                              '<a href="https://www.instagram.com/'+marker.usuario_inst+'/" >Visualizar instagram</a>' +
                            '</div>';
    
        let infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent,
        });
        
        marker.addListener('click',()=>{
            this.closeAllInfoWindows();
            infoWindow.open(this.map, marker);
        });

        this.infoWindows.push(infoWindow);
    }

    closeAllInfoWindows(){
      for(let window of this.infoWindows){
        window.close();
      }
    }

    lat;
    lng;

  showMap(){
    
    let latitude;
    let longitude;
    var location;
    this.geolocation.getCurrentPosition().then((position) => {
      
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      location = new google.maps.LatLng(parseFloat(latitude),parseFloat(longitude));

      const options = {
        center: location,
        zoom:15,
        disableDefaultUI:true
      }
    
    var noPoi = [
      {
          featureType: "poi",
          stylers: [
            { visibility: "off" }
          ]   
        }
      ];
      
      
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.map.setOptions({styles: noPoi});
    this.addMarkersToMap(this.markers);
    
    
    }).catch((error) => {
       console.log('Não foi possível encontrar sua localização', error);
     });

  }
 
  /* ionViewWillEnter() {
    this.authService.user().subscribe(
      user => {
        this.user = user;
        console.log(user);
      }
    );
  }*/
}
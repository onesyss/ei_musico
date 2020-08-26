import { Component } from '@angular/core';
import { Musicos } from 'src/app/models/musicos';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private authService: AuthService,public sanitizer: DomSanitizer) {}

  musicos: Musicos;

  ionViewWillEnter() {
    this.authService.musicos().subscribe(
      musicos => { 
            this.musicos = musicos;
            console.log(musicos);
      }
    );
  }

  safe(a){
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, '+a);
  }

}

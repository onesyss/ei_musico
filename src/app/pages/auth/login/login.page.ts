import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { RegisterPage } from '../register/register.page';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  token:any;
  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private storage: NativeStorage,
    private statusBar: StatusBar
  ) { 

        // let status bar overlay webview
        this.statusBar.overlaysWebView(true);

        // set status bar to white
        this.statusBar.styleLightContent();
  }

  ngOnInit() {
  }

  // Dismiss Login Modal
  dismissLogin() {
    this.modalController.dismiss();
  }

  // On Register button tap, dismiss login modal and open register modal
  async registerModal() {
    this.dismissLogin();
    const registerModal = await this.modalController.create({
      component: RegisterPage
    });
    return await registerModal.present();
  }

  login(form: NgForm){
    this.authService.login(form.value.email, form.value.senha).subscribe(
      data => {
          if(data > 0){
                
              //this.alertService.presentToast("Logado com sucesso");
              this.dismissLogin();
              this.navCtrl.navigateRoot('/dashboard');
            
          }else if(data == 0){

              this.alertService.presentToast("Dados inválidos");
              this.storage.remove("token");
              this.authService.isLoggedIn = false;
              delete this.token;

          } 
          console.log(data);   
      },
      error => {
        
        console.log(error);
      
      }
      /*() => {
        this.dismissLogin();
        this.navCtrl.navigateRoot('/dashboard');
      }*/
    );
  }
}
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private statusBar: StatusBar,
    private alertService: AlertService
  ) { 

        // let status bar overlay webview
        this.statusBar.overlaysWebView(true);

        // set status bar to white
        this.statusBar.styleLightContent();
  }

  ngOnInit() {
  }

  // Dismiss Register Modal
  dismissRegister() {
    this.modalController.dismiss();
  }

  // On Login button tap, dismiss Register modal and open login Modal
  async loginModal() {
    this.dismissRegister();
    const loginModal = await this.modalController.create({
      component: LoginPage,
    });
    return await loginModal.present();
  }

  register(form: NgForm){
    this.authService.register(form.value.nome, form.value.email, form.value.senha).subscribe(
      data => {
                if(data > 0){
                  this.alertService.presentToast("Registrado com sucesso");
                }else if(data == 0){
                  this.alertService.presentToast("Não foi possível salvar seus dados");
                } 
       /* this.authService.login(form.value.email, form.value.password).subscribe(
          data => {
              if(data > 0){
                this.dismissRegister();
                this.navCtrl.navigateRoot('/dashboard');
              }else if(data == 0){
                this.alertService.presentToast("Não foi possível salvar seus dados");
              }
          },
          error => {
            console.log(error);
          },
          () => {
            this.dismissRegister();
            this.navCtrl.navigateRoot('/dashboard');
          }
        );
        this.alertService.presentToast(data['message']);
      },
      error => {
        console.log(error);
      }
      () => {
        
      }*/
            }

        );
    }
}
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from './env.service';
import { Musicos } from '../models/musicos';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  token:any;
  constructor(
    private http: HttpClient,
    private storage: NativeStorage,
    private env: EnvService,
  ) { }  
  login(email: String, senha: String){
    return this.http.post(this.env.API_URL + 'login.php',
      {email: email, senha: senha}
    ).pipe(
        tap(token => {
          this.storage.setItem('token', token)
          .then(
            () => {
              console.log('Token Stored');
            },
              error => console.error('Error storing item', error)
          );
          this.token = token;
          this.isLoggedIn = true;
          return token;
        })
    );
  }
  search(search: String,latitude:String,longitude:String){
    return this.http.post(this.env.API_URL + 'musicos.php',
      {
       search:search,
       latitude:latitude,
       longitude:longitude
      },
      { withCredentials: true }
    ).pipe(
        tap(data => {
            return data;
        })
    );
  }
  register(nome: String, email: String, senha: String) {
    return this.http.post(this.env.API_URL + 'registro.php',
      {nome: nome, email: email, senha: senha}
    )
  }
  logout(){
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"]+" "+this.token["access_token"]
    });
    return this.http.get(this.env.API_URL + 'logout.php', { withCredentials: true })
    .pipe(
      tap(data => {
        this.storage.remove("token");
        this.isLoggedIn = false;
        delete this.token;
        return data;
      })
      
    )
  }
  musicos() {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"]+" "+this.token["access_token"]
    });
    return this.http.get<Musicos>(this.env.API_URL + 'musicos_detalhe.php', { withCredentials: true })
    .pipe(
      tap(musicos => {

        return musicos;
      
      })
    )
  }
  getToken() {
    return this.storage.getItem('token').then(
      data => {
        this.token = data;
        if(this.token != null) {
          this.isLoggedIn=true;
        } else {
          this.isLoggedIn=false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn=false;
      }
    );
  }
}
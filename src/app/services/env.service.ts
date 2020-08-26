import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  API_URL = 'https://www.tagsolution.com.br/projeto_musico/api_app/';

  constructor() { }
}

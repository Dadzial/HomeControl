import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

//TODO Pliki serwisu w angularze odpowiadaja za zapytania http websockety ogólnie komunikacja z backendem
//TODO ty musisz w private apiUrl = '' umiesic zrobiony przez siebie andpoit z weather controllera
//TODO i pozniej pod constructorem dac metodr które beda pobirac dane z tego endpointa i odpowiednio je przetwazac
//TODO dla przykladu i zrozumienia wszystkiego zajżyj do np auth service logout service gdy juz zrobisz przejdz do
//TODO  folderu weather (nad app component) plik weather.component.ts

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiUrl = ''


  constructor(private httpClient : HttpClient) { }
}

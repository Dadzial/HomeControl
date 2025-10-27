import {Component, OnInit} from '@angular/core';
import {WeatherService} from '../services/weather.service';
import {MatIcon} from '@angular/material/icon';

//TODO jesteś w komponencie i tutaj wyswietlasz to co daje serwis tutaj mowisz jak komponent ma dzialac itd itd
//TODO komponent składa sie 3 plików niby 4 ale pliku z dopiskiem spec  nie ruszamy te 3 pliki to
//TODO plik ts czyli logika plik css czyli style plik html czyli co ma byc w komponecie  i w pliku html
//TODO implentujemy zminne i metody z pliku ts tak aby np dajmy na to zrobisz tu metode ze po klikneciu przycisku
//TODO wyswietla sie test no to ta medoda bedzie wywola na html dlaczego ? bo jak widzisz nizej templateUrl to
//TODO style to raczej proste klasyczny css dla komponentu dalej widzimy imports które sa np pakietem ikon
//TODO z Maticons korzystaj najlepsze są co tego fragmentu moze on dziwić implements OnInit , AfterViewInit, OnDestroy
//TODO to cykl zycia komponentu 3 metody lecąc po kolei OnInit to jak komponent jest zainicjalizowany
//TODO AfterViewInit to jak komponent jest zainicjalizowany i jest widoczny (jak działa) na ekranie OnDestroy to jak komponent jest zniszczony(wyłączany)
//TODO zachecam do ich uzycia ale oczywiscie nie musisz w zasadzie to tyle co wygladu rob tak aby bylo ladnie najwyżej cos sie poprawi i wgl
//TODO a i moze rob to na innej brachy

@Component({
  selector: 'app-weather',
  imports: [MatIcon],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnInit , AfterViewInit, OnDestroy {

    constructor(private weatherService: WeatherService) {}

  ngOnInit() {
      console.log("Component is initialized")
  }

  ngAfterViewInit() {
    console.log("Component is working")
  }

  ngOnDestroy() {
    console.log("Component is destroyed")
  }
}

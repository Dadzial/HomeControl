import Controller from "../interfaces/controller.interface";
import {NextFunction, Request, request, Response, Router} from "express";

//TODO pewnie projekt nie dziala i spokojnie to nie blad tylko pewne usprawienie zobaczylem ze na
//TODO publicznym repo lata moj klucz do bazy (zostaw to dla siebie nie mow tego na uczelni bo zapomnialem ze repo jest publiczne xdddd)
//TODO zrobimy to profesjonalnie tak ja to zrobilem juz wczesniej uzyjemy pliku zminnych srodowiskowych
//TODO nazywa sie on ".env" umiesc go w folderze api tam gdzie package.json (bedzie na dc) bedzie on też w .gitignore wiadome
//TODO i od teraz wszystkie dane wrażliwe mają być tam . Nie musisz nic robić  config.ts ma już połączenie (pobiera np klucz do bazy)
//TODO teraz prośba wieksza dla ciebie żebyś nauczył sie troche angulara i jego sensu (aby przy prof piwko nie byc zielonym)
//TODO zrobisz widget pogodowy taki mały zeby byla wiadomy stan na zewnątrz (niby xd) zacznij od wygnerowania sobie klucza api na stronie
//TODO open weather api wez go i jako iż jest rzecza wrażliwą umieść w .env po tym w configu dlaczego winadomo importujesz config tu i zrobisz
//TODO scieżke która pobieże ci dla stałej lokalziacji opis pogody slownie temperture sile wiatru oraz kierunek plus ikone reprezentująca pogode
//TODO gdy to zrobisz i test w przegladrace (bo to get nie potrzebujesz postmana) wykaże ze dziala wtedy krok drugi to frontend
//TODO odpalasz backend w drugim oknie terminala wchodzisz w cd frontend tam odalasz go komenda "ng serve" logujesz sie danymi
//TODO login Damian hasło 123 i dam interseuje cie karta weather reszta intrukcji czeka na ciebie w frontend/src/app/services/weather.service.ts

class ClimateController implements Controller {
    public path = "api/weather";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

    }
}
export default ClimateController;
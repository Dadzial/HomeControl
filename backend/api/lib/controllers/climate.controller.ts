import Controller from "../interfaces/controller.interface";
import {NextFunction, Request, request, Response, Router} from "express";
import {Server} from "socket.io";

//TODO: Nastepna czesc apki to temperatura i wilgotnosc z czujnika (kod na discord) odczytasz z niego
//TODO: co wysyla plytka tutaj musisz to po pierwsze wyswietalac na sucho getem i zapisywac do bazy
//TODO: a potem enpoint do usuwania danych z bazy i na koniec websocket do frontu pliki w modules zrobione
//TODO: z czego model w calosci trzeba dorbic schema i service
//TODO:


class ClimateController implements Controller {
    public path = "api/climate";
    public router = Router();
    public esp32EndPoint = "http://192.168.2.240";
    private io: Server;


    constructor(io: Server) {
        this.io = io;
        this.initializeRoutes();
        this.initializeWebSocketHandler();
    }

    private initializeRoutes() {
        //TODO endpointy do zrobienia 
        // this.router.get(`${this.path}/temperature`, this.getTemperature);
        // this.router.get(`${this.path}/humidity`, this.getHumidity);
        // this.router.post(`${this.path}/save/temperature`, this.savaTemperature);
        // this.router.post(`${this.path}/save/humidity`, this.saveHumidity);
        // this.router.delete(`${this.path}/delete/climate`, this.deleteClimateData)
    }

    private initializeWebSocketHandler() {

    }
}
export default ClimateController;
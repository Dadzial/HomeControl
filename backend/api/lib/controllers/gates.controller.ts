import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import axios from "axios";

class GatesController implements Controller {
    public path = "/api/gates";
    public router = Router()
    public esp32EndPoint = "http://192.168.2.241";

    //TODO: Nastepnym i pewnie ostanim kontrolerem bedzie kontroler gates
    //TODO: chodzi mi tu o zrobienie enpointow do otwierania i zamykania oraz zatrzyamania bramy na podstawie
    //TODO: enpointu z esp32 ktory dostaniesz zadnych serwisow i bazy
    //TODO: uzyj do axios juz zaimportowanego

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/open`, this.openGate);
        this.router.post(`${this.path}/close`, this.closeGate);
        this.router.post(`${this.path}/stop`, this.stopGate);
    }

    private openGate = async (req: Request, res: Response, next: NextFunction) => {};

    private closeGate = async (req: Request, res: Response, next: NextFunction) => {};

    private stopGate = async (req: Request, res: Response, next: NextFunction) => {};

}
export default GatesController;

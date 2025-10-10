import Controller from "../interfaces/controller.interface";
import {Router} from "express";
import path from "path";
import { Request, Response } from "express";

class UserController implements Controller {
    public path = "/api/user";
    public router = Router();

    constructor() {
        this.initializeRouters();
    }

    //TODO Zadanie dla ciebie na start pewnie pamietasz jak tworzyłes urzytkowników do apki w poprzednim semsentrze
    //TODO tu chce abys zrobił to samo po prostu z instrukcji temat 10 u piwko masz wyprowadzony kontroler
    //TODO z middlewary oczywiscie testowy endpoint do usuniecia baza postawiona oczywiscie

    private initializeRouters() {
        this.router.get(`${this.path}/test`,this.test)
    }

    private test(req: Request, res: Response) {
        res.send("Test");
    }
}
export default UserController;
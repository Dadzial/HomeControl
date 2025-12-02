import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";

class GatesController implements Controller {
    public path = "/api/gates";
    public router = Router()
    public esp32EndPoint = "http://192.168.2.241";

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

    }

}
export default GatesController;

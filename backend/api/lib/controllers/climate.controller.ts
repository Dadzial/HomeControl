import Controller from "../interfaces/controller.interface";
import {NextFunction, Request, request, Response, Router} from "express";

//TODO :: letter
class ClimateController implements Controller {
    public path = "api/climate";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

    }
}
export default ClimateController;
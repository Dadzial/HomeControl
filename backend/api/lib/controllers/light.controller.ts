import path from "path";
import {NextFunction, Request, request, Response, Router} from "express";
import Controller from "../interfaces/controller.interface";
import {Server, Socket} from "socket.io";
import cron from "node-cron";
import Joi from "joi";

class LightController implements Controller {
    public path = "api/light";
    public router = Router();
    public esp32LightEndPoint = "http://192.168.2.192";
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        this.initializeRoutes();
        this.initializeWebSocketHandler();
    }

    //TODO :: masz zrobiony juz kontroler z obsługą websocketów dopisz tu metody ktore pozwolą włączyc swiatło
    //TODO :: pobrac status swiateł co do websocketu niech obsługuje tylko /toogle i status reszte to
    //TODO :: klasyczne http co do usage i /usage reset powinien byc zrobiony schema i serwis w light.service
    //TODO :: razem to wszystko spinasz tu dostajac w endpoicie czas wlaczenia swiatelem oraz reset
    //TODO :: dam ci strukture kodu esp32 gdy wkelisz ją do czata wszystko stanie jasne bo dostaniesz
    //TODO :: strukture jsona który masz wysyłać za pomoca tych enpointów zeby wszystko działo


    private initializeRoutes() {
        this.router.post(`${this.path}/toggle`, this.turnLight);
        this.router.get(`${this.path}/status`, this.getAllLightsStatus);
        this.router.get(`${this.path}/usage`, this.getLightUsageDurations);
        this.router.delete(`${this.path}/usage/reset`, this.resetLightUsageDurations);
    }

    private turnLight = async (request: Request, response: Response, next: NextFunction) => {

    };

    private getAllLightsStatus = async (request: Request, response: Response, next: NextFunction) => {

    };

    private getLightUsageDurations = async (request: Request, response: Response, next: NextFunction) => {

    };

    private resetLightUsageDurations = async (request: Request, response: Response, next: NextFunction) => {

    };

    private initializeWebSocketHandler() {

    }
}
export default LightController;
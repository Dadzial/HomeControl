import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import AlarmService from "../modules/services/alarm.service";

class AlarmController implements Controller {
    public path = '/api/alarm';
    public router = Router();
    public alarmService = new AlarmService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/all`,this.getAllAlarms)
        this.router.delete(`${this.path}/delete`,this.deleteAlarms)
    }

    private getAllAlarms = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const alarms = await this.alarmService.getAlarms();
            res.json(alarms);
        } catch (error) {
            next(error);
        }
    }

    private deleteAlarms = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const alarms = await this.alarmService.deleteAllAlarms();
            res.json(alarms);
        } catch (error) {
            next(error);
        }
    }
}
export default AlarmController;

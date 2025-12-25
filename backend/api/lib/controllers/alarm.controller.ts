import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import AlarmService from "../modules/services/alarm.service";

interface AlarmToggleBody {
    type: 'motion' | 'temperature' | 'gas';
    enabled: boolean;
}

class AlarmController implements Controller {
    public path = '/api/alarm';
    public router = Router();
    public alarmService = new AlarmService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/all`, this.getAllAlarms);
        this.router.get(`${this.path}/settings`, this.getSettings); // Nowy endpoint
        this.router.delete(`${this.path}/delete`, this.deleteAlarms);
        this.router.post(`${this.path}/toggle`, this.toggleAlarm);
    }

    private getAllAlarms = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const alarms = await this.alarmService.getAlarms();
            res.json(alarms);
        } catch (error) {
            next(error);
        }
    }

    private getSettings = (req: Request, res: Response, next: NextFunction) => {
        try {
            const settings = this.alarmService.getAlarmSettings();
            res.json(settings);
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

    private toggleAlarm = (req: Request<{}, {}, AlarmToggleBody>, res: Response, next: NextFunction) => {
        try {
            const { type, enabled } = req.body;

            if (!['motion', 'temperature', 'gas'].includes(type)) {
                return res.status(400).json({ message: 'Invalid alarm type' });
            }

            this.alarmService.setAlarmSettings(type, enabled);

            res.json({
                message: `Alarm type "${type}" is now ${enabled ? 'enabled' : 'disabled'}`,
                settings: this.alarmService.getAlarmSettings()
            });
        } catch (error) {
            next(error);
        }
    }
}

export default AlarmController;
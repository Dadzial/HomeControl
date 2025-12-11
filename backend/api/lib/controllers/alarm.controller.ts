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


    private alarmSettings: Record<string, boolean> = {
        motion: true,
        temperature: true,
        gas: true
    };

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/all`, this.getAllAlarms);
        this.router.delete(`${this.path}/delete`, this.deleteAlarms);
        this.router.post(`${this.path}/toggle`, this.toggleAlarm);
    }

    private getAllAlarms = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const alarms = await this.alarmService.getAlarms();
            const filtered = alarms.filter(a => this.alarmSettings[a.type]);
            res.json(filtered);
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
                return res.status(400).json({ success: false, message: 'Invalid alarm type' });
            }
            this.alarmSettings[type] = enabled;
            res.json({ success: true, type, enabled });
        } catch (error) {
            next(error);
        }
    }
}

export default AlarmController;

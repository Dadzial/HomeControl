import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import AlarmService from "../modules/services/alarm.service";
import logger from "../utils/logger"; // Loger już zaimportowany

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
        this.router.get(`${this.path}/settings`, this.getSettings);
        this.router.delete(`${this.path}/delete`, this.deleteAlarms);
        this.router.post(`${this.path}/toggle`, this.toggleAlarm);
    }

    private getAllAlarms = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const alarms = await this.alarmService.getAlarms();
            res.json(alarms);
        } catch (error) {
            logger.error(`Error fetching all alarms: ${error.message}`);
            next(error);
        }
    }

    private getSettings = (req: Request, res: Response, next: NextFunction) => {
        try {
            const settings = this.alarmService.getAlarmSettings();
            res.json(settings);
        } catch (error) {
            logger.error(`Error fetching alarm settings: ${error.message}`);
            next(error);
        }
    }

    private deleteAlarms = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.alarmService.deleteAllAlarms();
            logger.info("All alarms history has been deleted from database");
            res.json({ message: "History cleared" });
        } catch (error) {
            logger.error(`Error deleting alarms: ${error.message}`);
            next(error);
        }
    }

    private toggleAlarm = (req: Request<{}, {}, AlarmToggleBody>, res: Response, next: NextFunction) => {
        try {
            const { type, enabled } = req.body;

            if (!['motion', 'temperature', 'gas'].includes(type)) {
                logger.warn(`Attempted to toggle invalid alarm type: ${type}`);
                return res.status(400).json({ message: 'Invalid alarm type' });
            }

            this.alarmService.setAlarmSettings(type, enabled);

            logger.info(`Alarm settings changed: ${type} set to ${enabled}`);

            res.json({
                message: `Alarm type "${type}" is now ${enabled ? 'enabled' : 'disabled'}`,
                settings: this.alarmService.getAlarmSettings()
            });
        } catch (error) {
            logger.error(`Error toggling alarm ${req.body.type}: ${error.message}`);
            next(error);
        }
    }
}

export default AlarmController;
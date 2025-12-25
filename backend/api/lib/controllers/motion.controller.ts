import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import AlarmService from "../modules/services/alarm.service";
import axios from "axios";
import { config } from "../config";
import logger from "../utils/logger"; // Import loggera

class MotionController implements Controller {
    public path = "/api/motion";
    public router = Router();
    public esp32EndPoint = config.esp32EndPoint;
    public alarmService = new AlarmService();

    constructor() {
        this.initializeRoutes();
        this.startPolling();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/now`, this.getMotionData);
    }

    private getMotionData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const motionData = await this.getMotionDataFromEsp32();

            if (motionData.motion) {
                logger.warn("Motion detected (manual request). Triggering alarm.");
                await this.alarmService.createMotionAlarm();
            }

            return res.status(200).json({ motionData });
        } catch (error: any) {
            logger.error(`Error in getMotionData endpoint: ${error.message}`);
            return res.status(500).json({
                success: false,
                message: "Cannot get data from ESP32",
                error: error.message
            });
        }
    }

    private getMotionDataFromEsp32 = async () => {
        try {
            const url = `${this.esp32EndPoint}/motion`;
            const response = await axios.get(url, { timeout: 800 });
            return response.data;
        } catch (error: any) {

            logger.error(`ESP32 Motion Sensor connection error: ${error.message}`);
            throw error;
        }
    }

    private startPolling() {
        logger.info("Starting motion sensor polling (1000ms interval)");

        setInterval(async () => {
            try {
                const motionData = await this.getMotionDataFromEsp32();

                if (motionData.motion) {
                    logger.warn("MOTION DETECTED (auto-polling). Alarm created!");
                    await this.alarmService.createMotionAlarm();
                }
            } catch (err: any) {

                logger.debug(`Polling interval error: ${err.message}`);
            }
        }, 1000);
    }
}

export default MotionController;
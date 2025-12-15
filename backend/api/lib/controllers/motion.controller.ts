import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import AlarmService from "../modules/services/alarm.service";
import axios from "axios";
import { config } from "../config";

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
                console.log("Motion detected (manual), creating alarm...");
                await this.alarmService.createMotionAlarm();
            }

            return res.status(200).json({ motionData });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Cannot get data from ESP32",
                error: error.message
            });
        }
    }

    private getMotionDataFromEsp32 = async () => {
        const motionData = await axios.get(`${this.esp32EndPoint}/motion`);
        return motionData.data;
    }

    private startPolling() {
        setInterval(async () => {
            try {
                const motionData = await this.getMotionDataFromEsp32();

                if (motionData.motion) {
                    console.log("Motion detected (auto), creating alarm...");
                    await this.alarmService.createMotionAlarm();
                }
            } catch (err: any) {
                console.error("Error polling ESP32:", err.message);
            }
        }, 1000);
    }
}

export default MotionController;

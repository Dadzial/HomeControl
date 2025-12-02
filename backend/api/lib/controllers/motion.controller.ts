import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import AlarmService from "../modules/services/alarm.service";
import axios from "axios";

class MotionController implements Controller {
    public path = "/api/motion";
    public router = Router()
    public esp32EndPoint = "http://192.168.2.241";
    public alarmService = new AlarmService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/now`, this.getMotionData);
    }

    private getMotionData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const motionData = await this.getMotionDataFromEsp32();
            if (motionData.motion) {
                await this.alarmService.createMotionAlarm();
            }
            return res.status(200).json({ motionData });
        } catch (error) {
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

}
export default MotionController;
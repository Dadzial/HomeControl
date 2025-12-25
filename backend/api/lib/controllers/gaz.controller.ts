import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import axios from "axios";
import AlarmService from "../modules/services/alarm.service";
import { config } from "../config";
import logger from "../utils/logger"; // Import loggera

class GazController implements Controller {
    public path = '/api/gaz';
    public router: Router = Router();
    private esp32EndPoint = config.esp32EndPoint;
    public serviceAlarm: AlarmService;

    constructor() {
        this.serviceAlarm = new AlarmService();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/now`, this.getGazData);
    }

    private async readFromEsp32() {
        const url = `${this.esp32EndPoint}/air-quality`;
        try {
            const response = await axios.get(url, { timeout: 4000 });
            return response.data;
        } catch (error) {
            logger.error(`Failed to read gas data from ESP32 at ${url}: ${error.message}`);
            throw error;
        }
    }

    private getGazData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.readFromEsp32();


            logger.debug(`Gas sensor reading: ${data.gas}`);

            if (data.gas > 25) {

                logger.warn(`DANGEROUS GAS LEVEL DETECTED: ${data.gas}. Triggering alarm.`);
                await this.serviceAlarm.createGasAlarm();
            }

            return res.status(200).json({
                ...data,
                timestamp: new Date().toISOString()
            });

        } catch (error) {

            logger.error(`Error in getGazData endpoint: ${error.message}`);

            return res.status(500).json({
                success: false,
                message: "Cannot get data from ESP32",
                error: error.message
            });
        }
    }
}

export default GazController;
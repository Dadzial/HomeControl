import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import axios from "axios";
import { config } from "../config";
import logger from "../utils/logger"; // Import loggera

class GatesController implements Controller {
    public path = "/api/gates";
    public router = Router();
    public esp32EndPoint = config.esp32EndPoint;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/open`, this.openGate);
        this.router.post(`${this.path}/close`, this.closeGate);
        this.router.post(`${this.path}/stop`, this.stopGate);
    }

    private async sendGateCommand(
        action: "open" | "close" | "stop",
        res: Response,
        next: NextFunction
    ) {
        const url = `${this.esp32EndPoint}/gate`;

        try {
            logger.info(`Sending gate command: [${action.toUpperCase()}] to ${url}`);

            const { data, status } = await axios.post(
                url,
                { action },
                { timeout: 4000 }
            );

            logger.info(`Gate command [${action}] successful. ESP32 Status: ${status}`);

            return res.status(200).json({
                action,
                espStatus: status,
                espResponse: data,
                timestamp: new Date(),
            });
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    logger.error(`ESP32 returned error for [${action}]: Status ${error.response.status}`, {
                        data: error.response.data
                    });
                    return res.status(502).json({
                        message: "Error communication",
                        espStatus: error.response.status,
                        espResponse: error.response.data,
                    });
                }

                if (error.request) {
                    logger.error(`No response from ESP32 when sending [${action}] to ${url} - Timeout or Offline`);
                    return res.status(504).json({
                        message: "No response from ESP32",
                    });
                }
            }

            logger.error(`Critical error in GatesController [${action}]: ${error.message}`);
            return next(error);
        }
    }

    private openGate = async (_req: Request, res: Response, next: NextFunction) => {
        return this.sendGateCommand("open", res, next);
    };

    private closeGate = async (_req: Request, res: Response, next: NextFunction) => {
        return this.sendGateCommand("close", res, next);
    };

    private stopGate = async (_req: Request, res: Response, next: NextFunction) => {
        return this.sendGateCommand("stop", res, next);
    };
}

export default GatesController;
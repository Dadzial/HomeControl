import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import axios from "axios";

class GatesController implements Controller {
    public path = "/api/gates";
    public router = Router();
    public esp32EndPoint = "http://192.168.2.241";

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
        try {
            const url = `${this.esp32EndPoint}/gate`;

            const { data, status } = await axios.post(
                url,
                { action },
                { timeout: 4000 }
            );

            return res.status(200).json({
                action,
                espStatus: status,
                espResponse: data,
            });
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    return res.status(502).json({
                        message: "Błąd komunikacji z bramą",
                        espStatus: error.response.status,
                        espResponse: error.response.data,
                    });
                }

                if (error.request) {
                    return res.status(504).json({
                        message: "Brak odpowiedzi z ESP32",
                    });
                }
            }

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

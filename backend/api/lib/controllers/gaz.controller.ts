import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import axios from "axios";

class GazController implements Controller {
    public path = '/api/gaz';
    public router: Router = Router();
    public esp32Ip = "http://192.168.2.241";

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/now`, this.getGazData);
    }

    private async readFromEsp32() {
        const response = await axios.get(`${this.esp32Ip}/air-quality`);
        return response.data;
    }

    private getGazData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.readFromEsp32();

            return res.status(200).json({
                success: true,
                data,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Cannot get data from ESP32",
                error: error.message
            });
        }
    }
}

export default GazController;

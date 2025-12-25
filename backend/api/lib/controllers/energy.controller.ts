import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import logger from "../utils/logger"; // Import loggera

class EnergyController implements Controller {
    public path = "/api/energy";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/now`, this.getEnergyData);
    }

    private getEnergyData = (req: Request, res: Response, next: NextFunction) => {
        try {
            const energyData = this.generateEnergyData();
            const timestamp = new Date();


            logger.debug(`Energy data requested. Generated value: ${energyData}kW`);

            res.json({ energyData, timestamp });
        } catch (error) {

            logger.error(`Error in getEnergyData: ${error.message}`);
            next(error);
        }
    };

    private generateEnergyData(): number {
        const hour = new Date().getHours();

        let baseUsage: number;
        if (hour >= 0 && hour < 6) baseUsage = 0.5;
        else if (hour >= 6 && hour < 12) baseUsage = 1.5;
        else if (hour >= 12 && hour < 18) baseUsage = 2.5;
        else baseUsage = 3.5;

        const variation = (Math.random() - 0.5) * 0.6;
        const finalValue = parseFloat((baseUsage + variation).toFixed(2));


        if (finalValue > 3.8) {
            logger.warn(`High energy consumption simulated: ${finalValue}kW at hour ${hour}`);
        }

        return finalValue;
    }
}

export default EnergyController;
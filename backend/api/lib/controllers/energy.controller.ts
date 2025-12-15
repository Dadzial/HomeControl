import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";


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
        const energyData = this.generateEnergyData();
        const timestamp = new Date();
        res.json({ energyData, timestamp });
    };

    private generateEnergyData(): number {
        const hour = new Date().getHours();

        let baseUsage: number;
        if (hour >= 0 && hour < 6) baseUsage = 0.5;
        else if (hour >= 6 && hour < 12) baseUsage = 1.5;
        else if (hour >= 12 && hour < 18) baseUsage = 2.5;
        else baseUsage = 3.5;

        const variation = (Math.random() - 0.5) * 0.6;

        return parseFloat((baseUsage + variation).toFixed(2));
    }
}

export default EnergyController;

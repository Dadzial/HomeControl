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
        return parseFloat((Math.random() * 4.5 + 0.5).toFixed(2));
    }
}

export default EnergyController;

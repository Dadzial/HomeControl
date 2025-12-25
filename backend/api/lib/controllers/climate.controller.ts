import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import { Server, Socket } from "socket.io";
import axios from "axios";
import ClimateService from "../modules/services/climate.service";
import AlarmService from "../modules/services/alarm.service";
import { deleteClimateQuerySchema } from "../modules/schemas/climate.schema";
import { config } from "../config";
import logger from "../utils/logger";

class ClimateController implements Controller {
    public path = "/api/climate";
    public router = Router();
    private esp32EndPoint = config.esp32EndPoint;
    private io: Server;
    private serviceClimate: ClimateService;
    private serviceAlarm: AlarmService;


    constructor(io: Server) {
        this.io = io;
        this.serviceClimate = new ClimateService();
        this.serviceAlarm = new AlarmService();
        this.initializeRoutes();
        this.initializeWebSocketHandler();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/temperature`, this.getTemperature);
        this.router.get(`${this.path}/humidity`, this.getHumidity);
        this.router.get(`${this.path}/now`, this.getNow);
        this.router.post(`${this.path}/save/temperature`, this.saveTemperature);
        this.router.post(`${this.path}/save/humidity`, this.saveHumidity);
        this.router.get(`${this.path}/latest`, this.getLatestSaved);
        this.router.delete(`${this.path}/delete`, this.deleteClimateData);
    }

    private getTemperature = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const data = await this.fetchFromEsp32();
            return response.status(200).json({ temperature: data.temperature, timestamp: new Date().toISOString() });
        } catch (err) {
            logger.error(`Failed to get temperature from ESP32: ${err.message}`);
            return next(err);
        }
    };

    private getHumidity = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const data = await this.fetchFromEsp32();
            return response.status(200).json({ humidity: data.humidity, timestamp: new Date().toISOString() });
        } catch (err) {
            logger.error(`Failed to get humidity from ESP32: ${err.message}`);
            return next(err);
        }
    };

    private getNow = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const data = await this.fetchFromEsp32();
            return response.status(200).json(data);
        } catch (err) {
            logger.error(`Failed to get current climate data: ${err.message}`);
            return next(err);
        }
    };

    private saveTemperature = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const data = await this.fetchFromEsp32();

            if (data.temperature > 26) {
                logger.warn(`High temperature detected: ${data.temperature}°C. Triggering alarm.`);
                await this.serviceAlarm.createHighTemperatureAlarm();
            } else if (data.temperature < 15) {
                logger.warn(`Low temperature detected: ${data.temperature}°C. Triggering alarm.`);
                await this.serviceAlarm.createLowTemperatureAlarm();
            }

            const saved = await this.serviceClimate.saveReading(data.temperature, data.humidity);
            logger.info(`Climate reading saved: T:${data.temperature}, H:${data.humidity}`);

            this.io.emit("climate:update", { source: "save/temperature", data: saved });
            return response.status(201).json(saved);
        } catch (err) {
            logger.error(`Error in saveTemperature: ${err.message}`);
            return next(err);
        }
    };

    private saveHumidity = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const data = await this.fetchFromEsp32();
            const saved = await this.serviceClimate.saveReading(data.temperature, data.humidity);

            logger.info(`Climate reading saved (via humidity endpoint): T:${data.temperature}, H:${data.humidity}`);

            this.io.emit("climate:update", { source: "save/humidity", data: saved });
            return response.status(201).json(saved);
        } catch (err) {
            logger.error(`Error in saveHumidity: ${err.message}`);
            return next(err);
        }
    };

    private getLatestSaved = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const doc = await this.serviceClimate.getLatest();
            return response.status(200).json(doc);
        } catch (err) {
            logger.error(`Error fetching latest saved climate data: ${err.message}`);
            return next(err);
        }
    };

    private deleteClimateData = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { error, value } = deleteClimateQuerySchema.validate(request.query, { abortEarly: false, stripUnknown: true });
            if (error) {
                logger.warn(`Validation failed for climate data deletion: ${error.message}`);
                return response.status(400).json({ message: "Validation failed", details: error.details.map(d => d.message) });
            }

            const olderThanHours: number | undefined = value.olderThanHours;
            const result = await this.serviceClimate.deleteData(olderThanHours);

            logger.info(`Climate data deleted. Count: ${result.deletedCount}, Older than: ${olderThanHours}h`);

            this.io.emit("climate:deleted", { olderThanHours, result });
            return response.status(200).json({ deletedCount: result.deletedCount });
        } catch (err) {
            logger.error(`Error deleting climate data: ${err.message}`);
            return next(err);
        }
    };

    private initializeWebSocketHandler() {
        this.io.on("connection", (socket: Socket) => {
            logger.debug(`Socket connected in ClimateController: ${socket.id}`);

            socket.on("climate:get", async () => {
                try {
                    const data = await this.fetchFromEsp32();
                    socket.emit("climate:update", { source: "ws:get", data });
                } catch (err) {
                    logger.error(`WS climate:get error: ${err.message}`);
                    socket.emit("error", { scope: "climate:get", message: (err as Error).message });
                }
            });

            socket.on("climate:latest", async () => {
                try {
                    const latest = await this.serviceClimate.getLatest();
                    socket.emit("climate:update", { source: "ws:latest", data: latest });
                } catch (err) {
                    logger.error(`WS climate:latest error: ${err.message}`);
                    socket.emit("error", { scope: "climate:latest", message: (err as Error).message });
                }
            });

            socket.on("disconnect", () => {
                logger.debug(`Socket disconnected: ${socket.id}`);
            });
        });

    }

    private async fetchFromEsp32(): Promise<{ temperature: number, humidity: number, timestamp: string }> {
        const url = `${this.esp32EndPoint}/dht`;
        try {
            const { data } = await axios.get(url, { timeout: 4000 });
            const t = data?.temperature;
            const h = data?.humidity;

            if (t === "error" || h === "error" || typeof t !== "number" || typeof h !== "number") {
                throw new Error("Invalid DHT reading from ESP32");
            }
            return { temperature: t, humidity: h, timestamp: new Date().toISOString() };
        } catch (err) {
            logger.error(`ESP32 Fetch Error at ${url}: ${err.message}`);
            throw err;
        }
    }
}

export default ClimateController;
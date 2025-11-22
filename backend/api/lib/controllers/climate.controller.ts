import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import { Server, Socket } from "socket.io";
import axios from "axios";
import ClimateService from "../modules/services/climate.service";
import { deleteClimateQuerySchema } from "../modules/schemas/climate.schema";

class ClimateController implements Controller {
  public path = "/api/climate";
  public router = Router();
  public esp32EndPoint = "http://192.168.2.241";
  private io: Server;
  private service: ClimateService;

  constructor(io: Server) {
    this.io = io;
    this.service = new ClimateService();
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
    } catch (err) { return next(err); }
  };

  private getHumidity = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const data = await this.fetchFromEsp32();
      return response.status(200).json({ humidity: data.humidity, timestamp: new Date().toISOString() });
    } catch (err) { return next(err); }
  };

  private getNow = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const data = await this.fetchFromEsp32();
      return response.status(200).json(data);
    } catch (err) { return next(err); }
  };

  private saveTemperature = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const data = await this.fetchFromEsp32();
      const saved = await this.service.saveReading(data.temperature, data.humidity);
      this.io.emit("climate:update", { source: "save/temperature", data: saved });
      return response.status(201).json(saved);
    } catch (err) { return next(err); }
  };

  private saveHumidity = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const data = await this.fetchFromEsp32();
      const saved = await this.service.saveReading(data.temperature, data.humidity);
      this.io.emit("climate:update", { source: "save/humidity", data: saved });
      return response.status(201).json(saved);
    } catch (err) { return next(err); }
  };

  private getLatestSaved = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const doc = await this.service.getLatest();
      return response.status(200).json(doc);
    } catch (err) { return next(err); }
  };

  private deleteClimateData = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { error, value } = deleteClimateQuerySchema.validate(request.query, { abortEarly: false, stripUnknown: true });
      if (error) {
        return response.status(400).json({ message: "Validation failed", details: error.details.map(d => d.message) });
      }

      const olderThanHours: number | undefined = value.olderThanHours;
      const result = await this.service.deleteData(olderThanHours);
      this.io.emit("climate:deleted", { olderThanHours, result });
      return response.status(200).json({ deletedCount: result.deletedCount });
    } catch (err) { return next(err); }
  };

  private initializeWebSocketHandler() {
    this.io.on("connection", (socket: Socket) => {
      socket.on("climate:get", async () => {
        try {
          const data = await this.fetchFromEsp32();
          socket.emit("climate:update", { source: "ws:get", data });
        } catch (err) {
          socket.emit("error", { scope: "climate:get", message: (err as Error).message });
        }
      });

      socket.on("climate:latest", async () => {
        try {
          const latest = await this.service.getLatest();
          socket.emit("climate:update", { source: "ws:latest", data: latest });
        } catch (err) {
          socket.emit("error", { scope: "climate:latest", message: (err as Error).message });
        }
      });
    });

  }

  private async fetchFromEsp32(): Promise<{ temperature: number, humidity: number, timestamp: string }> {
    const url = `${this.esp32EndPoint}/dht`;
    const { data } = await axios.get(url, { timeout: 4000 });
    const t = data?.temperature;
    const h = data?.humidity;
    if (t === "error" || h === "error" || typeof t !== "number" || typeof h !== "number") {
      throw new Error("Invalid DHT reading from ESP32");
    }
    return { temperature: t, humidity: h, timestamp: new Date().toISOString() };
  }
}

export default ClimateController;

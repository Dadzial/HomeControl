import {NextFunction, Request, Response, Router} from "express";
import Controller from "../interfaces/controller.interface";
import {Server, Socket} from "socket.io";
import {
    toggleLightSchema,
    resetUsageSchema,
    RoomsUnion,
} from "../modules/schemas/lights.schema";
import LightsService from "../modules/services/lights.service";
import { config } from "../config";
import logger from "../utils/logger"; // Import loggera

class LightController implements Controller {
    public path = "/api/light";
    public router = Router();
    private esp32EndPoint = config.esp32EndPoint;
    private io: Server;
    private service: LightsService;

    constructor(io: Server) {
        this.io = io;
        this.service = new LightsService(this.esp32EndPoint);
        this.initializeRoutes();
        this.initializeWebSocketHandler();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/toggle`, this.turnLight);
        this.router.get(`${this.path}/status`, this.getAllLightsStatus);
        this.router.get(`${this.path}/usage`, this.getLightUsageDurations);
        this.router.delete(`${this.path}/usage/reset`, this.resetLightUsageDurations);
    }

    private turnLight = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { error, value } = toggleLightSchema.validate(request.body, { abortEarly: false, stripUnknown: true });
            if (error) {
                logger.warn(`Light toggle validation failed: ${error.message}`);
                return response.status(400).json({ message: "Validation failed", details: error.details.map(d => d.message) });
            }
            const { room, state } = value as { room: RoomsUnion | "all"; state: boolean };

            logger.info(`Toggling light: Room [${room}] to State [${state ? 'ON' : 'OFF'}]`);

            await this.service.toggleRoomOnEsp32(room, state);
            this.service.applyToggleToUsage(room, state, new Date());

            const status = await this.service.fetchStatusFromEsp32();
            const usage = this.service.getUsage();

            this.io.emit("light:status", { status, usage });
            return response.status(200).json({ status, usage });
        } catch (err: any) {
            logger.error(`Error in turnLight: ${err.message}`);
            return next(err);
        }
    };

    private getAllLightsStatus = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const status = await this.service.fetchStatusFromEsp32();
            const usage = this.service.getUsage();
            logger.debug("Fetched all lights status and usage");
            return response.status(200).json({ status, usage });
        } catch (err: any) {
            logger.error(`Error fetching lights status: ${err.message}`);
            return next(err);
        }
    };

    private getLightUsageDurations = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const usage = this.service.getUsage();
            return response.status(200).json({ usage });
        } catch (err: any) {
            logger.error(`Error fetching light usage: ${err.message}`);
            return next(err);
        }
    };

    private resetLightUsageDurations = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { error, value } = resetUsageSchema.validate(request.query, { abortEarly: false, stripUnknown: true });
            if (error) {
                logger.warn(`Reset usage validation failed: ${error.message}`);
                return response.status(400).json({ message: "Validation failed", details: error.details.map(d => d.message) });
            }
            const room = value.room as RoomsUnion | "all" | undefined;

            logger.info(`Resetting light usage for: ${room || 'all rooms'}`);
            this.service.resetUsage(room);

            const usage = this.service.getUsage();
            const status = await this.service.fetchStatusFromEsp32();

            this.io.emit("light:status", { status, usage });
            return response.status(200).json({ status, usage });
        } catch (err: any) {
            logger.error(`Error resetting light usage: ${err.message}`);
            return next(err);
        }
    };

    private initializeWebSocketHandler() {
        this.io.on("connection", (socket: Socket) => {
            logger.debug(`Socket.io connection established in LightController: ${socket.id}`);

            socket.on("light:status:get", async () => {
                try {
                    const status = await this.service.fetchStatusFromEsp32();
                    const usage = this.service.getUsage();
                    socket.emit("light:status", { status, usage });
                } catch (e: any) {
                    logger.error(`WS light:status:get error: ${e.message}`);
                    socket.emit("error", { scope: "light:status:get", message: e.message });
                }
            });

            socket.on("light:toggle", async (payload: unknown) => {
                try {
                    const { error, value } = toggleLightSchema.validate(payload, { abortEarly: false, stripUnknown: true });
                    if (error) {
                        logger.warn(`WS light:toggle validation failed: ${error.message}`);
                        return socket.emit("error", { scope: "light:toggle", message: "Validation failed" });
                    }
                    const { room, state } = value as { room: RoomsUnion | "all"; state: boolean };

                    logger.info(`WS Toggle Light: Room [${room}] to [${state ? 'ON' : 'OFF'}] (from socket ${socket.id})`);

                    await this.service.toggleRoomOnEsp32(room, state);
                    this.service.applyToggleToUsage(room, state, new Date());

                    const status = await this.service.fetchStatusFromEsp32();
                    const usage = this.service.getUsage();

                    this.io.emit("light:status", { status, usage });
                } catch (e: any) {
                    logger.error(`WS light:toggle error: ${e.message}`);
                    socket.emit("error", { scope: "light:toggle", message: e.message });
                }
            });
        });
    }
}
export default LightController;
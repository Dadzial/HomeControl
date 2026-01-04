import { Server, Socket } from "socket.io";
import {
    toggleLightSchema,
    resetUsageSchema,
    RoomsUnion,
} from "../modules/schemas/lights.schema";
import LightsService from "../modules/services/lights.service";
import { config } from "../config";
import logger from "../utils/logger";

class LightController {
    private io: Server;
    private service: LightsService;

    constructor(io: Server) {
        this.io = io;
        this.service = new LightsService(config.esp32EndPoint);
        this.initializeWebSocketHandler();
    }

    private initializeWebSocketHandler() {
        this.io.on("connection", (socket: Socket) => {
            logger.info(`WS Light connected: ${socket.id}`);

            socket.on("light:status:get", async () => {
                try {
                    const status = await this.service.fetchStatusFromEsp32();
                    const usage = this.service.getUsage();
                    socket.emit("light:status", { status, usage });
                } catch (err: any) {
                    logger.error(err.message);
                    socket.emit("error", { scope: "light:status:get", message: err.message });
                }
            });

            socket.on("light:toggle", async (payload: unknown) => {
                try {
                    const { error, value } = toggleLightSchema.validate(payload, {
                        abortEarly: false,
                        stripUnknown: true,
                    });

                    if (error) {
                        return socket.emit("error", {
                            scope: "light:toggle",
                            message: "Validation failed",
                        });
                    }

                    const { room, state } = value as {
                        room: RoomsUnion | "all";
                        state: boolean;
                    };

                    await this.service.toggleRoomOnEsp32(room, state);
                    this.service.applyToggleToUsage(room, state, new Date());

                    const status = await this.service.fetchStatusFromEsp32();
                    const usage = this.service.getUsage();

                    this.io.emit("light:status", { status, usage });
                } catch (err: any) {
                    logger.error(err.message);
                    socket.emit("error", { scope: "light:toggle", message: err.message });
                }
            });

            socket.on("light:usage:reset", async (payload: unknown) => {
                try {
                    const { error, value } = resetUsageSchema.validate(payload, {
                        abortEarly: false,
                        stripUnknown: true,
                    });

                    if (error) {
                        return socket.emit("error", {
                            scope: "light:usage:reset",
                            message: "Validation failed",
                        });
                    }

                    const room = value.room as RoomsUnion | "all" | undefined;
                    this.service.resetUsage(room);

                    const status = await this.service.fetchStatusFromEsp32();
                    const usage = this.service.getUsage();

                    this.io.emit("light:status", { status, usage });
                } catch (err: any) {
                    logger.error(err.message);
                    socket.emit("error", { scope: "light:usage:reset", message: err.message });
                }
            });

            socket.on("disconnect", () => {
                logger.info(`WS Light disconnected: ${socket.id}`);
            });
        });
    }
}

export default LightController;

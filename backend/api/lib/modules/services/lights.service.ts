import axios from "axios";
import { ILightUsage } from "../models/lights.model";
import logger from "../../utils/logger";

export type Rooms = "kitchen" | "garage" | "room" | "bath";
type RoomsOrAll = Rooms | "all";
type StatusMap = Record<Rooms, boolean>;

class LightsService {
    private baseUrl: string;
    private usage: Map<Rooms, ILightUsage>;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl.replace(/\/+$/, "");
        this.usage = new Map<Rooms, ILightUsage>([
            ["kitchen", { room: "kitchen", totalUsageMs: 0 }],
            ["garage",  { room: "garage",  totalUsageMs: 0 }],
            ["room",    { room: "room",    totalUsageMs: 0 }],
            ["bath",    { room: "bath",    totalUsageMs: 0 }],
        ]);
        logger.info("LightsService initialized with rooms: kitchen, garage, room, bath");
    }

    async fetchStatusFromEsp32(): Promise<StatusMap> {
        const url = `${this.baseUrl}/showlight`;
        try {
            const { data } = await axios.get(url, { timeout: 3000 });
            return {
                kitchen: !!data.kitchen,
                garage: !!data.garage,
                room: !!data.room,
                bath: !!data.bath,
            };
        } catch (error: any) {
            logger.error(`Failed to fetch lights status from ESP32: ${error.message}`);
            throw error;
        }
    }

    async toggleRoomOnEsp32(room: RoomsOrAll, state: boolean): Promise<void> {
        const url = `${this.baseUrl}/led`;
        let payload: Partial<Record<Rooms, boolean>>;

        if (room === "all") {
            payload = { kitchen: state, garage: state, room: state, bath: state };
        } else {
            payload = { [room]: state } as Partial<Record<Rooms, boolean>>;
        }

        try {
            logger.debug(`Sending LED payload to ESP32: ${JSON.stringify(payload)}`);
            await axios.post(url, payload, { timeout: 3000, headers: { "Content-Type": "application/json" } });
        } catch (error: any) {
            logger.error(`Error toggling light on ESP32 (${room}): ${error.message}`);
            throw error;
        }
    }

    applyToggleToUsage(room: RoomsOrAll, state: boolean, now: Date) {
        const apply = (r: Rooms) => {
            const entry = this.usage.get(r)!;
            if (state) {
                if (!entry.turnedOnAt) {
                    entry.turnedOnAt = now;
                    logger.debug(`Usage tracking: Light in ${r} turned ON at ${now.toISOString()}`);
                }
            } else {
                if (entry.turnedOnAt) {
                    const duration = now.getTime() - entry.turnedOnAt.getTime();
                    entry.totalUsageMs += duration;
                    entry.turnedOnAt = undefined;
                    logger.debug(`Usage tracking: Light in ${r} turned OFF. Session duration: ${duration}ms`);
                }
            }
            this.usage.set(r, entry);
        };

        if (room === "all") {
            (["kitchen", "garage", "room", "bath"] as Rooms[]).forEach(apply);
        } else {
            apply(room);
        }
    }

    getUsage(): Record<Rooms, { totalUsageMs: number; turnedOnAt?: string }> {

        const now = Date.now();
        const result: Record<Rooms, { totalUsageMs: number; turnedOnAt?: string }> = {
            kitchen: { totalUsageMs: 0 },
            garage:  { totalUsageMs: 0 },
            room:    { totalUsageMs: 0 },
            bath:    { totalUsageMs: 0 },
        };

        (["kitchen", "garage", "room", "bath"] as Rooms[]).forEach((r) => {
            const entry = this.usage.get(r)!;
            let total = entry.totalUsageMs;
            if (entry.turnedOnAt) {
                total += now - entry.turnedOnAt.getTime();
            }
            result[r] = {
                totalUsageMs: total,
                ...(entry.turnedOnAt ? { turnedOnAt: entry.turnedOnAt.toISOString() } : {}),
            };
        });

        return result;
    }

    resetUsage(room?: RoomsOrAll) {
        const resetOne = (r: Rooms) => {
            const current = this.usage.get(r)!;
            const isOn = !!current.turnedOnAt;
            this.usage.set(r, {
                room: r,
                totalUsageMs: 0,
                turnedOnAt: isOn ? new Date() : undefined,
            });
            logger.info(`Light usage statistics reset for room: ${r}`);
        };

        if (!room || room === "all") {
            logger.warn("Global reset of light usage statistics initiated.");
            (["kitchen", "garage", "room", "bath"] as Rooms[]).forEach(resetOne);
        } else {
            resetOne(room);
        }
    }
}

export default LightsService;
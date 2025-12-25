import mongoose, { Document, Model, Schema } from "mongoose";
import { IClimate } from "../models/climate.model";
import logger from "../../utils/logger";

interface IClimateDoc extends IClimate, Document {}

const ClimateSchema = new Schema<IClimateDoc>({
    temperature: { type: Number, required: true },
    humidity:    { type: Number, required: true },
    timestamp:   { type: Date,   required: true, default: () => new Date() },
}, {
    versionKey: false,
    collection: "climate"
});

const ClimateModel: Model<IClimateDoc> =
    mongoose.models.Climate || mongoose.model<IClimateDoc>("Climate", ClimateSchema);

class ClimateService {

    async saveReading(temperature: number, humidity: number, timestamp: Date = new Date()) {
        try {
            const doc = await ClimateModel.create({ temperature, humidity, timestamp });

            logger.debug(`Climate reading saved to DB: ${temperature}°C, ${humidity}%`);

            return {
                id: doc._id.toString(),
                temperature: doc.temperature,
                humidity: doc.humidity,
                timestamp: doc.timestamp,
            };
        } catch (error: any) {
            logger.error(`Error saving climate reading to database: ${error.message}`);
            throw error;
        }
    }


    async getLatest() {
        try {
            const doc = await ClimateModel.findOne().sort({ timestamp: -1 }).lean();
            return doc ? {
                id: (doc as any)._id?.toString(),
                temperature: doc.temperature,
                humidity: doc.humidity,
                timestamp: doc.timestamp,
            } : null;
        } catch (error: any) {
            logger.error(`Error fetching latest climate data: ${error.message}`);
            throw error;
        }
    }


    async deleteData(olderThanHours?: number) {
        try {
            if (!olderThanHours || olderThanHours <= 0) {
                const res = await ClimateModel.deleteMany({});
                logger.warn(`FULL CLIMATE DATA PURGE initiated. Deleted ${res.deletedCount} records.`);
                return { deletedCount: res.deletedCount ?? 0 };
            }

            const threshold = new Date(Date.now() - olderThanHours * 3600 * 1000);
            const res = await ClimateModel.deleteMany({ timestamp: { $lt: threshold } });

            logger.info(`Cleanup: Deleted ${res.deletedCount} climate records older than ${olderThanHours} hours.`);

            return { deletedCount: res.deletedCount ?? 0 };
        } catch (error: any) {
            logger.error(`Error during climate data deletion: ${error.message}`);
            throw error;
        }
    }
}

export default ClimateService;
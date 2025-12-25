import mongoose, { Document, Model, Schema } from "mongoose";
import { IClimate } from "../models/climate.model";

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
    const doc = await ClimateModel.create({ temperature, humidity, timestamp });
    return {
      id: doc._id.toString(),
      temperature: doc.temperature,
      humidity: doc.humidity,
      timestamp: doc.timestamp,
    };
  }


  async getLatest() {
    const doc = await ClimateModel.findOne().sort({ timestamp: -1 }).lean();
    return doc ? {
      id: (doc as any)._id?.toString(),
      temperature: doc.temperature,
      humidity: doc.humidity,
      timestamp: doc.timestamp,
    } : null;
  }


  async deleteData(olderThanHours?: number) {
    if (!olderThanHours || olderThanHours <= 0) {
      const res = await ClimateModel.deleteMany({});
      return { deletedCount: res.deletedCount ?? 0 };
    }
    const threshold = new Date(Date.now() - olderThanHours * 3600 * 1000);
    const res = await ClimateModel.deleteMany({ timestamp: { $lt: threshold } });
    return { deletedCount: res.deletedCount ?? 0 };
  }
}

export default ClimateService;

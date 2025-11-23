import {Schema, model} from "mongoose";
import {IAlarm,AlarmType} from "../models/alarm.model";

const AlarmSchema = new Schema<IAlarm>({
    type : {type: String, enum: Object.values(AlarmType),  required: true},
    triggerAt : {type: Date, required: true}
});

export default model<IAlarm>('Alarm', AlarmSchema);

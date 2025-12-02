import AlarmModel from "../schemas/alarm.schema";
import {AlarmType, IAlarm} from "../models/alarm.model";


class AlarmService {

    private lastMotionAlarm: Date | null = null;

    public async createAlarm(alarm: IAlarm) {
       try {
           const alarmModel = new AlarmModel(alarm);
           return await alarmModel.save();
       } catch (error) {
           console.error(`Create Alarm Error: ${error.message}`);
           throw new Error('Failed to create alarm');
       }
    }

    public async getAlarms() {
        try {
            return await AlarmModel.find();
        } catch (error) {
            console.error(`Get Alarms Error: ${error.message}`);
            throw new Error('Failed to get alarms');
        }
    }

    public async deleteAllAlarms() {
        try {
            return await AlarmModel.deleteMany();
        } catch (error) {
            console.error(`Delete All Alarms Error: ${error.message}`);
            throw new Error('Failed to delete all alarms');
        }
    }

    public async createHighTemperatureAlarm() {
        return this.createAlarm({
            type: AlarmType.temperatureRising,
            triggerAt: new Date(),
        });
    }

    public async createLowTemperatureAlarm() {
        return this.createAlarm({
            type: AlarmType.temperatureDown,
            triggerAt: new Date(),
        });
    }

    public async createGasAlarm() {
        return this.createAlarm({
            type: AlarmType.gas,
            triggerAt: new Date(),
        });
    }

    public async createMotionAlarm() {
        const now = new Date();
        return this.createAlarm({
            type: AlarmType.motion,
            triggerAt: now,
        });
    }


}

export default AlarmService;

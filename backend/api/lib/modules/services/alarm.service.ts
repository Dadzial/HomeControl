import AlarmModel from "../schemas/alarm.schema";
import { AlarmType, IAlarm } from "../models/alarm.model";

class AlarmService {
    private static alarmSettings: Record<string, boolean> = {
        motion: true,
        temperature: true,
        gas: true
    };

    public setAlarmSettings(type: 'motion' | 'temperature' | 'gas', enabled: boolean) {
        AlarmService.alarmSettings[type] = enabled;
        console.log(`Settings updated: ${JSON.stringify(AlarmService.alarmSettings)}`);
    }

    public getAlarmSettings() {
        return AlarmService.alarmSettings;
    }

    public async createAlarm(alarm: IAlarm) {
        const typeKey: 'motion' | 'temperature' | 'gas' =
            alarm.type === AlarmType.motion ? 'motion' :
                (alarm.type === AlarmType.temperatureRising || alarm.type === AlarmType.temperatureDown) ? 'temperature' :
                    'gas';


        if (!AlarmService.alarmSettings[typeKey]) {
            console.log(`Alarm "${alarm.type}" blocked by settings – not saving to database.`);
            return null;
        }

        try {
            const alarmModel = new AlarmModel(alarm);
            return await alarmModel.save();
        } catch (error: any) {
            console.error(`Create Alarm Error: ${error.message}`);
            throw new Error('Failed to create alarm');
        }
    }

    public async getAlarms() {
        try {
            return await AlarmModel.find().sort({ triggerAt: -1 });
        } catch (error: any) {
            console.error(`Get Alarms Error: ${error.message}`);
            throw new Error('Failed to get alarms');
        }
    }

    public async deleteAllAlarms() {
        try {
            return await AlarmModel.deleteMany();
        } catch (error: any) {
            console.error(`Delete All Alarms Error: ${error.message}`);
            throw new Error('Failed to delete all alarms');
        }
    }

    public async createHighTemperatureAlarm() {
        return this.createAlarm({ type: AlarmType.temperatureRising, triggerAt: new Date() });
    }

    public async createLowTemperatureAlarm() {
        return this.createAlarm({ type: AlarmType.temperatureDown, triggerAt: new Date() });
    }

    public async createGasAlarm() {
        return this.createAlarm({ type: AlarmType.gas, triggerAt: new Date() });
    }

    public async createMotionAlarm() {
        return this.createAlarm({ type: AlarmType.motion, triggerAt: new Date() });
    }
}

export default AlarmService;
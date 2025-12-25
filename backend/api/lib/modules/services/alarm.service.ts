import AlarmModel from "../schemas/alarm.schema";
import { AlarmType, IAlarm } from "../models/alarm.model";
import logger from "../../utils/logger";

class AlarmService {
    private static alarmSettings: Record<string, boolean> = {
        motion: true,
        temperature: true,
        gas: true
    };

    public setAlarmSettings(type: 'motion' | 'temperature' | 'gas', enabled: boolean) {
        AlarmService.alarmSettings[type] = enabled;
        logger.info(`Global alarm settings updated: ${type} is now ${enabled ? 'ENABLED' : 'DISABLED'}`);
        logger.debug(`Current settings state: ${JSON.stringify(AlarmService.alarmSettings)}`);
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
            logger.warn(`Alarm "${alarm.type}" triggered but BLOCKED by user settings. Not saving to DB.`);
            return null;
        }

        try {
            const alarmModel = new AlarmModel(alarm);
            const savedAlarm = await alarmModel.save();
            logger.info(`Alarm stored in database: ${alarm.type}`);
            return savedAlarm;
        } catch (error: any) {
            logger.error(`Database Error while creating alarm (${alarm.type}): ${error.message}`);
            throw new Error('Failed to create alarm');
        }
    }

    public async getAlarms() {
        try {
            const alarms = await AlarmModel.find().sort({ triggerAt: -1 });
            logger.debug(`Fetched ${alarms.length} alarms from database`);
            return alarms;
        } catch (error: any) {
            logger.error(`Database Error while fetching alarms: ${error.message}`);
            throw new Error('Failed to get alarms');
        }
    }

    public async deleteAllAlarms() {
        try {
            const result = await AlarmModel.deleteMany();
            logger.warn(`ALARM HISTORY PURGED. Deleted documents: ${result.deletedCount}`);
            return result;
        } catch (error: any) {
            logger.error(`Database Error while deleting alarms: ${error.message}`);
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
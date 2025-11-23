
export enum AlarmType {
    motion = 'motion',
    temperatureRising = 'temperature_rising',
    temperatureDown = 'temperature_down',
    gas = 'gas'
}


export interface IAlarm {
    type : AlarmType;
    triggerAt : Date;
}
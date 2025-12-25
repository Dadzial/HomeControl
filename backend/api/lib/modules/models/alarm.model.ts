
export enum AlarmType {
    motion = 'motion',
    temperatureRising = 'temperatureRising',
    temperatureDown = 'temperatureDown',
    gas = 'gas'
}


export interface IAlarm {
    type : AlarmType;
    triggerAt : Date;
}
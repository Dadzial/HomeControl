
export enum AlarmType {
    motion = 'motion',
    temperatureRising = 'temperature rising',
    temperatureDown = 'temperature down',
    gas = 'gas'
}


export interface IAlarm {
    type : AlarmType;
    triggerAt : Date;
}
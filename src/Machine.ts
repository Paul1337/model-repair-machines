import { EventEmitter } from 'stream';
import { config } from './config';
import { modelTimeToMs } from './timeConverter';
import { getRandom } from './random';

export class Machine extends EventEmitter {
    isBroken: boolean;
    onTheWay: boolean;
    spearTimeCost: number;
    reliability: number;
    timeWithoutBreak: number;
    breakType: (typeof config.machine.breakTypes)[0] | null;

    constructor(public name: string) {
        super();

        this.timeWithoutBreak = 0;
        this.breakType = null;
        this.onTheWay = false;
        this.isBroken = false;
        this.reliability = config.machine.reliability;
        this.spearTimeCost = config.machine.spareTimeCost;

        this.planNextBreak();
    }

    planNextBreak() {
        const { maxTimeBeforeBreaks: time } = config.machine;
        const timeBeforeBreaks = Math.floor(
            ((1 - this.reliability) * Math.random() + this.reliability) * time
        );
        setTimeout(this.break.bind(this), modelTimeToMs(timeBeforeBreaks));
    }

    break() {
        const breakTypeInd = Math.floor(Math.random() * config.machine.breakTypes.length);
        const breakType = config.machine.breakTypes[breakTypeInd];
        this.breakType = breakType;
        this.putOnTrack();
        this.isBroken = true;
    }

    putOnTrack() {
        if (!this.breakType) throw new Error('break type is not defined');
        const time = getRandom(this.breakType?.mechanicGoTime[0], this.breakType?.mechanicGoTime[1]);
        setTimeout(() => {
            this.emit('break');
        }, modelTimeToMs(time));
    }

    fix() {
        if (!this.breakType) throw new Error('break type is not defined');
        this.planNextBreak();
        const serviceTime = getRandom(this.breakType.serviceTime[0], this.breakType.serviceTime[1]);
        setTimeout(() => {
            this.emit('fix');
            this.timeWithoutBreak = 0;
            this.isBroken = false;
        }, modelTimeToMs(serviceTime));
    }

    shouldBreak() {
        const maxTime = 10000;
        const probability = Math.random() * 0.5 + Math.min(this.timeWithoutBreak / maxTime, 1) * 0.5;
        return probability > 0.85;
    }

    update() {
        this.timeWithoutBreak++;
        if (this.shouldBreak() && !this.isBroken) {
            this.break();
        }
    }
}

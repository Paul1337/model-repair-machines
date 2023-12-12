import { Machine } from './Machine';
import { config } from './config';
import { RepairQueue } from './RepairQueue';
import { modelTimeToMs } from './timeConverter';

const repairQueue = new RepairQueue();

const machines: Machine[] = new Array(config.mechanicsCount);
for (let i = 0; i < machines.length; i++) {
    machines[i] = new Machine('m' + i);
    machines[i].on('break', () => {
        console.log('break', i);
        if (config.usePriorityAdd) {
            repairQueue.priorityAdd(machines[i]);
        } else {
            repairQueue.add(machines[i]);
        }
        if (repairQueue.data.length === 1) {
            repairQueue.data[0].fix();
        }
        // console.log('Queue', repairQueue.data.length);
    });
    machines[i].on('fix', () => {
        console.log(`Fixed m${i}`);
        repairQueue.data.shift();
        if (repairQueue.data.length > 0) {
            repairQueue.data[0].fix();
        }
    });
}

let additionalCost = 0;
let mechanicsWaitingSum = 0;
let time = 0;

const daySeconds = 8 * 60 * 60;

let interval = setInterval(() => {
    time++;
    for (let machine of machines) {
        // machine.update();
        if (machine.isBroken) {
            additionalCost += machine.spearTimeCost;
        }
    }
    mechanicsWaitingSum += repairQueue.data.length;
    if (time % 100 == 0) {
        console.log('Mechanics waiting: ', repairQueue.data.length, 'mid: ', mechanicsWaitingSum / time);
        if (repairQueue.data.length) {
            console.log(repairQueue.toString());
        }
        console.log(`Time ${time}; additional cost:`, additionalCost, 'mid: ', additionalCost / time);
    }
    if (time >= daySeconds) {
        clearInterval(interval);
        process.exit(0);
    }
}, modelTimeToMs(1));

import { EventEmitter } from 'stream';
import { Machine } from './Machine';
import { modelTimeToMs } from './timeConverter';
import { config } from './config';

export interface RepairItemScheme {
    time: number;
    machine: Machine;
}

export class RepairQueue extends EventEmitter {
    data: Machine[];

    constructor() {
        super();
        this.data = [];
    }

    add(machine: Machine) {
        this.data.push(machine);
    }

    priorityAdd(machine: Machine) {
        if (!machine.breakType) throw new Error('no break type');

        if (this.data.length === 0) {
            this.add(machine);
            return;
        }

        const { priority } = machine.breakType;
        let i = 0;
        while (i < this.data.length && (this.data[i].breakType?.priority ?? 0) > priority) {
            i++;
        }
        console.log('so i', i);
        if (i == 0) {
            this.data.splice(i + 1, 0, machine);
        } else {
            this.data.splice(i, 0, machine);
        }
    }

    toString() {
        return this.data.map(machine => `${machine.name} (${machine.breakType?.priority})`).join(', ');
    }
}

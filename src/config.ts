export const config = {
    mechanicsCount: 10,
    usePriorityAdd: false,
    machine: {
        reliability: 0.8,
        maxTimeBeforeBreaks: 2500,
        spareTimeCost: 5,
        breakTypes: [
            {
                mechanicGoTime: [60, 780],
                serviceTime: [210, 390],
                priority: 0,
            },
            {
                mechanicGoTime: [120, 600],
                serviceTime: [70, 130],
                priority: 1,
            },
        ],
    },
};

// 1.12
// 12.4 (358830)

// 1.23
// 12.8 (369875)

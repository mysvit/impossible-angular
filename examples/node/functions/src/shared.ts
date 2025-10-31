/**
 * performance in percentage
 *
 * Example: process1 = 10ms, process2 = 15ms
 * - performancePercent(10, 15) => 50; process1 50% faster than process2
 * - performancePercent(9, 10) => -11; process1 11% slower then process2
 *
 * @param mainProcess - time for main process
 * @param secondProcess - time for second process
 * @returns percentage - (+) process1 faster (-) process1 slower
 */
export const performancePercent = (mainProcess: number, secondProcess: number): number => {
    const smallerNum = mainProcess < secondProcess ? mainProcess : secondProcess
    return Math.round(((secondProcess - mainProcess) / smallerNum) * 100)
}

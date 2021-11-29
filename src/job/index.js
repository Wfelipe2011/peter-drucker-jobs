import { scheduleJob } from 'node-schedule';
//https://github.com/node-schedule/node-schedule#readme

export class JobWork   {
  static start({ config, start }) {
    scheduleJob(config, () => {
      start();
    });
  }
}


import { JobWork } from '../index';
import { get } from '../service/api.axios';

export class JobGet {
  start(config) {
    JobWork.start({
      config: config,
      start: this.execute.bind(this),
    });
  }

  async execute() {
    const data = await get('user_schedule/job') 
    console.log(data);
  }
}


import { JobWork } from '../index.js';
import { get } from '../service/api.axios.js';

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

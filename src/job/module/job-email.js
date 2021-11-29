
import { JobWork } from '../index.js';
import { get } from '../service/api.axios.js';

export class JobEmail {
  start(config) {
    JobWork.start({
      config: config,
      start: this.execute.bind(this),
    });
  }

  async execute() {
    await get('job-email')
  }
}


import { JobWork } from '../index';
import { get } from '../service/api.axios';

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

import { JobWork } from "../index";
import { get } from "../service/api.axios";

export class JobEmail {
  start(config): void {
    JobWork.start({
      config: config,
      start: this.execute.bind(this),
    });
  }

  async execute(): Promise<void> {
    await get("job-email");
  }
}

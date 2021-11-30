import { JobWork } from "../index";

export class JobStart {
  start(config): void {
    JobWork.start({
      config: config,
      start: this.execute.bind(this),
    });
  }

  async execute(): Promise<void> {
    console.log("Estou vivo!");
  }
}

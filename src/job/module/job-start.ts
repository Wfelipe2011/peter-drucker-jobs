import { JobWork } from "../index";
import { getJob } from "../service/api.axios";

export class JobStart {
  start(config): void {
    JobWork.start({
      config: config,
      start: this.execute.bind(this),
    });
  }

  private getDate() {
    return new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
  }

  async execute(): Promise<void> {
    const data = await getJob("https://job-peter-drucker.herokuapp.com/");
    console.log(`${data}: ${this.getDate()}`);
  }
}

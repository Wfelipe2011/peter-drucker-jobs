
import { JobWork } from '../index';
import { get } from '../service/api.axios';
// const wbm = require('wbm');

// Modulo WhatsApp





export class JobGet {
  start(config): void {
    JobWork.start({
      config: config,
      start: this.execute.bind(this),
    });
  }
  
  async execute(): Promise<void> {
    // WhatsOneMessage(5515981428548, `Oi gatinha ${new Date().toLocaleString("pt-BR", {
    //   timeZone: "America/Sao_Paulo",
    // })}`)
    await get('user_schedule/job') 
  }
}

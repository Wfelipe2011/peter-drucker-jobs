
import { JobWork } from '../index';
import { get } from '../service/api.axios';
import wbm from 'wbm';

// Modulo WhatsApp

function WhatsOneMessage(numero, text) {

    return wbm.start().then(async () => {
        const phones = [numero]
        const message = text;
        await wbm.send(phones, message);
        await wbm.end();
    }).catch(err => console.log(err));
}



export class JobGet {
  start(config): void {
    JobWork.start({
      config: config,
      start: this.execute.bind(this),
    });
  }
  
  async execute(): Promise<void> {
    WhatsOneMessage(5515981428548, `Oi gatinha ${new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    })}`)
    await get('user_schedule/job') 
  }
}

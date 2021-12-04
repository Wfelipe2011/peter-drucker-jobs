import express from "express";
import dotenv from "dotenv";
import { JobEmail } from "./job/module/job-email";
import { JobGet, WhatsOneMessage } from "./job/module/job-get-user-schedule";
import { JobStart } from "./job/module/job-start";
const wbm = require("wbm");
const fs = require("fs");
const qrcode = require("qrcode");

dotenv.config();
const app = express();
// teste por minuto '*/1 * * * *'
// jobEmailInfo.start({ hour: 8, minute: 59, dayOfWeek: [1, 2, 3, 4, 5], tz: 'Etc/GMT-3' });
// jobUserSchedule.start({ hour: 9, minute: 20 });
const jobInfo = new JobEmail();
jobInfo.start({
  hour: 13,
  minute: 5,
  dayOfWeek: [1, 2, 3, 4, 5],
});

const jobGet = new JobGet();
jobGet.start("*/30 * * * *");

const jobStart = new JobStart();
jobStart.start("*/29 * * * *");

app.get("/", (req, res) => {
  wbm
    .start({ showBrowser: false, qrCodeData: true, session: false })
    .then(async (qrCodeData) => {
     // show data used to generate QR Code
      // await wbm.waitQRCode();
      const result = await run(qrCodeData).catch((error) =>
        console.error(error.stack)
      );
      res.set("Content-Type", "text/html");
      res.send(Buffer.from(result || "<h2>Erro!</h2>"));

      await wbm.end();
    })
    .catch((err) => {
      console.log(err);
    });
    // res.set("Content-Type", "text/html");
    // res.send(Buffer.from("<h2>Estou Vivo!</h2>"));
});

app.listen(process.env.PORT, () => {
  console.log(`> Sever listening on port: ${process.env.PORT}`);
});

async function run(value?: any) {
  const res = await qrcode.toString(value, { version: 2 });
  // qrcode.generate(qrcodeData, { small: true });
  return `<img src="${res}">`;
}

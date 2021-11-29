import express from "express";
import dotenv from 'dotenv'
import { JobEmail } from './job/module/job-email.js';
import { JobGet } from './job/module/job-get-user-schedule.js';

dotenv.config();
const app = express();

// // teste por minuto '*/1 * * * *'
// jobEmailInfo.start({ hour: 8, minute: 59, dayOfWeek: [1, 2, 3, 4, 5], tz: 'Etc/GMT-3' });
// jobUserSchedule.start({ hour: 9, minute: 20 });
const jobInfo = new JobEmail()
jobInfo.start({ hour: 8, minute: 59, dayOfWeek: [1, 2, 3, 4, 5], tz: 'Etc/GMT-3' })

const jobGet = new JobGet()
jobGet.start('*/10 * * * *')

app.listen(process.env.PORT, () => {
  console.log(`> Sever listening on port: ${process.env.PORT}`);
});

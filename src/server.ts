import express from "express";
import dotenv from "dotenv";
import { JobEmail } from "./job/module/job-email";
import { JobGet } from "./job/module/job-get-user-schedule";
import { JobStart } from "./job/module/job-start";

dotenv.config();
const app = express();
//https://crontab.guru/
const jobInfo = new JobEmail();
jobInfo.start("59 8 * * 1-5");

const jobGet = new JobGet();
jobGet.start("* 9,12,15 * * 1-5");

const jobStart = new JobStart();
jobStart.start("*/29 * * * *");

app.get("/", (req, res) => {
  res.send("Estou vivo!").json();
});

app.listen(process.env.PORT, () => {
  console.log(`> Sever listening on port: ${process.env.PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import { JobEmail } from "./job/module/job-email";
import { JobGet } from "./job/module/job-get-user-schedule";
import { JobStart } from "./job/module/job-start";
// const wbm = require("../wbm");
// const fs = require("fs");
// const qrcode = require("qrcode");
const puppeteer = require("puppeteer");

dotenv.config();
const app = express();

const SELECTORS = {
  LOADING: "progress",
  INSIDE_CHAT: "document.getElementsByClassName('two')[0]",
  QRCODE_PAGE: "body > div > div > .landing-wrapper",
  QRCODE_DATA: "div[data-ref]",
  QRCODE_DATA_ATTR: "data-ref",
  SEND_BUTTON: 'div:nth-child(2) > button > span[data-icon="send"]',
};
// teste por minuto '*/1 * * * *'
// jobEmailInfo.start({ hour: 8, minute: 59, dayOfWeek: [1, 2, 3, 4, 5], tz: 'Etc/GMT-3' });
// jobUserSchedule.start({ hour: 9, minute: 20 });
// const jobInfo = new JobEmail();
// jobInfo.start({
//   hour: 9,
//   minute: 20,
// });

// const jobGet = new JobGet();
// jobGet.start("*/10 * * * *");

// const jobStart = new JobStart();
// jobStart.start("*/29 * * * *");
app.use(express.static("public"));
app.get("/connect", puppeteerConection);
app.get("/send", async (req, res) => {
  await WhatsOneMessage(5515981428548, "teste");
  res.send("Chamou").json();
});

let page = null;
let browser = null;

async function puppeteerConection(req, res) {
  const data = await start();

  res.type("image/png");
  res.send(Buffer.from(data));
}

app.listen(process.env.PORT, () => {
  console.log(`> Sever listening on port: ${process.env.PORT}`);
});

async function WhatsOneMessage(numero, text) {
  const phones = [numero];
  const message = text;
  console.log('chamou');
  await send(phones, message);
  // await browser.close()
}

async function start() {
  const browserTeste = await puppeteer.launch();
  const pageTeste = await browserTeste.newPage();

  page = pageTeste;
  browser = browserTeste;
  
  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
  );
  page.setDefaultTimeout(60000);

  await page.goto("https://web.whatsapp.com/");

  await page.waitForSelector(SELECTORS.QRCODE_DATA, { timeout: 60000 });
  const qrcodeData = await page.evaluate((SELECTORS) => {
    let qrcodeDiv = document.querySelector(SELECTORS.QRCODE_DATA);
    return qrcodeDiv.getAttribute(SELECTORS.QRCODE_DATA_ATTR);
  }, SELECTORS);
  return await page.screenshot();
}

async function send(phoneOrContacts, message) {
  for (let phoneOrContact of phoneOrContacts) {
    await sendTo(phoneOrContact, message);
  }
}

async function sendTo(phoneOrContact, message) {
  let phone = phoneOrContact;
  if (typeof phoneOrContact === "object") {
    phone = phoneOrContact.phone;
    message = generateCustomMessage(phoneOrContact, message);
  }
  console.log(phone);
  console.log(`https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    message
  )}`);
  try {
    process.stdout.write("Sending Message...\r");
    await page.goto(
      `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
        message
      )}`
    );
    await page.screenshot();
    await page.waitForSelector(SELECTORS.LOADING, {
      hidden: true,
      timeout: 60000,
    });
    await page.waitForSelector(SELECTORS.SEND_BUTTON, { timeout: 5000 });
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await page.waitFor(2000);
    // process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${phone} Sent\n`);
    // counter.success++;
  } catch (err) {
    // process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${phone} Failed\n`);
    // counter.fails++;
    console.error(err);
  }
}

function generateCustomMessage(contact, messagePrototype) {
  let message = messagePrototype;
  for (let property in contact) {
    message = message.replace(
      new RegExp(`{{${property}}}`, "g"),
      contact[property]
    );
  }
  return message;
}
// async function run(value?: any) {
//   const res = await qrcode.toDataURL(value, { errorCorrectionLevel: 'L' });
//   // qrcode.toString(value, { type: "terminal" }, function (err, url) {
//   //   console.log(url);
//   // });
//   // qrcode.generate(qrcodeData, { small: true });
//   return `<img src="${res}">`;
// }

// wbm
//   .start({ showBrowser: false, qrCodeData: true, session: false })
//   .then(async (qrCodeData) => {
//     // show data used to generate QR Code
//     // await wbm.waitQRCode();
//     const result = await run(qrCodeData).catch((error) =>
//       console.error(error.stack)
//     );
//     res.set("Content-Type", "text/html");
//     res.send(Buffer.from(result || "<h2>Erro!</h2>"));

//     await wbm.end();
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// res.set("Content-Type", "text/html");
// res.send(Buffer.from("<h2>Estou Vivo!</h2>"));

const puppeteer = require("puppeteer");
// const path = require('path');
// const tmpPath = path.resolve(__dirname, '../tmp');

const SELECTORS = {
  LOADING: "progress",
  INSIDE_CHAT: "document.getElementsByClassName('two')[0]",
  QRCODE_PAGE: "body > div > div > .landing-wrapper",
  QRCODE_DATA: "div[data-ref]",
  QRCODE_DATA_ATTR: "data-ref",
  SEND_BUTTON: 'div:nth-child(2) > button > span[data-icon="send"]',
};

let page = null;
let browser = null;

async function isAuthenticated() {
  if (!page) return true;
  console.log("Authenticating...");
  console.log(await isInsideChat());
  return await isInsideChat();
}

async function needsToScan() {
  return page
    .waitForSelector(SELECTORS.QRCODE_PAGE, {
      timeout: 0,
    })
    .then(() => false);
}

async function isInsideChat() {
  return page
    .waitForFunction(SELECTORS.INSIDE_CHAT, {
      timeout: 0,
    })
    .then(() => false);
}

async function start() {
  try {
    const browserTeste = await puppeteer.launch({
      headless: false,
      // userDataDir: tmpPath,
      args: [
        "--no-sandbox",
        // "--blink-settings=imagesEnabled=false"]
      ],
    });
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
  } catch (error) {
    console.error("start => ", error);
  }
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
  console.log(
    `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
      message
    )}`
  );
  try {
    process.stdout.write("Sending Message...\r");
    await page
      .goto(
        `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
          message
        )}`
      )
      .catch((e) => console.log(e));

    await page
      .waitForSelector(SELECTORS.LOADING, {
        hidden: true,
        timeout: 60000,
      })
      .catch((e) => console.log(e));

    await page
      .waitForSelector(SELECTORS.SEND_BUTTON, { timeout: 5000 })
      .catch((e) => console.log(e));
    await page.waitFor(3000).catch((e) => console.log(e));
    await page.keyboard.press("Enter").catch((e) => console.log(e));
    await page.waitFor(2000).catch((e) => console.log(e));
    // await page.goto("https://web.whatsapp.com/");
    // process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${phone} Sent\n`);
    // counter.success++;
  } catch (err) {
    // process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${phone} Failed\n`);
    // counter.fails++;
    console.error("sendTo => ", err);
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

async function end() {
  await browser.close();
  console.log(`Fim...`);
}

export { start, send, end };

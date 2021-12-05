
const puppeteer = require("puppeteer");

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

  async function finish(){
      await browser.close()
  }

  export {
      start,
      send,
      finish
  }
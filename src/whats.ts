import express from "express";
import dotenv from "dotenv";
import { end, send, start } from "./whats.mod";

dotenv.config();
const app = express();

app.use(express.static("public"));

app.get("/connect", puppeteerConection);

app.get("/send", async (req, res) => {
  res.send("mandou!").json();
});

app.get("/fim", async (req, res) => {
  // await finish();
  res.send("finish").json();
});

async function WhatsOneMessage(numero, text) {
  const phones = [numero];
  const message = text;

  await send(phones, message);
  await end()
}

async function puppeteerConection(req, res) {
  const data = await start();
  if (data) {
    res.type("image/png");
    res.send(Buffer.from(data));
  }else{
    res.send("logado").json();
  }
  setTimeout(async () => {
    // setInterval(async () => {
    await WhatsOneMessage(5515981785706, "teste");
    // }, 6000);
  }, 10000);
}

app.listen(process.env.PORT, () => {
  console.log(`> Sever listening on port: ${process.env.PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import { finish, send, start } from "./whats.mod";

dotenv.config();
const app = express();

app.use(express.static("public"));

app.get("/connect", puppeteerConection);

app.get("/send", async (req, res) => {
  async function WhatsOneMessage(numero, text) {
    const phones = [numero];
    const message = text;

    await send(phones, message);
    res.send("mandou!").json();
  }
  await WhatsOneMessage(5515981428548, "teste");
});

app.get("/fim", async (req, res) => {
  await finish();
  res.send("finish").json();
});

async function puppeteerConection(req, res) {
  const data = await start();

  res.type("image/png");
  res.send(Buffer.from(data));
}

app.listen(process.env.PORT, () => {
  console.log(`> Sever listening on port: ${process.env.PORT}`);
});

import { createServer, Server, ServerResponse } from "http";
import { Bot } from "./bot/bot";
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

const PORT = 4200 || process.env.PORT;

const server: Server = createServer((request, response: ServerResponse) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello World!\n");
});

puppeteer.use(stealthPlugin());

const config = {
  searchValue: "JavaScript",
  maxRecords: 10,
};

const pairs = {
  title: "div > .jss232",
  offerURL: "div > a",
};

const parentElement = "div > .root";

(async () => {
  const bot = new Bot(config);

  await bot.init(false);
  await bot.goto("https://justjoin.it/all/javascript");

  const pageTitle = await bot.Scrapper.getPageTitle();
  console.log(pageTitle);

  const data = await bot.Scrapper.getAllData(".css-ic7v2w", pairs, 10);

  console.log(data);

  await bot.close();
})();

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

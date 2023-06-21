import { createServer, Server, ServerResponse } from "http";
import puppeteer, { ElementHandle, Page } from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import * as fs from "fs/promises";
import { Bot } from "./bot/bot";

const PORT = 4200 || process.env.PORT;

const server: Server = createServer((request, response: ServerResponse) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello World!\n");
});

puppeteerExtra.use(stealthPlugin());

// Puppeteer will not run without these lines

(async () => {
  const scraperOPtions = {
    searchValue: "JavaScript",
    maxRecords: 10,
  };

  const url = "https://justjoin.it/";

  const bot = new Bot(scraperOPtions);
  const selectorWhat = "input.MuiInputBase-input";
  const nodeoptions = "div.css-ic7v2w > div > div";

  const pairs = {
    offerURL: "a",
  };

  await bot.init(false);
  await bot.goto(url);
  await bot.setViewPortResolution(1080, 720);
  await bot.useInputElementToFillQuery(
    bot.page,
    selectorWhat,
    scraperOPtions.searchValue,
    "Enter",
    200
  );

  await bot.mouseScrollOfElement(bot.page, nodeoptions, 5, 200);

  const data = await bot.Scrapper.getHtmlElementsData(
    bot.page,
    nodeoptions,
    pairs,
    20
  );
  console.log("Data", data);

  await bot.close();
})();

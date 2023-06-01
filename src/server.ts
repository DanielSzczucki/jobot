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

// //works
// const getAllData = async (
//   page: Page,
//   parentSelector: string,
//   elementsPairs: Record<string, string>,
//   length: number
// ) => {
//   const elements = await page.evaluate(
//     (selector: string, pairs: Record<string, string>, maxLength: number) => {
//       const elementsList = document.querySelectorAll(selector);

//       const maxIterations =
//         maxLength !== undefined
//           ? Math.min(maxLength, elementsList.length)
//           : elementsList.length;

//       return Array.from(elementsList)
//         .slice(0, maxIterations)
//         .map((element) => {
//           const data = {};

//           for (const [key, selector] of Object.entries(pairs)) {
//             const childSelector = selector;
//             const dataKey = key;

//             if (dataKey === "offerURL") {
//               const value =
//                 element.querySelector<HTMLAnchorElement>(childSelector)?.href ||
//                 "";
//               data[key] = value;
//             } else {
//               const value =
//                 element.querySelector<HTMLElement>(childSelector)?.innerText ||
//                 "";
//               data[key] = value;
//             }
//           }
//           return data;
//         });
//     },
//     parentSelector,
//     elementsPairs,
//     length
//   );

//   return elements;
// };

// //works
// async function scrollElements(
//   page: Page,
//   elementSelector: string,
//   itemCount: number,
//   scrollDealay: number
// ) {
//   try {
//     const elements = await page.$$(elementSelector);

//     for (let i = 0; i < itemCount && i < elements.length; i++) {
//       const element = elements[i];

//       await page.evaluate((el) => el.scrollIntoView(), element);
//       await new Promise((resolve) => setTimeout(resolve, scrollDealay));
//     }
//   } catch (e) {
//     console.log(e);
//   }
// }

// //debug needed - cant return data

// (async () => {
//   // Inicjalizacja przeglądarki
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   // Przechodzimy na stronę JustJoinIT
//   await page.goto("https://justjoin.it/", {
//     waitUntil: "domcontentloaded",
//   });

//   const selectorWhat = "input.MuiInputBase-input";
//   const nodeoptions = "div.css-ic7v2w > div > div";
//   const elementToScroll = "div.css-ic7v2w > div > div";
//   const recordCount = 30; // Liczba rekordów do pobrania
//   page.setViewport({ width: 1080, height: 720 });
//   await new Promise((resolve) => setTimeout(resolve, 4000));
//   // Wykonujemy akcje na stronie

//   await page.waitForSelector(selectorWhat);
//   await page.click(selectorWhat);

//   await new Promise((resolve) => setTimeout(resolve, 3000));
//   await page.type(selectorWhat, "JavaScript");

//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   await page.keyboard.press("Enter");
//   await new Promise((resolve) => setTimeout(resolve, 3000)); // Oczekiwanie na przewinięcie, 2000 ms

//   await page.waitForSelector(nodeoptions);
//   await new Promise((resolve) => setTimeout(resolve, 3000));
//   // class="css-ic7v2w"

//   const config = {
//     searchValue: "JavaScript",
//     maxRecords: 10,
//   };

//   const pairs = {
//     offerURL: "a",
//   };

//   // await page.$$eval(nodeoptions, (elements) =>
//   //   elements.map((e) => ({
//   //     // title: e.querySelector(selector).innerText,
//   //     // level: e.querySelector(selector).innerText,
//   //     url: e.querySelector("a").href,
//   //     // promo: e.querySelector(selector)).innerText,
//   //   }))
//   // );

//   // const offers = [];

//   // for (let i = 0; i < 2; i++) {
//   //   await scrollElements(page, nodeoptions, 10, 100);
//   //   const data = await page.$$eval(nodeoptions, (elements) =>
//   //     elements.map((e) => ({
//   //       // title: e.querySelector(selector).innerText,
//   //       // level: e.querySelector(selector).innerText,
//   //       url: e.querySelector<HTMLAnchorElement>("a").href,
//   //       // promo: e.querySelector(selector)).innerText,
//   //     }))
//   //   );
//   //   offers.push(...data);
//   //   await scrollElements(page, nodeoptions, 10, 100);
//   // }

//   const data = await getAllData(page, nodeoptions, pairs, 10);
//   await scrollElements(page, nodeoptions, 20, 800);
//   const offers = await getAllData(page, nodeoptions, pairs, 10);

//   console.log(offers);
//   console.log(offers.length);

//   await page.close();
// })();
// //

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
  const data = await bot.Scrapper.getGroupHtmlElementsData(
    bot.page,
    nodeoptions,
    pairs,
    10
  );
  console.log(data);

  await bot.close();
})();

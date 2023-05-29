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

//actually ewerything inside function is working, have discard mouse, replece with code scrolling. have to divide, add record lenght.

async function scrollElements(
  page: Page,
  elementSelector: string,
  itemCount: number,
  scrollDealay: number
) {
  try {
    const elements = await page.$$(elementSelector);

    for (let i = 0; i < itemCount && i < elements.length; i++) {
      const element = elements[i];

      await page.evaluate((el) => el.scrollIntoView(), element);
      await new Promise((resolve) => setTimeout(resolve, scrollDealay));
    }
  } catch (e) {
    console.log(e);
  }
}

const getAllHtmlData = async (
  page: Page,
  parentSelector: string,
  elementsPairs: Record<string, string>,
  length: number
) => {
  const elements = await page.evaluate(
    (parentSelector, elementsPairs, length) => {
      const elementsList = document.querySelectorAll(parentSelector);

      const maxIterations =
        length !== undefined
          ? Math.min(length, elementsList.length)
          : elementsList.length;

      return Array.from(elementsList)
        .slice(0, maxIterations)
        .map((element) => {
          const data = {};
          for (const key in elementsPairs) {
            const childSelector = elementsPairs[key];
            console.log("child Selector", childSelector);

            if (childSelector === "offerURL") {
              const value =
                element.querySelector<HTMLAnchorElement>(childSelector)?.href ||
                "";
              data[key] = value;
            } else {
              const value =
                element.querySelector<HTMLElement>(childSelector)?.innerText ||
                "";
              data[key] = value;
            }
          }
          return data;
        });
    },
    parentSelector,
    elementsPairs,
    length
  );

  console.log(elements);
  return elements;
};

(async () => {
  // Inicjalizacja przeglądarki
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Przechodzimy na stronę JustJoinIT
  await page.goto("https://justjoin.it/", {
    waitUntil: "domcontentloaded",
  });

  const selectorWhat = "input.MuiInputBase-input";
  const nodeoptions = "div.css-ic7v2w > div > div";
  const elementToScroll = "div.css-ic7v2w > div > div";
  const recordCount = 30; // Liczba rekordów do pobrania
  page.setViewport({ width: 1280, height: 926 });
  await new Promise((resolve) => setTimeout(resolve, 4000));
  // Wykonujemy akcje na stronie

  await page.waitForSelector(selectorWhat);
  await page.click(selectorWhat);

  await new Promise((resolve) => setTimeout(resolve, 3000));
  await page.type(selectorWhat, "JavaScript");

  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.keyboard.press("Enter");
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Oczekiwanie na przewinięcie, 2000 ms

  await page.waitForSelector(nodeoptions);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // class="css-ic7v2w"

  // const fieldHandle = await page.$(nodeoptions);
  // const fieldBoundingBox = await fieldHandle.boundingBox();
  // const fieldX = fieldBoundingBox.x + fieldBoundingBox.width / 2;
  // const fieldY = fieldBoundingBox.y + fieldBoundingBox.height / 2;
  // await page.mouse.move(fieldX, fieldY);

  // const scrollCount = 20;
  // for (let i = 0; i < scrollCount; i++) {
  //   await page.mouse.wheel({ deltaY: 100 }); // Przewiń w dół o 100 jednostek
  //   await new Promise((resolve) => setTimeout(resolve, 800)); // Poczekaj przez 1 sekundę po przewinięciu
  // }
  const config = {
    searchValue: "JavaScript",
    maxRecords: 10,
  };

  const pairs = {
    offerURL: "div.css-ic7v2w > div > div > a",
  };

  const offers = await getAllHtmlData(page, nodeoptions, pairs, 20);
  await scrollElements(page, nodeoptions, 20, 600);
  // const offers = await page.$$eval(nodeoptions, (elements) =>
  //   elements.map((e) => ({
  //     // title: e.querySelector(selector).innerText,
  //     // level: e.querySelector(selector).innerText,
  //     url: e.querySelector("a").href,
  //     // promo: e.querySelector(selector)).innerText,
  //   }))
  // );
  console.log(offers);
  // await page.close();
})();

// (async () => {
//   const config = {
//     searchValue: "JavaScript",
//     maxRecords: 10,
//   };

//   const pairs = {
//     offerURL: "div.css-ic7v2w > div > div > a",
//   };

//   const bot = new Bot(config);

//   await bot.init(false);
//   await bot.goto("https://justjoin.it/all/javascript");

//   const nodeoptions = "div.css-ic7v2w > div > div";

//   const data = await bot.Scrapper.getAllHtmlData(nodeoptions, pairs, 20);

//   await bot.mouseScrollOfElement(
//     bot.page,
//     "div.css-ic7v2w > div > div",
//     30,
//     400
//   );

//   //store html content in the reactstorefront file
//   await fs.writeFile("test.json", JSON.stringify(data), "utf-8");

//   console.log(data);

//   await bot.close();
// })();

// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}/`);
// });

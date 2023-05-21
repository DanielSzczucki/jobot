import { createServer, Server, ServerResponse } from "http";
import puppeteer, { ElementHandle, Page } from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import * as fs from "fs/promises";

const PORT = 4200 || process.env.PORT;

const server: Server = createServer((request, response: ServerResponse) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello World!\n");
});

puppeteerExtra.use(stealthPlugin());

async function scrollToElement(
  element: ElementHandle<HTMLDivElement>,
  scrollCount: number
) {
  for (let i = 0; i < scrollCount; i++) {
    await element.scrollIntoView();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

// async function scrollAndScrape(
//   page: Page,
//   selector: string,
//   recordCount: number
// ) {
//   let items = [];
//   while (items.length < recordCount) {
//     const newItems = await page.$$eval(selector, (elements) =>
//       elements.map((e) => {
//         const anchorElement =
//           e.querySelector<HTMLAnchorElement>("div > div > a");
//         return anchorElement?.href || "";
//       })
//     );
//     await new Promise((resolve) => setTimeout(resolve, 3000));
//     items = items.concat(newItems);

//     const lastUrl = newItems[newItems.length - 1];
//     await page.evaluate((lastUrl) => {
//       const element = document.querySelector(
//         `div > div > a[href="${lastUrl}"]`
//       );
//       element?.scrollIntoView();
//     }, lastUrl);

//     await new Promise((resolve) => setTimeout(resolve, 1000)); // Oczekiwanie na przewinięcie, 2000 ms
//   }

//   const urls = items.slice(0, recordCount);
//   console.log(urls);
// }

//actually ewerything inside function is working, have discard mouse, replece with code scrolling. have to divide, add record lenght.

(async () => {
  // Inicjalizacja przeglądarki
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Przechodzimy na stronę JustJoinIT
  await page.goto("https://justjoin.it/", {
    waitUntil: "domcontentloaded",
  });

  const selectorWhat = "input.MuiInputBase-input";
  const nodeoptions = "div.css-ic7v2w > div > div";
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

  const fieldHandle = await page.$(nodeoptions);
  const fieldBoundingBox = await fieldHandle.boundingBox();
  const fieldX = fieldBoundingBox.x + fieldBoundingBox.width / 2;
  const fieldY = fieldBoundingBox.y + fieldBoundingBox.height / 2;
  await page.mouse.move(fieldX, fieldY);

  const scrollCount = 10;
  for (let i = 0; i < scrollCount; i++) {
    await page.mouse.wheel({ deltaY: 100 }); // Przewiń w dół o 100 jednostek
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Poczekaj przez 1 sekundę po przewinięciu
  }

  const courses = await page.$$eval(nodeoptions, (elements) =>
    elements.map((e) => ({
      // title: e.querySelector('.card-body h3').innerText,
      // level: e.querySelector('.card-body .level').innerText,
      url: e.querySelector("a").href,
      // promo: e.querySelector('.card-footer .promo-code .promo').innerText,
    }))
  );

  console.log(courses);

  // await page.close();
})();

// (async () => {
//   const bot = new Bot(config);

//   await bot.init(false);
//   await bot.goto("https://justjoin.it/all/javascript");

//   const pageTitle = await bot.Scrapper.getPageTitle();
//   console.log(pageTitle);
//   const parentElement = "div > .root";

//   const data = await bot.Scrapper.getHtmlElement(parentElement, pairs.offerURL);

//   //store html content in the reactstorefront file
//   await fs.writeFile("test.json", JSON.stringify(data), "utf-8");

//   console.log(data);

//   await bot.close();
// })();

// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}/`);
// });

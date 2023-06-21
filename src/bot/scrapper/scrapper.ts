import { Page, PaperFormat } from "puppeteer";
import { ScrapperOptions } from "../../utills/types";
import { Bot } from "../bot";

export class Scrapper {
  public page: Page;
  public config: ScrapperOptions;

  constructor(page: Page, config: ScrapperOptions) {
    this.page = page;
    this.config = config;
  }

  async makePdf(path: string, format?: PaperFormat): Promise<void> {
    await this.page.pdf({ path: `${path}`, format: `${format}` });
  }

  async getPageTitle(): Promise<string> {
    const pageTitle = await this.page.evaluate(() => document.title);
    return pageTitle;
  }

  async getElementsList(
    page: Page,
    parentSelector: string,
    maxLength: number
  ): Promise<HTMLElement[]> {
    const nodeListodElement = await page.evaluate(
      (selector: string, maxLength: number) => {
        const elementsList = document.querySelectorAll(selector);

        const maxIterations =
          maxLength !== undefined
            ? Math.min(maxLength, elementsList.length)
            : elementsList.length;

        return Array.from(elementsList).slice(
          0,
          maxIterations
        ) as HTMLElement[];
      },
      parentSelector,
      maxLength
    );
    console.log("elements:", nodeListodElement);
    return nodeListodElement;
  }

  getElementData(
    element: Element,
    pairs: Record<string, string>
  ): Record<string, string> {
    const data: Record<string, string> = {};

    for (const [key, selector] of Object.entries(pairs)) {
      const childSelector = selector;
      const dataKey = key;

      if (dataKey === "offerURL") {
        const value =
          element.querySelector<HTMLAnchorElement>(childSelector)?.href || "";
        data[key] = value;
      } else {
        const value =
          element.querySelector<HTMLElement>(childSelector)?.innerText || "";
        data[key] = value;
      }
    }

    return data;
  }

  //propably works good, have to check it in oop
  async getHtmlElementsData(
    page: Page,
    parentSelector: string,
    elementsPairs: Record<string, string>,
    length: number
  ) {
    await this.scrollElements(this.page, parentSelector, 20, 200);
    const elements = await page.evaluate(
      (
        parentSelector: string,
        pairs: Record<string, string>,
        length: number
      ) => {
        const elementsList = document.querySelectorAll(parentSelector);

        const maxIterations =
          length !== undefined
            ? Math.min(length, elementsList.length)
            : elementsList.length;

        return Array.from(elementsList)
          .slice(0, maxIterations)
          .map((element) => {
            const data = {};

            for (const [key, selector] of Object.entries(pairs)) {
              const childSelector = selector;
              const dataKey = key;

              if (dataKey === "offerURL") {
                const value =
                  element.querySelector<HTMLAnchorElement>(childSelector)
                    ?.href || "";
                data[key] = value;
              } else {
                const value =
                  element.querySelector<HTMLElement>(childSelector)
                    ?.innerText || "";
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

    return elements;
  }

  async scrollElements(
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

  async getPageContent() {
    //get full page html
    const html = await this.page.content();
    return html;
  }

  async getJSON() {
    // Przechwyć żądania sieciowe
    await this.page.setRequestInterception(true);

    this.page.on("request", (request) => {
      request.continue();
    });

    this.page.on("response", async (response) => {
      const url = response.url();
      const contentType = response.headers()["content-type"];

      // Sprawdź, czy odpowiedź zawiera dane JSON
      if (contentType && contentType.includes("application/json")) {
        const jsonData = await response.json();
        console.log("Przechwycono dane JSON:", jsonData);
      }
    });
  }

  // Metody do pobierania danych (cena, opis itp.)
}

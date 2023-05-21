import puppeteer, { Browser, Page, PaperFormat } from "puppeteer";
import { ScrapperOptions } from "../../utills/types";

export class Scrapper {
  private page: Page;
  public config: ScrapperOptions;

  constructor(page: Page, config: ScrapperOptions) {
    this.page = page;
    this.config = config;
  }

  async makePdf(path: string, format?: PaperFormat): Promise<void> {
    await this.page.pdf({ path: `${path}`, format: `${format}` });
  }

  async logger(element: string) {
    console.log(`logged: ${element}`);
  }

  async getPageTitle(): Promise<string> {
    const pageTitle = await this.page.evaluate(() => document.title);
    return pageTitle;
  }

  getHtmlElement = async (parentSelector: string, childSelector: string) => {
    const element = await this.page.evaluate(
      (parentSelector, childSelector) => {
        const parentElement = document.querySelector(parentSelector);
        const childElement =
          parentElement.querySelector<HTMLAnchorElement>(childSelector).href;
        return { childElement };
      },
      parentSelector,
      childSelector
    );
  };

  async getHtmlElementData<T extends HTMLElement>(
    parentSelector: string,
    childSelector: string
  ) {
    const element = await this.page.evaluate(
      (parentSelector, childSelector) => {
        const parentElement = document.querySelector(parentSelector);
        const childElement =
          parentElement.querySelector<T>(childSelector).innerText;
        return { childElement };
      },
      parentSelector,
      childSelector
    );

    console.log(element);
    return element;
  }

  async createObjectArray<T>(
    elements: HTMLElement[],
    mappingFunction: (element: HTMLElement) => T,
    length: number = this.config.maxRecords
  ) {
    const objectArray = [];

    const maxIterations =
      length !== undefined
        ? Math.min(length, elements.length)
        : elements.length;

    for (let i = 0; i < maxIterations; i++) {
      const element = elements[i];
      const mappedObject = mappingFunction(element);
      objectArray.push(mappedObject);
    }

    return objectArray;
  }

  async getPageContent() {
    //get full page html
    const html = await this.page.content();
    return html;
  }

  async getAllData<T extends HTMLElement>(
    parentSelector: string,
    elementsPairs: Record<string, string>,
    length: number = this.config.maxRecords
  ) {
    const elements = await this.page.evaluate(
      (selector, pairs, length) => {
        const elementsList = document.querySelectorAll(selector);
        const maxIterations =
          length !== undefined
            ? Math.min(length, elementsList.length)
            : elementsList.length;

        return Array.from(elementsList)
          .slice(0, maxIterations)
          .map((element) => {
            const data = {};
            for (const key in pairs) {
              const childSelector = pairs[key];

              if (childSelector === "offerURL") {
                const value =
                  element.querySelector<HTMLAnchorElement>(childSelector)
                    ?.href || "";
                data[key] = value;
              } else {
                const value =
                  element.querySelector<T>(childSelector)?.innerText || "";
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

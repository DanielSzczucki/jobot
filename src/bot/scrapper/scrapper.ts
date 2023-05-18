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
    length?: number
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

  // Metody do pobierania danych (cena, opis itp.)
}

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

  // Metody do pobierania danych (cena, opis itp.)
}

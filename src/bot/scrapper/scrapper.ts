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

  async getPageTitle(): Promise<string> {
    const pageTitle = await this.page.evaluate(() => document.title);
    return pageTitle;
  }

  async getHtmlElementData(selector: string) {
    // Get courses

    // const courses = await this.page.$$eval("#courses .card", (elements) =>
    //   elements.map((e) => ({
    //     title: e.querySelector<HTMLElement>(".card-body h3").innerText,
    //     level: e.querySelector<HTMLElement>(".card-body .level").innerText,
    //     url: e.querySelector<HTMLAnchorElement>(".card-footer a").href,
    //     promo: e.querySelector<HTMLElement>(".card-footer .promo-code .promo")
    //       .innerText,
    //   }))
    // );

    const offerts = await this.page.evaluate(() => {
      // Fetch the first element with class "quote"
      const offer = document.querySelector(".css-1id4k1");

      // Fetch the sub-elements from the previously fetched quote element
      // Get the displayed text and return it (`.innerText`)
      const title = offer.querySelector<HTMLElement>(".text").innerText;
      const author = offer.querySelector<HTMLElement>(".author").innerText;

      return { title, author };
    });

    // Display the quotes
    console.log(offerts);
  }

  // Metody do pobierania danych (cena, opis itp.)
}

import puppeteer, { Browser, Page, PaperFormat } from "puppeteer";

export class Scrapper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async makePdf(path: string, format?: PaperFormat): Promise<void> {
    await this.page.pdf({ path: `${path}`, format: `${format}` });
  }

  async getPageTitle(): Promise<string> {
    const pageTitle = await this.page.evaluate(() => document.title);
    return pageTitle;
  }

  async getOfferData() {
    const jobOffer = await this.page.evaluate(() => {
      Array.from(document.querySelectorAll(".class"), (offer) => ({}));
    });
  }

  // Metody do pobierania danych (cena, opis itp.)
}

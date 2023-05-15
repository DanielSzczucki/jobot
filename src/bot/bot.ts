import puppeteer, { Page, Browser } from "puppeteer";

export class Bot {
  // Logic should be encapsulated in bot class body
  private browser: Browser | null;
  private page: Page | null;

  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
  }

  async scraper(url: string) {
    if (!this.page) {
      throw new Error("Browser page is not initialized");
    }

    await this.page.goto(url);
    //methods from scrapper
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

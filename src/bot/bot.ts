import dotenv from "dotenv";
dotenv.config();
import puppeteer, { Page, Browser } from "puppeteer";
import { Scrapper } from "./scrapper/scrapper";

const URL = process.env.URL || null;
const PAGE_SCREEN = process.env.SCRAPED_PDF || null;

export class Bot {
  private browser: Browser | null;
  private page: Page | null;
  Scrapper: Scrapper;

  constructor() {
    this.browser = null;
    this.page = null;
    this.Scrapper = new Scrapper(this.page);
  }

  async init() {
    this.browser = await puppeteer.launch();
    //{ headless: true }
    this.page = await this.browser.newPage();
    this.Scrapper = new Scrapper(this.page);
  }

  async goto(url: string) {
    if (!this.page) {
      throw new Error("Browser page is not initialized");
    }

    await this.page.goto(url);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  // Metody specyficzne dla Scrapper
}

// (async () => {
//   const bot = new Bot();
//   await bot.init();
//   await bot.goto("https://www.simplecargo.networkmanager.pl");

//   await bot.Scrapper.makePdf("./examplePdf");

//   await bot.close();
// })();

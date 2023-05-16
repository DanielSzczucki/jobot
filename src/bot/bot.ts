import dotenv from "dotenv";
dotenv.config();
import puppeteer, { Page, Browser } from "puppeteer";
import { Scrapper } from "./scrapper/scrapper";
import { ScrapperOptions } from "../utills/types";

const URL = process.env.URL || null;
const PAGE_SCREEN = process.env.SCRAPED_PDF || null;

export class Bot {
  private browser: Browser | null;
  private page: Page | null;
  public Scrapper: Scrapper;
  public config: ScrapperOptions;

  constructor() {
    this.browser = null;
    this.page = null;
    this.config = null;
    this.Scrapper = new Scrapper(this.page, this.config);
  }

  async init() {
    this.browser = await puppeteer.launch({ headless: false });
    this.page = await this.browser.newPage();
    this.Scrapper = new Scrapper(this.page, this.config);
  }

  async goto(url: string) {
    if (!this.page) {
      throw new Error("Browser page is not initialized");
    }

    await this.page.goto(url);
  }

  async typeSearch(
    inputSelector: string,
    fillQuery: string,
    confirmFirstEl: string
  ) {
    //find a search input
    const searchInputSelector = inputSelector;
    await this.page.waitForSelector(searchInputSelector);

    //fill input
    await this.page.type(searchInputSelector, fillQuery);

    //click first element
    const confirmFirstElement = confirmFirstEl;
    await this.page.click(confirmFirstElement);
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

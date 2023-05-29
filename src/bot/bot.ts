import dotenv from "dotenv";
dotenv.config();
import puppeteer, { Page, Browser, KeyInput } from "puppeteer";
import { Scrapper } from "./scrapper/scrapper";
import { ScrapperOptions } from "../utills/types";

const URL = process.env.URL || null;
const PAGE_SCREEN = process.env.SCRAPED_PDF || null;

export class Bot {
  private browser: Browser | null;
  public page: Page | null;
  public Scrapper: Scrapper;
  public config: ScrapperOptions;

  constructor(config: ScrapperOptions) {
    this.browser = null;
    this.page = null;
    this.config = this.config;
    this.Scrapper = new Scrapper(this.page, this.config);
  }

  async init(headlesType: boolean | "new") {
    this.browser = await puppeteer.launch({ headless: headlesType });
    this.page = await this.browser.newPage();
    this.Scrapper = new Scrapper(this.page, this.config);
  }

  async goto(url: string) {
    if (!this.page) {
      throw new Error("Browser page is not initialized");
    }
    await this.page.goto(url, {
      waitUntil: "domcontentloaded",
    });
  }

  async useInputElementToFillQuery(
    page: Page,
    inputSelector: string,
    fillQuery: string,
    pressKey: KeyInput,
    timeDelay: number
  ) {
    //do some actions on webpage, fill input and take first element

    //wait for selected html elemnt
    await page.waitForSelector(inputSelector);
    //click on it;
    await page.click(inputSelector);
    //delay for content loading
    await new Promise((resolve) => setTimeout(resolve, timeDelay));
    //take input, fill query
    await page.type(inputSelector, fillQuery);
    //wait for loading elemnts
    await new Promise((resolve) => setTimeout(resolve, timeDelay));
    //confitm and add some delay
    await page.keyboard.press(pressKey);
    await new Promise((resolve) => setTimeout(resolve, timeDelay));
  }

  async mouseScrollOfElement(
    page: Page,
    areaSelector: string,
    scrollCount: number,
    scrollDealy: number
  ) {
    await page.waitForSelector(areaSelector);
    const fieldHandle = await page.$(areaSelector);
    //set mouse area settings
    const fieldBoundingBox = await fieldHandle.boundingBox();

    const fieldX = fieldBoundingBox.x + fieldBoundingBox.width / 2;
    const fieldY = fieldBoundingBox.y + fieldBoundingBox.height / 2;

    //set mouse on area
    await page.mouse.move(fieldX, fieldY);

    //scroll
    for (let i = 0; i < scrollCount; i++) {
      //scroll lenght
      await page.mouse.wheel({ deltaY: scrollDealy });
      //scroll delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  // Metody specyficzne dla Scrapper
}

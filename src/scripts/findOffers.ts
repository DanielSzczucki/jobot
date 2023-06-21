import { Bot } from "../bot/bot";

const scraperOPtions = {
  searchValue: "JavaScript",
  maxRecords: 20,
};

const url = "https://justjoin.it/";

const selectorWhat = "input.MuiInputBase-input";
const nodeoptions = "div.css-ic7v2w > div > div";

const pairs = {
  offerURL: "a",
};

const findOffers = async () => {
  const bot = new Bot(scraperOPtions);

  await bot.init(false);
  await bot.goto(url);
  await bot.setViewPortResolution(1080, 720);
  await bot.useInputElementToFillQuery(
    bot.page,
    selectorWhat,
    scraperOPtions.searchValue,
    "Enter",
    200
  );

  await bot.pageWaitForSelector(nodeoptions);

  await bot.waitMoment(2000);
  let data = [];

  //have to check is this working without for loop

  for (let i = 0; i < 5; i++) {
    await bot.pageWaitForSelector(nodeoptions);
    await bot.waitMoment(300);

    console.log("Scrapping...");
    await bot.mouseScrollOfElement(bot.page, nodeoptions, 3, 200);

    const el = await bot.Scrapper.getHtmlElementsData(
      bot.page,
      nodeoptions,
      pairs,
      10
    );
    data.push(el);
  }

  console.log("Data", data);

  await bot.close();
};

findOffers();

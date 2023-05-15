import { createServer, Server, ServerResponse } from "http";
import { Bot } from "./bot/bot";

const PORT = 4200 || process.env.PORT;

const server: Server = createServer((request, response: ServerResponse) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello World!\n");
});

// (async () => {
//   const bot = new Bot();
//   await bot.init();
//   await bot.goto("https://www.nerdbord.io");

//   await bot.Scrapper.makePdf("./examplePdf.pdf", "A4");

//   await bot.close();
// })();

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

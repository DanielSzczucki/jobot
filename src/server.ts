import { createServer, Server, ServerResponse } from "http";
import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

const PORT = 4200 || process.env.PORT;

const server: Server = createServer((request, response: ServerResponse) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello World!\n");
});

//anty bot block
puppeteerExtra.use(stealthPlugin());

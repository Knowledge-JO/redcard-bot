import { Telegraf, session, Scenes } from "telegraf";
import CryptoBotApi from "crypto-bot-api";
import { handleDeposit } from "./scenes/deposit.js";
import { handleShare } from "./scenes/share.js";

import dotenv from "dotenv";
dotenv.config();

const endpoint = "https://testnet-pay.crypt.bot/api";

export const cryptoClient = new CryptoBotApi(
  process.env.API_TOKEN || "",
  endpoint
);

const { BaseScene, Stage } = Scenes;

const bot = new Telegraf(process.env.BOT_TOKEN);

const depositScene = new BaseScene("deposit");
const shareScene = new BaseScene("share");

const stage = new Stage([depositScene, shareScene]);

bot.use(session());
bot.use(stage.middleware());

const port = process.env.PORT || 8080;

const webhookDomain = "https://redcard-bot.onrender.com";

bot.telegram.setMyCommands([
  { command: "start", description: "mini app button" },
  { command: "deposit", description: "Deposit funds" },
  { command: "share", description: "forward tickets to your group" },
]);

bot.start(async (ctx) => {
  await ctx.reply("Welcome to red cards", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🧧Redcards",
            web_app: { url: "https://redcard.vercel.app" },
          },
        ],
      ],
      resize_keyboard: true,
    },
  });
});

handleDeposit(bot, depositScene);
handleShare(bot, shareScene);

// bot.launch();

bot.launch({
  webhook: {
    // Public domain for webhook; e.g.: example.com
    domain: webhookDomain,

    // Port to listen on; e.g.: 8080
    port: port,

    secretToken: crypto.randomUUID(),
  },
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

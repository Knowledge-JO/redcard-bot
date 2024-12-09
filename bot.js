import { Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const port = process.env.PORT || 8080;

const webhookDomain = "";

bot.start(async (ctx) => {
  await ctx.reply("Welcome to red cards", {
    reply_markup: {
      keyboard: [
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

// bot.launch();

bot.launch({
  webhook: {
    // Public domain for webhook; e.g.: example.com
    domain: webhookDomain,

    // Port to listen on; e.g.: 8080
    port: port,

    secretToken: crypto.randomBytes(64).toString("hex"),
  },
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

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

bot.use((ctx, next) => {
  if (ctx.chat.type == "private") {
    next();
  }
});

bot.use(session());
bot.use(stage.middleware());

const port = process.env.PORT || 8080;

const webhookDomain = "https://redcard-bot.onrender.com";

bot.telegram.setMyCommands([
  { command: "start", description: "mini app button" },
  { command: "deposit", description: "Deposit funds" },
  // { command: "share", description: "forward tickets to your group" },
]);

async function balances() {
  const tonBalance = await cryptoClient.getBalance("TON");
  const usdtBalance = await cryptoClient.getBalance("USDT");
  const btcBalance = await cryptoClient.getBalance("BTC");

  return {
    ton: tonBalance.available,
    usdt: usdtBalance.available,
    btc: btcBalance.available,
  };
}

bot.start(async (ctx) => {
  try {
    const text = ctx.message.text.split(" ");
    if (text[1] == "deposit") {
      ctx.scene.enter("deposit");
      return;
    }
    const { ton, usdt, btc } = await balances();
    await ctx.reply(
      `<strong>🧧Welcome to red cards</strong>

<strong>Wallet balance:</strong>

<strong>TON:</strong> ${ton}
<strong>USDT:</strong> ${usdt}
<strong>BTC:</strong> ${btc}
      `,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🧧Redcards",
                web_app: { url: "https://redcard.vercel.app" },
              },
              {
                text: "Deposit",
                callback_data: "deposit",
              },
            ],
          ],
          resize_keyboard: true,
        },
        parse_mode: "HTML",
      }
    );
  } catch (error) {
    console.log(error);
  }
});

bot.on("callback_query", (ctx) => {
  const callback_data = ctx.callbackQuery.data;
  if (callback_data == "deposit") {
    ctx.scene.enter("deposit");
  }
});

handleDeposit(bot, depositScene);
// handleShare(bot, shareScene);

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

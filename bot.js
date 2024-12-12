import { Telegraf, Markup, session, Scenes } from "telegraf";
const { BaseScene, Stage } = Scenes;
import dotenv from "dotenv";
dotenv.config();

import CryptoBotApi from "crypto-bot-api";

const endpoint = "https://testnet-pay.crypt.bot/api";

async function makePayment(ctx, asset, amount) {
  const cryptoClient = new CryptoBotApi(process.env.API_TOKEN || "", endpoint);
  try {
    const invoice = await cryptoClient.createInvoice({
      asset,
      amount,
    });
    ctx.reply(
      `Invoice created successfully, please click on the link and make deposit. \n \n ${invoice.botPayUrl}`
    );
  } catch (error) {
    ctx.reply(`${error}`);
  }
}

const bot = new Telegraf(process.env.BOT_TOKEN);

const depositScene = new BaseScene("deposit");
const stage = new Stage([depositScene]);
bot.use(session());
bot.use(stage.middleware());

const port = process.env.PORT || 8080;

const webhookDomain = "https://redcard-bot.onrender.com";

bot.telegram.setMyCommands([
  { command: "start", description: "mini app button" },
  { command: "deposit", description: "Deposit funds" },
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

bot.command("deposit", (ctx) => {
  ctx.scene.enter("deposit");
});

depositScene.enter((ctx) => {
  // ctx.reply("Please enter amount you want to deposit: ");

  ctx.reply("Please select an asset", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "BTC", callback_data: "BTC" }],
        [{ text: "TON", callback_data: "TON" }],
        [{ text: "USDT", callback_data: "USDT" }],
      ],
    },
  });
});

depositScene.on("text", async (ctx) => {
  const state = ctx.session.currentState;
  const asset = ctx.session.asset;

  const text = ctx.message.text;

  if (text == "end") {
    ctx.scene.leave();
  }

  if (state == "create") {
    const amount = parseFloat(ctx.message.text);
    if (isNaN(amount) || amount <= 0) {
      ctx.reply("Please enter a valid amount");
    } else {
      // perform deposit
      await makePayment(ctx, asset, amount);
      ctx.scene.state = null;
      ctx.scene.leave();
    }
  } else {
    ctx.reply("Please select an asset");
  }
});

depositScene.on("callback_query", (ctx) => {
  const query = ctx.callbackQuery.data;
  ctx.reply("Please enter amount you want to deposit: ");
  ctx.session.asset = query;
  ctx.session.currentState = "create";
});

//bot.launch();

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

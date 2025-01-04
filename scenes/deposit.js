import { cryptoClient, userPrefrences } from "../bot.js";
import { locale } from "../translations.js";

function handleDeposit(bot, depositScene) {
  bot.command("deposit", async (ctx) => {
    if (ctx.chat.type !== "private") return;
    ctx.scene.enter("deposit");
  });

  depositScene.enter((ctx) => {
    // ctx.reply("Please enter amount you want to deposit: ");
    const userId = ctx.from.id;
    const lang = userPrefrences.get(userId) || "en";
    const t = locale[lang];
    ctx.reply(t.asset, {
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

    const userId = ctx.from.id;
    const lang = userPrefrences.get(userId) || "en";
    const t = locale[lang];

    if (state == "create") {
      const amount = parseFloat(ctx.message.text);
      if (isNaN(amount) || amount <= 0) {
        ctx.reply(t.invalid);
      } else {
        // perform deposit
        await makePayment(ctx, asset, amount, t);
        ctx.session.currentState = null;
        ctx.scene.leave();
      }
    } else {
      console.log(t.asset);
      ctx.reply(t.asset);
    }
  });

  depositScene.on("callback_query", (ctx) => {
    const query = ctx.callbackQuery.data;
    const userId = ctx.from.id;
    const lang = userPrefrences.get(userId) || "en";
    const t = locale[lang];
    ctx.reply(`${t.amount}:`);
    ctx.session.asset = query;
    ctx.session.currentState = "create";
  });

  depositScene.command("exit", (ctx) => {
    const id = ctx.from.id;
    const lang = userPrefrences.get(id) || "en";
    const t = locale[lang];
    ctx.reply(t.canceled);
    ctx.session.currentState = null;
    ctx.session.asset = null;
    ctx.scene.leave();
    return;
  });
}

async function makePayment(ctx, asset, amount, t) {
  try {
    const invoice = await cryptoClient.createInvoice({
      asset,
      amount,
    });
    ctx.reply(`${t.invoice} \n \n ${invoice.botPayUrl}`);
  } catch (error) {
    ctx.reply(`${error}`);
  }
}

export { handleDeposit };

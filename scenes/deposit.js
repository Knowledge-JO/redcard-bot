import { cryptoClient } from "../bot.js";
import { isAdmin } from "../utils.js";

function handleDeposit(bot, depositScene) {
  bot.command("deposit", async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return ctx.reply("❌ Only admins can use this command!");
    }
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

    if (text.toLowerCase() == "end") {
      ctx.reply("cancelled.");
      ctx.scene.leave();
      return;
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
}

async function makePayment(ctx, asset, amount) {
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

export { handleDeposit };

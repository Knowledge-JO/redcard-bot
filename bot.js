import { Telegraf, session, Scenes } from "telegraf";
import CryptoBotApi from "crypto-bot-api";
import dotenv from "dotenv";

import { handleDeposit } from "./scenes/deposit.js";
import { muteUser } from "./features/mute.js";
import { banUser } from "./features/ban.js";
import { kickUser } from "./features/kick.js";
import { deleteMessage } from "./features/Delete.js";
import { autoManageChat } from "./features/autoManage.js";
import { whitelistLink } from "./features/links.js";
import { isCreator } from "./utils.js";

dotenv.config();

const webhookDomain = "https://redcard-bot.onrender.com";
const endpoint = "https://testnet-pay.crypt.bot/api";
const port = process.env.PORT || 8080;

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

bot.telegram.setMyCommands([
  { command: "start", description: "mini app button" },
  { command: "deposit", description: "Deposit funds" },
  { command: "kick", description: "kick a user" },
  {
    command: "ban",
    description:
      "ban a user for. e.g /ban 60, 60 is the duration in seconds. defaults to permanent ban if no secs passed",
  },
  {
    command: "mute",
    description:
      "mute a user. e.g /mute 120, 120 is the duration in seconds. Defaults to 60secs if no seconds passed",
  },
  {
    command: "whitelist",
    description: "whitelist a domain",
  },
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
  if (ctx.chat.type !== "private") return;
  if (!(await isCreator(ctx))) {
    return ctx.reply("❌ Only admins can use this command!");
  }
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

// Handle new chat members
bot.on("new_chat_members", async (ctx) => {
  try {
    const newMembers = ctx.message.new_chat_members;
    // Auto-delete the join/leave message
    await ctx.deleteMessage(ctx.message.message_id);
    for (const member of newMembers) {
      const welcomeMessage = `🎉 Welcome, ${
        member.first_name || "Friend"
      }! We're glad to have you here.`;

      // Send the welcome image with the caption
      await ctx.replyWithPhoto(
        {
          url: "https://rose-gothic-goose-655.mypinata.cloud/ipfs/QmVgzd5JGFuNKrv18eena3FqjP6hPhcNJMoC37mZm26MYn",
        },
        { caption: welcomeMessage }
      );
    }
  } catch (error) {
    console.error("Error handling new chat members:", error);
  }
});

bot.on("callback_query", (ctx) => {
  const callback_data = ctx.callbackQuery.data;
  if (callback_data == "deposit") {
    ctx.scene.enter("deposit");
  }
});

handleDeposit(bot, depositScene);
muteUser(bot);
banUser(bot);
kickUser(bot);
deleteMessage(bot);
whitelistLink(bot);
autoManageChat(bot);

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

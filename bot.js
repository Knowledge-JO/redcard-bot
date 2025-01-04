import { Telegraf, session, Scenes, Markup } from "telegraf";
import CryptoBotApi from "crypto-bot-api";
import dotenv from "dotenv";

import { handleDeposit } from "./scenes/deposit.js";
import { muteUser } from "./features/mute.js";
import { banUser } from "./features/ban.js";
import { kickUser } from "./features/kick.js";
import {
  deleteInappropriateWord,
  deleteKeyword,
  deleteLink,
  deleteMessage,
} from "./features/Delete.js";
import { autoManageChat } from "./features/autoManage.js";
import { setWelcomeMsg } from "./features/setWelcomeMessage.js";
import {
  getTelegramDataByChatId,
  getTelegramDataByChatIdSingle,
  getUserLanguage,
  insertChat,
  updateLanguage,
} from "./supabaseAPI.js";
import { setWelcomeImg } from "./features/setWelcomeImage.js";
import { setKwdRply } from "./features/setKeywordReplies.js";
import { setAllowedLinks } from "./features/setAllowedLinks.js";
import { setInappropriateWords } from "./features/setInappropriateWords.js";
import { botCommands } from "./commands.js";
import { lang, locale } from "./translations.js";

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
const setImageScene = new BaseScene("setImage");

const stage = new Stage([depositScene, shareScene, setImageScene]);

export const userPrefrences = new Map();

bot.use(session());
bot.use(stage.middleware());

bot.use(async (ctx, next) => {
  const chatId = ctx.chat.id;
  if (ctx.chat.type !== "private") {
    try {
      const chat = await getTelegramDataByChatId(chatId);
      if (chat.length == 0) {
        await insertChat(chatId);
      }

      await next();
    } catch (error) {
      console.log(error);
    }
  } else {
    await next();
  }
});

botCommands(bot);

async function startMsg(lang) {
  const { ton, usdt, btc } = await balances();
  const t = locale[lang];

  return `<strong>🧧${t.welcome}</strong>

<strong>${t.balance}:</strong>

<strong>TON:</strong> ${ton}
<strong>USDT:</strong> ${usdt}
<strong>BTC:</strong> ${btc}
      `;
}

function startKeys(lang) {
  const t = locale[lang];
  return [
    [
      {
        text: t.red,
        web_app: { url: "https://redcard.vercel.app" },
      },
      {
        text: t.deposit,
        callback_data: "deposit",
      },
    ],
    [{ text: locale[lang].lang, callback_data: "lang" }],
  ];
}

bot.start(async (ctx) => {
  if (ctx.chat.type !== "private") return;
  const userId = ctx.from.id;
  try {
    const lang = (await getUserLanguage(userId)) || "en";
    const text = ctx.message.text.split(" ");
    if (text[1] == "deposit") {
      ctx.scene.enter("deposit");
      return;
    }

    const msg = await startMsg(lang);
    await ctx.reply(msg, {
      reply_markup: {
        inline_keyboard: startKeys(lang),
        resize_keyboard: true,
      },
      parse_mode: "HTML",
    });
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
    const chatData = await getTelegramDataByChatIdSingle(ctx.chat.id);
    for (const member of newMembers) {
      const welcomeMessage = chatData.message
        ? `${member.first_name}, \n${chatData.message}`
        : `🎉 Welcome, ${
            member.first_name || "Friend"
          }! We're glad to have you here.`;

      // Send the welcome image with the caption
      if (chatData.imageUrl) {
        await ctx.replyWithPhoto(
          {
            url: chatData.imageUrl,
          },
          { caption: welcomeMessage }
        );
      } else {
        await ctx.reply(welcomeMessage);
      }
    }
  } catch (error) {
    console.error("Error handling new chat members:", error);
  }
});

bot.on("callback_query", async (ctx) => {
  const callback_data = ctx.callbackQuery.data;
  const userId = ctx.from.id;
  const selectedLang = userPrefrences.get(userId) || "en";
  const t = locale[selectedLang];
  switch (callback_data) {
    case "deposit":
      ctx.scene.enter("deposit");
      break;

    case "lang":
      ctx.editMessageText(
        t.select,

        Markup.inlineKeyboard([
          Markup.button.callback(lang.english, "en"),
          Markup.button.callback(lang.chinese, "zh"),
        ])
      );
      break;
    case "en":
      userPrefrences.set(userId, "en");
      updateLanguage(userId, "en").catch((err) => console.log(err));
      const msg_en = await startMsg("en");

      ctx.editMessageText(msg_en, {
        reply_markup: { inline_keyboard: startKeys("en") },
        parse_mode: "HTML",
      });
    case "zh":
      userPrefrences.set(userId, "zh");
      updateLanguage(userId, "zh").catch((err) => console.log(err));
      const msg_zh = await startMsg("zh");
      ctx.editMessageText(msg_zh, {
        reply_markup: { inline_keyboard: startKeys("zh") },
        parse_mode: "HTML",
      });
    default:
      break;
  }
});

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

handleDeposit(bot, depositScene);
muteUser(bot);
banUser(bot);
kickUser(bot);
deleteMessage(bot);
setWelcomeMsg(bot);
setWelcomeImg(bot, setImageScene);
setKwdRply(bot);
setAllowedLinks(bot);
setInappropriateWords(bot);
deleteInappropriateWord(bot);
deleteKeyword(bot);
deleteLink(bot);
autoManageChat(bot);

// bot.launch(() => console.log("Bot online!"));

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

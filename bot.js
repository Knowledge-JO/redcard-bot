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
  getUserApiKey,
  getUserLanguage,
  insertChat,
  updateChatAdmins,
  updateLanguage,
} from "./supabaseAPI.js";
import { setWelcomeImg } from "./features/setWelcomeImage.js";
import { setKwdRply } from "./features/setKeywordReplies.js";
import { setAllowedLinks } from "./features/setAllowedLinks.js";
import { setInappropriateWords } from "./features/setInappropriateWords.js";
import { handleSetApiKey } from "./scenes/setApiKey.js";
import { botCommands } from "./commands.js";
import { lang, locale } from "./translations.js";
import { handleUpdateApiKey } from "./scenes/updateApiKey.js";

dotenv.config();

const webhookDomain = "https://redcard-bot.onrender.com";
const port = process.env.PORT || 8080;

const { BaseScene, Stage } = Scenes;

const bot = new Telegraf(process.env.BOT_TOKEN);

const depositScene = new BaseScene("deposit");
const shareScene = new BaseScene("share");
const setImageScene = new BaseScene("setImage");
const setApiKeyScene = new BaseScene("setApiKey");
const updateApiKeyScene = new BaseScene("updateApiKey");

const stage = new Stage([
  depositScene,
  shareScene,
  setImageScene,
  setApiKeyScene,
  updateApiKeyScene,
]);

export const userPrefrences = new Map();

bot.use(session());
bot.use(stage.middleware());

botCommands(bot);

export const cryptoClient = function cryptoClient(key) {
  const endpoint = "https://testnet-pay.crypt.bot/api";
  return new CryptoBotApi(key, endpoint);
};

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
    [
      { text: t.lang, callback_data: "lang" },
      { text: t.config, web_app: { url: "https://redcard.vercel.app/config" } },
    ],
    [{ text: t.update_api_btn, callback_data: "update_key" }],
  ];
}

bot.start(async (ctx) => {
  if (ctx.chat.type !== "private") return;
  const userId = ctx.from.id;
  try {
    const lang = (await getUserLanguage(userId)) || "en";
    const text = ctx.message.text.split(" ");

    const apiKey = await getUserApiKey(userId);

    const t = locale[lang];

    if (!apiKey) {
      await ctx.reply(`${t.set_api_key} crypto testnet bot @CryptoTestnetBot`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: t.set_api_btn, callback_data: "api_key" }],
          ],
        },
      });

      return;
    }

    if (text[1] == "deposit") {
      ctx.scene.enter("deposit");
      return;
    }

    const client = cryptoClient(apiKey);

    const msg = await startMsg(lang, client);

    await ctx.reply(msg, {
      reply_markup: {
        inline_keyboard: startKeys(lang),
        resize_keyboard: true,
      },
      parse_mode: "HTML",
    });
  } catch (error) {
    if (error.message.includes("API key")) {
      errorReply(ctx);
    } else {
      ctx.reply(error.message);
    }
  }
});

async function errorReply(ctx) {
  const userId = ctx.from.id;
  try {
    const lang = (await getUserLanguage(userId)) || "en";
    const t = locale[lang];
    ctx.reply(t.api_error, {
      reply_markup: {
        inline_keyboard: [
          [{ text: t.update_api_btn, callback_data: "update_key" }],
        ],
      },
    });
  } catch (error) {
    console.log(error.message);
  }
}

// Handle new chat members
bot.on("new_chat_members", async (ctx) => {
  try {
    const newMembers = ctx.message.new_chat_members;
    const chatId = ctx.chat.id;
    console.log("New member added");

    const chat = await getTelegramDataByChatId(chatId);
    const chatData = chat.length > 0 ? chat.at(0) : undefined;
    for (const member of newMembers) {
      if (member.is_bot && member.id == bot.botInfo.id) {
        console.log("Bot added", bot.botInfo.id);
        console.log(chatData, chat);
        if (!chatData) {
          // add new chat
          // Get the list of admins
          const admins = await ctx.getChatAdministrators();
          // Separate the creator and other admins
          const creator = admins.find((admin) => admin.status === "creator");
          const otherAdmins = admins
            .filter((admin) => admin.status === "administrator")
            .map((otherAdmin) => otherAdmin.user.id);
          const chatName = ctx.chat.title;
          await insertChat(
            chatId,
            creator?.user.id || null,
            otherAdmins,
            chatName
          );
        }
      } else {
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
    }
    // Auto-delete the join/leave message
    await ctx.deleteMessage(ctx.message.message_id);
  } catch (error) {
    console.error("Error handling new chat members:", error);
  }
});

bot.on("chat_member", async (ctx) => {
  const chatMemberUpdate = ctx.chatMember;
  console.log("chat member");
  // Check if the user was promoted to admin
  const oldStatus = chatMemberUpdate.old_chat_member.status;
  const newStatus = chatMemberUpdate.new_chat_member.status;

  // If the old status is "member" and the new status is "administrator", they were promoted
  if (oldStatus == "member" && newStatus == "administrator") {
    const promotedUser = chatMemberUpdate.new_chat_member.user;
    console.log("promoted user", promotedUser.first_name);
    // update admins
    try {
      await updateChatAdmins(ctx.chat.id, promotedUser.id, true); // promote
    } catch (error) {
      console.error("Failed to update admins", error);
    }
  }
  if (oldStatus == "administrator" && newStatus == "member") {
    const demotedUser = chatMemberUpdate.new_chat_member.user;
    console.log("demoted user", demotedUser.first_name);
    try {
      await updateChatAdmins(ctx.chat.id, demotedUser.id, false); // demote
    } catch (error) {
      console.error("Failed to update admins", error);
    }
  }
});

bot.on("callback_query", async (ctx) => {
  const callback_data = ctx.callbackQuery.data;
  const userId = ctx.from.id;
  const selectedLang = userPrefrences.get(userId) || "en";
  const t = locale[selectedLang];
  const apiKey = await getUserApiKey(userId);
  switch (callback_data) {
    case "deposit":
      ctx.scene.enter("deposit");
      break;

    case "api_key":
      ctx.scene.enter("setApiKey");
      break;

    case "update_key":
      ctx.scene.enter("updateApiKey");
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
      const client = cryptoClient(apiKey);
      userPrefrences.set(userId, "en");
      updateLanguage(userId, "en").catch((err) => console.log(err));
      const msg_en = await startMsg("en", client);

      ctx.editMessageText(msg_en, {
        reply_markup: { inline_keyboard: startKeys("en") },
        parse_mode: "HTML",
      });
      break;
    case "zh":
      const client_zh = cryptoClient(apiKey);
      userPrefrences.set(userId, "zh");
      updateLanguage(userId, "zh").catch((err) => console.log(err));
      const msg_zh = await startMsg("zh", client_zh);
      ctx.editMessageText(msg_zh, {
        reply_markup: { inline_keyboard: startKeys("zh") },
        parse_mode: "HTML",
      });
      break;
    default:
      break;
  }
});

async function startMsg(lang, cryptoClient) {
  const { ton, usdt, btc } = await balances(cryptoClient);
  const t = locale[lang];

  return `<strong>🧧${t.welcome}</strong>

<strong>${t.balance}:</strong>

<strong>TON:</strong> ${ton}
<strong>USDT:</strong> ${usdt}
<strong>BTC:</strong> ${btc}
      `;
}

async function balances(cryptoClient) {
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
handleSetApiKey(bot, setApiKeyScene);
handleUpdateApiKey(bot, updateApiKeyScene);
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

import {
  getUserLanguage,
  removeInappropriateWord,
  removeKeywordReply,
  removeLink,
} from "../supabaseAPI.js";
import { locale } from "../translations.js";
import { isAdmin, isCreator, linkPattern } from "../utils.js";

export function deleteMessage(bot) {
  // Delete inappropriate messages (admin only)
  bot.command("delete", async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
    if (!(await isAdmin(ctx))) {
      return ctx.reply(`❌ ${t.admin_warning}`);
    }

    const messageToDelete = ctx.message.reply_to_message;

    if (!messageToDelete) {
      return ctx.reply(`⚠️ ${t.delete.warning}`);
    }

    try {
      await ctx.telegram.deleteMessage(ctx.chat.id, messageToDelete.message_id);
      ctx.reply(`✅ ${t.delete.success}`);
    } catch (error) {
      console.error("Delete Error:", error);
      ctx.reply(`❌ ${t.delete.failed}`);
    }
  });
}

export function deleteLink(bot) {
  bot.command("deletelink", async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
    if (!(await isCreator(ctx))) {
      return ctx.reply(`❌ ${t.admin_warning}`);
    }

    const chatId = ctx.chat.id;
    const link = ctx.message.text.split(" ")[1];

    if (!link) return ctx.reply(t.delete.link.warning);

    const valid = linkPattern.test(link);
    if (!valid) {
      return ctx.reply(t.delete.link.invalid);
    }

    try {
      await removeLink(chatId, link);
      ctx.reply(t.delete.link.success);
    } catch (error) {
      console.log(error);
      ctx.reply(t.delete.link.failed);
    }
  });
}

export function deleteKeyword(bot) {
  bot.command("deletekeyword", async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
    if (!(await isCreator(ctx))) return ctx.reply(`❌ ${t.admin_warning}`);

    const chatId = ctx.chat.id;
    const keyword = ctx.message.text.split(" ")[1];

    if (!keyword) return ctx.reply(t.delete.keyword.warning);

    try {
      await removeKeywordReply(chatId, keyword);
      ctx.reply(t.delete.keyword.success);
    } catch (error) {
      console.log(error);
      ctx.reply(t.delete.keyword.failed);
    }
  });
}

export function deleteInappropriateWord(bot) {
  bot.command("deleteword", async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
    if (!(await isCreator(ctx))) return ctx.reply(`❌ ${t.admin_warning}`);

    const chatId = ctx.chat.id;
    const word = ctx.message.text.split(" ")[1];

    if (!word) return ctx.reply(t.delete.word.warning);

    try {
      await removeInappropriateWord(chatId, word);
      ctx.reply(t.delete.word.success);
    } catch (error) {
      console.log(error);
      ctx.reply(t.delete.word.failed);
    }
  });
}

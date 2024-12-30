import {
  removeLink,
  removeInappropriateWord,
  removeKeywordReply,
} from "../supabaseAPI.js";
import { isAdmin, isCreator, linkPattern } from "../utils.js";

export function deleteMessage(bot) {
  // Delete inappropriate messages (admin only)
  bot.command("delete", async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return ctx.reply("❌ Only admins can use this command!");
    }

    const messageToDelete = ctx.message.reply_to_message;

    if (!messageToDelete) {
      return ctx.reply("⚠️ Reply to the message you want to delete.");
    }

    try {
      await ctx.telegram.deleteMessage(ctx.chat.id, messageToDelete.message_id);
      ctx.reply("✅ Message deleted.");
    } catch (error) {
      console.error("Delete Error:", error);
      ctx.reply("❌ Failed to delete the message.");
    }
  });
}

export function deleteLink(bot) {
  bot.command("deletelink", async (ctx) => {
    if (!(await isCreator(ctx)))
      return ctx.reply("❌ You can't use this command");

    const chatId = ctx.chat.id;
    const link = ctx.message.text.split(" ")[1];

    if (!link) return ctx.reply("Please pass the link after the command.");

    const valid = linkPattern.test(link);
    if (!valid) {
      return ctx.reply("Invalid links sent");
    }

    try {
      await removeLink(chatId, link);
      ctx.reply("Deleted link successfully!");
    } catch (error) {
      console.log(error);
      ctx.reply("Failed to delete link");
    }
  });
}

export function deleteKeyword(bot) {
  bot.command("deletekeyword", async (ctx) => {
    if (!(await isCreator(ctx)))
      return ctx.reply("❌ You can't use this command");

    const chatId = ctx.chat.id;
    const keyword = ctx.message.text.split(" ")[1];

    if (!keyword) return ctx.reply("Pass a keyword to delete");

    try {
      await removeKeywordReply(chatId, keyword);
      ctx.reply("Keyword deleted successfully!");
    } catch (error) {
      console.log(error);
      ctx.reply("Failed to delete keyword");
    }
  });
}

export function deleteInappropriateWord(bot) {
  bot.command("deleteword", async (ctx) => {
    if (!(await isCreator(ctx)))
      return ctx.reply("❌ You can't use this command");

    const chatId = ctx.chat.id;
    const word = ctx.message.text.split(" ")[1];

    if (!word) return ctx.reply("Pass a word to delete");

    try {
      await removeInappropriateWord(chatId, word);
      ctx.reply("Word deleted successfully!");
    } catch (error) {
      console.log(error);
      ctx.reply("Failed to delete word");
    }
  });
}

import { getUserLanguage, updateInappropiateWords } from "../supabaseAPI.js";
import { locale } from "../translations.js";
import { isCreator } from "../utils.js";

export async function setInappropriateWords(bot) {
  bot.command("blacklist", async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
    if (!(await isCreator(ctx))) return ctx.reply(`❌ ${t.admin_warning}`);
    const chatId = ctx.chat.id;
    const words = ctx.message.text.split(" ").slice(1);
    if (words.length == 0) return ctx.reply(`⚠️ ${t.blacklist.warning}`);
    try {
      await updateInappropiateWords(chatId, words);
      ctx.reply(`✅ ${t.blacklist.success}`);
    } catch (error) {
      console.log(error);
      ctx.reply(`❌ ${t.blacklist.failed}`);
    }
  });
}

import { getUserLanguage, updateKeywordReplies } from "../supabaseAPI.js";
import { locale } from "../translations.js";
import { isCreator } from "../utils.js";

export async function setKwdRply(bot) {
  bot.command("setkeyword", async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
    if (!(await isCreator(ctx))) return ctx.reply(`❌ ${t.admin_warning}`);
    const chatId = ctx.chat.id;
    const keyword = ctx.message.text.split(" ")[1];
    const replyContent = ctx.message.text.split(" ").slice(2).join(" ");

    if (!keyword) return ctx.reply(`⚠️ ${t.keyword.warning}`);

    try {
      await updateKeywordReplies(chatId, { keyword, replyContent });
      ctx.reply(`✅ ${t.keyword.success}`);
    } catch (error) {
      console.log(error);
      ctx.reply(`❌ ${t.keyword.failed}`);
    }
  });
}

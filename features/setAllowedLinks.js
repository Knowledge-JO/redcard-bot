import { getUserLanguage, updateAllowedLinks } from "../supabaseAPI.js";
import { locale } from "../translations.js";
import { isCreator, linkPattern } from "../utils.js";

export async function setAllowedLinks(bot) {
  bot.command("allowlinks", async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
    if (!(await isCreator(ctx))) return ctx.reply(`❌ ${t.admin_warning}`);
    const chatId = ctx.chat.id;
    const links = ctx.message.text.split(" ").slice(1);

    if (links.length == 0) return ctx.reply(`⚠️ ${t.allow_links.warning}`);
    for (const link of links) {
      const valid = linkPattern.test(link);
      if (!valid) {
        return ctx.reply(`❌ ${t.allow_links.invalid}`);
      }
    }
    try {
      await updateAllowedLinks(chatId, links);
      ctx.reply(`✅ ${t.allow_links.success}`);
    } catch (error) {
      console.log(error);
      ctx.reply(`❌ ${t.allow_links.failed}`);
    }
  });
}

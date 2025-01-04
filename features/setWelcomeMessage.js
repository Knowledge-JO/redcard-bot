import { getUserLanguage, updateWelcomeMessage } from "../supabaseAPI.js";
import { locale } from "../translations.js";
import { isCreator } from "../utils.js";

export async function setWelcomeMsg(bot) {
  bot.command("setmessage", async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
    if (!(await isCreator(ctx))) return ctx.reply(`❌ ${t.admin_warning}`);
    const chatId = ctx.chat.id;
    const message = ctx.message.text.split(" ").slice(1).join(" ");
    if (!message) return ctx.reply(`⚠️ ${t.set_msg.warning}`);
    try {
      await updateWelcomeMessage(chatId, message);
      ctx.reply(`✅ ${t.set_msg.success}`);
    } catch (error) {
      console.error(error);
      ctx.reply(`❌ ${t.set_msg.failed}`);
    }
  });
}

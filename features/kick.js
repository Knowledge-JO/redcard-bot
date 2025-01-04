import { getUserLanguage } from "../supabaseAPI.js";
import { locale } from "../translations.js";
import { isAdmin } from "../utils.js";

export function kickUser(bot) {
  // Kick a user
  bot.command("kick", async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
    if (!(await isAdmin(ctx))) {
      return ctx.reply(`❌ ${t.admin_warning}`);
    }

    const userId = ctx.message.reply_to_message?.from?.id;

    if (!userId) {
      return ctx.reply(`⚠️ ${t.kick.warning}`);
    }

    try {
      await ctx.telegram.kickChatMember(ctx.chat.id, userId);
      ctx.reply(`✅ ${t.kick.success}`);
    } catch (error) {
      console.error("Kick Error:", error);
      ctx.reply(`❌ ${t.kick.failed}`);
    }
  });
}

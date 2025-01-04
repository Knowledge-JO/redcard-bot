import { getUserLanguage } from "../supabaseAPI.js";
import { locale } from "../translations.js";
import { isAdmin } from "../utils.js";

export function banUser(bot) {
  // Ban a user
  bot.command("ban", async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
    if (!(await isAdmin(ctx))) {
      return ctx.reply(`❌ ${t.admin_warning}`);
    }

    const args = ctx.message.text.split(" ");
    const userId = ctx.message.reply_to_message?.from?.id;
    const duration = parseInt(args[1]) || 0; // Default: Permanent ban

    if (!userId) {
      return ctx.reply(`⚠️ ${t.ban_warning}`);
    }

    try {
      const untilDate = duration ? Math.floor(Date.now() / 1000) + duration : 0;
      await ctx.telegram.banChatMember(ctx.chat.id, userId, {
        until_date: untilDate,
      });
      ctx.reply(
        `✅ ${t.banned.msg1} ${
          duration > 0
            ? `${t.banned.msg2} ${duration} ${t.banned.msg3}.`
            : `${t.banned.alt}`
        }`
      );
    } catch (error) {
      console.error("Ban Error:", error);
      ctx.reply(`❌ ${t.ban_failed}`);
    }
  });
}

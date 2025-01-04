import { getUserLanguage } from "../supabaseAPI.js";
import { locale } from "../translations.js";
import { isAdmin } from "../utils.js";

export function muteUser(bot) {
  // Mute a user
  bot.command("mute", async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
    if (!(await isAdmin(ctx))) {
      return ctx.reply(`❌ ${t.admin_warning}`);
    }

    const args = ctx.message.text.split(" ");
    const userId = ctx.message.reply_to_message?.from?.id;
    const duration = parseInt(args[1]) || 60; // Default: 60 seconds

    if (!userId) {
      return ctx.reply(`⚠️ ${t.mute.warning}`);
    }

    try {
      const untilDate = Math.floor(Date.now() / 1000) + duration;
      await ctx.telegram.restrictChatMember(ctx.chat.id, userId, {
        permissions: { can_send_messages: false },
        until_date: untilDate,
      });
      ctx.reply(`✅ ${t.mute.success.msg1} ${duration} ${t.mute.success.msg2}`);
    } catch (error) {
      console.error("Mute Error:", error);
      ctx.reply(`❌ ${t.mute.failed}`);
    }
  });
}

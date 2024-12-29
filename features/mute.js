import { isAdmin } from "../utils.js";

export function muteUser(bot) {
  // Mute a user
  bot.command("mute", async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return ctx.reply("❌ Only admins can use this command!");
    }

    const args = ctx.message.text.split(" ");
    const userId = ctx.message.reply_to_message?.from?.id;
    const duration = parseInt(args[1]) || 60; // Default: 60 seconds

    if (!userId) {
      return ctx.reply(
        "⚠️ Reply to the user you want to mute and specify a duration in seconds (optional)."
      );
    }

    try {
      const untilDate = Math.floor(Date.now() / 1000) + duration;
      await ctx.telegram.restrictChatMember(ctx.chat.id, userId, {
        permissions: { can_send_messages: false },
        until_date: untilDate,
      });
      ctx.reply(`✅ User has been muted for ${duration} seconds.`);
    } catch (error) {
      console.error("Mute Error:", error);
      ctx.reply("❌ Failed to mute the user.");
    }
  });
}

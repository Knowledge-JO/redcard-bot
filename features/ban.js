import { isAdmin } from "../utils.js";

export function banUser(bot) {
  // Ban a user
  bot.command("ban", async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return ctx.reply("❌ Only admins can use this command!");
    }

    const args = ctx.message.text.split(" ");
    const userId = ctx.message.reply_to_message?.from?.id;
    const duration = parseInt(args[1]) || 0; // Default: Permanent ban

    if (!userId) {
      return ctx.reply(
        "⚠️ Reply to the user you want to ban and specify a duration in seconds (optional)."
      );
    }

    try {
      const untilDate = duration ? Math.floor(Date.now() / 1000) + duration : 0;
      await ctx.telegram.banChatMember(ctx.chat.id, userId, {
        until_date: untilDate,
      });
      ctx.reply(
        `✅ User has been banned ${
          duration > 0 ? `for ${duration} seconds.` : "permanently."
        }`
      );
    } catch (error) {
      console.error("Ban Error:", error);
      ctx.reply("❌ Failed to ban the user.");
    }
  });
}

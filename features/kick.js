import { isAdmin } from "../utils.js";

export function kickUser(bot) {
  // Kick a user
  bot.command("kick", async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return ctx.reply("❌ Only admins can use this command!");
    }

    const userId = ctx.message.reply_to_message?.from?.id;

    if (!userId) {
      return ctx.reply("⚠️ Reply to the user you want to kick.");
    }

    try {
      await ctx.telegram.kickChatMember(ctx.chat.id, userId);
      ctx.reply("✅ User has been kicked from the group.");
    } catch (error) {
      console.error("Kick Error:", error);
      ctx.reply("❌ Failed to kick the user.");
    }
  });
}

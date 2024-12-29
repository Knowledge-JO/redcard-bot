import { isAdmin } from "../utils.js";

export function deleteMessage(bot) {
  // Delete inappropriate messages (admin only)
  bot.command("delete", async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return ctx.reply("❌ Only admins can use this command!");
    }

    const messageToDelete = ctx.message.reply_to_message;

    if (!messageToDelete) {
      return ctx.reply("⚠️ Reply to the message you want to delete.");
    }

    try {
      await ctx.telegram.deleteMessage(ctx.chat.id, messageToDelete.message_id);
      ctx.reply("✅ Message deleted.");
    } catch (error) {
      console.error("Delete Error:", error);
      ctx.reply("❌ Failed to delete the message.");
    }
  });
}

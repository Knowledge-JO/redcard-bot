import { getTelegramDataByChatIdSingle } from "../supabaseAPI.js";
import { autoReplyChat } from "./autoReply.js";
import { autoCleanLinks } from "./links.js";

// const inappropriateKeywords = [
//   "badword1",
//   "badword2",
//   "badword3",
//   "free money",
//   "click here",
//   "buy now",
//   "promo",
// ]; // Add your own inappropriate keywords

// Memory to track duplicate messages
const recentMessages = new Map();

export function autoManageChat(bot) {
  // Auto-delete join/leave notifications
  bot.on("left_chat_member", async (ctx) => {
    try {
      // Auto-delete the join/leave message
      await ctx.deleteMessage(ctx.message.message_id);
    } catch (error) {
      console.error("Auto-delete Error:", error);
    }
  });

  // Filter and delete inappropriate messages automatically
  bot.on("text", async (ctx) => {
    if (ctx.chat.type == "private") return;
    const messageText = ctx.message.text.toLowerCase();

    const userId = ctx.message.from.id;
    const chatId = ctx.chat.id;

    const chatData = await getTelegramDataByChatIdSingle(chatId);
    const inappropriateKeywords = chatData.inappropriateKeywords || [];
    // Check for inappropriate keywords
    if (inappropriateKeywords.some((word) => messageText.includes(word))) {
      try {
        await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
        console.log(`Deleted inappropriate message: "${ctx.message.text}"`);
      } catch (error) {
        console.error("Auto-delete inappropriate message error:", error);
      }
    }

    try {
      //  Detect Duplicate Messages and delete them
      const previousMessage = recentMessages.get(userId);
      if (previousMessage && previousMessage.text === messageText) {
        const now = Date.now();
        if (now - previousMessage.timestamp < 30000) {
          // 30 seconds
          try {
            await ctx.telegram.deleteMessage(chatId, ctx.message.message_id);
            console.log(`Deleted duplicate message: "${ctx.message.text}"`);
            return;
          } catch (error) {
            console.error("Error deleting duplicate message:", error);
          }
        }
      }

      // Save the message for future duplicate checks
      recentMessages.set(userId, { text: messageText, timestamp: Date.now() });
    } catch (error) {
      console.error("Error handling duplicate messages:", error);
    }
    await autoCleanLinks(ctx);

    await autoReplyChat(ctx);
  });
}

// Clear old messages from memory periodically to save memory
setInterval(() => {
  const now = Date.now();
  for (const [userId, message] of recentMessages.entries()) {
    if (now - message.timestamp > 300000) {
      // 5 minutes
      recentMessages.delete(userId);
    }
  }
}, 60000); // Check every 1 minute

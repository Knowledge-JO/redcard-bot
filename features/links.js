import {
  getTelegramDataByChatIdSingle,
  getUserLanguage,
} from "../supabaseAPI.js";
import { locale } from "../translations.js";

// const whitelistedLinks = ["example.com", "trusted-site.com"];

export async function autoCleanLinks(ctx) {
  const messageText = ctx.message.text.toLowerCase();
  const userId = ctx.message.from.id;
  const chatId = ctx.chat.id;

  const lang = (await getUserLanguage(userId)) || "en";
  const t = locale[lang];

  // Detect links in the message
  const linkPattern = /(https?:\/\/)?(www\.)?\S+\.\S+/g;
  const linksInMessage = messageText.match(linkPattern);

  const chatData = await getTelegramDataByChatIdSingle(chatId);

  const whitelistedLinks = chatData.allowedLinks || [];

  if (linksInMessage) {
    let isAuthorized = false;

    // Check if the link is in the whitelist
    for (const link of linksInMessage) {
      if (
        whitelistedLinks.some((whitelistedLink) =>
          whitelistedLink.includes(link)
        )
      ) {
        isAuthorized = true;
      } else {
        isAuthorized = false;
      }
    }

    // If the link is unauthorized
    if (!isAuthorized) {
      try {
        // Delete the message
        await ctx.telegram.deleteMessage(chatId, ctx.message.message_id);

        // Notify the user
        const notification = await ctx.reply(`⚠️ ${t.link_warning}`);

        // Auto-delete notification after 30 seconds
        setTimeout(() => ctx.deleteMessage(notification.message_id), 30000);
      } catch (error) {
        console.error("Error deleting unauthorized link:", error);
      }
    }
  }
}

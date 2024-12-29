import { isAdmin } from "../utils.js";

const whitelistedLinks = ["example.com", "trusted-site.com"];

export async function autoCleanLinks(ctx) {
  const messageText = ctx.message.text.toLowerCase();
  const userId = ctx.message.from.id;
  const chatId = ctx.chat.id;

  // Detect links in the message
  const linkPattern = /(https?:\/\/)?(www\.)?\S+\.\S+/g;
  const linksInMessage = messageText.match(linkPattern);

  console.log("Links in message:", linksInMessage);

  if (linksInMessage) {
    let isAuthorized = false;

    // Check if the link is in the whitelist
    for (const link of linksInMessage) {
      if (whitelistedLinks.includes(link)) {
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
        const notification = await ctx.reply(
          `⚠️ Links are not allowed unless whitelisted. Your message was deleted.\nAdmins can approve the link if necessary.`
        );

        // Auto-delete notification after 30 seconds
        setTimeout(() => ctx.deleteMessage(notification.message_id), 30000);
      } catch (error) {
        console.error("Error deleting unauthorized link:", error);
      }
    }
  }
}

export function whitelistLink(bot) {
  // Whitelist a domain
  bot.command("whitelist", async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return ctx.reply("❌ Only admins can use this command!");
    }

    const args = ctx.message.text.split(" ");
    const domain = args[1];

    if (!domain) {
      return ctx.reply("⚠️ Please specify the domain to whitelist.");
    }

    if (whitelistedLinks.includes(domain)) {
      return ctx.reply(`✅ The domain "${domain}" is already whitelisted.`);
    }

    whitelistedLinks.push(domain);
    ctx.reply(`✅ The domain "${domain}" has been added to the whitelist.`);
  });
}

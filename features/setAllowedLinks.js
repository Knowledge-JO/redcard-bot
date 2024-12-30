import { updateAllowedLinks } from "../supabaseAPI.js";
import { isCreator, linkPattern } from "../utils.js";

export async function setAllowedLinks(bot) {
  bot.command("allowlinks", async (ctx) => {
    if (!(await isCreator(ctx)))
      return ctx.reply("❌ You can't use this command");
    const chatId = ctx.chat.id;
    const links = ctx.message.text.split(" ").slice(1);

    if (links.length == 0)
      return ctx.reply("Please pass the links after the command.");
    for (const link of links) {
      const valid = linkPattern.test(link);
      if (!valid) {
        return ctx.reply("Invalid links sent");
      }
    }
    try {
      await updateAllowedLinks(chatId, links);
      ctx.reply("Allowed links updated successfully!");
    } catch (error) {
      console.log(error);
      ctx.reply("Failed to update allowed links");
    }
  });
}

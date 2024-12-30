import { updateInappropiateWords } from "../supabaseAPI.js";
import { isCreator } from "../utils.js";

export async function setInappropriateWords(bot) {
  bot.command("blacklist", async (ctx) => {
    if (!(await isCreator(ctx)))
      return ctx.reply("❌ You can't use this command");
    const chatId = ctx.chat.id;
    const words = ctx.message.text.split(" ").slice(1);
    if (words.length == 0)
      return ctx.reply("Please pass the words after the command.");
    try {
      await updateInappropiateWords(chatId, words);
      ctx.reply("Inappropriate words blacklisted successfully!");
    } catch (error) {
      console.log(error);
      ctx.reply("Failed to blacklist inappropriate words");
    }
  });
}

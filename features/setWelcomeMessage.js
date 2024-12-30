import { updateWelcomeMessage } from "../supabaseAPI.js";
import { isCreator } from "../utils.js";

export async function setWelcomeMsg(bot) {
  bot.command("setmessage", async (ctx) => {
    if (!(await isCreator(ctx)))
      return ctx.reply("❌ You can't use this command");
    const chatId = ctx.chat.id;
    const message = ctx.message.text.split(" ").slice(1).join(" ");
    if (!message)
      return ctx.reply("Please specify a welcome message after the command");
    try {
      await updateWelcomeMessage(chatId, message);
      ctx.reply("Welcome message updated successfully!");
    } catch (error) {
      console.error(error);
      ctx.reply("Failed to update welcome message.");
    }
  });
}

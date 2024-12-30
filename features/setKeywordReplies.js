import { updateKeywordReplies } from "../supabaseAPI.js";
import { isCreator } from "../utils.js";

export async function setKwdRply(bot) {
  bot.command("setkeyword", async (ctx) => {
    if (!(await isCreator(ctx)))
      return ctx.reply("❌ You can't use this command");
    const chatId = ctx.chat.id;
    const keyword = ctx.message.text.split(" ")[1];
    const replyContent = ctx.message.text.split(" ").slice(2).join(" ");

    if (!keyword) return ctx.reply("Pass a keyword followed by a reply");

    try {
      await updateKeywordReplies(chatId, { keyword, replyContent });
      ctx.reply("Keyword and reply message updated successfully!");
    } catch (error) {
      console.log(error);
      ctx.reply("Failed to update keyword and reply message");
    }
  });
}

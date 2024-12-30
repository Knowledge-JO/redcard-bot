import axios from "axios";
import { isCreator } from "../utils.js";
import { updateWelcomeImage } from "../supabaseAPI.js";

export async function setWelcomeImg(bot, setImageScene) {
  bot.command("setimage", async (ctx) => {
    if (!(await isCreator(ctx))) {
      return ctx.reply("❌ Only admins can use this command!");
    }
    ctx.scene.enter("setImage");
  });

  setImageScene.enter((ctx) => {
    ctx.reply("Send an image for welcome messages.");
  });

  setImageScene.on("photo", async (ctx) => {
    try {
      const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id; // Get the highest resolution image
      const fileInfo = await ctx.telegram.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${fileInfo.file_path}`;

      // Download the image
      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer",
      });
      const imageBuffer = Buffer.from(response.data);

      // Upload to Supabase
      const fileName = `telegram-images-${Math.random()}_${fileInfo.file_path
        .split("/")
        .pop()}`.replaceAll("/", "");

      await updateWelcomeImage(ctx.chat.id, imageBuffer, fileName);
      ctx.reply(`Image uploaded successfully! 🌟`);
      ctx.scene.leave();
    } catch (error) {
      console.log(error);
    }
  });

  setImageScene.command("exit", (ctx) => {
    ctx.reply("cancelled.");
    ctx.scene.leave();
    return;
  });
}

import axios from "axios";
import { getUserLanguage, updateWelcomeImage } from "../supabaseAPI.js";
import { locale } from "../translations.js";
import { isCreator } from "../utils.js";

export async function setWelcomeImg(bot, setImageScene) {
  bot.command("setimage", async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
    if (!(await isCreator(ctx))) return ctx.reply(`❌ ${t.admin_warning}`);
    ctx.scene.enter("setImage");
  });

  setImageScene.enter(async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
    ctx.reply(t.set_image.msg);
  });

  setImageScene.on("photo", async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
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
      ctx.reply(`${t.set_image.success} 🌟`);
      ctx.scene.leave();
    } catch (error) {
      console.log(error);
    }
  });

  setImageScene.command("exit", async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
    ctx.reply(t.canceled);
    ctx.scene.leave();
    return;
  });
}

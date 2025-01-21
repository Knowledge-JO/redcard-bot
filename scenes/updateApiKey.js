import { getUserLanguage, updateApiKey } from "../supabaseAPI.js";
import { locale } from "../translations.js";

export function handleUpdateApiKey(bot, updateApiKeyScene) {
  updateApiKeyScene.enter(async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
    ctx.reply(t.prompt_api_keyword);
  });

  updateApiKeyScene.on("text", async (ctx) => {
    const userId = ctx.from.id;
    const key = ctx.message.text;
    const lang = (await getUserLanguage(userId)) || "en";
    const t = locale[lang];
    if (key.includes(" ")) {
      await ctx.reply(t.prompt_api_error);
      return;
    }
    await updateApiKey(userId, key);
    await ctx.reply(t.prompt_api_updated);
    ctx.scene.leave();
  });
}

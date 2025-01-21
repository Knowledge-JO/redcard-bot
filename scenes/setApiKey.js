import { getUserLanguage, setUserApiKey } from "../supabaseAPI.js";
import { locale } from "../translations.js";

export function handleSetApiKey(bot, setApiKeyScene) {
  setApiKeyScene.enter(async (ctx) => {
    const id = ctx.from.id;
    const lang = (await getUserLanguage(id)) || "en";
    const t = locale[lang];
    ctx.reply(t.prompt_api_keyword);
  });

  setApiKeyScene.on("text", async (ctx) => {
    const userId = ctx.from.id;
    const key = ctx.message.text.trim();
    const lang = (await getUserLanguage(userId)) || "en";
    const t = locale[lang];
    if (key.includes(" ")) {
      await ctx.reply(t.prompt_api_error);
      return;
    }
    await setUserApiKey(userId, key);
    await ctx.reply(t.prompt_api_set);
    ctx.scene.leave();
  });
}

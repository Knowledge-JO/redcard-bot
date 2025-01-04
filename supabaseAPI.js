import { supabase, supabaseUrl } from "./supabase.js";

async function getTelegramDataByChatId(chatId) {
  let { data: telegram, error } = await supabase
    .from("telegram")
    .select("*")
    .eq("chatId", chatId);

  if (error) {
    throw new Error(error.message);
  }

  return telegram;
}
async function getTelegramDataByChatIdSingle(chatId) {
  let { data: telegram, error } = await supabase
    .from("telegram")
    .select("*")
    .eq("chatId", chatId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return telegram;
}

async function insertChat(chatId) {
  const { data, error } = await supabase
    .from("telegram")
    .insert([{ chatId }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function updateWelcomeMessage(chatId, message) {
  const { error } = await supabase
    .from("telegram")
    .update({ message })
    .eq("chatId", chatId)
    .select();

  if (error) {
    throw new Error(error.message);
  }
}

async function updateWelcomeImage(chatId, imageBuffer, fileName) {
  const { data, error } = await supabase.storage
    .from("welcome")
    .upload(fileName, imageBuffer, {
      contentType: "image/jpeg",
    });

  if (error) {
    throw new Error(error.message);
  }

  const { error: updateError } = await supabase
    .from("telegram")
    .update({
      imageUrl: `${supabaseUrl}/storage/v1/object/public/welcome/${fileName}`,
    })
    .eq("chatId", chatId)
    .select();

  if (updateError) {
    throw new Error(updateError.message);
  }
}

async function updateKeywordReplies(chatId, keywordReplies) {
  const data = await getTelegramDataByChatId(chatId);
  const chatData = data ? data : [];
  if (chatData.length > 0) {
    const chat = chatData[0];
    const kwdReplies = chat.keywordReplies ? chat.keywordReplies : [];
    const { error } = await supabase
      .from("telegram")
      .update({ keywordReplies: [...kwdReplies, keywordReplies] })
      .eq("chatId", chatId)
      .select();

    if (error) {
      throw new Error(error.message);
    }
  }
}

async function updateInappropiateWords(chatId, words) {
  const data = await getTelegramDataByChatId(chatId);
  const chatData = data ? data : [];

  if (chatData.length > 0) {
    const chat = chatData[0];
    const inappropriateKeywords = chat.inappropriateKeywords
      ? chat.inappropriateKeywords
      : [];
    const { error } = await supabase
      .from("telegram")
      .update({ inappropriateKeywords: [...inappropriateKeywords, ...words] })
      .eq("chatId", chatId)
      .select();

    if (error) {
      throw new Error(error.message);
    }
  }
}

async function updateAllowedLinks(chatId, links) {
  const data = await getTelegramDataByChatId(chatId);
  const chatData = data ? data : [];

  if (chatData.length > 0) {
    const chat = chatData[0];
    const allowedLinks = chat.allowedLinks ? chat.allowedLinks : [];
    const { error } = await supabase
      .from("telegram")
      .update({ allowedLinks: [...allowedLinks, ...links] })
      .eq("chatId", chatId)
      .select();

    if (error) {
      throw new Error(error.message);
    }
  }
}

async function removeLink(chatId, link) {
  const data = await getTelegramDataByChatId(chatId);
  const chatData = data ? data : [];

  if (chatData.length > 0) {
    const chat = chatData[0];
    const allowedLinks = chat.allowedLinks ? chat.allowedLinks : [];
    if (allowedLinks.length == 0) throw new Error("No links found");
    const filtered = allowedLinks.filter((allowedLink) => allowedLink !== link);
    const { error } = await supabase
      .from("telegram")
      .update({ allowedLinks: [...filtered] })
      .eq("chatId", chatId)
      .select();

    if (error) {
      throw new Error(error.message);
    }
  }
}

async function removeInappropriateWord(chatId, word) {
  const data = await getTelegramDataByChatId(chatId);
  const chatData = data ? data : [];

  if (chatData.length > 0) {
    const chat = chatData[0];
    const blacklistedWords = chat.inappropriateKeywords
      ? chat.inappropriateKeywords
      : [];
    if (blacklistedWords.length == 0)
      throw new Error("No blacklisted words found");
    const filtered = blacklistedWords.filter(
      (blacklistedWord) => blacklistedWord !== word
    );
    const { error } = await supabase
      .from("telegram")
      .update({ inappropriateKeywords: [...filtered] })
      .eq("chatId", chatId)
      .select();

    if (error) {
      throw new Error(error.message);
    }
  }
}

async function removeKeywordReply(chatId, keyword) {
  const data = await getTelegramDataByChatId(chatId);
  const chatData = data ? data : [];

  if (chatData.length > 0) {
    const chat = chatData[0];
    const keywordReplies = chat.keywordReplies ? chat.keywordReplies : [];
    if (keywordReplies.length == 0) throw new Error("No keyword replies found");
    const filtered = keywordReplies.filter(
      (keywordReply) => keywordReply.keyword !== keyword
    );
    const { error } = await supabase
      .from("telegram")
      .update({ keywordReplies: [...filtered] })
      .eq("chatId", chatId)
      .select();

    if (error) {
      throw new Error(error.message);
    }
  }
}

async function updateLanguage(userId, lang) {
  const { data: language, error } = await supabase
    .from("language")
    .select("*")
    .eq("userId", userId);

  if (error) throw new Error(error.message);

  if (language.length == 0) {
    // insert
    const { error } = await supabase
      .from("language")
      .insert([{ userId, lang }])
      .select();

    if (error) throw new Error(error.message);
  }
}

async function getUserLanguage(userId) {
  const { data: language, error } = await supabase
    .from("language")
    .select("*")
    .eq("userId", userId);

  if (error) return "";
  if (language.length == 0) {
    return "";
  }

  return language[0].lang;
}

export {
  getTelegramDataByChatId,
  getTelegramDataByChatIdSingle,
  insertChat,
  updateWelcomeMessage,
  updateWelcomeImage,
  updateKeywordReplies,
  updateInappropiateWords,
  updateAllowedLinks,
  removeInappropriateWord,
  removeKeywordReply,
  removeLink,
  updateLanguage,
  getUserLanguage,
};

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

export {
  getTelegramDataByChatId,
  getTelegramDataByChatIdSingle,
  insertChat,
  updateWelcomeMessage,
  updateWelcomeImage,
  updateKeywordReplies,
  updateInappropiateWords,
  updateAllowedLinks,
};

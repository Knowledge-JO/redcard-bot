import { getTelegramDataByChatIdSingle } from "../supabaseAPI.js";

// const data = [
//   {
//     keyword: "hello",
//     replyContent: "Hello, how can I help you today?",
//   },

//   {
//     keyword: "rules",
//     replyContent: "Please follow the group rules: No spamming, respect others!",
//   },

//   {
//     keyword: "faq",
//     replyContent: "Check out our FAQs here: https://example.com/faq",
//   },
// ];

// const dataArray = data.map((keywords) => [
//   keywords.keyword,
//   keywords.replyContent,
// ]);

// const keywordReplies = new Map(dataArray);

export async function autoReplyChat(ctx) {
  const messageText = ctx.message.text.toLowerCase();
  const chatData = await getTelegramDataByChatIdSingle(ctx.chat.id);
  const dataArray = chatData.keywordReplies.map(({ keyword, replyContent }) => [
    keyword,
    replyContent,
  ]);
  const keywordReplies = new Map(dataArray);
  for (const [keyword, replyContent] of keywordReplies.entries()) {
    if (messageText.includes(keyword)) {
      try {
        await ctx.reply(replyContent, {
          reply_to_message_id: ctx.message.message_id,
        });
      } catch (error) {
        console.error("Error sending auto-reply:", error);
      }
      break;
    }
  }
}

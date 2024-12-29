// Check if the user issuing the command is an admin
export const isAdmin = async (ctx) => {
  const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
  return ["administrator", "creator"].includes(chatMember.status);
};

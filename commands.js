export function botCommands(bot) {
  bot.telegram.setMyCommands([
    { command: "start", description: "mini app button" },
    { command: "deposit", description: "Deposit funds" },
    { command: "kick", description: "kick a user" },
    {
      command: "ban",
      description:
        "ban a user for. e.g /ban 60, 60 is the duration in seconds. defaults to permanent ban if no secs passed",
    },
    {
      command: "mute",
      description:
        "mute a user. e.g /mute 120, 120 is the duration in seconds. Defaults to 60secs if no seconds passed",
    },
    {
      command: "setmessage",
      description: "set welcome message",
    },
    {
      command: "setimage",
      description: "set welcome image",
    },
    {
      command: "setkeyword",
      description: "set keyword and reply content",
    },
    {
      command: "blacklist",
      description: "blacklist inappropriate words e.g /blacklist word1 word2",
    },
    {
      command: "allowlinks",
      description: "allow links in the chat e.g /allowlinks link1 link2",
    },
    {
      command: "deletelink",
      description:
        "delete a link from the allowed links list e.g /deletelink link",
    },
    {
      command: "deletekeyword",
      description: "delete a keyword e.g /deletekeyword keyword",
    },
    {
      command: "deleteword",
      description:
        "delete a word from the inappropriate words list e.g /deleteword word",
    },
  ]);
}

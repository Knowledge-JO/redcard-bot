import { cryptoClient } from "../bot.js";

function handleShare(bot, shareScene) {
  bot.command("share", async (ctx) => {
    ctx.scene.enter("share");
  });

  shareScene.enter(async (ctx) => {
    try {
      const checks = await cryptoClient.getChecks({ status: "active" });
      ctx.session.totalChecks = checks.length;
      let checkLists = `Total checks available: ${checks.length}\n`;
      for (let i = 0; i < checks.length; i++) {
        checkLists += `\n${i + 1}. ${checks[i].botCheckUrl}`;
      }
      if (checks.length > 0) {
        checkLists += `\n\n<strong>Reply with how many tickets you will like to share or click share all to share all.</strong>`;
      } else {
        checkLists += "\n\n<strong>No tickets to share.</strong>";
        ctx.reply(checkLists);
        ctx.scene.leave();
        return;
      }

      ctx.session.tickets = checks.map((check) => ({
        url: check.botCheckUrl,
        price: check.amount,
        asset: check.asset,
      }));
      ctx.reply(checkLists, {
        reply_markup: {
          inline_keyboard: [[{ text: "Share all", callback_data: "all" }]],
        },
        parse_mode: "HTML",
      });
    } catch (error) {
      ctx.reply(`Error getting tickets`);
      ctx.scene.leave();
    }
  });

  shareScene.on("text", async (ctx) => {
    const text = ctx.message.text;
    const amount = parseInt(text);

    if (text == "end") {
      ctx.reply("cancelled.");
      ctx.scene.leave();
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      ctx.reply("Please enter a valid number");
    } else {
      const totalTickets = ctx.session.totalChecks;
      ctx.session.sharableAmount = amount;
      if (amount > totalTickets) {
        ctx.reply(
          "Amount specified is greater than tickets available. Enter correct amount"
        );
      } else {
        const tickets = ctx.session.tickets;
        const message = composeMessage(tickets.slice(0, amount));
        ctx.reply("Sharing tickets");
        forwardToChannel(bot, message)
          .then(() => {
            ctx.reply("Shared successfully");
            ctx.scene.leave();
          })
          .catch((error) => ctx.reply(`Error sharing tickets: ${error}`));
      }
    }
  });

  shareScene.on("callback_query", (ctx) => {
    const tickets = ctx.session.tickets;
    const message = composeMessage(tickets);
    ctx.reply("Sharing tickets");
    forwardToChannel(bot, message)
      .then(() => {
        ctx.reply("Shared successfully");
        ctx.scene.leave();
      })
      .catch((error) => ctx.reply(`Error sharing tickets: ${error}`));
  });
}

function composeMessage(tickets) {
  let message = `Claim tickets`;
  for (let i = 0; i < tickets.length; i++) {
    message += `\n\n${i + 1}. ${tickets[i].url} - ${tickets[i].price}${
      tickets[i].asset
    }`;
  }

  return message;
}

async function forwardToChannel(bot, message) {
  const TARGET_CHAT_ID = -4707464812;
  await bot.telegram.sendMessage(TARGET_CHAT_ID, message);
}

export { handleShare };

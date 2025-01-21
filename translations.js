export const locale = {
  en: {
    welcome: "Welcome to red cards",
    lang: "Language",
    english: "English",
    welcome_msg: "Welcome",
    select: "Select a language",
    red: "Redcards",
    deposit: "Deposit",
    balance: "Wallet balance",
    asset: "Please select an asset",
    invalid: "Please enter a valid amount",
    amount: "Please enter amount you want to deposit",
    invoice:
      "Invoice created successfully, please click on the link and make deposit.",

    admin_warning: "Only admins can use this command!",

    ban_warning:
      "Reply to the user you want to ban and specify a duration in seconds (optional).",

    ban_failed: "Failed to ban the user.",

    banned: {
      msg1: "User has been banned",
      msg2: "for",
      msg3: "seconds.",

      alt: "permanently.",
    },

    delete: {
      warning: "Reply to the message you want to delete.",
      success: "Message deleted.",
      failed: "Failed to delete the message.",
      link: {
        warning: "Please pass the link after the command.",
        invalid: "Invalid links sent",
        success: "Deleted link successfully!",
        failed: "Failed to delete link",
      },
      keyword: {
        warning: "Pass a keyword to delete",
        success: "Keyword deleted successfully!",
        failed: "Failed to delete keyword",
      },
      word: {
        warning: "Pass a word to delete",
        success: "Word deleted successfully!",
        failed: "Failed to delete word",
      },
    },
    kick: {
      warning: "Reply to the user you want to kick.",
      success: "User has been kicked from the group.",
      failed: "Failed to kick the user.",
    },
    link_warning:
      "Links are not allowed unless whitelisted. Your message was deleted.\nAdmins can approve the link if necessary.",
    mute: {
      warning:
        "Reply to the user you want to mute and specify a duration in seconds (optional).",

      success: {
        msg1: "User has been muted for",
        msg2: "seconds.",
      },
      failed: "Failed to mute the user.",
    },
    allow_links: {
      warning: "Please pass the links after the command.",
      invalid: "Invalid links sent",
      success: "Allowed links updated successfully!",
      failed: "Failed to update allowed links",
    },
    blacklist: {
      warning: "Please pass the words after the command.",
      success: "Inappropriate words blacklisted successfully!",
      failed: "Failed to blacklist inappropriate words",
    },
    keyword: {
      warning: "Pass a keyword followed by a reply",
      success: "Keyword and reply message updated successfully!",
      failed: "Failed to update keyword and reply message",
    },
    set_image: {
      msg: "Send an image for welcome messages.",
      success: "Image uploaded successfully!",
    },
    set_msg: {
      warning: "Please specify a welcome message after the command",
      success: "Welcome message updated successfully!",
      failed: "Failed to update welcome message.",
    },
    canceled: "Canceled.",
    config: "Config",
    set_api_key:
      "Please set your API key to procede. You can get the api key from",
    set_api_btn: "Set API key",
    api_error: "Invalid api key provided",
    update_api_btn: "Update API key",

    prompt_api_keyword: "Please send the Api key",
    prompt_api_error: "Please provide a valid api key",
    prompt_api_set: "Key set",
    prompt_api_updated: "Key updated",
  },

  zh: {
    welcome: "欢迎红牌",
    lang: "语言",
    chinese: "中国人",
    welcome_msg: "欢迎",
    select: "选择语言",
    red: "红牌",
    deposit: "订金",
    balance: "钱包余额",
    asset: "请选择资产",
    invalid: "请输入有效金额",
    amount: "请输入您要存入的金额",
    invoice: "发票创建成功，请点击链接并存款。",

    admin_warning: "只有管​​理员才能使用此命令！",
    ban_warning: "回复您要禁止的用户并指定持续时间（以秒为单位）（可选）。",

    ban_failed: "禁止用户失败。",

    banned: {
      msg1: "用户已被禁止",
      msg2: "为了",
      msg3: "秒。",

      alt: "永久地。",
    },

    delete: {
      warning: "回复您要删除的消息。",
      success: "消息已删除。",
      failed: "删除消息失败。",
      link: {
        warning: "请在命令后传递链接。",
        invalid: "发送的链接无效",
        success: "链接删除成功！",
        failed: "删除链接失败",
      },
      keyword: {
        warning: "传递关键字进行删除",
        success: "关键字删除成功！",
        failed: "删除关键字失败",
      },
      word: {
        warning: "传递一个要删除的单词",
        success: "Word删除成功！",
        failed: "删除单词失败",
      },
    },
    kick: {
      warning: "回复您要踢出的用户。",
      success: "用户已被踢出群组。",
      failed: "踢出用户失败。",
    },
    link_warning:
      "除非列入白名单，否则不允许链接。您的消息已删除。\n如有必要，管理员可以批准该链接。",
    mute: {
      warning: "回复您想要静音的用户并指定持续时间（以秒为单位）（可选）。",
      success: {
        msg1: "用户已被静音",
        msg2: "秒。",
      },
      failed: "无法将用户静音。",
    },

    allow_links: {
      warning: "请传递命令后的链接。",
      invalid: "发送的链接无效",
      success: "允许的链接更新成功！",
      failed: "无法更新允许的链接",
    },
    blacklist: {
      warning: "请传递命令后的文字。",
      success: "不当言论列入黑名单成功！",
      failed: "无法将不当词语列入黑名单",
    },
    keyword: {
      warning: "传递关键字，然后回复",
      success: "关键字和回复信息更新成功！",
      failed: "无法更新关键字和回复消息",
    },
    set_image: {
      msg: "发送欢迎消息图像。",
      success: "图片上传成功！",
    },
    set_msg: {
      warning: "请在命令后指定欢迎消息",
      success: "欢迎留言更新成功！",
      failed: "无法更新欢迎消息。",
    },
    canceled: "取消。",
    config: "配置",
    set_api_key: "请设置您的API密钥以继续。您可以从",
    set_api_btn: "设置API密钥",
    api_error: "提供的API密钥无效",
    update_api_btn: "更新API密钥",

    prompt_api_keyword: "请发送Api密钥",
    prompt_api_error: "请提供有效的api密钥",
    prompt_api_set: "关键字设置",
    prompt_api_updated: "关键字更新",
  },
};

export const lang = {
  english: "English",
  chinese: "中国人",
};

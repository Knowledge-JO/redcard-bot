# RedCard Bot

## Documentation

Welcome to the RedCard Bot documentation! This guide explains the available bot commands and their usage to help you manage your Telegram groups effectively.

---

### **Bot Commands and Usage**

| **Command**                | **Description**                                                                                    | **Example**                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `/start`                   | Launches the mini app button for users.                                                            | `/start`                                                                       |
| `/deposit`                 | Initiates the process for depositing funds.                                                        | `/deposit`                                                                     |
| `/kick`                    | Kicks a user from the group.                                                                       | Reply to the user and type `/kick`.                                            |
| `/ban <duration>`          | Bans a user for a specified duration in seconds. Defaults to permanent if no duration is passed.   | Reply to the user and type `/ban 60` (bans for 60 seconds).                    |
| `/mute <duration>`         | Mutes a user for a specified duration in seconds. Defaults to 60 seconds if no duration is passed. | Reply to the user and type `/mute 120` (mutes for 120 seconds).                |
| `/setmessage`              | Sets a custom welcome message for new members.                                                     | `/setmessage Welcome to the group!`                                            |
| `/setimage`                | Sets a custom welcome image for new members.                                                       | Reply to an image and type `/setimage`.                                        |
| `/setkeyword <key> <text>` | Configures a keyword and its automatic reply content.                                              | `/setkeyword rules Please follow our group rules: No spamming, be respectful.` |
| `/blacklist <words>`       | Adds inappropriate words to the blacklist.                                                         | `/blacklist spam rude`                                                         |
| `/allowlinks <links>`      | Adds links to the allowed links list.                                                              | `/allowlinks example.com mywebsite.net`                                        |
| `/deletelink <link>`       | Removes a link from the allowed links list.                                                        | `/deletelink example.com`                                                      |
| `/deletekeyword <key>`     | Deletes a keyword and its associated reply content.                                                | `/deletekeyword rules`                                                         |
| `/deleteword <word>`       | Removes a word from the inappropriate words blacklist.                                             | `/deleteword spam`                                                             |

---

### **Command Details**

#### 1. **Basic Commands**

- **`/start`**: Use this command to initialize the bot or trigger its mini app button. It is typically used for user onboarding.
- **`/deposit`**: Enables admin user to start the deposit process. Follow any prompts the bot provides after using this command.

#### 2. **User Management**

- **`/kick`**: Removes a user from the group. Use this command by replying to the user's message you want to kick.
- **`/ban <duration>`**: Bans a user from the group. The duration should be specified in seconds (e.g., `/ban 60` for a 1-minute ban). If no duration is provided, the ban is permanent.
- **`/mute <duration>`**: Temporarily mutes a user in the group. Specify the duration in seconds (e.g., `/mute 120` for a 2-minute mute). Defaults to 60 seconds if no duration is provided.

#### 3. **Welcome Message and Image**

- **`/setmessage`**: Customize the welcome message displayed when new members join the group. For example:
  ```
  /setmessage Welcome to our group! Please read the rules pinned at the top.
  ```
- **`/setimage`**: Configure a custom welcome image by replying to an image message and typing `/setimage`.

#### 4. **Keyword Management**

- **`/setkeyword <keyword> <reply>`**: Adds a keyword and its corresponding automatic reply. For example:
  ```
  /setkeyword rules Please follow our group rules: No spamming, be respectful.
  ```
- **`/deletekeyword <keyword>`**: Removes a specific keyword and its reply. For example:
  ```
  /deletekeyword rules
  ```

#### 5. **Word Blacklist**

- **`/blacklist <words>`**: Adds words to the inappropriate words blacklist. Messages containing these words will be deleted. For example:
  ```
  /blacklist spam rude profanity
  ```
- **`/deleteword <word>`**: Removes a word from the blacklist. For example:
  ```
  /deleteword spam
  ```

#### 6. **Link Management**

- **`/allowlinks <links>`**: Adds specific links to the allowed list. Only these links will be permitted in the group. For example:
  ```
  /allowlinks example.com trustedsite.net
  ```
- **`/deletelink <link>`**: Removes a specific link from the allowed list. For example:
  ```
  /deletelink example.com
  ```

---

### **Tips for Using the Bot**

1. **Admin Permissions**: Ensure the bot has admin rights in your group to manage messages and users effectively.
2. **Responding to Users**: For commands like `/kick`, `/ban`, and `/mute`, you need to reply to the user's message for the command to work.
3. **Customizing Settings**: Use `/setmessage` and `/setimage` to create a personalized onboarding experience for new members.
4. **Monitoring Spam**: Regularly update the blacklist and allowed links list to maintain a clean group environment.

---

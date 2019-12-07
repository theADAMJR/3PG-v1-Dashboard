const config = require("./config"),
      db = require("./database"),
      discord = require("discord.js"),
      express = require("express");

let bot = new discord.Client();

bot.on("ready", () => 
{
    log.info(`${bot.user.username} is ready!`, "discord");
    // bot.user.setActivity("Helping with the 3PG webapp");
});

bot.on("message", msg => 
{
    if (msg.content === 'testing123') 
    {
        msg.reply('Message sent from webapp lol');
    }
});

bot.login(config.api.token);

module.exports.bot = bot;
module.exports.locals = 
{
    bot: 
    { 
        getBotUser: () => bot.user,
        getGuildCount: () => bot.guilds.size,
        inGuild: (id) => bot.guilds.get(id) != undefined
    }
}
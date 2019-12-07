const colours = require("colors");

module.exports = 
{
    app: 
    {
        discordLink: "https://discordapp.com/invite/xRT6Fz5",
        port: 3000,
        url: `http://localhost:3000`,
        configModules: ["Admin", "General", "Moderation", "Music", "XP"]
    },
    api:
    {
      id: "533947001578979328",
      secret: "PX7Z0xVD-betLaxifd8-wfwEccevgJgj",
      token: "NTMzOTQ3MDAxNTc4OTc5MzI4.XdA6dw.-1VMdnIzqqIhiGrfsd3PLgO9LDA"
    },
    db: 
    {
      host: "localhost",
      port: 27017,
      name: "3pg",
      collection:
      {
        attributes: "attributes",
        guild: "guild",
        guildUser: "guildUser",
        user: "user"
      }
    },
    utils:
    {
      source:
      {
        db: "MNGO".green,
        discord: "DCRD".gray,
        express: "EXPR".yellow,
        other: "OTHR"
      }
    }
};
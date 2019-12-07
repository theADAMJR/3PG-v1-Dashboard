const config = require("./config"),
      db = require("./database"),
      utils = require("./utils"),
      { bot, locals } = require("./bot");

module.exports =
{   
    updateRedirect: (req, res, next) =>
    {
        res.locals.loginRedirect = null;
        if (!res.locals.user)
        {
            let url = req.originalUrl === "/" ? "/servers" : req.originalUrl;
            res.locals.loginRedirect = url;
            res.cookies.set("redirect", url);
        }
        return next();
    },
     
    updateUser: async(req, res, next) =>
    {
        let key = req.cookies.get("key");
        res.locals.key = key;
        res.locals.user = key ? await client.getUser(key) : null;
        return next();
    },

    updateGuilds: async(req, res, next) =>
    {        
        let key = req.cookies.get("key");
        res.locals.guilds = await client.getGuilds(key);
        return next();
    },

    validateKey: (req, res, next) => !req.cookies.get("key") ? res.redirect(`/welcome?redirect=${req.originalUrl}`) : next(),

    validateManager: (req, res, next) => 
    {
        let member = res.locals.guilds && res.locals.guilds.get(req.params.id);
        if (!member) return sendCode(res, 403, "You must be in this server to view the dashboard");

        let userIsManager = member.permissions.some(p => p === "MANAGE_GUILD");
        return userIsManager ? next() : sendCode(res, 401, "You must have permission 'MANAGE_GUILD' to edit server modules");
    },

    validateBotInGuild: (req, res, next) => locals.bot.inGuild(req.params.id) ? next() : sendCode(res, 412, `${locals.bot.getBotUser().username} is not in server`),
    
    validateGuildConfig: async(req, res, next) =>
    {
        // {"guild":{"General":{"Enabled":"true","Announce":{"WelcomeMessages":"test","GoodbyeMessages":"[USER] left the server.,Sad to see you [USER].,Bye [USER]!"},"/":true}}}
        let updatedGuild = req.body.guild;
        if (updatedGuild == null) return 404;

        await db.find({ _id: id }, config.db.collection.guild, async(err, guilds) =>
        {
            let oldGuild = guilds[0];
            // define immutable fields (id, isPremium, )
            if (o)
            JSON.stringify()
            return next();
        });
        return sendCode(res, 400, "Server config could not be validated");
    }
}
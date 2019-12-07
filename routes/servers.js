const api = require("../api"),
      authRoutes = require("../routes/auth"),
      { bot, locals } = require("../bot"),
      config = require("../config"),
      db = require("../database"),
      express = require("express"),
      { validateBotInGuild, validateManager } = require("../middleware"),
      mongoose = require("mongoose"),
      schema = require("../schema.json"),
      utils = require("../utils");

let router = express.Router({ mergeParams: true }),
    client = api.client;

mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/3pg`);

var Guild = mongoose.model("guild", new mongoose.Schema(schema.guild, { strict: false }), "guild");

// TODO => remove
router.use((req, res, next) =>
{
    res.locals.configModules = config.app.configModules;
    next();
});

// BUG -> if db is reset and 3PG is in guild without new account, it will send 404 (guild not found)
router.get("/",  async(req, res) => res.render("servers/index", { guilds: res.locals.guilds }));

router.get("/:id([0-9]{18})", validateBotInGuild, validateManager, async(req, res) => 
{
    let id = req.params.id;
    await db.find({ _id: id }, config.db.collection.guild, async(err, guilds) =>
    {
        if (err || !guilds) return err ? sendCode(res, 500, err) : sendCode(res, 404, "Guild not found");
        res.render("servers/show", { guild: guilds[0], socketGuild: bot.guilds.get(id) });
    });
});

router.get("/:id", (req, res) => sendCode(res, 400, "Invalid ID: Must be numbers 0-9 and 18 characters long"));

router.get("/:id/:module", validateBotInGuild, validateManager, async(req, res, next) => 
{
    let id = req.params.id;
    await db.find({ _id: id }, config.db.collection.guild, async(err, guilds) =>
    {
        if (err || !guilds) return err ? sendCode(res, 500, err) : sendCode(res, 404, "Server not found");

        let guild = guilds[0];
        let module = req.params.module.toLowerCase();
        switch (module)
        {
            case "punishments":
            case "leaderboard":
                return await db.find({ GuildID: id }, config.db.collection.guildUser, async(err, guildUsers) =>
                {
                    var data = { guild: guild, guildUsers: guildUsers || [], socketGuild: bot.guilds.get(id) };
                    return err ? sendCode(res, 500, err) : res.render("servers/" + module, data);
                });
            default:
                module = module == "xp" ? "XP" : module.capitalize();
                let moduleNotFound = !config.app.configModules.some(m => m === module) && module !== "Settings";
                
                if (guild[module] && !guild[module]["Enabled"]) return sendCode(res, 412, "Module not enabled");

                var data = { guild: guild, module: module, socketGuild: bot.guilds.get(id) };
                return moduleNotFound ? sendCode(res, 404, "Module not found") : res.render("servers/" + module.toLowerCase(), data);            
        }
    });
});

var validateGuildConfig = async(req, res, next) =>
{
    let id = req.params.id;
    await db.find({ _id: id }, config.db.collection.guild, async(err, guilds) =>
    {
        var guild = Object.assign(guilds ? guilds[0] : null, req.body.guild);
        await new Guild(guild).validate(err =>
        {
            res.locals.guild = new Guild(guild);
            return err ? res.send(err) : next();
        });
    });
}

router.put("/:id", validateGuildConfig, validateBotInGuild, validateManager, async(req, res, next) =>
{
    let id = req.params.id;
    await Guild.deleteOne({ _id: id });
    await Guild.create(res.locals.guild, (err, guild) =>
    {
        if (err || !guild) return err ? sendCode(res, 500, err) : sendCode(res, 404, "Guild not found");
        res.redirect("back");
    });  
});

//router.use((err, req, res, next) => res.send("Oops! Make sure 3PG is still in the server!"));

module.exports = router;
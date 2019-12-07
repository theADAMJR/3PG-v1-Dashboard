const bot = require("./bot").bot,
      cookies = require("cookies"),
      config = require("./config"),
      express = require("express"),
      OAuthClient = require("disco-oauth"),
      utils = require("./utils");

const authRoutes = require("./routes/auth");

let app = express(),
    client = new OAuthClient(config.api.id, config.api.secret);

// TODO => refactor
module.exports.getGuild = async(id) => bot.guilds.get(id);

client.setRedirect(`${config.app.url}/auth`);
client.setScopes("identify", "guilds");

app.use(cookies.express("1212012ujjsisdsdsd", "498u5tj34j5ifdfdfdfdf", "240284ju32u4h32o4h324j3h4usd"));

app.use((req, res, next) =>
{
    res.locals.loginRedirect = req.cookies.get("redirect");
    return next();
});
app.use("/", authRoutes.router(this, client));

module.exports.app = app;
module.exports.client = client;
const api = require("./api"),
      bodyParser = require("body-parser"),
      bot = require("./bot"),
      config = require("./config"),
      cookies = require("cookies"),
      db = require("./database"),
      express = require("express"),
      expressSanitizer = require('express-sanitizer'),
      methodOverride = require('method-override'),
      middleware = require("./middleware"),
      utils = require("./utils");

let app = express();

const indexRoutes = require("./routes/index"),
      serverRoutes = require("./routes/servers");

db.find({ _id: "Attributes" }, config.db.collection.attributes, (err, items) =>
{
    try { app.locals.modules = items[0]; }
    catch { log.error("Attributes could not be set. Ensure db is online", "db"); }
});

db.find({ _id: "Commands" }, config.db.collection.attributes, (err, items) =>
{
    try 
    { 
        app.locals.commands = items[0].Commands; 
        app.locals.commandModules = items[0].Modules;
    }
    catch { log.error("Commands could not be set. Ensure db is online", "db"); }
});

app.locals = Object.assign(api.app.locals, bot.locals, utils.locals);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookies.express("some", "random", "keys"));
app.use(express.static("./public"));
app.use(expressSanitizer());
app.use(logIp);
app.use(methodOverride('_method'));

app.set("view engine", "ejs");

app.listen(config.app.port, () => log.info(`3PG webapp server listening on port ${config.app.port}`, "express"));

app.use(api.app, middleware.updateUser, middleware.updateRedirect);
app.use("/", indexRoutes);
app.use("/servers", middleware.validateKey, middleware.updateGuilds, serverRoutes);

app.use((err, req, res, next) => sendCode(res, 500, `Something went wrong, and it's our fault! \n${err}`));

app.get("*", (req, res) => sendCode(res, 404, "Not found"));

module.exports = app;
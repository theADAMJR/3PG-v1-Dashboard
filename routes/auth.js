const config = require("../config"),
      express = require("express"),
      { validateKey } = require("../middleware"),
      utils = require("../utils");

const botInviteRedirect = `${config.app.url}/auth-guild`;

let router = express.Router({ mergeParams: true });

router.get("/welcome", (req, res) => 
{
    res.cookies.set("redirect", req.query.redirect);
    return sendCode(res, 401, "You must logged in to view this page");
});

router.get("/login", (req, res) => res.redirect(client.authCodeLink));

router.get("/auth", async(req, res) =>
{
    let code = req.query.code;
    if (!code) return res.redirect("/welcome");    
    try
    {
        let key = await client.getAccess(code);
        req.cookies.set("key", key);
        res.cookie("key", key, { maxAge: 2592000000 }); // 1 month in ms
    }
    finally { res.redirect(req.cookies.get("redirect") || "/servers"); }
});

router.get("/logout", async(req, res) =>
{  
    try 
    { 
        req.cookies.get("key") && res.clearCookie("key");

        res.locals.key = null;
        res.locals.user = null;
    }
    finally { res.redirect("/"); }
});

router.get("/invite/:id([0-9]{18})", validateKey, (req, res) =>
{
    let id = req.params.id;
    let guild = api.getGuild(id);

    let inviteLink = `https://discordapp.com/oauth2/authorize?scope=bot&response_type=code&client_id=${config.api.id}&guild_id=${id}&permissions=2147483127&redirect_uri=${botInviteRedirect}`;
    res.cookies.set("redirect", `/servers/${id}`);

    return !guild ? sendCode(res, 400, "Guild not found") : res.redirect(inviteLink);
});

router.get("/invite/:id", (req, res) => sendCode(res, 400, "Invalid ID: Must be numbers 0-9 and 18 characters long"));

router.get("/auth-guild", validateKey, (req, res) => res.redirect(res.cookies.get("redirect") || "/servers"));

module.exports.router = (api, client) => 
{ 
    global.api = api;
    global.client = client; 
    return router; 
}
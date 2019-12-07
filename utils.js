const colours = require("colors"),
      config = require("./config");

const toHHMMSS = (time) =>
{
	var hours = time.getHours();
	var minutes = time.getMinutes();
	var seconds = time.getSeconds();

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}

log =
{    
    info: (message, src) => console.log(`[${toHHMMSS(new Date())}] ${"INFO".white} [${config.utils.source[src || "other"]}] ${message}`),
    error: (error, src) => console.error(`[${toHHMMSS(new Date())}] ${"EROR".red} [${config.utils.source[src || "other"]}] ${(error || "").red}`)
}

// express
logIp = (req, res, next) =>
{    
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    log.info(`${ip} has connected to ${req.url}`, "express");
    return next();
}

sendCode = (res, code, message) => 
{
    // TODO => log errors to file
    code == 500 && log.error(message);
    res.status(code).render(`error`, { code: code, message: message });
}

// extension
Map.prototype.find = function(predicate)
{
    let match = null;
    this.forEach(item =>
    {
        if (predicate(item) && !match) 
        {
            match = item;
        }
    });
    return match;
}

String.prototype.capitalize = function() 
{
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.toSentenceCase = function()
{
    return this.replace(/([A-Z])/g, " $1").capitalize();
}

Date.prototype.toCleanString = function() 
{
    var hours = this.getHours();
    var minutes = this.getMinutes();    
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }

    var strTime = hours + ':' + minutes;
    const month = this.toLocaleString('default', { month: 'long' });
    return `${month} ${this.getDate()} ${this.getFullYear()}, ${this.getHours()}:${this.getMinutes()}`;
}

Object.prototype.getKey = function(val)
{
    return Object.keys(this).find(key => this[key] === val);
}

module.exports.locals =
{
    capitalize: String.prototype.capitalize,
    toSentenceCase: String.prototype.toSentenceCase,
    toCleanString: Date.prototype.format,
    getKey: Object.prototype.getKey
}
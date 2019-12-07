const assert = require("assert"),
	  config = require("./config"),
	  mongo = require("mongodb"),
      utilils = require("./utils");

class DatabaseManager
{	
	constructor(host, port, dbName)
	{
		const url = `mongodb://${host}:${port}`;
		this.dbName = dbName;

		this.client = new mongo.MongoClient(url, { useNewUrlParser: true });
		this.client.connect(async(err) => 
		{
			!err ? log.info(`Connected to database - ${host}:${port}`, "db") : log.error(`Failed to connect to database on port ${port}`, "db");
		});
	}
	
	async insert(item, col, callback)
	{		
		await this.client.connect(async(err) => 
		{		
			try
			{
				var db = this.client.db(this.dbName);
				await db.collection(col).insertOne(item);
				
				assert.equal(1, result.insertedCount);
				callback();
			}
			catch(err) { callback(err); }
		});
	}
	
	async find(filter, col, callback)
	{
		await this.client.connect(async(err) => 
		{		
			try
			{
				var db = this.client.db(this.dbName);
				await db.collection(col).find(filter).toArray((err, items) =>
				{
					assert.equal(err, null);
					callback(null, items.length < 1 ? null : items);
				});
			}
			catch(err) { callback(err); }
		});
	}
	
	async replace(filter, newItem, col, callback)
	{		
		await this.client.connect(async(err) => 
		{
			try
			{
				var db = this.client.db(this.dbName);
				await db.collection(col).findOneAndReplace(filter, newItem, { upsert: true }).then(() =>
				{
					assert.equal(err, null);
					callback(null, newItem);
				});
			}
			catch(err) { callback(err); }
		});
	}
	
	async remove(filter, col, callback)
	{		
		await this.client.connect(async(err) => 
		{	
			try
			{
				var db = this.client.db(this.dbName);
				await db.collection(col).deleteMany(filter);
				callback(null);
			}
			catch(err) { callback(err); }
		});
	}
}

module.exports = new DatabaseManager(config.db.host, config.db.port, config.db.name)
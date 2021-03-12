import mongoose from 'mongoose';
import { default as createDebug } from 'debug';

import { dbConfig } from './lib/config.js';

const debug = createDebug('rest-api:debug');

const dbString = 
    'mongodb://' + 
    dbConfig.host + ':' + 
    dbConfig.port + '/' + 
    dbConfig.database;

const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

async function connect() {
    var db = null;
    try {
      const mngse = await mongoose.connect(dbString, dbOptions);
      console.log("Connected successfully to server");
      db = mngse.connection;
      // other code that might throw an exception
    }
    catch(error) {
      console.log(error);
    }
    finally {
      if (db !== null && db.readyState === 1) {
        await db.close();
        console.log("Disconnected successfully to server");
      }
    }
  }
  
  connect();
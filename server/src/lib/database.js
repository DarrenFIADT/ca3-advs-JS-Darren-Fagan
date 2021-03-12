import mongoose from 'mongoose';
import { default as createDebug } from 'debug';

import { dbConfig } from './config.js';

import Tag from '../models/Tag.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import Image from '../models/Image.js';
import Comment from '../models/Comment.js';

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

var db;

const connectDB = async () => {
    try {
        if (db !== undefined && db.readyState === 1) {
            return;
        }
        const client = await mongoose.connect(dbString, dbOptions);
        db = client.connection; 
    }
    catch (error) {
        debug("Error connecting to database: " + error);
        throw new Error("Could not connect to the database server.");
    }
}

export default connectDB;
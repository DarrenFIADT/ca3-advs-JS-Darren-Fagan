import { passwordVerify, passwordHash, issueJWT } from '../lib/utils.js';
import connectDB from '../lib/database.js';
import User from '../models/User.js';

const login = async function(req, res, next) {
    try {
        await connectDB();
        const user = await User.findByLogin(req.body.username);
        if (!user) {
            res.status(401).json({ 
                success: false, 
                msg: "Invalid username/password" 
            });
        }
        const isValid = passwordVerify(req.body.password, user.hash, user.salt);       
        if (isValid) {
            const tokenObject = issueJWT(user);
            res.status(200).json({ 
                success: true, 
                user: user, 
                token: tokenObject.token, 
                expiresIn: tokenObject.expires 
            });
        } 
        else {
            res.status(401).json({ 
                success: false, 
                msg: "Invalid username/password" 
            });
        }
    }
    catch (error) {
        res.json({ 
            success: false, 
            msg: error 
        });
    }
};

const register = async function(req, res, next){
    try {
        const saltHash = passwordHash(req.body.password);
        const salt = saltHash.salt;
        const hash = saltHash.hash;

        await connectDB();
        const oldUser = await User.findByLogin(req.body.username);
        if (oldUser) {
            res.status(401).json({ 
                success: false, 
                msg: "Username already registered" 
            });
        }
        else {
            const newUser = new User({
                username: req.body.username,
                hash: hash,
                salt: salt
            });
            const user = await newUser.save();
            const tokenObject = issueJWT(user);
            res.json({ 
                success: true, 
                user: user, 
                token: tokenObject.token, 
                expiresIn: tokenObject.expires 
            });
        }
    }
    catch (error) {
        res.json({ 
            success: false, 
            msg: error 
        });
    }
};

const logout = function(req, res){
    req.logout();
    res.json({ 
        success: true, 
        user: null, 
        token: null, 
        expiresIn: null 
    });
};

export { login, register, logout };
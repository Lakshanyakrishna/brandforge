const express = require('express');
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

// httpOnly: blocks client-side JS (and XSS payloads) from reading the cookie.
// sameSite: 'lax': cookie still rides along on top-level navigations/same-site
// requests but is withheld on most cross-site requests, mitigating CSRF.
// secure: only sent over HTTPS once deployed (NODE_ENV=production); left off
// in local dev since localhost typically runs on plain HTTP.
const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.isProduction
};

async function registerController(req, res) {
    const { username, password } = req.body;

    const isUserAlredyExist = await UserModel.findOne({ username })

    if (isUserAlredyExist) {
        return res.status(400).json({ message: "User already exists" })
    }

    const user = await UserModel.create({ username,
        password : bcrypt.hashSync(password,10)

     });
    const token = jwt.sign( { userId: user._id }, config.jwtSecret)
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
        message: "user registered successfully"    });
}

async function loginController(req, res) {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username});

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordIsValid = await bcrypt.compare(password, user.password);

    if (!isPasswordIsValid) {
        return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({userId: user._id}, config.jwtSecret);
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({ message: "User logged in successfully" });
}





module.exports = {
    registerController,
    loginController
}
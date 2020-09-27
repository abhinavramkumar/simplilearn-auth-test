const express = require('express');

const Router = express.Router();
const bcrypt = require('bcrypt');
const db = require("../models");

const { User } = db;

const saltRounds = 10;

const USERTYPE = {
  VISITOR: "VISITOR",
  ADMIN: "ADMIN"
};

Router.get('/is-user-authenticated', (req, res) => {
  return res.status(200).json({
    isAuthenticated: req.session.isAuthenticated || false
  });
});

Router.post('/signup', async (req, res) => {
  const { name, email, password: unhashedPassword } = req.body;
  const json = { status: "failure", message: "" };

  const password = await bcrypt.hash(unhashedPassword, saltRounds);
  if (password) {
    try {
      const newUser = await User.build({
        name,
        email,
        password,
        role: USERTYPE.VISITOR
      });

      await newUser.save();

      req.session.isAuthenticated = false;

      json.userId = newUser.id;
      json.status = "success";
      json.message = "Successfully created new user";
    } catch (error) {
      json.status = "failure";
      json.message = "Failed to create user";
    }
  } else {
    json.message = "Failed to create user";
  }

  return res.status(200).json(json);
});

// if username exists then throw error
// else add username to database
// set isauthenticated to true
Router.post('/select-username', async (req, res) => {
  const { username, userId } = req.body;
  const json = { status: "failure", message: "" };
  req.session.isAuthenticated = false;

  const user = await User.findOne({ where: { id: userId } });
  if (user) {
    if (username === user.username) {
      json.message = "User already exists";
    } else {
      user.username = username;
      await user.save();
      json.status = "success";
      json.message = "Username updated successsfully";
      req.session.isAuthenticated = true;
      req.session.userId = user.id;
    }
  } else {
    json.message = "Unable to find user";
  }

  return res.status(200).json(json);
});


// receive username, password
// if username in db fetch password else throw error
// if password matches the hashed pwd then set isauthenticated in session 
Router.post('/verify', async (req, res) => {
  const { username, password } = req.body;
  const json = { status: "failure", message: "" };

  const user = await User.findOne({ where: { username } });
  req.session.isAuthenticated = false;
  if (user) {
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (isPasswordMatched) {
      req.session.isAuthenticated = true;
      req.session.userId = user.id;
      json.status = "success";
      json.message = "Login Successful";
    } else {
      json.status = "failure";
      json.message = "Logiin Failed! Password does not match";
    }
  } else {
    json.status = "failure";
    json.message = "Login Failed! User does not exist";
  }

  return res.status(200).json(json);
});

Router.get('/get-user', async (req, res) => {
  const json = { status: "failure", message: "" };
  const { userId } = req.session;

  const user = await User.findOne({ where: { id: userId } });
  req.session.isAuthenticated = false;
  if (user) {
    req.session.isAuthenticated = true;
    req.session.userId = userId;
    json.account = {
      name: user.name,
      email: user.email,
      username: user.username
    };
    json.status = "success";
    json.message = "User Fetched successfully";

  } else {
    json.status = "failure";
    json.message = "Login Failed! User does not exist";
  }

  return res.status(200).json(json);
});

Router.post('/logout', async (req, res) => {
  const json = { status: "failure", message: "" };

  req.session.destroy();
  json.status = "success";
  json.message = "User Fetched successfully";

  return res.status(200).json(json);
});

module.exports = Router;
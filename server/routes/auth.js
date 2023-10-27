const express = require("express");
const authRoutes = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbo = require("../db/conn");

// View all registered users
authRoutes.route("/users").get(async (req, res) => {
  try {
    const db_connect = dbo.getDb();
    const users = await db_connect.collection("users").find({}).toArray();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

// User registration
authRoutes.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, username, password, email } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);

    const db_connect = dbo.getDb();
    const existingUser = await db_connect.collection("users").findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const newUser = {
      firstname,
      lastname,
      username,
      password: hashedPassword,
      email,
    };
    const result = await db_connect.collection("users").insertOne(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// User login
authRoutes.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const db_connect = dbo.getDb();
    const user = await db_connect.collection("users").findOne({ username });
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to authenticate user" });
  }
});

module.exports = authRoutes;
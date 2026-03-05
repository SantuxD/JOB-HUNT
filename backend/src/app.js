const express = require("express");
const cors = require("cors");
const authRoutes = require("../src/routes/auth.route");
const uploadRoutes = require("./routes/uploads.route");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowdHeaders: ["content-type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/v1", uploadRoutes);

module.exports = app;

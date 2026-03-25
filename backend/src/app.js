const express = require("express");
const cors = require("cors");
const authRoutes = require("../src/routes/auth.route");
const uploadRoutes = require("./routes/uploads.route");
const userRoutes = require("./routes/user.routes");
const jobRoutes = require("./routes/jobs.routes");
const applicationRoutes = require("./routes/application.routes");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["content-type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/v1", uploadRoutes);
app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/application", applicationRoutes);

module.exports = app;

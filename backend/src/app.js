const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("../src/routes/auth.route");
const uploadRoutes = require("./routes/uploads.route");
const userRoutes = require("./routes/user.routes");
const jobRoutes = require("./routes/jobs.routes");
const applicationRoutes = require("./routes/application.routes");
const savedJobRoutes = require("./routes/savedJob.routes")
const analyticsRoutes = require("./routes/analytics.route")

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(
  cors({
    origin: ["https://job-hunt-one-alpha.vercel.app",
                "http://localhost:5173"],
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
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/analytics", analyticsRoutes)

module.exports = app;

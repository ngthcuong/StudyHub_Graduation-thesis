const express = require("express");
const cors = require("cors");
const http = require("http");
const connectToDB = require("./src/configs/database");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const userRoutes = require("./src/routes/userRoutes");
const certificateRoutes = require("./src/routes/certificateRoutes");

require("dotenv").config();

// Create Expresss App and HTTP Server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Config CORS
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/app/v1/auth", authRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/certs", certificateRoutes);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectToDB(); // Connect to MongoDB

    // Define routes
    app.get("/", (req, res) => {
      res.status(200).json({ message: "Welcome to StudyHub API!" });
    });

    // Handle 404 errors
    app.use((req, res, next) => {
      res.status(404).json({ error: "Route not found" });
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: "Something went wrong!" });
    });

    // Start server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // Escape when there is an error
  }
};

startServer();

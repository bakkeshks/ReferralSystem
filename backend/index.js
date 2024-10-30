const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const dbConfig = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(dbConfig.uri, dbConfig.options)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB", error));

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

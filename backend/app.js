require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const {
  isAuthenticated,
  initializePassport,
} = require("./middleware/authentication");

const app = express();

// app.use(cors());

const keys = require("./config/keys");
const authRoutes = require("./routes/auth");
const analyticsRoutes = require("./routes/analytics");
const categoryRoutes = require("./routes/category");
const orderRoutes = require("./routes/order");
const optionRoutes = require("./routes/option");
const clientRoutes = require("./routes/client");
const userRoutes = require("./routes/user");
const emailRoutes = require("./routes/email");

app.use(helmet());

mongoose
  .connect(
    process.env.NODE_ENV === "production"
      ? keys.mongoURI
      : "mongodb://localhost:27019/crm-coffee", { useNewUrlParser: true, useUnifiedTopology:true, serverSelectionTimeoutMS: 5000}
  )
  .then(() => console.info("MongoDB connected."))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use(initializePassport);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(" ")
  : [];
app.options('*', cors({ origin: [...allowedOrigins, "http://localhost:3000", "http://localhost:4200" ],
credentials: true}));

app.options('*',(req,res)=>{
  const origin= req.header('Origin');
  if(allowedOrigins.includes(origin) || !origin){
    res.header('Access-Control-Allow-Origin',origin);
    res.header('Access-Control-Allow-Methods','GET, POST, PATH, DELETE, PUT, HEAD');
  }
});

app.use(cors({ origin: [...allowedOrigins, "http://localhost:3000", "http://localhost:4200" ],
methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
credentials: true, }));


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/analytics", isAuthenticated, analyticsRoutes);
app.use("/api/v1/order", isAuthenticated, orderRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/option", optionRoutes);
app.use("/api/v1/client", clientRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/mail", emailRoutes);

app.enable("trust proxy");
app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect("https://" + req.headers.host + req.url);
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist/client"));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "client", "dist", "client", "index.html")
    );
  });
}

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;

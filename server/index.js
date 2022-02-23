import cors from "cors";
import bodyParser from "body-parser";
import finale from "finale-rest";
import express, { urlencoded } from "express";
import pgtools from "pgtools";

import routes from "./src/routes.js";
import db from "./src/models.js";
import dbConfig from "./src/config.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* app.use(async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      throw new Error("Authorization header is required");

    const accessToken = req.headers.authorization.trim().split(" ")[1];

    next();
  } catch (error) {
    handleLog("Authorization failed:", error);
    next(error.message);
  }
  handleLog("DB query...");
}); */

const connection = db.conn;

// Testing connection.
const testConnection = async () => {
  console.log("Testing the database connection...");
  try {
    await connection.authenticate();
    handleLog("Database connection test: success");
    return true;
  } catch (error) {
    handleLog("Unable to connect to the database:", error);
    return false;
  }
};

const dbCreateIfNotExist = () => {
  console.log("Creating database...");
  const config = {
    user: dbConfig.USER,
    host: dbConfig.HOST,
    password: dbConfig.PASSWORD,
    port: dbConfig.PORT,
  };
  try {
    pgtools.createdb(config, dbConfig.DB, (err, res) => {
      if (err) {
        handleLog("Creating DB error:", err);
        process.exit(-1);
      } else {
        handleLog("Creating DB successful");
        //startServer();
      }
      console.log("Creating DB:", res);
    });
  } catch (error) {
    handleLog("Unable to Create DB:", error);
  }
};

// Start server
const startServer = () => {
  // Create connection
  console.log("Creating connection...");
  finale.initialize({ app, sequelize: connection });

  // Create resources
  console.log("Creating resources...");
  finale.resource({
    model: db.posts,
    model: db.images,
    endpoints: ["/posts", "/posts/:id"],
  });

  // Start the web server on the specified port.

  app.use(urlencoded({ extended: true }));
  routes(app);
  const port = process.env.REACT_APP_DB_WEB_PORT || 3001;

  console.log(`Starting server on PORT:${port} ...`);
  connection.sync().then(() => {
    app.listen(port, () => {
      handleLog(
        `Server is up and running: Listening on -> ${process.env.REACT_APP_DB_HOST}:${port}`
      );
    });
  });
};

const initApp = async () => {
  const connect = await testConnection();
  console.log(connect);
  /* if (connect) startServer();
  else dbCreateIfNotExist(); */
};

initApp();

function handleLog(source, err) {
  const color = err ? "\x1b[31m" : "\x1b[32m";
  console.log(color, `${source} ${err ? err.message : ""}`, "\x1b[0m");
}

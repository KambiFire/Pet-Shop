import routes from "./src/routes.js";
import cors from "cors";
import bodyParser from "body-parser";
import finale from "finale-rest";
import OktaJwtVerifier from "@okta/jwt-verifier";
import express, { urlencoded } from "express";
const app = express();

app.use(urlencoded({ extended: true }));
routes(app);

let port = 3000;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});

// db.sequelize.sync();
/* sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
}); */

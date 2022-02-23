import { Router } from "express";

const router = Router();

import homeController from "./controller.js";
import uploadController from "./middleware.js";

let routes = app => {
  router.get("/", homeController);

  router.post("/multiple-upload", uploadController);

  return app.use("/", router);
};

export default routes;

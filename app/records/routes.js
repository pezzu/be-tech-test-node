const express = require("express");
const recordsController = require("./controller");

const { permissions } = require("../../middleware/permissions");

const get = () => {
  const router = express.Router();

  router.post("/", permissions(), recordsController.create);
  router.get("/", permissions(), recordsController.read);
  router.put("/", permissions(["Admin, Editor"]), recordsController.update);
  router.delete("/", permissions(["Admin"]), recordsController.deleteRecord);

  return router;
};

module.exports = { get };

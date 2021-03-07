const router = require("express").Router();
const rolesController = require("../../controllers/rolesController");

// Matches with "/api/users"
router.route("/")
  .get(rolesController.findAll)
  .post(rolesController.create);

router.route("/bulk")
  .post(rolesController.bulkCreate);

// Matches with "/api/users/:id"
router
  .route("/:id")
  .get(rolesController.findById)
  .put(rolesController.update)
  .delete(rolesController.remove);

module.exports = router;

const router = require("express").Router();
const checklistsController = require("../../controllers/checklistsController");

// Matches with "/api/checklists"
router.route("/")
  .get(checklistsController.findAll)
  .post(checklistsController.create);

router.route("/bulk")
  .post(checklistsController.bulkCreate);

// Matches with "/api/checklists/:id"
router
  .route("/:id")
  .get(checklistsController.findById)
  .put(checklistsController.update)
  .delete(checklistsController.remove);

module.exports = router;

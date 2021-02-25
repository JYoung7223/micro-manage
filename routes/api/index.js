const router = require("express").Router();
const checklistRoutes = require("./checklists");

// Book routes
router.use("/checklists", checklistRoutes);

module.exports = router;

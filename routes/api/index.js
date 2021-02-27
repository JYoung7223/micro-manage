const router = require("express").Router();
const checklistRoutes = require("./checklists");
const userRoutes = require("./users");

// Book routes
router.use("/checklists", checklistRoutes);
router.use("/users", userRoutes);

module.exports = router;

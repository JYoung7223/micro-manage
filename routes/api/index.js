const router = require("express").Router();
const checklistRoutes = require("./checklists");
const userRoutes = require("./users");
const roleRoutes = require("./roles");

// Book routes
router.use("/checklists", checklistRoutes);
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);

module.exports = router;

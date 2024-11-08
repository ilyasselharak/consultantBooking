"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controllers/usersController");
const router = express_1.default.Router();
router.post("/", usersController_1.createUser)
    .get("/", usersController_1.getUsers)
    .get("/:id", usersController_1.getUserById)
    .put("/:id", usersController_1.updateUser)
    .delete("/:id", usersController_1.deleteUser);
exports.default = router;

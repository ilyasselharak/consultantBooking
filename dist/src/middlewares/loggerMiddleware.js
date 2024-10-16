"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl} ${new Date().toISOString()} ${req.secure}`);
    // console.log(req);
    next();
};
exports.default = logger;

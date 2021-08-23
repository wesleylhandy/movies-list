"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debuggerLog = void 0;
const debug_1 = __importDefault(require("debug"));
const server_config_1 = require("../configs/server-config");
exports.debuggerLog = debug_1.default(server_config_1.appName);
//# sourceMappingURL=debugger-log.js.map
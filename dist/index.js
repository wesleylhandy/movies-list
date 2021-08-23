"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = require("body-parser");
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const http_1 = require("http");
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const api_1 = require("./api/api");
const server_config_1 = require("./configs/server-config");
const debugger_log_1 = require("./utils/debugger-log");
const logger_1 = require("./utils/logger");
const app = express_1.default();
debugger_log_1.debuggerLog('Secure Headers');
app.use(helmet_1.default());
app.use(helmet_1.default.referrerPolicy({ policy: "no-referrer-when-downgrade" }));
app.use(helmet_1.default.hidePoweredBy());
debugger_log_1.debuggerLog("Stuff Query Parameters");
app.use(hpp_1.default());
debugger_log_1.debuggerLog("Configure CORS");
/* Reconfigure for Production */
app.use(cors_1.default());
// Use morgan for logs
app.use(morgan_1.default("combined"));
app.use(compression_1.default());
debugger_log_1.debuggerLog("Configure BodyParser");
app.use(body_parser_1.json());
// parsing application/json
app.use(body_parser_1.urlencoded({
    extended: true
}));
app.use(body_parser_1.text());
app.use(body_parser_1.json({ type: "application/vnd.api+json" }));
app.set("port", server_config_1.PORT);
debugger_log_1.debuggerLog("Configure Rate-Limiting Middleware");
// set up rate limits for access to backend to prevent DDOS attacks
const apiLimiter = express_rate_limit_1.default({
    windowMs: 15 * 60 * 1000,
    max: 1000
});
app.use("*", apiLimiter);
debugger_log_1.debuggerLog("Configure Api");
app.use('/api', api_1.apiRouter);
debugger_log_1.debuggerLog("Serve Front End");
if (server_config_1.NODE_ENV === "production") {
    app.use(express_1.default.static("client/build"));
}
app.listen(app.get("port"), () => {
    logger_1.logger.log('info', `Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
const server = http_1.createServer(app);
const pid = process.pid;
process.title = server_config_1.appName;
const gracefulShutdown = () => {
    server.close(() => {
        logger_1.logger.log('info', `Process ${pid} closed out remaining connections.`);
        process.exit(0);
    });
    // if after
    setTimeout(() => {
        logger_1.logger.log('error', "Could not close connections in time, forcefully shutting down");
        process.exit(1);
    }, 10 * 1000);
};
// listen for TERM signal .e.g. kill
process.on("SIGTERM", gracefulShutdown);
// listen for INT signal e.g. Ctrl-C
process.on("SIGINT", gracefulShutdown);
process.on("unhandledRejection", error => {
    if (error) {
        logger_1.logger.log('error', JSON.stringify({ UnhandledRejection: error }));
    }
});
process.on("error", error => {
    if (error) {
        logger_1.logger.log('error', JSON.stringify({ ProcessError: error }));
    }
});
//# sourceMappingURL=index.js.map
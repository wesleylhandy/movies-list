import { json, text, urlencoded } from 'body-parser'
import compression from 'compression';
import cors from 'cors';

import express from "express";
import helmet from 'helmet';
import hpp from 'hpp';
import { createServer } from 'http'
import morgan from 'morgan';
import rateLimit  from "express-rate-limit";

import { apiRouter } from './api/api';
import { appName, NODE_ENV, PORT } from './configs/server-config';


import { debuggerLog } from './utils/debugger-log';
import { logger } from './utils/logger';

const app = express();

debuggerLog('Secure Headers');

app.use(helmet());
app.use(helmet.referrerPolicy({ policy: "no-referrer-when-downgrade" }));
app.use(helmet.hidePoweredBy());

debuggerLog("Stuff Query Parameters");
app.use(hpp());

debuggerLog("Configure CORS")
/* Reconfigure for Production */
app.use(cors());

// Use morgan for logs
app.use(morgan("combined"));

app.use(compression());

debuggerLog("Configure BodyParser")
app.use(json());
  // parsing application/json
app.use(urlencoded({
    extended: true
}));
app.use(text());
app.use(json({ type: "application/vnd.api+json" }));

app.set("port", PORT);

debuggerLog("Configure Rate-Limiting Middleware");
// set up rate limits for access to backend to prevent DDOS attacks

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000
});
app.use("*", apiLimiter);

debuggerLog("Configure Api");
app.use('/api', apiRouter);

debuggerLog("Serve Front End");
if (NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

app.listen(app.get("port"), () => {
    logger.log('info', `Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});

const server = createServer(app);

const pid = process.pid;
process.title = appName;

const gracefulShutdown = () => {
    server.close(() => {
      logger.log('info',`Process ${pid} closed out remaining connections.`);
      process.exit(0);
    });

    // if after
    setTimeout(() => {
      logger.log('error', "Could not close connections in time, forcefully shutting down");
      process.exit(1);
    }, 10 * 1000);
};

  // listen for TERM signal .e.g. kill
process.on("SIGTERM", gracefulShutdown);

  // listen for INT signal e.g. Ctrl-C
process.on("SIGINT", gracefulShutdown);

process.on("unhandledRejection", error => {
    if (error) {
      logger.log('error', JSON.stringify({ UnhandledRejection: error }));
    }
});

process.on("error", error => {
    if (error) {
      logger.log('error', JSON.stringify({ ProcessError: error }));
    }
});
